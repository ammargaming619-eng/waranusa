import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const INSTRUMENT_FILE_MAP: Record<string, string> = {
  // Alias berdasarkan nama instrumen populer & ID katalog
  "angklung": "jawa-barat.glb",
  "bonang-barung": "jawa-tengah.glb",
  "burdah-palembang": "sumatera-selatan.glb",
  "dambus-babel": "kepulauan-bangka-belitung.glb",
  "dogdog-lojor": "banten.glb",
  "dol-bengkulu": "bengkulu.glb",
  "fu-kerang": "maluku-utara.glb",
  "gambus-selodang": "riau.glb",
  "gamelan-jawa": "jawa-tengah.glb",
  "gamolan-pekhing": "lampung.glb",
  "gendang-beleq": "nusa-tenggara-barat.glb",
  "gendang-panjang": "kepulauan-riau.glb",
  "gimba-kaili": "sulawesi-tengah.glb",
  "guoto-arfak": "papua-barat.glb",
  "hasapi-batak": "sumatera-utara.glb",
  "hasapi-sumut": "sumatera-utara.glb",
  "japen-kalteng": "kalimantan-tengah.glb",
  "jatung-utang": "kalimantan-utara.glb",
  "kecapi-mandar": "sulawesi-barat.glb",
  "kelintang-kayu": "jambi.glb",
  "kendang-reog": "jawa-timur.glb",
  "keso-keso": "sulawesi-selatan.glb",
  "kolintang-minahasa": "sulawesi-utara.glb",
  "lado-lado": "sulawesi-tenggara.glb",
  "musik-panting": "kalimantan-selatan.glb",
  "pikon-dani": "papua-pegunungan.glb",
  "polopalo-gorontalo": "gorontalo.glb",
  "rapai-aceh": "aceh.glb",
  "rindik-bali": "bali.glb",
  "sampe-dayak-kaltim": "kalimantan-timur.glb",
  "saron-demung-jateng": "jawa-tengah.glb",
  "sasando-rote": "nusa-tenggara-timur.glb",
  "talempong-minang": "sumatera-barat.glb",
  "tehyan-jakarta": "dki-jakarta.glb",
  "tifa-asmat": "papua-selatan.glb",
  "tifa-kamoro": "papua-tengah.glb",
  "tifa-marind": "papua-selatan.glb",
  "tifa-sentani": "papua.glb",
  "tifa-totobuang": "maluku.glb",
  "triton-raja-ampat": "papua-barat-daya.glb",
  "tuma-dayak": "kalimantan-barat.glb",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    if (!file || file.includes("..")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const cleanName = file.toLowerCase().replace(/\.glb$/i, "");
    const targetFile =
      INSTRUMENT_FILE_MAP[cleanName] ??
      (file.endsWith(".glb") ? file : `${file}.glb`);

    // Redirect langsung (HTTP 307) ke file static di Vercel CDN
    // Menghindari batas payload serverless function (4.5 MB) pada file GLB berukuran 20-45 MB
    return NextResponse.redirect(
      new URL(`/models/instruments/${targetFile}`, _req.url),
      307
    );
  } catch (error) {
    console.error("Error redirecting instrument GLB:", error);
    return new NextResponse("Error serving model", { status: 500 });
  }
}
