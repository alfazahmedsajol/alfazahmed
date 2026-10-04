import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
export const MEDIA_FOLDERS = ["profile", "projects", "blog", "certificates", "diagrams", "resume", "general"] as const;

/** Public URL served through the site's own media endpoint (bucket stays private; read policy allows anon). */
export const mediaUrl = (path: string) => `/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP, GIF images or PDF files are allowed.";
  if (file.size > MAX_UPLOAD_BYTES) return "File is larger than 10 MB.";
  return null;
}

export async function uploadMedia(file: File, folder: string = "general"): Promise<string> {
  const err = validateFile(file);
  if (err) throw new Error(err);
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "file";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  await supabase.from("media").insert({ bucket: MEDIA_BUCKET, path, file_name: file.name, mime_type: file.type, size_bytes: file.size });
  return mediaUrl(path);
}
