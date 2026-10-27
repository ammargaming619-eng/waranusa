"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRoute } from "@/lib/router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Building2,
  Compass,
  ExternalLink,
  Hammer,
  Layers,
  LayoutGrid,
  MapPin,
  Maximize2,
  Minimize2,
  Music4,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TreePine,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import type { CulturalItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  HOUSES_38_CATALOGUE,
  ISLAND_TABS,
  type IslandRegion,
  type ArchitecturalSpecs,
  type TraditionalHouse,
} from "@/data/traditional-houses";
import {
  INSTRUMENTS_38_CATALOGUE,
  type OrganologyType,
  type OrganologySpecs,
  type TraditionalInstrument38,
} from "@/data/instruments-data";

void Layers;
void Minimize2;
void Sparkles;

const ModelViewer = dynamic(() => import("@/components/three/model-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[520px] w-full rounded-2xl" />,
});

export type { OrganologyType, OrganologySpecs };
export type TraditionalInstrument = TraditionalInstrument38;
export const INSTRUMENTS_CATALOGUE: TraditionalInstrument38[] = INSTRUMENTS_38_CATALOGUE;

export default function Exploration3DView() {
  const route = useRoute();
  
  // State untuk Wahana Rumah Adat 38 Provinsi
  const [selectedHouseIsland, setSelectedHouseIsland] = useState<IslandRegion>("ALL");
  const [activeHouseId, setActiveHouseId] = useState<string>("joglo");
  const [houseSearchQuery, setHouseSearchQuery] = useState<string>("");
  const [houseViewMode, setHouseViewMode] = useState<"strip" | "grid">("strip");
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [modelViewerKey, setModelViewerKey] = useState<number>(0);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  const handleSelectHouse = (houseId: string) => {
    setActiveHouseId(houseId);
  };

  // Sinkronkan pilihan rumah adat jika dibuka dari URL (?house=slug / ?province=name)
  useEffect(() => {
    let houseParam: string | null = null;
    let provParam: string | null = null;

    if (typeof window !== "undefined") {
      try {
        const sp = new URLSearchParams(window.location.search);
        houseParam = sp.get("house");
        provParam = sp.get("province") ?? sp.get("provinsi");
      } catch {}
    }

    const requestedHouse = houseParam ?? route.query.house;
    const requestedProvince = provParam ?? route.query.province ?? route.query.provinsi;

    if (requestedHouse) {
      const found = HOUSES_38_CATALOGUE.find(
        (h) => h.slug === requestedHouse || h.id === requestedHouse
      );
      if (found) {
        setActiveHouseId(found.id);
        setSelectedHouseIsland("ALL");
      } else {
        // Fallback aman ke rumah adat pertama jika query string rusak
        setActiveHouseId(HOUSES_38_CATALOGUE[0].id);
      }
    } else if (requestedProvince) {
      const pLower = requestedProvince.toLowerCase().trim();
      const houseByProv = HOUSES_38_CATALOGUE.find(
        (h) =>
          h.province.toLowerCase() === pLower ||
          h.provinceSlug.toLowerCase() === pLower ||
          h.province.toLowerCase().includes(pLower)
      );
      if (houseByProv) {
        setActiveHouseId(houseByProv.id);
        setSelectedHouseIsland("ALL");
      }
    }
  }, [
    route.query.house,
    route.query.province,
    route.query.provinsi,
  ]);

  // Filter daftar rumah adat (berdasarkan Wilayah Kepulauan & Pencarian)
  const filteredHouses = useMemo(() => {
    return HOUSES_38_CATALOGUE.filter((h) => {
      const matchIsland = selectedHouseIsland === "ALL" || h.islandRegion === selectedHouseIsland;
      if (!matchIsland) return false;
      if (!houseSearchQuery.trim()) return true;
      const q = houseSearchQuery.toLowerCase().trim();
      return (
        h.title.toLowerCase().includes(q) ||
        h.province.toLowerCase().includes(q) ||
        h.ethnicGroup.toLowerCase().includes(q) ||
        h.indigenousName.toLowerCase().includes(q)
      );
    });
  }, [selectedHouseIsland, houseSearchQuery]);

  // Data rumah aktif
  const activeHouse = useMemo(() => {
    return (
      filteredHouses.find((h) => h.id === activeHouseId) ??
      filteredHouses[0] ??
      HOUSES_38_CATALOGUE[0]
    );
  }, [activeHouseId, filteredHouses]);

  // Alat musik khas dari provinsi yang sama untuk tautan cepat antar-budaya
  const matchingInstrument = useMemo(() => {
    return INSTRUMENTS_38_CATALOGUE.find(
      (inst) =>
        inst.province.toLowerCase() === activeHouse.province.toLowerCase() ||
        inst.provinceSlug === activeHouse.provinceSlug ||
        inst.provinceNumber === activeHouse.provinceNumber ||
        (activeHouse.province.includes("Yogyakarta") && inst.province.includes("Yogyakarta")) ||
        (activeHouse.province.includes("Bangka") && inst.province.includes("Bangka"))
    );
  }, [activeHouse]);

  // CulturalItem untuk ModelViewer (langsung memuat GLB model dari public/models/houses/)
  const viewerItem = useMemo<CulturalItem>(() => {
    return activeHouse.fallbackItem;
  }, [activeHouse]);

  return (
    <div className="min-h-screen bg-lontar-gradient text-stone-900 pb-12 pt-3 sm:pt-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* ================= HERO HEADER (FOKUS RUMAH ADAT 38 PROVINSI) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto pt-0 pb-3 sm:pb-4"
        >
          <div className="inline-flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A4B29] mb-1.5">
            <span aria-hidden="true" className="inline-block h-[1.5px] w-5 bg-[#7A4B29]" />
            <span>Ruang Pamer Digital Nusantara</span>
            <span aria-hidden="true" className="inline-block h-[1.5px] w-5 bg-[#7A4B29]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#2D1E12]">
            Eksplorasi 3D Rumah Adat Nusantara
          </h1>
          <p className="mt-1.5 text-stone-600 text-xs sm:text-sm leading-relaxed">
            Jelajahi keagungan arsitektur vernakular, bedah konstruksi saka guru, dan falsafah ruang rumah adat 38 provinsi di Indonesia.
          </p>

          {/* BADGE KOLEKSI & PINTASAN KE INSTRUMEN */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#DFD3C2] px-3.5 py-1.5 text-xs font-bold text-[#2D1E12] shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-[#7A4B29]" />
              <span>38 Rumah Adat Vernakular 3D</span>
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-[#DFD3C2] bg-white/90 hover:bg-stone-50 text-[#6E472D] hover:text-[#52331E] font-bold text-xs h-8 px-3.5 shadow-2xs gap-1.5"
            >
              <Link href="/virtual-instruments">
                <Music4 className="h-3.5 w-3.5 text-[#7A4B29]" />
                <span>Buka Studio Instrumen Virtual</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* ================= PANGGUNG RUMAH ADAT 3D NUSANTARA ================= */}
        <section className="mt-2 mb-10 rounded-3xl border border-[#DFD3C2] bg-white/95 p-3.5 sm:p-5 lg:p-6 shadow-md">
          {/* Header Bagian Arsitektur */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DCD0] pb-2.5 mb-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A4B29]">
                <span aria-hidden="true" className="inline-block h-[1.5px] w-4 bg-[#7A4B29]" />
                <span>Katalog Arsitektur Vernakular Nusantara</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1E12] mt-0.5">
                Bedah Struktur Rumah Adat
              </h2>
            </div>

            {/* Status hitungan katalog */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF6EE] border border-[#DFD3C2] px-3 py-1 text-xs font-semibold text-[#2D1E12]">
                <span className="h-2 w-2 rounded-full bg-[#147A76]" />
                <span>38 Model 3D Interaktif</span>
              </span>
            </div>
          </div>

            {/* TAB WILAYAH / PULAU */}
            <div className="mb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {ISLAND_TABS.map((island) => {
                  const isCurrent = selectedHouseIsland === island.id;
                  return (
                    <button
                      key={island.id}
                      type="button"
                      onClick={() => {
                        setSelectedHouseIsland(island.id);
                      }}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                        isCurrent
                          ? "bg-[#6E472D] text-white shadow-xs font-bold"
                          : "bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 border border-stone-200/60"
                      )}
                    >
                      {island.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PENCARIAN & SWITCHER TAMPILAN (STRIP VS GRID) */}
            <div className="mb-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#FBF8F2] p-2 sm:p-2.5 rounded-2xl border border-stone-200/70">
              {/* Kotak Pencarian */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Cari provinsi, nama rumah, suku..."
                  value={houseSearchQuery}
                  onChange={(e) => setHouseSearchQuery(e.target.value)}
                  className="pl-8 pr-8 h-8 text-xs rounded-full bg-white border-stone-200 focus-visible:ring-[#8A5B38]"
                />
                {houseSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setHouseSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Mode Tampilan Switcher */}
              <div className="flex items-center justify-center gap-1 bg-white p-0.5 rounded-full border border-stone-200 w-full sm:w-auto shadow-xs">
                <button
                  type="button"
                  onClick={() => setHouseViewMode("strip")}
                  className={cn(
                    "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    houseViewMode === "strip"
                      ? "bg-[#6E472D] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  )}
                  title="Tampilan Strip Mendatar"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Strip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHouseViewMode("grid")}
                  className={cn(
                    "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    houseViewMode === "grid"
                      ? "bg-[#6E472D] text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  )}
                  title="Tampilan Kisi-Kisi 38 Provinsi"
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span>Grid ({filteredHouses.length})</span>
                </button>
              </div>
            </div>

            {/* DAFTAR PEMILIH RUMAH ADAT */}
            {filteredHouses.length === 0 ? (
              <div className="mb-4 rounded-2xl border border-dashed border-stone-300 p-6 text-center bg-[#FAF7F2]">
                <p className="text-sm font-semibold text-stone-700">Tidak ada rumah adat yang sesuai pencarian "{houseSearchQuery}"</p>
                <p className="text-xs text-stone-500 mt-1">Coba gunakan kata kunci lain atau pilih tab Semua Wilayah.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHouseSearchQuery("");
                    setSelectedHouseIsland("ALL");
                  }}
                  className="mt-2.5 rounded-full text-xs"
                >
                  Reset Pencarian
                </Button>
              </div>
            ) : houseViewMode === "strip" ? (
              /* DOCK / STRIP HORIZONTAL SCROLLABLE */
              <div className="mb-3 sm:mb-3.5">
                <div className="flex items-stretch gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin">
                  {filteredHouses.map((house) => {
                    const isActive = house.id === activeHouse.id;
                    return (
                      <button
                        key={house.id}
                        type="button"
                        onClick={() => handleSelectHouse(house.id)}
                        className={cn(
                          "group flex-shrink-0 text-left rounded-xl p-2 sm:p-2.5 border transition-all duration-200 min-w-[170px] sm:min-w-[190px] cursor-pointer",
                          isActive
                            ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.01]"
                            : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={cn(
                              "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate",
                              isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                            )}
                          >
                            {house.province}
                          </span>
                        </div>

                        <div className="font-serif font-bold text-xs sm:text-sm leading-snug truncate">
                          {house.title}
                        </div>

                        <div
                          className={cn(
                            "text-[10px] sm:text-[11px] mt-0.5 line-clamp-1",
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
            ) : (
              /* GRID KOLEKSI PENUH 38 PROVINSI */
              <div className="mb-4 max-h-[300px] overflow-y-auto p-1 scrollbar-thin">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {filteredHouses.map((house) => {
                    const isActive = house.id === activeHouse.id;
                    return (
                      <button
                        key={house.id}
                        type="button"
                        onClick={() => handleSelectHouse(house.id)}
                        className={cn(
                          "group text-left rounded-xl p-2.5 border transition-all duration-150 flex flex-col justify-between",
                          isActive
                            ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.02]"
                            : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider truncate block",
                            isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                          )}
                        >
                          {house.province}
                        </span>
                        <span className="font-serif font-bold text-xs leading-snug mt-1 block truncate">
                          {house.title}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] mt-1 block truncate",
                            isActive ? "text-stone-200" : "text-stone-500"
                          )}
                        >
                          Suku {house.ethnicGroup}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AREA UTAMA: MODEL VIEWER (KIRI) + EDITORIAL SCHOLARSHIP (KANAN) */}
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* KOLOM KIRI: STAGE 3D / PREVIEW */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FAF7F2] shadow-inner p-2 sm:p-3">
                  {/* Floating Action Toolbar di Kanvas */}
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-stone-200/80 shadow-md">
                    <button
                      type="button"
                      onClick={() => setIsAutoRotate((prev) => !prev)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-all",
                        isAutoRotate
                          ? "bg-amber-100 text-amber-900"
                          : "bg-stone-100 text-stone-600 hover:text-stone-900"
                      )}
                      title={isAutoRotate ? "Jeda Rotasi Otomatis" : "Mulai Rotasi Otomatis"}
                    >
                      {isAutoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      <span className="hidden sm:inline">{isAutoRotate ? "Jeda" : "Putar"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelViewerKey((k) => k + 1)}
                      className="rounded-full p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="Reset Pandangan Kamera"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFullscreenModal(true)}
                      className="rounded-full p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="Buka Layar Penuh (Fullscreen)"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Stage Model 3D */}
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#221810]/5 via-transparent to-[#221810]/5">
                    <ModelViewer
                      key={`${activeHouse.id}-${modelViewerKey}`}
                      item={viewerItem}
                      className="h-[340px] xs:h-[380px] sm:h-[440px] md:h-[500px] lg:h-[520px]"
                      autoRotate={isAutoRotate}
                      showHotspots
                    />
                  </div>
                </div>

                {/* Panduan Interaksi Singkat & Berkelas */}
                <div className="rounded-xl bg-[#F8F4EC] border border-[#E9DECE] px-4 py-2.5 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    <strong className="font-medium text-[#2D1E12]">Kanvas 360° Interaktif:</strong> Seret mouse/layar sentuh untuk memutar, gulir untuk zoom, &amp; klik nomor emas untuk membedah anatomi rangka.
                  </span>
                  <span className="inline-block text-[11px] text-[#8A5B38] font-mono bg-[#8A5B38]/10 px-2 py-0.5 rounded-md">
                    {activeHouse.modelUrl.split("/").pop()}
                  </span>
                </div>
              </div>

              {/* KOLOM KANAN: EDITORIAL SCHOLARSHIP & SPESIFIKASI ARSITEKTUR */}
              <div className="lg:col-span-5 space-y-5">
                {/* Header Identitas Rumah */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-[#6E472D]/30 bg-[#6E472D]/5 text-[#6E472D] font-semibold text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {activeHouse.province}
                    </Badge>
                    <Badge variant="secondary" className="bg-[#F5EFE4] text-stone-700 border border-[#E2D6C5] text-xs font-medium">
                      Suku {activeHouse.ethnicGroup}
                    </Badge>
                    <Badge variant="secondary" className="bg-[#FAF6EE] text-[#6E472D] border border-[#E2D6C5] text-xs font-medium">
                      Wilayah {activeHouse.islandRegion}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-serif text-3xl font-bold text-[#2D1E12] tracking-tight">
                      {activeHouse.title}
                    </h3>
                    <p className="text-xs italic text-[#7A4B29] font-serif mt-0.5">
                      Nama vernakular: {activeHouse.indigenousName}
                    </p>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed pt-1">
                    {viewerItem.summary}
                  </p>
                </div>

                {/* KUTIPAN FILOSOFI ADAT LELUHUR */}
                <div className="relative rounded-xl border-l-4 border-[#6E472D] bg-gradient-to-r from-[#FAF4E8] to-[#F5ECE0] p-4 text-xs sm:text-sm text-stone-800">
                  <p className="font-bold text-[11px] uppercase tracking-[0.16em] text-[#7A4B29] mb-1">
                    Falsafah Ruang &amp; Adat Leluhur
                  </p>
                  <blockquote className="font-serif italic text-stone-700 leading-relaxed">
                    {activeHouse.philosophy}
                  </blockquote>
                </div>

                {/* GRID 2x2 SPESIFIKASI ANATOMI ARSITEKTUR (EDITORIAL HAIRLINE TANPA KOTAK BERTUMPUK) */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500 block">
                    Karakteristik &amp; Rekayasa Tradisi
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                    {/* Spec 1: Struktur & Pondasi */}
                    <div className="border-t border-[#DFD3C2] pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Hammer className="h-3.5 w-3.5" />
                        <span>Sistem Sambungan</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {activeHouse.specs.structure}
                      </p>
                    </div>

                    {/* Spec 2: Material Alami */}
                    <div className="border-t border-[#DFD3C2] pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <TreePine className="h-3.5 w-3.5" />
                        <span>Material Tradisional</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {activeHouse.specs.material}
                      </p>
                    </div>

                    {/* Spec 3: Geometri Atap */}
                    <div className="border-t border-[#DFD3C2] pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Bentuk &amp; Geometri Atap</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {activeHouse.specs.roofGeometry}
                      </p>
                    </div>

                    {/* Spec 4: Fungsi Ruang Sakral */}
                    <div className="border-t border-[#DFD3C2] pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#6E472D] font-bold">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>Fungsi Ruang &amp; Adat</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {activeHouse.specs.sacredFunction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tautan ke Ensiklopedia Budaya & Pintasan ke Studio Musik */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Button
                    asChild
                    className="w-full sm:w-auto btn-waranusa rounded-full text-white px-6 text-xs sm:text-sm font-semibold shadow-sm"
                  >
                    <Link href={`#/budaya/${activeHouse.slug}`}>
                      Pelajari Sejarah &amp; Rujukan Ilmiah
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {matchingInstrument && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto rounded-full border-[#DFD3C2] bg-white hover:bg-stone-50 text-[#6E472D] hover:text-[#52331E] text-xs sm:text-sm font-bold shadow-2xs gap-1.5"
                    >
                      <Link href={`/virtual-instruments?instrument=${matchingInstrument.id}`}>
                        <Music4 className="h-3.5 w-3.5 text-[#7A4B29]" />
                        <span>Mainkan {matchingInstrument.title} ({activeHouse.province})</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* FULLSCREEN MODAL 3D VIEWER */}
            {isFullscreenModal && (
              <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md p-3 sm:p-6 text-white animate-in fade-in duration-200">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="min-w-0 pr-1">
                    <h3 className="font-serif text-base sm:text-2xl font-bold text-amber-100 truncate">
                      {activeHouse.title} — {activeHouse.province}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-400 truncate">
                      Nama asli: {activeHouse.indigenousName} &bull; Suku {activeHouse.ethnicGroup}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAutoRotate((prev) => !prev)}
                      className="border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 text-xs rounded-full px-2.5 sm:px-3"
                    >
                      {isAutoRotate ? <Pause className="h-3.5 w-3.5 sm:mr-1" /> : <Play className="h-3.5 w-3.5 sm:mr-1" />}
                      <span className="hidden sm:inline">{isAutoRotate ? "Jeda Rotasi" : "Mulai Putar"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setModelViewerKey((k) => k + 1)}
                      className="border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 text-xs rounded-full px-2.5 sm:px-3"
                    >
                      <RotateCcw className="h-3.5 w-3.5 sm:mr-1" />
                      <span className="hidden sm:inline">Reset Kamera</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreenModal(false)}
                      className="text-stone-300 hover:text-white hover:bg-stone-800 rounded-full h-8 w-8 p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 w-full h-full min-h-[300px] relative rounded-xl overflow-hidden mt-3 bg-stone-900/60 flex items-center justify-center">
                  <div className="w-full h-full">
                    <ModelViewer
                      key={`fullscreen-${activeHouse.id}-${modelViewerKey}`}
                      item={viewerItem}
                      height="100%"
                      autoRotate={isAutoRotate}
                      showHotspots
                      className="h-full w-full min-h-[300px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
