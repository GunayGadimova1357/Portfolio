import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {randomUUID} from "node:crypto";
import {NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/auth";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";

export const runtime = "nodejs";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "projects");
const allowedMimeTypes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);
const maxFileSizeInBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdminSession();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Image file is required.");
    }

    if (!allowedMimeTypes.has(file.type)) {
      throw new Error("Unsupported image format. Use PNG, JPG, WebP or AVIF.");
    }

    if (file.size > maxFileSizeInBytes) {
      throw new Error("Image is too large. Maximum size is 5MB.");
    }

    const extension = allowedMimeTypes.get(file.type);

    if (!extension) {
      throw new Error("Unsupported image format.");
    }

    const fileName = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(uploadDirectory, {recursive: true});
    await writeFile(filePath, buffer);

    return NextResponse.json({path: `/uploads/projects/${fileName}`}, {status: 201});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
