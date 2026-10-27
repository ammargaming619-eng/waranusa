import { NextResponse } from "next/server";

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
        : file.endsWith(".glb")
        ? file
        : `${file}.glb`;

    // Redirect langsung (HTTP 307) ke file static di Vercel CDN
    // Menghindari batas payload serverless function (4.5 MB) pada model besar (seperti baloy-mayo 33 MB)
    return NextResponse.redirect(
      new URL(`/models/houses/${targetFile}`, _req.url),
      307
    );
  } catch (error) {
    console.error("Error redirecting house GLB file:", error);
    return new NextResponse("Error serving model", { status: 500 });
  }
}
