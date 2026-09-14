import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveUploadedImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!allowedTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and GIF uploads are supported.");
  }

  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const safeName = `${Date.now()}-${crypto.randomUUID()}${extension.toLowerCase()}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`animal-photos/${safeName}`, file, {
      access: "public",
      addRandomSuffix: false
    });
    return blob.url;
  }

  await mkdir(uploadDir, { recursive: true });
  const diskPath = path.join(uploadDir, safeName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(diskPath, bytes);
  return `/uploads/${safeName}`;
}

export function formDataToRecord(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string")
  );
}
