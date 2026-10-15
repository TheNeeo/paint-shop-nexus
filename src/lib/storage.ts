import { supabase } from "@/integrations/supabase/client";

/** Uploads a file to the private app-files bucket under the user's folder and returns a long-lived signed URL. */
export async function uploadAppFile(file: File, folder: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const ext = file.name.split(".").pop() || "bin";
  const path = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("app-files").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("app-files").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 || new Error("Signed URL failed");
  return data.signedUrl;
}
