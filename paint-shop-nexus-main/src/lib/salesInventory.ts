import { supabase } from "@/integrations/supabase/client";

export interface SaleInventoryLine {
  productId: string | null;
  productName: string;
  quantity: number;
}

export interface AppliedInventoryChange {
  productId: string;
  previousStock: number | null;
  nextStock: number;
  adjustmentId: string;
}

export async function restoreSaleInventory(changes: AppliedInventoryChange[]) {
  let rollbackFailed = false;

  for (const change of [...changes].reverse()) {
    const { data, error } = await supabase
      .from("products")
      .update({ current_stock: change.previousStock })
      .eq("id", change.productId)
      .eq("current_stock", change.nextStock)
      .select("id")
      .maybeSingle();
    if (error || !data) rollbackFailed = true;
  }

  if (changes.length > 0) {
    const { error } = await supabase
      .from("stock_adjustments")
      .delete()
      .in("id", changes.map((change) => change.adjustmentId));
    if (error) rollbackFailed = true;
  }

  if (rollbackFailed) {
    throw new Error("Inventory cleanup was incomplete. Refresh and inspect stock before retrying.");
  }
}

export async function decreaseSaleInventory(
  lines: SaleInventoryLine[],
  saleId: string,
  invoiceNumber: string,
  userId: string,
): Promise<AppliedInventoryChange[]> {
  if (lines.length === 0 || lines.some((line) => !line.productId || !Number.isFinite(line.quantity) || line.quantity <= 0)) {
    throw new Error("Every finalized invoice line must reference an inventory product and a positive quantity.");
  }

  const lineQuantities = new Map<string, number>();
  lines.forEach((line) => {
    const productId = line.productId!;
    lineQuantities.set(productId, (lineQuantities.get(productId) || 0) + line.quantity);
  });

  const { data: selectedProducts, error: selectedError } = await supabase
    .from("products")
    .select("id, name, current_stock, is_variant, parent_product_id")
    .in("id", Array.from(lineQuantities.keys()));
  if (selectedError) throw selectedError;

  const productById = new Map((selectedProducts || []).map((product) => [product.id, product]));
  if (productById.size !== lineQuantities.size) {
    throw new Error("One or more invoice products are no longer available.");
  }

  const stockDeltas = new Map(lineQuantities);
  for (const product of selectedProducts || []) {
    if (product.is_variant && product.parent_product_id) {
      stockDeltas.set(product.parent_product_id, (stockDeltas.get(product.parent_product_id) || 0) + (lineQuantities.get(product.id) || 0));
    }
  }

  const missingProducts = Array.from(stockDeltas.keys()).filter((productId) => !productById.has(productId));
  if (missingProducts.length > 0) {
    const { data: parents, error: parentError } = await supabase
      .from("products")
      .select("id, name, current_stock, is_variant, parent_product_id")
      .in("id", missingProducts);
    if (parentError) throw parentError;
    parents?.forEach((product) => productById.set(product.id, product));
  }

  for (const [productId, quantity] of stockDeltas) {
    const product = productById.get(productId);
    if (!product) throw new Error("Could not verify inventory for a finalized invoice.");
    if (quantity > (Number(product.current_stock) || 0)) {
      throw new Error(`${product.name} does not have enough stock to finalize this invoice.`);
    }
  }

  const changes: AppliedInventoryChange[] = [];
  try {
    for (const [productId, quantity] of stockDeltas) {
      const product = productById.get(productId)!;
      const previousStock = product.current_stock;
      const nextStock = (Number(previousStock) || 0) - quantity;
      const update = previousStock === null
        ? await supabase.from("products").update({ current_stock: nextStock }).eq("id", productId).is("current_stock", null).select("id").maybeSingle()
        : await supabase.from("products").update({ current_stock: nextStock }).eq("id", productId).eq("current_stock", previousStock).select("id").maybeSingle();
      if (update.error) throw update.error;
      if (!update.data) throw new Error(`Stock for ${product.name} changed while finalizing. Refresh and try again.`);

      const adjustmentId = crypto.randomUUID();
      changes.push({ productId, previousStock, nextStock, adjustmentId });
      const { error: adjustmentError } = await supabase.from("stock_adjustments").insert({
        id: adjustmentId,
        product_id: productId,
        quantity: -quantity,
        adjustment_type: "sale",
        reason: `Sale ${invoiceNumber}`,
        reference_id: saleId,
        created_by_user_id: userId,
      });
      if (adjustmentError) throw adjustmentError;
    }

    return changes;
  } catch (error) {
    try {
      await restoreSaleInventory(changes);
    } catch {
      throw new Error("Invoice inventory updates failed and automatic cleanup was incomplete. Inspect stock before retrying.");
    }
    throw error;
  }
}
