import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

async function uploadToCloudinary(file: File, publicId: string): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ledyim-farm/animal-photos",
        public_id: publicId,
        resource_type: "image",
        overwrite: false
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function saveUploadedImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!allowedTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and GIF uploads are supported.");
  }

  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const safeName = `${Date.now()}-${crypto.randomUUID()}${extension.toLowerCase()}`;
  const publicId = path.basename(safeName, extension);

  if (hasCloudinaryConfig()) {
    return uploadToCloudinary(file, publicId);
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
