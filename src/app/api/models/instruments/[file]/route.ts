import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.glb$/i, "")
    .replace(/^\d+[\.\-\s_]*/, "")
    .replace(/^kep[\.\s]+/, "kepulauan-")
    .replace(/^di[\.\s]+/, "daerah-istimewa-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    if (!file || file.includes("..")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "public", "models", "instruments");
    let filePath = path.join(dirPath, file);

    if (!fs.existsSync(filePath) && fs.existsSync(dirPath)) {
      const targetSlug = normalizeName(file);
      const entries = await fs.promises.readdir(dirPath);
      const matched = entries.find(
        (entry) =>
          entry.toLowerCase().endsWith(".glb") &&
          normalizeName(entry) === targetSlug
      );
      if (matched) {
        filePath = path.join(dirPath, matched);
      }
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.redirect(new URL(`/models/instruments/${file}`, _req.url));
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Length": String(fileBuffer.byteLength),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error serving instrument GLB file:", error);
    return new NextResponse("Error serving model", { status: 500 });
  }
}
