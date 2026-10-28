"use client";

/**
 * WaraNusa — InstrumentView (#/instrumen)
 * Studio Interaktif 38 Alat Musik Tradisional Nusantara:
 * - Mendukung 5 tipe cara main: strike (pukul), pluck (petik), bow (gesek), shake (goyang), dan blow (tiup).
 * - Memuat lengkap 38 model 3D .glb provinsi dari Sabang sampai Merauke.
 * - Hybrid Audio Engine (MP3 + 6-Mode Procedural Web Audio Synthesizer) + Sensor Tiup Mikrofon + Gestur Kamera AI.
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  Info,
  Keyboard,
  LayoutGrid,
  Music2,
  MousePointerClick,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Search,
} from "lucide-react";
import type { Route } from "@/lib/router";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n-store";
import { ISLAND_TABS, type IslandRegion } from "@/data/traditional-houses";
import {
  INSTRUMENTS_38_CATALOGUE,
  INTERACTION_META,
  INTERACTION_TABS,
  type InteractionFilter,
} from "@/data/instruments-data";

const Instrument3DStage = dynamic(
  () =>
    import("@/components/three/instrument-3d-stage").then((m) => m.Instrument3DStage),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[460px] w-full rounded-2xl" />,
  }
);

export default function InstrumentView({ route }: { route?: Route } = {}) {
  const { language, t } = useTranslation();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string>("saron-demung-jateng");
  const [selectedIsland, setSelectedIsland] = useState<IslandRegion>("ALL");
  const [selectedInteraction, setSelectedInteraction] =
    useState<InteractionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [volume, setVolume] = useState(0.78);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeEditorialTab, setActiveEditorialTab] = useState<"controls" | "culture">("controls");

  const getIslandLabel = (island: { id: IslandRegion; label: string }) => {
    if (language !== "EN") return island.label;
    const match = island.label.match(/\((\d+)\)/);
    const countStr = match ? ` (${match[1]})` : "";
    switch (island.id) {
      case "ALL":
        return `All Regions${countStr}`;
      case "SUMATERA":
        return `Sumatra${countStr}`;
      case "JAWA":
        return `Java${countStr}`;
      case "KALIMANTAN":
        return `Kalimantan${countStr}`;
      case "SULAWESI":
        return `Sulawesi${countStr}`;
      case "BALI_NUSA":
        return `Bali & Nusa Tenggara${countStr}`;
      case "PAPUA_MALUKU":
        return `Papua & Maluku${countStr}`;
      default:
        return island.label;
    }
  };

  const getInteractionMeta = (type: string) => {
    const meta = INTERACTION_META[type as keyof typeof INTERACTION_META] || INTERACTION_META.strike;
    if (language !== "EN") return meta;
    const enLabels: Record<string, { badge: string; label: string }> = {
      strike: { badge: "Strike / Percussion", label: "Strike" },
      pluck: { badge: "Pluck / Strings", label: "Pluck" },
      bow: { badge: "Bow / Strings", label: "Bow" },
      shake: { badge: "Shake / Bamboo", label: "Shake" },
      blow: { badge: "Blow / Wind", label: "Blow" },
    };
    return {
      ...meta,
      badge: enLabels[type]?.badge ?? meta.badge,
      label: enLabels[type]?.label ?? meta.label,
    };
  };

  const gamelanItem = useAsyncData(() => api.items.detail("gamelan-jawa"), []);
  void gamelanItem;

  // Deep-link ?instrument=slug, ?instrumen=slug, ?alat=slug, ?province=slug
  useEffect(() => {
    let paramVal: string | null = null;
    if (searchParams) {
      try {
        paramVal =
          searchParams.get("instrument") ??
          searchParams.get("instrumen") ??
          searchParams.get("alat") ??
          searchParams.get("province") ??
          searchParams.get("provinsi");
      } catch {}
    }
    if (!paramVal && typeof window !== "undefined") {
      try {
        const sp = new URLSearchParams(window.location.search);
        paramVal =
          sp.get("instrument") ??
          sp.get("instrumen") ??
          sp.get("alat") ??
          sp.get("province") ??
          sp.get("provinsi");
      } catch {}
    }

    const requested =
      paramVal ??
      route?.query?.instrumen ??
      route?.query?.instrument ??
      route?.query?.alat ??
      route?.query?.provinsi ??
      route?.query?.province;

    if (!requested) return;
    const reqLower = requested.toLowerCase().trim();
    const found = INSTRUMENTS_38_CATALOGUE.find(
      (i) =>
        i.id.toLowerCase() === reqLower ||
        i.slug.toLowerCase() === reqLower ||
        i.provinceSlug.toLowerCase() === reqLower ||
        i.province.toLowerCase() === reqLower ||
        i.title.toLowerCase().includes(reqLower) ||
        i.province.toLowerCase().includes(reqLower)
    );
    if (found) {
      setActiveId(found.id);
      setSelectedIsland("ALL");
      setSelectedInteraction("ALL");
    } else {
      // Graceful self-fallback: jika query string tidak ditemukan, fallback ke instrumen pertama
      setActiveId(INSTRUMENTS_38_CATALOGUE[0].id);
      toast.info("Menampilkan 38 koleksi instrumen", {
        description: "Pilih provinsi atau cara memainkan instrumen di bawah ini.",
      });
    }
  }, [
    searchParams,
    route?.query?.instrumen,
    route?.query?.instrument,
    route?.query?.alat,
    route?.query?.provinsi,
    route?.query?.province,
  ]);

  const filteredInstruments = useMemo(() => {
    return INSTRUMENTS_38_CATALOGUE.filter((inst) => {
      if (selectedIsland !== "ALL" && inst.islandRegion !== selectedIsland) {
        return false;
      }
      if (
        selectedInteraction !== "ALL" &&
        inst.interactionType !== selectedInteraction
      ) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        inst.title.toLowerCase().includes(q) ||
        inst.province.toLowerCase().includes(q) ||
        inst.ethnicGroup.toLowerCase().includes(q) ||
        inst.vernacularName.toLowerCase().includes(q)
      );
    });
  }, [selectedIsland, selectedInteraction, searchQuery]);

  const activeInstrument = useMemo(() => {
    return (
      filteredInstruments.find((i) => i.id === activeId) ??
      INSTRUMENTS_38_CATALOGUE.find((i) => i.id === activeId) ??
      filteredInstruments[0] ??
      INSTRUMENTS_38_CATALOGUE[0]
    );
  }, [activeId, filteredInstruments]);

  const interactionMeta = INTERACTION_META[activeInstrument.interactionType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 md:py-8 lg:px-8 pb-32 sm:pb-36"
    >
      {/* ============ STUDIO HEADER RINGKAS & ELEGAN (ABOVE THE FOLD) ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#E5DACB]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8A5B38]">
            <span aria-hidden="true" className="inline-block h-[1.5px] w-5 bg-[#8A5B38]" />
            <span>{t("instruments.studio_badge", "Studio Musik Tradisional 3D")}</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 font-semibold">{t("instruments.studio_provinces", "38 Provinsi")}</span>
          </div>
          <h1 className="mt-0.5 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2D1E12] tracking-tight truncate">
            {activeInstrument.title} — {activeInstrument.province}
          </h1>
          <p className="text-xs text-stone-600 truncate mt-0.5">
            {activeInstrument.organologyLabel} &bull; {language === "EN" ? "Ethnic Group" : "Suku"} {activeInstrument.ethnicGroup} &bull; {t("instruments.prop_vernacular", "Vernakular")}: {activeInstrument.vernacularName}
          </p>
        </div>

        {/* Action Controls: Tombol Pemilih 38 Koleksi & Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#DFD3C2] bg-white hover:bg-stone-50 text-[#3C2213] text-xs font-bold px-3.5 h-9 shadow-2xs gap-1.5 cursor-pointer"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-[#8C5E3C]" />
                <span>{t("instruments.select_btn", "Pilih dari 38 Alat Musik")}</span>
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-4xl rounded-3xl border border-stone-200 bg-[#FCFAF6] p-5 sm:p-7 text-stone-900 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                  {t("instruments.select_title", "Pilih dari 38 Alat Musik Nusantara")}
                </DialogTitle>
              </DialogHeader>

              {/* Filter Kepulauan & Pencarian di dalam Dialog */}
              <div className="mt-3 space-y-2.5 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("instruments.search_placeholder", "Cari provinsi, nama alat musik, suku...")}
                    className="pl-10 h-10 rounded-full border-stone-300 bg-white text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {ISLAND_TABS.filter(
                    (island) =>
                      island.id === "ALL" ||
                      INSTRUMENTS_38_CATALOGUE.some((inst) => inst.islandRegion === island.id)
                  ).map((island) => {
                    const isCurrent = selectedIsland === island.id;
                    return (
                      <button
                        key={island.id}
                        type="button"
                        onClick={() => setSelectedIsland(island.id)}
                        className={cn(
                          "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                          isCurrent
                            ? "bg-[#6E472D] text-white shadow-xs"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        )}
                      >
                        {getIslandLabel(island)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid 38 Alat Musik di dalam Dialog (Tanpa Scrollbar Horizontal) */}
              <div className="mt-4 flex-1 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                  {filteredInstruments.map((inst) => {
                    const isActive = inst.id === activeInstrument.id;
                    const meta = getInteractionMeta(inst.interactionType);
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => {
                          setActiveId(inst.id);
                          setSelectorOpen(false);
                        }}
                        className={cn(
                          "group text-left rounded-2xl p-3 border transition-all duration-150 flex flex-col justify-between cursor-pointer min-w-0",
                          isActive
                            ? "bg-[#6E472D] text-white border-[#4A2D19] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.01]"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-amber-50/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider truncate block",
                              isActive ? "text-amber-200/95" : "text-[#8A5B38]"
                            )}
                          >
                            {inst.province}
                          </span>
                          <span
                            className={cn(
                              "text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#6E472D]/10 text-[#6E472D]"
                            )}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-sm leading-snug block truncate">
                          {inst.title}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] mt-1 block truncate",
                            isActive ? "text-stone-200" : "text-stone-500"
                          )}
                        >
                          {language === "EN" ? "Ethnic Group" : "Suku"} {inst.ethnicGroup}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Badge
            variant="outline"
            className="hidden sm:inline-flex rounded-full border-[#6E472D]/30 bg-[#6E472D]/8 text-[#6E472D] text-xs font-semibold px-3 py-1"
          >
            {getInteractionMeta(activeInstrument.interactionType).badge}
          </Badge>
        </div>
      </div>

      {/* ============ MENU PEMILIH ALAT MUSIK (DI ATAS CARA MAIN DENGAN CELAH & JARAK LEGA) ============ */}
      <div className="mt-3.5 sm:mt-4 space-y-2.5 rounded-2xl border border-[#DFD3C2]/90 bg-white/90 p-3 sm:p-4 shadow-xs">
        {/* Baris 1: Filter Kepulauan yang jelas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B29] mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3 text-[#7A4B29]" />
            {language === "EN" ? "Region:" : "Wilayah:"}
          </span>
          {ISLAND_TABS.filter((island) =>
            island.id === "ALL" ||
            INSTRUMENTS_38_CATALOGUE.some((inst) => inst.islandRegion === island.id)
          ).map((island) => {
            const isCurrent = selectedIsland === island.id;
            return (
              <button
                key={island.id}
                type="button"
                onClick={() => setSelectedIsland(island.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                  isCurrent
                    ? "btn-waranusa text-white shadow-xs font-bold"
                    : "bg-[#FAF7F2] text-stone-700 hover:bg-stone-200/80 border border-stone-200/80"
                )}
              >
                {getIslandLabel(island)}
              </button>
            );
          })}
        </div>

        {/* Baris 2: Strip Koleksi Alat Musik dengan celah-celah lega (gap-2.5) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar snap-x border-t border-stone-200/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B29] mr-1 shrink-0 flex items-center gap-1">
            <Music2 className="h-3 w-3 text-[#7A4B29]" />
            {language === "EN" ? "Collection:" : "Koleksi:"}
          </span>
          {filteredInstruments.map((inst) => {
            const isActive = inst.id === activeInstrument.id;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setActiveId(inst.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all border cursor-pointer snap-start min-h-[38px]",
                  isActive
                    ? "bg-[#6E472D] text-white border-[#4A2D19] shadow-sm font-bold ring-2 ring-[#6E472D]/20"
                    : "bg-[#FAF7F2] text-stone-800 border-stone-200/90 hover:border-stone-300 hover:bg-white"
                )}
              >
                <span className="font-semibold">{inst.title}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                    isActive ? "bg-white/20 text-white" : "bg-stone-200/70 text-stone-600"
                  )}
                >
                  {inst.province}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ STUDIO SPLIT VIEW: SISI KIRI 3D (~60%) & SISI KANAN ENSIKLOPEDIA (~40%) ============ */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Sisi Kiri (~60% / 7 cols): Panggung 3D & Bilah Nada Interaktif */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-3xl border border-[#DFD3C2] bg-white/95 p-2 sm:p-4 shadow-md overflow-hidden">
            <Instrument3DStage
              instrument={activeInstrument}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>
        </div>

        {/* Sisi Kanan (~40% / 5 cols): Ringkasan Ensiklopedia & Organologi Budaya */}
        <div className="lg:col-span-5 space-y-3">
          {/* Tab Pemilih Kajian vs Kontrol */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-full border border-stone-200/80 w-fit">
            <button
              type="button"
              onClick={() => setActiveEditorialTab("culture")}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
                activeEditorialTab === "culture"
                  ? "bg-[#6E472D] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              {language === "EN" ? "Organology & Heritage" : "Kajian Falsafah & Organologi"}
            </button>
            <button
              type="button"
              onClick={() => setActiveEditorialTab("controls")}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
                activeEditorialTab === "controls"
                  ? "bg-[#6E472D] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              {language === "EN" ? "Multi-Input Controls" : "Panduan Multi-Input"}
            </button>
          </div>

          {activeEditorialTab === "culture" ? (
            <Card className="rounded-3xl border-[#DFD3C2] bg-white/95 shadow-xs">
              <CardHeader className="pb-2 px-4 sm:px-5 pt-4 sm:pt-5">
                <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                  {language === "EN" ? `Organology & Heritage of ${activeInstrument.title}` : `Kajian Organologi & Falsafah ${activeInstrument.title}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-stone-600 px-4 sm:px-5 pb-4 sm:pb-5">
                <blockquote className="rounded-2xl border-l-4 border-[#6E472D] bg-[#FAF6EE] p-3.5 font-serif italic text-stone-700">
                  &ldquo;{activeInstrument.philosophy}&rdquo;
                </blockquote>

                <div className="space-y-2 pt-1">
                  <div className="rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      {t("instruments.prop_tuning", "Sistem Tangga Nada")}
                    </span>
                    <strong className="text-stone-800 text-xs sm:text-[13px]">{activeInstrument.specs.tuningSystem}</strong>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      {t("instruments.prop_material", "Material Akustik")}
                    </span>
                    <strong className="text-stone-800 text-xs sm:text-[13px]">{activeInstrument.specs.materialAcoustic}</strong>
                  </div>
                  <div className="rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      {t("instruments.prop_ensemble", "Fungsi Musik & Ensemble")}
                    </span>
                    <strong className="text-stone-800 text-xs sm:text-[13px]">{activeInstrument.specs.ensembleFunction}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-200/60">
                  <p className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <BookOpen className="h-3.5 w-3.5 text-[#6E472D]" aria-hidden="true" />
                    {language === "EN" ? "Kemdikbudristek Cultural Archive" : "Portal Budaya Kemdikbudristek RI"}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full btn-waranusa font-bold text-white text-xs px-4 shadow-xs"
                  >
                    <a href={`#/budaya/${activeInstrument.slug}`}>
                      {language === "EN" ? "View Full Record" : "Buka Lembar Ensiklopedia"}
                      <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl border-[#DFD3C2] bg-white/95 shadow-xs">
              <CardHeader className="pb-2 px-4 sm:px-5 pt-4 sm:pt-5">
                <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                  {language === "EN"
                    ? `Multi-Input Control Guide (${getInteractionMeta(activeInstrument.interactionType).label})`
                    : `Sistem Kontrol Multi-Input (${getInteractionMeta(activeInstrument.interactionType).label})`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-5 pb-4 sm:pb-5">
                <ol className="space-y-2.5 text-xs sm:text-[13px] text-stone-700">
                  <li className="flex items-start gap-2 rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-3">
                    <MousePointerClick
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-[#2D1E12]">
                        {language === "EN" ? "Mouse & Touchscreen:" : "Mouse & Layar Sentuh:"}
                      </strong>{" "}
                      {activeInstrument.mouseGuide}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-3">
                    <Keyboard
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-[#2D1E12]">
                        {language === "EN" ? "Keyboard Number Shortcuts:" : "Pintasan Keyboard Nada:"}
                      </strong>{" "}
                      {language === "EN" ? "Press keys " : "Tekan tombol angka "}
                      <kbd className="rounded border border-[#DFD3C2] bg-[#FAF6EE] px-1 py-0.5 font-mono text-xs">
                        1
                      </kbd>
                      –
                      <kbd className="rounded border border-[#DFD3C2] bg-[#FAF6EE] px-1 py-0.5 font-mono text-xs">
                        7
                      </kbd>{" "}
                      {language === "EN" ? "to play harmonic notes." : "untuk membunyikan bilah nada."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 rounded-xl border border-stone-200/80 bg-[#FAF7F2] p-3">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-[#2D1E12]">
                        {language === "EN" ? "AI Camera Mode (MediaPipe):" : "Mode Kamera AI (MediaPipe):"}
                      </strong>{" "}
                      {activeInstrument.cameraGuide}
                    </span>
                  </li>
                </ol>

                <div className="space-y-1.5 pt-2 max-w-sm">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="volume-studio"
                      className="text-xs font-semibold text-[#2D1E12]"
                    >
                      {t("instruments.master_volume", "Volume Master")}
                    </Label>
                    <span
                      className="text-xs font-bold text-[#7A4B29]"
                      aria-live="polite"
                    >
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="volume-studio"
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(v) => setVolume(v[0] ?? 0.78)}
                    aria-label={t("instruments.master_volume", "Volume Master")}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
