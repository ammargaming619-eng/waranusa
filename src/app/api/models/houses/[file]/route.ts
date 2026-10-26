import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    if (!file || file.includes("..")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // Alias duplikasi Kalimantan Utara ke satu master file baloy-mayo.glb
    const targetFile =
      file === "kalimantan-utara.glb" || file === "kalimantan-utara-baloy-mayo.glb"
        ? "baloy-mayo.glb"
        : file;

    const filePath = path.join(process.cwd(), "public", "models", "houses", targetFile);

    if (!fs.existsSync(filePath)) {
      // Fallback ke static URL di Vercel CDN bila serverless function tidak menyertakan folder public
      return NextResponse.redirect(new URL(`/models/houses/${file}`, _req.url));
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
    console.error("Error serving GLB file:", error);
    return new NextResponse("Error serving model", { status: 500 });
  }
}
