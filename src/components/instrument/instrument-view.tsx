"use client";

/**
 * WaraNusa — InstrumentView (#/instrumen)
 * Studio Interaktif 38 Alat Musik Tradisional Nusantara:
 * - Mendukung 5 tipe cara main: strike (pukul), pluck (petik), bow (gesek), shake (goyang), dan blow (tiup).
 * - Memuat lengkap 38 model 3D .glb provinsi dari Sabang sampai Merauke.
 * - Hybrid Audio Engine (MP3 + 6-Mode Procedural Web Audio Synthesizer) + Sensor Tiup Mikrofon + Gestur Kamera AI.
 */
import { useEffect, useMemo, useState } from "react";
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
  Waves,
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

export default function InstrumentView({ route }: { route: Route }) {
  const [activeId, setActiveId] = useState<string>("saron-demung-jateng");
  const [selectedIsland, setSelectedIsland] = useState<IslandRegion>("ALL");
  const [selectedInteraction, setSelectedInteraction] =
    useState<InteractionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [volume, setVolume] = useState(0.78);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeEditorialTab, setActiveEditorialTab] = useState<"controls" | "culture">("controls");

  const gamelanItem = useAsyncData(() => api.items.detail("gamelan-jawa"), []);
  void gamelanItem;

  // Deep-link ?instrumen=slug, ?instrument=slug, ?provinsi=slug, atau ?province=slug
  useEffect(() => {
    const requested =
      route.query.instrumen ??
      route.query.instrument ??
      route.query.provinsi ??
      route.query.province;
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
      toast.info("Menampilkan 38 koleksi instrumen", {
        description: "Pilih provinsi atau cara memainkan instrumen di bawah ini.",
      });
    }
  }, [
    route.query.instrumen,
    route.query.instrument,
    route.query.provinsi,
    route.query.province,
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
    <div className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 md:py-8 lg:px-8 pb-32 sm:pb-36">
      {/* ============ STUDIO HEADER RINGKAS & ELEGAN (ABOVE THE FOLD) ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#E5DACB]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8A5B38]">
            <Waves className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Studio Musik Tradisional 3D</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 font-semibold">38 Provinsi</span>
          </div>
          <h1 className="mt-0.5 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2D1E12] tracking-tight truncate">
            {activeInstrument.title} — {activeInstrument.province}
          </h1>
          <p className="text-xs text-stone-600 truncate mt-0.5">
            {activeInstrument.organologyLabel} &bull; Suku {activeInstrument.ethnicGroup} &bull; Vernakular: {activeInstrument.vernacularName}
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
                <span>Pilih Alat Musik (38)</span>
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-3xl border border-stone-200 bg-[#FCFAF6] p-5 sm:p-6 text-stone-900 shadow-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl font-bold text-[#2D1E12]">
                  Pilih dari 38 Alat Musik Nusantara
                </DialogTitle>
              </DialogHeader>

              {/* Filter Kepulauan & Pencarian di dalam Dialog */}
              <div className="mt-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari provinsi, nama alat musik, suku..."
                    className="pl-9 h-9.5 rounded-full border-stone-300 bg-white text-xs"
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
                        {island.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-stone-200/60 pt-2">
                  {INTERACTION_TABS.map((tab) => {
                    const isCurrent = selectedInteraction === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedInteraction(tab.id)}
                        className={cn(
                          "whitespace-nowrap rounded-full px-3 py-0.5 text-[11px] font-medium transition-all border cursor-pointer",
                          isCurrent
                            ? "bg-[#6E472D]/10 text-[#6E472D] border-[#6E472D]/40 font-bold"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid 38 Alat Musik di dalam Dialog */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[50vh] overflow-y-auto p-1 scrollbar-thin">
                {filteredInstruments.map((inst) => {
                  const isActive = inst.id === activeInstrument.id;
                  const meta = INTERACTION_META[inst.interactionType];
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => {
                        setActiveId(inst.id);
                        setSelectorOpen(false);
                      }}
                      className={cn(
                        "group text-left rounded-xl p-2.5 border transition-all duration-150 flex flex-col justify-between cursor-pointer",
                        isActive
                          ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.02]"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-amber-50/50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider truncate block",
                            isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                          )}
                        >
                          {inst.province}
                        </span>
                        <span
                          className={cn(
                            "text-[8px] font-semibold px-1 py-0.2 rounded shrink-0",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#6E472D]/10 text-[#6E472D]"
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <span className="font-serif font-bold text-xs leading-snug mt-0.5 block truncate">
                        {inst.title}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] mt-1 block truncate",
                          isActive ? "text-stone-200" : "text-stone-500"
                        )}
                      >
                        Suku {inst.ethnicGroup}
                      </span>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Badge
            variant="outline"
            className="hidden sm:inline-flex rounded-full border-[#6E472D]/30 bg-[#6E472D]/8 text-[#6E472D] text-xs font-semibold px-3 py-1"
          >
            {interactionMeta.badge}
          </Badge>
        </div>
      </div>

      {/* ============ PANGGUNG 3D UTAMA (ABOVE THE FOLD) ============ */}
      <div className="mt-3.5 sm:mt-4">
        <div className="rounded-3xl border border-[#DFD3C2] bg-white/95 p-2 sm:p-5 shadow-md overflow-hidden">
          <Instrument3DStage
            instrument={activeInstrument}
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>
      </div>

      {/* ============ STRIP HORIZONTAL RAMPING PEMILIH 38 INSTRUMEN ============ */}
      <div className="mt-3.5 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar snap-x">
          {INSTRUMENTS_38_CATALOGUE.map((inst) => {
            const isActive = inst.id === activeInstrument.id;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setActiveId(inst.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border cursor-pointer snap-start min-h-[36px]",
                  isActive
                    ? "bg-[#6E472D] text-white border-[#583720] shadow-xs font-bold ring-1 ring-[#6E472D]/30"
                    : "bg-white/95 text-stone-700 border-stone-200/90 hover:border-stone-300 hover:bg-stone-50"
                )}
              >
                <Music2 className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-amber-200" : "text-[#8A5B38]")} />
                <span>{inst.title}</span>
                <span className={cn("text-[10px]", isActive ? "text-amber-100/80" : "text-stone-400")}>
                  &bull; {inst.province}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ DETAIL KAJIAN & PANDUAN MULTI-INPUT (DI BAWAH FOLD) ============ */}
      <div className="mt-8 border-t border-[#E5DACB] pt-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveEditorialTab("controls")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all border cursor-pointer",
              activeEditorialTab === "controls"
                ? "bg-[#6E472D] text-white border-[#583720] shadow-xs"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            )}
          >
            Panduan Bermain Multi-Input
          </button>
          <button
            type="button"
            onClick={() => setActiveEditorialTab("culture")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all border cursor-pointer",
              activeEditorialTab === "culture"
                ? "bg-[#6E472D] text-white border-[#583720] shadow-xs"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            )}
          >
            Kajian Falsafah &amp; Organologi
          </button>
        </div>

        {activeEditorialTab === "controls" ? (
          <Card className="rounded-3xl border-[#DFD3C2] bg-white/95 shadow-xs">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                Sistem Kontrol Multi-Input ({interactionMeta.label})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <MousePointerClick
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-[#2D1E12]">
                      Mouse &amp; Layar Sentuh:
                    </strong>{" "}
                    {activeInstrument.mouseGuide}
                  </span>
                </li>
                <li className="flex items-start gap-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <Keyboard
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-[#2D1E12]">
                      Pintasan Keyboard Nada:
                    </strong>{" "}
                    Tekan tombol angka{" "}
                    <kbd className="rounded border border-[#DFD3C2] bg-[#FAF6EE] px-1.5 py-0.5 font-mono text-xs">
                      1
                    </kbd>
                    –
                    <kbd className="rounded border border-[#DFD3C2] bg-[#FAF6EE] px-1.5 py-0.5 font-mono text-xs">
                      7
                    </kbd>{" "}
                    untuk membunyikan 7 tingkat nada laras.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <Sparkles
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-[#2D1E12]">
                      Mode Kamera AI (MediaPipe Hands):
                    </strong>{" "}
                    {activeInstrument.cameraGuide}
                  </span>
                </li>
              </ol>

              <div className="space-y-2 pt-2 max-w-sm">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="volume-studio"
                    className="text-xs sm:text-sm font-semibold text-[#2D1E12]"
                  >
                    Volume Master Studio
                  </Label>
                  <span
                    className="text-xs sm:text-sm font-bold text-[#7A4B29]"
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
                  aria-label="Kenyaringan instrumen"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-[#DFD3C2] bg-white/95 shadow-xs">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                Kajian Organologi &amp; Falsafah {activeInstrument.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm leading-relaxed text-stone-600 px-4 sm:px-6 pb-4 sm:pb-6">
              <blockquote className="rounded-2xl border-l-4 border-[#6E472D] bg-[#FAF6EE] p-4 font-serif italic text-stone-700">
                &ldquo;{activeInstrument.philosophy}&rdquo;
              </blockquote>

              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Sistem Tangga Nada
                  </span>
                  <strong className="text-stone-800 text-xs sm:text-sm">{activeInstrument.specs.tuningSystem}</strong>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Material Akustik
                  </span>
                  <strong className="text-stone-800 text-xs sm:text-sm">{activeInstrument.specs.materialAcoustic}</strong>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Fungsi Ritus &amp; Ansambel
                  </span>
                  <strong className="text-stone-800 text-xs sm:text-sm">{activeInstrument.specs.ensembleFunction}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200/60">
                <p className="flex items-center gap-1.5 text-xs text-stone-500">
                  <BookOpen className="h-4 w-4 text-[#6E472D]" aria-hidden="true" />
                  Rujukan: Portal Warisan Budaya Takbenda Kemdikbudristek RI
                </p>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full btn-waranusa font-bold text-white text-xs px-5 shadow-xs"
                >
                  <a href={`#/budaya/${activeInstrument.slug}`}>
                    Buka Lembar Ensiklopedia {activeInstrument.title}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
