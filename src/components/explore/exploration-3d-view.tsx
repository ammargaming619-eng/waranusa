"use client";

import { useState } from "react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Building2,
  ExternalLink,
  Info,
  Layers,
  Music4,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import type { CulturalItem } from "@/lib/types";

const ModelViewer = dynamic(() => import("@/components/three/model-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[440px] w-full rounded-xl" />,
});

const SaronInstrument = dynamic(
  () => import("@/components/three/saron-instrument").then((m) => m.SaronInstrument),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[380px] w-full rounded-2xl" />,
  }
);

const FALLBACK_GADANG: CulturalItem = {
  id: "seed-rumah-gadang",
  slug: "rumah-gadang",
  title: "Rumah Gadang",
  summary: "Arsitektur khas Minangkabau dengan atap gonjong bertanduk kerbau yang menjulang tinggi, dinding ukiran sarat falsafah alam, dan ketahanan terhadap gempa bumi.",
  description: "Rumah Gadang adalah rumah adat tradisional suku Minangkabau di Sumatera Barat dengan tiang-tiang kayu miring yang tahan terhadap guncangan gempa bumi.",
  status: "PUBLISHED",
  featured: true,
  viewCount: 120,
  category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  region: { id: "ID-SB", code: "ID-SB", name: "Sumatera Barat", islandGroup: "SUMATERA", summary: "Ranah Minang", lat: -0.7399, lng: 100.8000, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  hotspots: [
    { id: "h1", itemId: "seed-rumah-gadang", title: "Atap Gonjong", description: "Bentuk atap melengkung menyerupai tanduk kerbau dari ijuk tahan cuaca", x: 0, y: 1.2, z: 0, published: true },
    { id: "h2", itemId: "seed-rumah-gadang", title: "Dinding Ukiran", description: "Pola ornamen flora khas yang melambangkan falsafah alam Minangkabau", x: -0.8, y: 0.1, z: 0.5, published: true },
  ],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

const FALLBACK_JOGLO: CulturalItem = {
  id: "seed-joglo",
  slug: "joglo",
  title: "Rumah Joglo",
  summary: "Arsitektur vernakular Jawa bertingkat tumpangsari yang ditopang empat tiang utama (saka guru) kokoh tanpa paku besi.",
  description: "Rumah Joglo merupakan lambang status sosial dan harmoni spiritual masyarakat Jawa dengan ruang utama pendapa dan tatanan saka guru yang kokoh.",
  status: "PUBLISHED",
  featured: true,
  viewCount: 95,
  category: { id: "cat-arsitektur", slug: "arsitektur", name: "Arsitektur", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  region: { id: "ID-YO", code: "ID-YO", name: "D.I. Yogyakarta", islandGroup: "JAWA", summary: "Pusat Kebudayaan Jawa", lat: -7.7956, lng: 110.3695, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  hotspots: [
    { id: "h3", itemId: "seed-joglo", title: "Saka Guru", description: "Empat tiang penyangga utama penopang atap tumpangsari piramidal", x: 0, y: 0.8, z: 0, published: true },
    { id: "h4", itemId: "seed-joglo", title: "Pendapa Depan", description: "Ruang terbuka untuk musyawarah keluarga besar dan pertunjukan gamelan", x: 0, y: -0.2, z: 0.6, published: true },
  ],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};
import { cn } from "@/lib/utils";

type TabFilter = "all" | "architecture" | "instruments";

export default function Exploration3DView() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [activeHouse, setActiveHouse] = useState<"rumah-gadang" | "joglo">("rumah-gadang");

  const gadangQ = useAsyncData(() => api.items.detail("rumah-gadang"), []);
  const jogloQ = useAsyncData(() => api.items.detail("joglo"), []);

  const rawHouseData = activeHouse === "rumah-gadang" ? gadangQ.data : jogloQ.data;
  const activeHouseData = rawHouseData ?? (activeHouse === "rumah-gadang" ? FALLBACK_GADANG : FALLBACK_JOGLO);
  const activeHouseLoading = activeHouse === "rumah-gadang" ? gadangQ.loading : jogloQ.loading;

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
            Rasakan dimensi baru pelestarian budaya: jelajahi model arsitektur vernakular dalam sudut pandang 360° dan tabuh instrumen gamelan tradisional langsung dari peramban Anda.
          </p>

          {/* TAB FILTER */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all",
                activeTab === "all"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              Semua Wahana
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5",
                activeTab === "architecture"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              <Building2 className="h-4 w-4" />
              Rumah Adat 3D
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("instruments")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5",
                activeTab === "instruments"
                  ? "bg-[#6E472D] text-white shadow-md"
                  : "bg-white/80 text-stone-700 hover:bg-white border border-stone-200"
              )}
            >
              <Music4 className="h-4 w-4" />
              Instrumen Musik Virtual
            </button>
          </div>
        </div>

        {/* ================= BAGIAN 1: RUMAH ADAT 3D ================= */}
        {(activeTab === "all" || activeTab === "architecture") && (
          <section className="mt-6 mb-16 rounded-3xl border border-stone-200/80 bg-white/80 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A5B38]">
                  Arsitektur Vernakular 360°
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E12] mt-0.5">
                  Model 3D Rumah Adat
                </h2>
              </div>

              {/* Pemilih Rumah Adat */}
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-full border border-stone-200 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveHouse("rumah-gadang")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                    activeHouse === "rumah-gadang"
                      ? "bg-[#6E472D] text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-900"
                  )}
                >
                  Rumah Gadang
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHouse("joglo")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                    activeHouse === "joglo"
                      ? "bg-[#6E472D] text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-900"
                  )}
                >
                  Rumah Joglo
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Kolom Viewer 3D */}
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF7F2] shadow-inner p-2">
                  {activeHouseLoading ? (
                    <Skeleton className="h-[420px] w-full rounded-xl" />
                  ) : activeHouseData ? (
                    <ModelViewer
                      item={activeHouseData}
                      height={440}
                      autoRotate
                      showHotspots
                    />
                  ) : (
                    <div className="flex h-[440px] flex-col items-center justify-center gap-3 text-center text-stone-500">
                      <Box className="h-10 w-10 text-stone-400" />
                      <p className="text-sm">Model 3D sedang disiapkan.</p>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-stone-500 flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#8A5B38]" />
                  Gunakan mouse / sentuhan untuk memutar, zoom, dan klik titik emas untuk membaca detail.
                </p>
              </div>

              {/* Kolom Info Budaya */}
              <div className="lg:col-span-5 space-y-4">
                {activeHouseData ? (
                  <>
                    <Badge variant="outline" className="border-stone-300 text-stone-700">
                      {activeHouseData.region.name}
                    </Badge>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1E12]">
                      {activeHouseData.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {activeHouseData.summary}
                    </p>

                    <div className="rounded-2xl border border-stone-200 bg-[#FCFAF6] p-4 text-xs space-y-2 text-stone-700">
                      <p className="font-bold text-[#6E472D] flex items-center gap-1.5">
                        <Info className="h-4 w-4" />
                        Fitur Model Interaktif:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-stone-600">
                        <li>Titik penjelasan (hotspots) struktur atap &amp; tiang utama</li>
                        <li>Rotasi 360 derajat bebas sumbu X, Y, dan Z</li>
                        <li>Dapat diakses lancar di layar komputer maupun ponsel</li>
                      </ul>
                    </div>

                    <Button
                      asChild
                      className="mt-4 rounded-full bg-[#6E472D] hover:bg-[#583720] text-white"
                    >
                      <Link href={`#/budaya/${activeHouseData.slug}`}>
                        Baca Artikel Lengkap &amp; Rujukan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Skeleton className="h-48 w-full rounded-2xl" />
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= BAGIAN 2: INSTRUMEN VIRTUAL ================= */}
        {(activeTab === "all" || activeTab === "instruments") && (
          <section className="mb-16 rounded-3xl border border-stone-200/80 bg-white/80 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A5B38]">
                  Audio &amp; Gamelan Tradisional
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E12] mt-0.5">
                  Studio Instrumen Musik Virtual
                </h2>
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
                  <p className="text-xs text-stone-500">Jawa Barat &middot; Nada ganda bambu</p>
                </div>
                <Badge variant="secondary" className="text-[11px] rounded-full">
                  Segera Hadir
                </Badge>
              </div>
              <div className="rounded-2xl border border-stone-200/70 bg-[#FCFAF6] p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Rebab Gesek</h4>
                  <p className="text-xs text-stone-500">Nusantara &middot; Senar pelog melodi</p>
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
