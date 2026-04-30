interface PrintElementOptions {
  selector: string;
  title?: string;
}

const waitForImages = async (doc: Document) => {
  const images = Array.from(doc.images);
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    })
  );
};

export const printElementBySelector = async ({ selector, title = "Document" }: PrintElementOptions) => {
  const source = document.querySelector<HTMLElement>(selector);

  if (!source) {
    console.error(`Print source not found: ${selector}`);
    return false;
  }

  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".no-print, [data-no-print='true']").forEach((element) => element.remove());

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const printWindow = frame.contentWindow;
  const printDocument = printWindow?.document;

  if (!printWindow || !printDocument) {
    frame.remove();
    return false;
  }

  const styles = Array.from(document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>("link[rel='stylesheet'], style"))
    .map((node) => {
      if (node.tagName.toLowerCase() === "link") {
        const link = node as HTMLLinkElement;
        return `<link rel="stylesheet" href="${link.href}">`;
      }
      return `<style>${node.textContent || ""}</style>`;
    })
    .join("\n");

  const safeTitle = title.replace(/[<>]/g, "");

  printDocument.open();
  printDocument.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
        ${styles}
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
          body { width: 100%; min-height: 100%; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .lovable-print-root { width: 100%; max-width: 277mm; margin: 0 auto; background: #ffffff; }
          .lovable-print-root .no-print, .lovable-print-root [data-no-print='true'] { display: none !important; visibility: hidden !important; }
          @media print {
            body * { visibility: visible !important; }
            .lovable-print-root, .lovable-print-root * { visibility: visible !important; }
            .lovable-print-root { page-break-inside: avoid; break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <main class="lovable-print-root">${clone.outerHTML}</main>
      </body>
    </html>`);
  printDocument.close();

  await new Promise((resolve) => setTimeout(resolve, 300));
  await waitForImages(printDocument);
  await printDocument.fonts?.ready.catch(() => undefined);

  printWindow.focus();
  printWindow.print();

  const cleanup = () => setTimeout(() => frame.remove(), 500);
  printWindow.addEventListener("afterprint", cleanup, { once: true });
  setTimeout(cleanup, 30000);

  return true;
};