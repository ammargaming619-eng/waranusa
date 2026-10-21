"use client";

import { useState, useMemo } from "react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Building2,
  Compass,
  ExternalLink,
  Hammer,
  Layers,
  Music4,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TreePine,
  Volume2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import type { CulturalItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const ModelViewer = dynamic(() => import("@/components/three/model-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[440px] w-full rounded-2xl" />,
});

const SaronInstrument = dynamic(
  () => import("@/components/three/saron-instrument").then((m) => m.SaronInstrument),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[380px] w-full rounded-2xl" />,
  }
);

// ============================================================================
// DATASET MODEL BUDAYA & RUMAH ADAT NUSANTARA (SKALABEL UNTUK 38 PROVINSI)
// ============================================================================

export type IslandRegion =
  | "ALL"
  | "SUMATERA"
  | "JAWA"
  | "KALIMANTAN"
  | "SULAWESI"
  | "BALI_NUSA"
  | "PAPUA_MALUKU";

export interface ArchitecturalSpecs {
  structure: string;
  material: string;
  roofGeometry: string;
  sacredFunction: string;
}

export interface TraditionalHouse {
  id: string;
  slug: string;
  title: string;
  indigenousName: string;
  province: string;
  ethnicGroup: string;
  islandRegion: Exclude<IslandRegion, "ALL">;
  has3DModel: boolean;
  philosophy: string;
  specs: ArchitecturalSpecs;
  fallbackItem: CulturalItem;
}

