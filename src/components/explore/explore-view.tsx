"use client";

/**
 * WaraNusa — ExploreView (#/jelajah)
 * Peta interaktif wilayah budaya 38 Provinsi Indonesia (kiri) + panel kuratorial wilayah (kanan).
 * Mengusung tata letak editorial bersih, gradasi marun-jati, dan navigasi kepulauan tanpa emoji.
 */
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Building2,
  Compass,
  ExternalLink,
  Layers,
  MapPin,
  MoveRight,
  Music4,
  Pin,
  Search,
  Sparkles,
} from "lucide-react";
import type { Route } from "@/lib/router";
import { buildQuery, navigate } from "@/lib/router";
import { api } from "@/lib/api-client";
import type { Region } from "@/lib/types";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IndonesiaMap from "@/components/map/indonesia-map";
import { cn } from "@/lib/utils";
import {
  PROVINCES_38_DATASET,
  ISLAND_FILTER_TABS,
  type Province38,
} from "@/data/regions-38";
import { INSTRUMENTS_38_CATALOGUE } from "@/data/instruments-data";

void Compass;
void Pin;
void Sparkles;

export default function ExploreView({ route }: { route: Route }) {
  const [selectedIsland, setSelectedIsland] = useState<Province38["islandGroup"] | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const regionsQ = useAsyncData(() => api.regions.list(), []);

  // Sinkronkan 38 dataset provinsi komprehensif dengan data API/DB jika tersedia
  const allProvincesAsRegions = useMemo<Region[]>(() => {
    const dbRegions = regionsQ.data ?? [];
    const dbMap = new Map<string, Region>();
    for (const r of dbRegions) {
      dbMap.set(r.code, r);
      dbMap.set(r.name.toLowerCase(), r);
    }

    return PROVINCES_38_DATASET.map((p) => {
      const matchDb = dbMap.get(p.code) ?? dbMap.get(p.name.toLowerCase());
      return {
        id: matchDb?.id ?? p.id,
        code: p.code,
        name: p.name,
        islandGroup: p.islandGroup,
        capital: p.capital,
        lat: p.lat,
        lng: p.lng,
        summary: matchDb?.summary || p.summary,
        description: matchDb?.description || p.summary,
        itemCount: matchDb?.itemCount ?? 1,
        createdAt: matchDb?.createdAt ?? "2026-01-01",
        updatedAt: matchDb?.updatedAt ?? "2026-01-01",
      };
    });
  }, [regionsQ.data]);

  // Filter provinsi berdasarkan wilayah kepulauan dan pencarian
  const filteredProvinces = useMemo(() => {
    return PROVINCES_38_DATASET.filter((p) => {
      const matchIsland = selectedIsland === "ALL" || p.islandGroup === selectedIsland;
      if (!matchIsland) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.capital.toLowerCase().includes(q) ||
        p.traditionalHouseTitle.toLowerCase().includes(q) ||
        p.culturalHighlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [selectedIsland, searchQuery]);

  // Sinkronkan provinsi yang terfilter dengan data Region untuk komponen peta
  const filteredRegions = useMemo(() => {
    const allowedCodes = new Set(filteredProvinces.map((p) => p.code));
    return allProvincesAsRegions.filter((r) => allowedCodes.has(r.code));
  }, [allProvincesAsRegions, filteredProvinces]);

  // Wilayah terpilih diturunkan dari URL (?region=CODE)
  const selectedRegion = useMemo(() => {
    const code = route.query.region;
    if (!code) return null;
    return (
      allProvincesAsRegions.find((r) => r.code === code) ??
      allProvincesAsRegions.find((r) => r.id === code) ??
      null
    );
  }, [allProvincesAsRegions, route.query.region]);

  const selectedMeta = useMemo(() => {
    if (!selectedRegion) return null;
    return (
      PROVINCES_38_DATASET.find(
        (p) => p.code === selectedRegion.code || p.name === selectedRegion.name
      ) ?? null
    );
  }, [selectedRegion]);

  // Cari instrumen musik tradisional dari 38 katalog yang bersesuaian dengan provinsi terpilih
  const matchingInstrument = useMemo(() => {
    if (!selectedRegion) return null;
    const pName = selectedRegion.name.toLowerCase();
    return (
      INSTRUMENTS_38_CATALOGUE.find(
        (inst) =>
          inst.province.toLowerCase() === pName ||
          inst.provinceSlug === selectedRegion.code.toLowerCase() ||
          (selectedRegion.name.includes("Yogyakarta") && inst.province.includes("Yogyakarta")) ||
          (selectedRegion.name.includes("Bangka") && inst.province.includes("Bangka"))
      ) ?? null
    );
  }, [selectedRegion]);

  const detailPanelRef = useRef<HTMLElement>(null);

  const selectRegion = (r: Region) => {
    navigate(buildQuery("jelajah", { region: r.code }), { replace: true });
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  };

  const handleIslandChange = (islandId: Province38["islandGroup"] | "ALL") => {
    setSelectedIsland(islandId);
    // Jika provinsi terpilih saat ini berada di luar pulau yang baru dipilih, bersihkan pemilihan agar peta auto-fit ke pulau baru
    if (selectedRegion && islandId !== "ALL") {
      const currentMeta = PROVINCES_38_DATASET.find((p) => p.code === selectedRegion.code);
      if (currentMeta && currentMeta.islandGroup !== islandId) {
        navigate(buildQuery("jelajah", {}), { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-lontar-gradient">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* ============ HEADER EDITORIAL ============ */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-[#DFD3C2]"
        >
          <div>
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A4B29] mb-2">
              <span aria-hidden="true" className="inline-block h-[1.5px] w-6 bg-[#7A4B29]" />
              <span>Atlas Geografi &amp; Budaya Nusantara</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2D1E12]">
              Jelajahi 38 Provinsi Indonesia
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-stone-600 leading-relaxed">
              Pilih penanda kuning emas pada peta untuk menelaah koordinat wilayah, ibu kota provinsi, arsitektur rumah adat, serta pusaka tradisi dari Sabang sampai Merauke.
            </p>
          </div>

          {/* Indikator Cakupan */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#2D1E12] bg-white/90 border border-[#DFD3C2] px-4 py-2 rounded-full shadow-2xs shrink-0 self-start md:self-auto">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#E5A93C] ring-4 ring-[#E5A93C]/20" />
            <span>38 Provinsi Terpetakan</span>
          </div>
        </motion.div>

        {/* ============ FILTER TAB KEPULAUAN (BERSIH TANPA EMOJI) ============ */}
        <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter kepulauan">
          {ISLAND_FILTER_TABS.map((tab) => {
            const isActive = selectedIsland === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleIslandChange(tab.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "btn-waranusa text-white shadow-sm"
                    : "bg-white/85 text-stone-700 hover:bg-white hover:text-[#2D1E12] border border-[#DFD3C2]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          {/* ============ PETA UTAMA & INDEKS WILAYAH ============ */}
          <div className="lg:col-span-8 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-[#DFD3C2] shadow-md bg-white">
              <IndonesiaMap
                regions={filteredRegions}
                selectedId={selectedRegion?.id ?? null}
                onSelect={selectRegion}
                className="w-full"
              />
            </div>

            {/* Indeks Cepat Provinsi */}
            <div className="rounded-2xl border border-[#DFD3C2] bg-white/90 backdrop-blur-xs p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-stone-200/80">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#7A4B29]" />
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D1E12]">
                    Indeks Provinsi ({filteredProvinces.length} Wilayah)
                  </h3>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <Input
                    type="search"
                    placeholder="Cari provinsi, ibu kota, rumah adat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-full bg-[#FAF7F2] border-[#DFD3C2] focus-visible:ring-1 focus-visible:ring-[#6E472D]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 nice-scroll">
                {filteredProvinces.map((p) => {
                  const isSelected = selectedRegion?.code === p.code;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const target = allProvincesAsRegions.find((r) => r.code === p.code);
                        if (target) selectRegion(target);
                      }}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all text-left cursor-pointer",
                        isSelected
                          ? "border-[#147A76] bg-[#147A76] text-white shadow-xs font-semibold"
                          : "border-stone-200/90 bg-[#FAF7F2] text-stone-700 hover:border-[#6E472D]/40 hover:bg-white"
                      )}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============ PANEL KURATORIAL WILAYAH ============ */}
          <aside ref={detailPanelRef} className="lg:col-span-4 scroll-mt-20" aria-label="Detail wilayah budaya">
            {selectedRegion && selectedMeta ? (
              <Card className="overflow-hidden rounded-2xl border-[#DFD3C2] shadow-lg bg-white py-0 gap-0">
                {/* Header Panel Budaya — Gradasi Kayu Kopi Gelap ke Espresso */}
                <div className="bg-gradient-to-br from-[#3C2517] via-[#2E1B10] to-[#1C1009] px-5 py-5 text-white border-b border-[#D4A843]/25">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-[0.18em] text-[#D4A843]">
                      Kepulauan {selectedMeta.islandLabel}
                    </span>
                    <span className="text-stone-300/90 font-mono">
                      {selectedMeta.lat.toFixed(3)}°, {selectedMeta.lng.toFixed(3)}°
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#FAF6F0]">
                    {selectedRegion.name}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-200">
                    <Building2 className="h-3.5 w-3.5 text-[#D4A843]" aria-hidden="true" />
                    <span>
                      Ibu Kota Provinsi: <strong className="text-white">{selectedMeta.capital}</strong>
                    </span>
                  </p>
                </div>

                {/* Isi Panel dengan Pemisah Garis Tipis (Tanpa Tumpukan Kotak di Dalam Kotak) */}
                <CardContent className="divide-y divide-[#EAE0D2] p-5 text-stone-800">
                  <div className="pb-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7A4B29] mb-1.5">
                      Karakter Budaya &amp; Lanskap
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
                      {selectedMeta.summary}
                    </p>
                  </div>

                  {/* Pusaka & Warisan Tradisi */}
                  <div className="py-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500 mb-2.5">
                      Pusaka &amp; Warisan Tradisi Utama
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeta.culturalHighlights.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[#F7F2E8] px-2.5 py-1 text-xs font-medium text-[#2D1E12] border border-[#E2D6C5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arsitektur Adat 3D Terhubung */}
                  <div className="py-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-stone-500 font-bold mb-1">
                      <span>Arsitektur Vernakular</span>
                      <span className="font-mono text-[10px] text-[#147A76]">Model 3D Tersedia</span>
                    </div>
                    <p className="font-serif text-base font-bold text-[#2D1E12]">
                      {selectedMeta.traditionalHouseTitle}
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="mt-3 w-full rounded-xl btn-waranusa text-white text-xs font-bold shadow-xs"
                    >
                      <a href={`#/eksplorasi-3d?house=${selectedMeta.traditionalHouseSlug}&province=${encodeURIComponent(selectedRegion.name)}`}>
                        <Box className="mr-1.5 h-3.5 w-3.5" />
                        Bedah Struktur 3D di Ruang Pamer
                        <ExternalLink className="ml-1.5 h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  {/* Instrumen Tradisional 3D Terhubung */}
                  {matchingInstrument && (
                    <div className="py-4 border-t border-[#E8DEC0]/80">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-stone-500 font-bold mb-1">
                        <span>Alat Musik Tradisional</span>
                        <span className="font-mono text-[10px] text-[#7A4B29]">Studio 3D Tersedia</span>
                      </div>
                      <p className="font-serif text-base font-bold text-[#2D1E12]">
                        {matchingInstrument.title}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {matchingInstrument.organologyLabel} &bull; Suku {matchingInstrument.ethnicGroup}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-3 w-full rounded-xl btn-waranusa text-white text-xs font-bold shadow-xs"
                      >
                        <a href={`#/eksplorasi-3d?instrument=${matchingInstrument.id}&tab=instruments`}>
                          <Music4 className="mr-1.5 h-3.5 w-3.5" />
                          Mainkan {matchingInstrument.title} di Studio 3D
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Tombol Ensiklopedia & Katalog */}
                  <div className="pt-4 space-y-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl border-[#D5C6B2] text-[#2D1E12] hover:bg-[#FAF7F2] text-xs font-semibold"
                    >
                      <a href={`#/budaya/${selectedMeta.traditionalHouseSlug}`}>
                        Baca Ensiklopedia {selectedMeta.traditionalHouseTitle}
                        <MoveRight className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-[#DFD3C2] bg-white/95 p-6 shadow-sm text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E5A93C]/20 to-[#D4A843]/15 border border-[#E5A93C]/35 mb-4 shadow-xs">
                  <MapPin className="h-6 w-6 text-[#C2881C]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A4B29]">
                  Panduan Peta
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold text-[#2D1E12]">
                  Pilih Provinsi pada Peta
                </h3>
                <p className="mt-2 max-w-xs text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Klik salah satu dari 38 titik penanda kuning emas pada peta atau pilih nama provinsi dari indeks di bawah peta untuk membuka rincian budaya daerah.
                </p>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
