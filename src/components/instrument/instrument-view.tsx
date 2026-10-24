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
} from "lucide-react";
import type { Route } from "@/lib/router";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/states";
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
  const [viewMode, setViewMode] = useState<"strip" | "grid">("grid");
  const [volume, setVolume] = useState(0.78);

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
    <div className="mx-auto max-w-7xl px-3.5 py-6 sm:px-6 md:py-14 lg:px-8 pb-32 sm:pb-36">
      {/* ============ HERO STUDIO 38 ALAT MUSIK ============ */}
      <SectionHeading
        eyebrow="Atelier Musik Nusantara"
        title="38 Instrumen Tradisional Interaktif 3D"
        description="Jelajahi dan mainkan 38 alat musik tradisional Indonesia (lengkap 38 provinsi dari Aceh hingga Papua) dalam visualisasi 3 dimensi autentik (.glb) dengan teknik permainan: Dipukul, Dipetik, Digesek, Digoyang, dan Ditiup menggunakan Mouse/Sentuh, Keyboard, maupun Gestur Tangan Kamera AI."
      />

      <Alert className="mt-4 sm:mt-6 rounded-2xl border-[#DFD3C2] bg-[#FAF6EE]">
        <Info className="h-4 w-4 text-[#7A4B29]" aria-hidden="true" />
        <AlertTitle className="text-sm font-bold text-[#2D1E12]">
          Lengkap 38 Model 3D GLB &amp; Sistem Hybrid Audio Aktif
        </AlertTitle>
        <AlertDescription className="text-xs sm:text-sm text-stone-600">
          Seluruh <strong>38 instrumen tradisional</strong> dari 38 provinsi di Indonesia dilengkapi model 3D .glb asli dan didukung oleh <strong>Hybrid Audio Engine</strong> (Web Audio Procedural Synthesizer: Membrane Drum, Pentatonic FM Bell, Karplus-Strong Pluck, Bowed String, Bamboo Rattler, dan Wind Acoustic).
        </AlertDescription>
      </Alert>

      {/* ============ FILTER KEPULAUAN, CARA MAIN, & PENCARIAN ============ */}
      <div className="mt-6 space-y-3 rounded-3xl border border-[#DFD3C2] bg-white/95 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Filter Kepulauan yang Memiliki Koleksi */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                    "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    isCurrent
                      ? "bg-[#6E472D] text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/75 hover:text-stone-900"
                  )}
                >
                  {island.label}
                </button>
              );
            })}
          </div>

          {/* Pencarian & Switcher Mode (Strip vs Grid) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari provinsi atau alat musik..."
              className="h-9 w-full sm:w-52 md:w-64 rounded-full border-[#DFD3C2] bg-[#FAF7F2] text-xs"
            />
            <div className="flex items-center justify-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#DFD3C2] shadow-xs w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode("strip")}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "strip"
                    ? "bg-[#6E472D] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                )}
                title="Tampilan Strip Mendatar"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Strip</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-[#6E472D] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                )}
                title="Tampilan Kisi-Kisi Alat Musik"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grid ({filteredInstruments.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Kategori Cara Main */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar border-t border-[#EFE6D8]">
          {INTERACTION_TABS.map((tab) => {
            const isCurrent = selectedInteraction === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedInteraction(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-medium transition-all border cursor-pointer",
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

      {/* ============ PEMILIH 38 INSTRUMEN PROVINSI (STRIP VS GRID) ============ */}
      {viewMode === "strip" ? (
        <div
          className="mt-5 flex overflow-x-auto gap-3 pb-3 pt-1 scrollbar-thin"
          role="tablist"
          aria-label="Pilih instrumen tradisional"
        >
          {filteredInstruments.map((inst) => {
            const isActive = inst.id === activeInstrument.id;
            const meta = INTERACTION_META[inst.interactionType];
            return (
              <button
                key={inst.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(inst.id)}
                className={cn(
                  "min-h-[44px] shrink-0 w-[235px] sm:w-[250px] rounded-2xl border p-3.5 text-left transition-all cursor-pointer",
                  isActive
                    ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.01]"
                    : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider line-clamp-1",
                      isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                    )}
                  >
                    {inst.province}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5",
                      isActive
                        ? "bg-white/20 text-white border-transparent"
                        : "bg-[#6E472D]/10 text-[#6E472D] border border-[#6E472D]/20"
                    )}
                  >
                    {meta.badge}
                  </Badge>
                </div>

                <div className="mt-1.5 flex items-center gap-2 font-serif font-bold text-sm sm:text-base">
                  <Music2
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-amber-200/90" : "text-[#8A5B38]"
                    )}
                    aria-hidden="true"
                  />
                  <span className="line-clamp-1">{inst.title}</span>
                </div>

                <p
                  className={cn(
                    "mt-1 text-[11px] line-clamp-1",
                    isActive ? "text-stone-200" : "text-stone-500"
                  )}
                >
                  Model 3D Asli &bull; Suku {inst.ethnicGroup}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        /* GRID KOLEKSI ALAT MUSIK */
        <div className="mt-5 max-h-[360px] overflow-y-auto p-1 scrollbar-thin">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredInstruments.map((inst) => {
              const isActive = inst.id === activeInstrument.id;
              const meta = INTERACTION_META[inst.interactionType];
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => setActiveId(inst.id)}
                  className={cn(
                    "group text-left rounded-xl p-2.5 border transition-all duration-150 flex flex-col justify-between cursor-pointer",
                    isActive
                      ? "bg-[#6E472D] text-white border-[#583720] shadow-md ring-2 ring-[#6E472D]/20 scale-[1.02]"
                      : "bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-white"
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
        </div>
      )}

      {/* ============ PANGGUNG 3D & PANEL ORGANOLOGI ============ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Kolom Kiri (7 kolom): Panggung 3D Multi-Input */}
        <Card className="rounded-3xl border-[#DFD3C2] lg:col-span-7 overflow-hidden bg-white/95 shadow-md">
          <CardHeader className="pb-2 px-3.5 sm:px-6 pt-3.5 sm:pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 font-serif text-base sm:text-xl text-[#2D1E12] min-w-0">
                <Waves className="h-4 w-4 sm:h-5 sm:w-5 text-[#6E472D] shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {activeInstrument.title} — {activeInstrument.province}
                </span>
              </CardTitle>
              <Badge
                variant="outline"
                className="border-[#6E472D]/30 bg-[#6E472D]/5 text-[#6E472D] text-xs font-semibold shrink-0"
              >
                {activeInstrument.organologyLabel}
              </Badge>
            </div>
            <p className="text-xs text-stone-600 line-clamp-2 sm:line-clamp-none">
              Sebutan vernakular: <strong>{activeInstrument.vernacularName}</strong> (Suku{" "}
              {activeInstrument.ethnicGroup}). {interactionMeta.shortHint}
            </p>
          </CardHeader>
          <CardContent className="px-2.5 sm:px-6 pb-4 sm:pb-6">
            <Instrument3DStage
              instrument={activeInstrument}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </CardContent>
        </Card>

        {/* Kolom Kanan (5 kolom): Panduan Multi-Input & Kajian Organologi */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="rounded-3xl border-[#DFD3C2] bg-white/95">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                Sistem Kontrol Multi-Input ({interactionMeta.label})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <ol className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <MousePointerClick
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-[#2D1E12]">
                      Mode Standar (Mouse &amp; Layar Sentuh):
                    </strong>{" "}
                    {activeInstrument.mouseGuide}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
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
                    untuk membunyikan 7 tingkat nada laras instrumen.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
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
                <li className="flex items-start gap-2.5">
                  <Volume2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#6E472D]"
                    aria-hidden="true"
                  />
                  <span>
                    Atur tingkat kenyaringan suara melalui penggeser volume di bawah.
                  </span>
                </li>
              </ol>

              <div className="space-y-2 pt-1">
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

          <Card className="rounded-3xl border-[#DFD3C2] bg-white/95">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="font-serif text-base sm:text-lg text-[#2D1E12]">
                Kajian Organologi &amp; Falsafah {activeInstrument.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs sm:text-sm leading-relaxed text-stone-600 px-4 sm:px-6 pb-4 sm:pb-6">
              <blockquote className="rounded-xl border-l-4 border-[#6E472D] bg-[#FAF6EE] p-3 font-serif italic text-stone-700">
                {activeInstrument.philosophy}
              </blockquote>

              <div className="space-y-2 pt-1">
                <p>
                  <strong className="font-semibold text-[#2D1E12]">Sistem Tangga Nada:</strong>{" "}
                  {activeInstrument.specs.tuningSystem}
                </p>
                <p>
                  <strong className="font-semibold text-[#2D1E12]">Material Akustik:</strong>{" "}
                  {activeInstrument.specs.materialAcoustic}
                </p>
                <p>
                  <strong className="font-semibold text-[#2D1E12]">Fungsi Ritus &amp; Ansambel:</strong>{" "}
                  {activeInstrument.specs.ensembleFunction}
                </p>
              </div>

              <Separator className="bg-[#DFD3C2]" />

              <div>
                <p className="flex items-center gap-1.5 font-semibold text-[#2D1E12]">
                  <BookOpen className="h-4 w-4 text-[#6E472D]" aria-hidden="true" />
                  Rujukan Etnomusikologi
                </p>
                <ul className="mt-1.5 space-y-1 text-xs">
                  <li>
                    <a
                      href="https://warisanbudaya.kemdikbud.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#6E472D] underline-offset-2 hover:underline"
                    >
                      Portal Warisan Budaya Takbenda Kemdikbudristek{" "}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>

              <Button
                asChild
                className="min-h-[44px] w-full rounded-full btn-waranusa font-bold text-white"
              >
                <a href={`#/budaya/${activeInstrument.slug}`}>
                  Buka Lembar Ensiklopedia {activeInstrument.title}
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