const FALLBACK_GADANG: CulturalItem = {
  id: "seed-rumah-gadang",
  slug: "rumah-gadang",
  title: "Rumah Gadang",
  summary:
    "Arsitektur vernakular Minangkabau dengan tiang kayu miring bersendi batu yang lentur meredam gempa, serta atap bagonjong melengkung tajam mirip tanduk kerbau.",
  description:
    "Rumah Gadang adalah pusat kehidupan komunal dan kepemilikan matrilineal suku Minangkabau di Sumatera Barat, dirancang secara harmonis mengikuti falsafah alam takambang jadi guru.",
  status: "PUBLISHED",
  featured: true,
  viewCount: 120,
  category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  region: { id: "ID-SB", code: "ID-SB", name: "Sumatera Barat", islandGroup: "SUMATERA", summary: "Ranah Minang", lat: -0.7399, lng: 100.8000, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  hotspots: [
    { id: "h1", itemId: "seed-rumah-gadang", title: "Atap Gonjong", description: "Bentuk atap melengkung runcing menyerupai tanduk kerbau dari rajutan ijuk tahan cuaca", x: 0, y: 1.2, z: 0, published: true },
    { id: "h2", itemId: "seed-rumah-gadang", title: "Dinding Ukiran Singok", description: "Pola ornamen flora sulur khas yang menyimbolkan keteguhan adat matrilineal", x: -0.8, y: 0.1, z: 0.5, published: true },
  ],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

const FALLBACK_JOGLO: CulturalItem = {
  id: "seed-joglo",
  slug: "joglo",
  title: "Rumah Joglo",
  summary:
    "Mahakarya arsitektur kayu Jawa bertingkat tumpangsari yang dipikul oleh empat pilar saka guru tanpa paku besi, mengikat keseimbangan mikrokosmos dan makrokosmos.",
  description:
    "Rumah Joglo merupakan manifestasi filosofi hidup orang Jawa yang memadukan ruang terbuka egaliter di pendapa dengan ruang sakral senthong tengah.",
  status: "PUBLISHED",
  featured: true,
  viewCount: 95,
  category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  region: { id: "ID-YO", code: "ID-YO", name: "D.I. Yogyakarta", islandGroup: "JAWA", summary: "Pusat Kebudayaan Jawa", lat: -7.7956, lng: 110.3695, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  hotspots: [
    { id: "h3", itemId: "seed-joglo", title: "Saka Guru", description: "Empat tiang penyangga utama penopang struktur atap tumpangsari bertingkat", x: 0, y: 0.8, z: 0, published: true },
    { id: "h4", itemId: "seed-joglo", title: "Pendapa Ageng", description: "Ruang terbuka luas di bagian depan untuk musyawarah warga dan pentas gamelan", x: 0, y: -0.2, z: 0.6, published: true },
  ],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

const HOUSES_CATALOGUE: TraditionalHouse[] = [
  {
    id: "rumah-gadang",
    slug: "rumah-gadang",
    title: "Rumah Gadang",
    indigenousName: "Rumah Bagonjong / Godang",
    province: "Sumatera Barat",
    ethnicGroup: "Minangkabau",
    islandRegion: "SUMATERA",
    has3DModel: true,
    philosophy:
      "“Gadang jan maampok, tinggi jan malanjuang” — Menjulang megah tanpa menindas sesama, berakar pada musyawarah mufakat, syarak, dan ketahanan kaum matrilineal.",
    specs: {
      structure: "Konstruksi pasak kayu elastis bersendi batu pipih tanpa paku (tahan guncangan gempa)",
      material: "Kayu juar/ulin tahan rayap, anyaman sasak bambu, serta lapisan atap ijuk hitam pekat",
      roofGeometry: "Atap gonjong melengkung runcing menjulang membelah angin badai bukit barisan",
      sacredFunction: "Pusat musyawarah kaum matrilineal, serambi anjuang, & pengayom lumbung rangkiang",
    },
    fallbackItem: FALLBACK_GADANG,
  },
  {
    id: "joglo",
    slug: "joglo",
    title: "Rumah Joglo",
    indigenousName: "Joglo Trajumas / Sinom",
    province: "D.I. Yogyakarta & Jawa Tengah",
    ethnicGroup: "Jawa",
    islandRegion: "JAWA",
    has3DModel: true,
    philosophy:
      "“Bawana agung lan bawana alit” — Harmonisasi kosmos makrokosmos dan sukma mikrokosmos dalam naungan empat saka guru penopang tingkatan tumpangsari.",
    specs: {
      structure: "4 Saka Guru utama dengan sistem kuncian lidah-pasak purus penopang rangka tumpangsari",
      material: "Kayu jati tua (Tectona grandis) solid, pondasi umpak batu candi, & dinding gebyok ukir",
      roofGeometry: "Bentuk atap Tajug piramidal bertingkat melambangkan jenjang kedewasaan spiritual",
      sacredFunction: "Pendapa terbuka penerima tamu egaliter, pringgitan wayang, & senthong sakral keluarga",
    },
    fallbackItem: FALLBACK_JOGLO,
  },
  {
    id: "tongkonan",
    slug: "tongkonan",
    title: "Tongkonan",
    indigenousName: "Banua Pa'rapuan",
    province: "Sulawesi Selatan",
    ethnicGroup: "Toraja",
    islandRegion: "SULAWESI",
    has3DModel: false,
    philosophy:
      "“Misa’ kada dipotuo, pantan kada dipomate” — Ikatan sehati penegak rumpun leluhur yang berorientasi vertikal ke arah utara Puang Matua.",
    specs: {
      structure: "Panggung kayu uru dengan tiang penyangga silinder kokoh berkunci balok tulak somba",
      material: "Kayu uru hutan alami, atap tumpukan bambu belah berlapis, & ornamen tanduk kabongo",
      roofGeometry: "Lengkungan parabolik menjulang mirip haluan perahu pelaut purba menatap langit utara",
      sacredFunction: "Pusat pertemuan klan besar, lumbung pangan alang sura, & arena ritus agung Rambu Solo'",
    },
    fallbackItem: {
      id: "seed-tongkonan",
      slug: "tongkonan",
      title: "Tongkonan",
      summary: "Arsitektur perahu kosmis suku Toraja dengan konstruksi panggung kayu dan tanduk kerbau.",
      description: "Tongkonan adalah rumah adat orang Toraja dengan atap menjulang menyerupai perahu bercadik leluhur.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 88,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-SN", code: "ID-SN", name: "Sulawesi Selatan", islandGroup: "SULAWESI", summary: "Tana Toraja", lat: -3.05, lng: 119.88, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
  {
    id: "rumah-betang",
    slug: "rumah-betang",
    title: "Rumah Betang",
    indigenousName: "Huma Betang",
    province: "Kalimantan Tengah",
    ethnicGroup: "Dayak Ngaju",
    islandRegion: "KALIMANTAN",
    has3DModel: false,
    philosophy:
      "“Belom Bahadat” — Tata hidup beradab dalam naungan komunal tanpa sekat, merawat kesetaraan dan toleransi lintas keyakinan.",
    specs: {
      structure: "Rumah panggung raksasa setinggi 3-5 meter ditopang puluhan pilar kayu ulin anti-lapuk",
      material: "Kayu ulin (besi) hutan tropis, dinding papan pasak, atap sirap belah, & tangga kayu tunggal",
      roofGeometry: "Bumbungan pelana memanjang ratusan meter dengan sirkulasi silang pembasmi lembap hutan",
      sacredFunction: "Kediaman puluhan keluarga besar bersama, balai musyawarah damai, & benteng satwa liar",
    },
    fallbackItem: {
      id: "seed-rumah-betang",
      slug: "rumah-betang",
      title: "Rumah Betang",
      summary: "Rumah panjang panggung khas suku Dayak Kalimantan dengan struktur ulin berdaya tahan ratusan tahun.",
      description: "Rumah Betang adalah rumah komunal khas Dayak yang menampung ratusan anggota keluarga dalam satu atap persaudaraan.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 76,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-KT", code: "ID-KT", name: "Kalimantan Tengah", islandGroup: "KALIMANTAN", summary: "Bumi Tambun Bungai", lat: -1.5, lng: 113.5, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
  {
    id: "honai",
    slug: "honai",
    title: "Honai",
    indigenousName: "Pilamo / Ebei",
    province: "Papua Pegunungan",
    ethnicGroup: "Dani",
    islandRegion: "PAPUA_MALUKU",
    has3DModel: false,
    philosophy:
      "“Satu tungku kehangatan” — Mempertautkan persaudaraan tanpa sekat pembeda dalam lingkaran pelindung dari dinginnya lembah Baliem.",
    specs: {
      structure: "Rangka melingkar bertingkat dua dengan empat tiang utama kayu lokop penyangga loteng",
      material: "Kayu bulat hutan, dinding anyaman bilah ganda kedap angin, serta atap kubah jerami tebal",
      roofGeometry: "Kubah aerodinamis mengerucut tanpa jendela penyekat hawa dingin angin pegunungan",
      sacredFunction: "Perapian komunal penghangat malam, ruang perundingan tetua suku, & pewarisan kearifan",
    },
    fallbackItem: {
      id: "seed-honai",
      slug: "honai",
      title: "Honai",
      summary: "Rumah bulat khas suku Dani beratap kubah jerami yang dirancang cerdas menahan hawa dingin pegunungan.",
      description: "Honai merupakan rumah tradisional suku Dani di Lembah Baliem Papua dengan struktur melingkar aerodinamis.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 65,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-PE", code: "ID-PE", name: "Papua Pegunungan", islandGroup: "PAPUA", summary: "Lembah Baliem", lat: -4.0, lng: 138.9, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
  {
    id: "rumah-bolon",
    slug: "rumah-bolon",
    title: "Rumah Bolon",
    indigenousName: "Ruma Batak / Jabu Bolon",
    province: "Sumatera Utara",
    ethnicGroup: "Batak Toba",
    islandRegion: "SUMATERA",
    has3DModel: false,
    philosophy:
      "“Dalihan Na Tolu” — Tiga tiang tungku kekerabatan penyeimbang semesta: Somba Marhula-hula, Manat Mardongan Tubu, Elek Marboru.",
    specs: {
      structure: "Tiang gelondongan bersendi batu umpak alami berkuncian pasak tali ijuk tanpa baut besi",
      material: "Kayu keras rimba, dinding papan ukir gorga triwarna (merah, putih, hitam), & atap ijuk rapat",
      roofGeometry: "Lengkungan tajam haluan perahu dengan pedimen muka bertatahkan simbol singa-singa penolak bala",
      sacredFunction: "Kediaman tetua adat/raja huta, lumbung pangan sopo, serta ruang peradilan musyawarah",
    },
    fallbackItem: {
      id: "seed-rumah-bolon",
      slug: "rumah-bolon",
      title: "Rumah Bolon",
      summary: "Rumah adat suku Batak Toba berukir Gorga dengan bentuk haluan perahu yang megah di tepian Danau Toba.",
      description: "Rumah Bolon adalah lambang kebesaran suku Batak Toba yang sarat makna ornamen pelindung spiritual.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 71,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-SU", code: "ID-SU", name: "Sumatera Utara", islandGroup: "SUMATERA", summary: "Bona Pasogit", lat: 2.6, lng: 98.8, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
  {
    id: "bale-manten",
    slug: "bale-manten",
    title: "Bale Manten",
    indigenousName: "Bale Daja / Meten",
    province: "Bali",
    ethnicGroup: "Bali",
    islandRegion: "BALI_NUSA",
    has3DModel: false,
    philosophy:
      "“Tri Hita Karana & Sanga Mandala” — Harmoni kosmis spasial penataan arah kaja-kelod (gunung-laut) demi menjaga kesucian raga dan jiwa manusia.",
    specs: {
      structure: "Bebaturan pedestal batu bata terangkat tinggi ditopang 8 saka kayu berpasak (sakadutus)",
      material: "Kayu nangka/cempaka terpilih, bata gosok cetak tanah liat khas Bali, & atap alang-alang tebal",
      roofGeometry: "Bentuk limasan tropis berujung murda pengikat konsentrasi energi suci arah kaja (utara)",
      sacredFunction: "Ruang peristirahatan kepala keluarga & anak dara, simpanan pusaka keris, & ritus manusa yadnya",
    },
    fallbackItem: {
      id: "seed-bale-manten",
      slug: "bale-manten",
      title: "Bale Manten Bali",
      summary: "Kompleks arsitektur vernakular Bali bernavigasi arah suci Kaja (gunung agung) penuh keteduhan spiritual.",
      description: "Bale Manten adalah bangunan paling utara pada kompleks pekarangan tradisional Bali.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 59,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-BA", code: "ID-BA", name: "Bali", islandGroup: "BALI_NUSA", summary: "Pulau Dewata", lat: -8.34, lng: 115.09, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
  {
    id: "bale-tani",
    slug: "bale-tani",
    title: "Bale Tani Sasak",
    indigenousName: "Bale Kodong / Sasak Sade",
    province: "Nusa Tenggara Barat",
    ethnicGroup: "Sasak",
    islandRegion: "BALI_NUSA",
    has3DModel: false,
    philosophy:
      "“Merawat bumi pertiwi” — Pintu dibuat merunduk agar setiap tamu menghaturkan rasa hormat dan kerendahan hati saat melangkah masuk.",
    specs: {
      structure: "Rangka kayu dan bambu petung bertumpu pada pondasi tanah liat lempung padat alami",
      material: "Dinding anyaman bilah bambu bedek, atap susunan alang-alang, & lantai lepa olahan alami",
      roofGeometry: "Atap bertengger rendah menjuntai melengkung meneduhkan hunian dari sengatan surya pesisir",
      sacredFunction: "Bale luar untuk ruang pergaulan & bale dalem khusus wanita, persalinan, serta sesajen",
    },
    fallbackItem: {
      id: "seed-bale-tani",
      slug: "bale-tani",
      title: "Bale Tani Sasak",
      summary: "Hunian bersahaja masyarakat Sasak di Lombok dengan arsitektur ramah lingkungan dan pintu tawadhu.",
      description: "Bale Tani mencerminkan kesahajaan dan keterikatan erat masyarakat Sasak dengan tanah leluhur.",
      status: "PUBLISHED",
      featured: true,
      viewCount: 52,
      category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      region: { id: "ID-NB", code: "ID-NB", name: "Nusa Tenggara Barat", islandGroup: "BALI_NUSA", summary: "Lombok", lat: -8.65, lng: 116.32, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      hotspots: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  },
];

const ISLAND_TABS: { id: IslandRegion; label: string }[] = [
  { id: "ALL", label: "Semua Wilayah" },
  { id: "SUMATERA", label: "Sumatera" },
  { id: "JAWA", label: "Jawa" },
  { id: "KALIMANTAN", label: "Kalimantan" },
  { id: "SULAWESI", label: "Sulawesi" },
  { id: "BALI_NUSA", label: "Bali & Nusa Tenggara" },
  { id: "PAPUA_MALUKU", label: "Papua & Maluku" },
];

type MainTabFilter = "all" | "architecture" | "instruments";

export default function Exploration3DView() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabFilter>("all");
  const [selectedIsland, setSelectedIsland] = useState<IslandRegion>("ALL");
  const [activeHouseId, setActiveHouseId] = useState<string>("rumah-gadang");

  // Query API untuk sinkronisasi data dinamis bila tersedia di database
  const gadangQ = useAsyncData(() => api.items.detail("rumah-gadang"), []);
  const jogloQ = useAsyncData(() => api.items.detail("joglo"), []);

  // Filter daftar rumah adat berdasarkan wilayah pulau yang dipilih
  const filteredHouses = useMemo(() => {
    if (selectedIsland === "ALL") return HOUSES_CATALOGUE;
    return HOUSES_CATALOGUE.filter((h) => h.islandRegion === selectedIsland);
  }, [selectedIsland]);

  // Dapatkan data rumah aktif
  const activeHouse = useMemo(() => {
    return (
      HOUSES_CATALOGUE.find((h) => h.id === activeHouseId) ?? HOUSES_CATALOGUE[0]
    );
  }, [activeHouseId]);

  // Siapkan CulturalItem yang siap dimasukkan ke ModelViewer
  const viewerItem = useMemo<CulturalItem>(() => {
    if (activeHouse.id === "rumah-gadang" && gadangQ.data) {
      return gadangQ.data;
    }
    if (activeHouse.id === "joglo" && jogloQ.data) {
      return jogloQ.data;
    }
    return activeHouse.fallbackItem;
  }, [activeHouse, gadangQ.data, jogloQ.data]);

  const isModelLoading =
    (activeHouse.id === "rumah-gadang" && gadangQ.loading) ||
    (activeHouse.id === "joglo" && jogloQ.loading);

  return (
    <div className="min-h-screen bg-[#FCF8EC] text-stone-900 pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-10">
          <Badge className="rounded-full bg-[#8A5B38]/15 text-[#6E472D] border-none px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Wahana Digital Nusantara
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2D1E12]">
            Eksplorasi 3D &amp; Musik Virtual
          </h1>
          <p className="mt-3.5 text-stone-600 text-sm sm:text-base leading-relaxed">
            Rasakan dimensi baru pelestarian budaya: bedah anatomi arsitektur vernakular dalam sudut pandang 360° dan tabuh instrumen gamelan tradisional langsung dari peramban Anda.
          </p>

          {/* TAB FILTER UTAMA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMainTab("all")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all",
                activeMainTab === "all"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              Semua Wahana
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab("architecture")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5",
                activeMainTab === "architecture"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              <Building2 className="h-4 w-4" />
              Arsitektur Adat 38 Provinsi
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab("instruments")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5",
                activeMainTab === "instruments"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              <Music4 className="h-4 w-4" />
              Instrumen Musik Virtual
            </button>
          </div>
        </div>

        {/* ================= BAGIAN 1: RUMAH ADAT 3D NUSANTARA ================= */}
        {(activeMainTab === "all" || activeMainTab === "architecture") && (
          <section className="mt-6 mb-16 rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-md p-5 sm:p-8 lg:p-10 shadow-lg">
            {/* Header Bagian Arsitektur */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A5B38] flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  Katalog Arsitektur Vernakular Nusantara
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E12] mt-1">
                  Bedah Struktur Rumah Adat
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                  Pilihlah rumah adat dari berbagai kepulauan Nusantara untuk membedah filosofi ruang, sambungan tahan gempa, dan kearifan material alami.
                </p>
              </div>

              {/* Status hitungan katalog */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCF8EC] border border-[#E5D7C5] px-3 py-1 text-xs font-medium text-[#6E472D]">
                  <Box className="h-3.5 w-3.5 text-[#8A5B38]" />
                  2 Model 3D Interaktif &bull; 6 Kurasi Digital
                </span>
              </div>
            </div>

            {/* TAB WILAYAH / PULAU */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {ISLAND_TABS.map((island) => {
                  const isCurrent = selectedIsland === island.id;
                  return (
                    <button
                      key={island.id}
                      type="button"
                      onClick={() => setSelectedIsland(island.id)}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                        isCurrent
                          ? "bg-[#6E472D] text-white shadow-sm"
                          : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
                      )}
                    >
                      {island.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DOCK / STRIP PEMILIH RUMAH ADAT (HORIZONTAL SCROLLABLE) */}
            <div className="mb-8">
              <div className="flex items-stretch gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                {filteredHouses.map((house) => {
                  const isActive = house.id === activeHouse.id;
                  return (
                    <button
                      key={house.id}
                      type="button"
                      onClick={() => setActiveHouseId(house.id)}
                      className={cn(
                        "group flex-shrink-0 text-left rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 min-w-[200px] sm:min-w-[220px]",
                        isActive
                          ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.01]"
                          : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                          )}
                        >
                          {house.province.split("&")[0].trim()}
                        </span>
                        {house.has3DModel ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                              isActive
                                ? "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            )}
                          >
                            <Box className="h-2.5 w-2.5" />
                            3D Aktif
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-md",
                              isActive
                                ? "text-stone-300 bg-white/10"
                                : "text-stone-500 bg-stone-200/70"
                            )}
                          >
                            Arsip
                          </span>
                        )}
                      </div>

                      <div className="font-serif font-bold text-sm sm:text-base leading-tight">
                        {house.title}
                      </div>

                      <div
                        className={cn(
                          "text-[11px] mt-1 line-clamp-1",
                          isActive ? "text-stone-200" : "text-stone-500"
                        )}
                      >
                        Suku {house.ethnicGroup}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AREA UTAMA: MODEL VIEWER (KIRI) + EDITORIAL SCHOLARSHIP (KANAN) */}
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* KOLOM KIRI: STAGE 3D / PREVIEW */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FAF7F2] shadow-inner p-2 sm:p-3">
                  {isModelLoading ? (
                    <Skeleton className="h-[440px] w-full rounded-xl" />
                  ) : activeHouse.has3DModel ? (
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#221810]/5 via-transparent to-[#221810]/5">
                      <ModelViewer
                        item={viewerItem}
                        height={440}
                        autoRotate
                        showHotspots
                      />
                    </div>
                  ) : (
                    /* Tampilan arsip digital bagi rumah yang model fotogrametrinya sedang dikurasi */
                    <div className="flex h-[440px] flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF7F2] to-[#F5ECE1] rounded-xl border border-dashed border-[#E5D7C5]">
                      <div className="h-16 w-16 rounded-2xl bg-[#6E472D]/10 flex items-center justify-center text-[#6E472D] mb-4">
                        <Building2 className="h-8 w-8" />
                      </div>
                      <Badge className="bg-[#6E472D]/15 text-[#6E472D] border-none text-[11px] font-bold uppercase tracking-wider mb-2">
                        Digitalisasi Fotogrametri 3D
                      </Badge>
                      <h4 className="font-serif text-xl font-bold text-[#2D1E12]">
                        {activeHouse.title} — {activeHouse.province}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed">
                        Data arsitektur, pemetaan spasial, dan spesifikasi material tradisi telah didokumentasikan. Model 3D interaktif sedang dalam tahap pemindaian fotogrametri presisi tinggi.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveHouseId("rumah-gadang")}
                          className="rounded-full border-[#6E472D] text-[#6E472D] hover:bg-[#6E472D] hover:text-white text-xs font-semibold"
                        >
                          <Box className="h-3.5 w-3.5 mr-1.5" />
                          Buka Model 3D Rumah Gadang
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveHouseId("joglo")}
                          className="rounded-full border-[#6E472D] text-[#6E472D] hover:bg-[#6E472D] hover:text-white text-xs font-semibold"
                        >
                          <Box className="h-3.5 w-3.5 mr-1.5" />
                          Buka Model 3D Rumah Joglo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Panduan Interaksi Singkat & Berkelas */}
                {activeHouse.has3DModel && (
                  <div className="rounded-xl bg-[#F8F4EC] border border-[#E9DECE] px-4 py-2.5 text-xs text-stone-600 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-stone-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      <strong className="font-medium text-[#2D1E12]">Kanvas 360° Aktif:</strong> Seret untuk memutar, gulir untuk zoom, &amp; klik nomor emas untuk membedah anatomi rangka.
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-stone-400 font-mono">
                      WebGL &bull; R3F
                    </span>
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: EDITORIAL SCHOLARSHIP & SPESIFIKASI ARSITEKTUR */}
              <div className="lg:col-span-5 space-y-5">
                {/* Header Identitas Rumah */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-[#6E472D]/30 bg-[#6E472D]/5 text-[#6E472D] font-medium text-xs">
                      📍 {activeHouse.province}
                    </Badge>
                    <Badge variant="secondary" className="bg-stone-100 text-stone-700 text-xs font-normal">
                      Suku {activeHouse.ethnicGroup}
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-normal">
                      Wilayah {activeHouse.islandRegion}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl font-bold text-[#2D1E12] tracking-tight">
                      {activeHouse.title}
                    </h3>
                    <p className="text-xs italic text-[#8A5B38] font-serif mt-0.5">
                      Nama asli / vernakular: {activeHouse.indigenousName}
                    </p>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed pt-1">
                    {viewerItem.summary}
                  </p>
                </div>

                {/* KUTIPAN FILOSOFI ADAT LELUHUR */}
                <div className="relative rounded-2xl border-l-4 border-[#8A5B38] bg-[#FAF5EB] p-4 text-xs sm:text-sm text-stone-800 shadow-sm">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-[#8A5B38] mb-1">
                    Falsafah Ruang &amp; Adat Leluhur
                  </p>
                  <blockquote className="font-serif italic text-stone-700 leading-relaxed">
                    {activeHouse.philosophy}
                  </blockquote>
                </div>

                {/* GRID 2x2 SPESIFIKASI ANATOMI ARSITEKTUR (PENGGANTI AI SLOP) */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D1E12] block">
                    Karakteristik &amp; Rekayasa Tradisi:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Card 1: Struktur & Pondasi */}
                    <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Hammer className="h-3.5 w-3.5" />
                        <span>Sistem Sambungan</span>
                      </div>
                      <p className="text-stone-600 leading-snug">
                        {activeHouse.specs.structure}
                      </p>
                    </div>

                    {/* Card 2: Material Alami */}
                    <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <TreePine className="h-3.5 w-3.5" />
                        <span>Material Tradisional</span>
                      </div>
                      <p className="text-stone-600 leading-snug">
                        {activeHouse.specs.material}
                      </p>
                    </div>

                    {/* Card 3: Geometri Atap */}
                    <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Bentuk &amp; Geometri Atap</span>
                      </div>
                      <p className="text-stone-600 leading-snug">
                        {activeHouse.specs.roofGeometry}
                      </p>
                    </div>

                    {/* Card 4: Fungsi Ruang Sakral */}
                    <div className="rounded-xl border border-stone-200 bg-white p-3 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>Fungsi Ruang &amp; Adat</span>
                      </div>
                      <p className="text-stone-600 leading-snug">
                        {activeHouse.specs.sacredFunction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tautan ke Ensiklopedia Budaya */}
                <div className="pt-2">
                  <Button
                    asChild
                    className="w-full sm:w-auto rounded-full bg-[#6E472D] hover:bg-[#583720] text-white px-6 text-xs sm:text-sm font-semibold shadow-sm"
                  >
                    <Link href={`#/budaya/${activeHouse.slug}`}>
                      Pelajari Sejarah &amp; Rujukan Ilmiah
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= BAGIAN 2: INSTRUMEN VIRTUAL ================= */}
        {(activeMainTab === "all" || activeMainTab === "instruments") && (
          <section className="mb-16 rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-md p-5 sm:p-8 lg:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A5B38] flex items-center gap-1.5">
                  <Music4 className="h-4 w-4" />
                  Audio &amp; Gamelan Tradisional
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E12] mt-0.5">
                  Studio Instrumen Musik Virtual
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Eksplorasi laras pelog Jawa dengan sintesis Web Audio API dan pelacakan gestur tangan tanpa sentuhan.
                </p>
              </div>
              <Badge className="bg-[#6E472D] text-white rounded-full px-3.5 py-1 text-xs font-semibold self-start md:self-auto">
                <Volume2 className="h-3.5 w-3.5 mr-1" />
                Web Audio Synth &amp; Air Gesture
              </Badge>
            </div>

            {/* Embed Saron Instrument */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 sm:p-6 shadow-inner">
              <SaronInstrument />
            </div>

            {/* Rencana Instrumen Lainnya */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200/70 bg-[#FCFAF6] p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Angklung Bambu</h4>
                  <p className="text-xs text-stone-500">Jawa Barat &middot; Getaran tabung bambu nada ganda</p>
                </div>
                <Badge variant="secondary" className="text-[11px] rounded-full">
                  Segera Hadir
                </Badge>
              </div>
              <div className="rounded-2xl border border-stone-200/70 bg-[#FCFAF6] p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Rebab Gesek</h4>
                  <p className="text-xs text-stone-500">Nusantara &middot; Dawai pelog penyanyi melodi</p>
                </div>
                <Badge variant="secondary" className="text-[11px] rounded-full">
                  Rencana
                </Badge>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
