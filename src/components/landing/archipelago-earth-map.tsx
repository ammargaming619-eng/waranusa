"use client";

import { useState } from "react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { navigate } from "@/lib/router";
import { useTranslation } from "@/lib/i18n-store";

interface CulturalTag {
  id: string;
  region: string;
  title: string;
  image: string;
  description: string;
  routeHref: string;
  pin: { x: number; y: number };
  card: { x: number; y: number };
  dashedLine?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

export const CULTURAL_TAGS: CulturalTag[] = [
  {
    id: "sumbar",
    region: "Sumatra Barat",
    title: "Rumah Gadang & Saluang",
    image: "/uploads/seed/rumah-gadang.png",
    description:
      "Arsitektur vernakular Minangkabau dengan atap gonjong bertanduk kerbau yang menjulang tinggi, bersanding dengan alunan syahdu tiupan bambu instrumen Saluang.",
    routeHref: "#/eksplorasi-3d",
    pin: { x: 17.2, y: 56.5 },
    card: { x: 17.5, y: 48.5 },
  },
  {
    id: "kalimantan",
    region: "Kalimantan",
    title: "Rumah Betang & Sape'",
    image: "/uploads/seed/rumah-betang.png",
    description:
      "Arsitektur panggung kayu ulin suku Dayak sebagai pusat kebersamaan komunitas adat, bersanding dengan petikan dawai merdu instrumen Sape'.",
    routeHref: "#/eksplorasi-3d",
    pin: { x: 44.5, y: 44.5 },
    card: { x: 47.0, y: 35.5 },
  },
  {
    id: "jogja",
    region: "Yogyakarta",
    title: "Bangsal Kencono & Gamelan Bonang",
    image: "/uploads/seed/gamelan.png",
    description:
      "Arsitektur adiluhung Kraton Ngayogyakarta beratap lambang gantung bertingkat, bersanding dengan deretan gong perunggu penata gending Gamelan Bonang berlaras Pelog dan Slendro.",
    routeHref: "#/instrumen",
    pin: { x: 35.8, y: 73.5 },
    card: { x: 31.0, y: 84.5 },
    dashedLine: { from: { x: 35.8, y: 73.5 }, to: { x: 32.5, y: 79.5 } },
  },
  {
    id: "bali",
    region: "Bali",
    title: "Seni Tari & Gamelan Bali",
    image: "/uploads/seed/tari-bali.png",
    description:
      "Gerak ekspresif mata (seledet), liukan jemari anggun berbusana prada emas, dan persembahan sakral seni tari Pulau Dewata yang menyatu dalam ritme dinamis gamelan.",
    routeHref: "#/eksplorasi-3d",
    pin: { x: 46.2, y: 76.5 },
    card: { x: 54.0, y: 86.5 },
    dashedLine: { from: { x: 46.2, y: 76.5 }, to: { x: 51.0, y: 81.5 } },
  },
  {
    id: "sulsel",
    region: "Sulawesi Selatan",
    title: "Kapal Pinisi & Keso-Keso",
    image: "/uploads/seed/kapal-pinisi.png",
    description:
      "Mahakarya maritim pelaut ulung Bugis-Makassar warisan dunia UNESCO yang dirakit dari kayu bitti tanpa paku besi, bersanding dengan alunan gesekan dawai instrumen Keso-Keso khas Sulawesi Selatan.",
    routeHref: "#/eksplorasi-3d",
    pin: { x: 53.2, y: 65.5 },
    card: { x: 59.5, y: 59.5 },
  },
  {
    id: "papua",
    region: "Papua",
    title: "Rumah Honai & Tifa",
    image: "/uploads/seed/honai-noken.png",
    description:
      "Arsitektur bundar beratap jerami penahan dingin pegunungan Baliem dan dentuman ritme sakral alat musik Tifa khas Papua.",
    routeHref: "#/eksplorasi-3d",
    pin: { x: 86.8, y: 61.5 },
    card: { x: 84.5, y: 51.5 },
  },
];

export function ArchipelagoEarthMap({ introRevealed = true }: { introRevealed?: boolean } = {}) {
  const { t } = useTranslation();
  const [activeTag, setActiveTag] = useState<CulturalTag | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <div className="w-full select-none overflow-x-clip px-2 sm:px-4 md:px-6">
      {/* ========================================================================= */}
      {/* KANVAS PETA NUSANTARA TERPADU — BINGKAI KARTOGRAFI GANDA (DOUBLE NEATLINE) */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-[1560px] mx-auto rounded-2xl sm:rounded-3xl border-2 border-[#CBB8A1] bg-gradient-to-b from-[#FAF4EB]/85 to-[#F5ECE0]/85 p-1.5 sm:p-2.5 shadow-[0_16px_50px_rgba(110,71,45,0.08)] overflow-hidden aspect-[1024/720] sm:aspect-[1024/620] md:aspect-[1024/572] select-none">
        {/* BINGKAI GARIS DALAM (INNER NEATLINE BORDER SESUAI REFERENSI PENGGUNA) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 sm:inset-2.5 rounded-xl sm:rounded-2xl border border-[#CBB8A1] z-10"
        />

        {/* POLA KOTAK GRID KARTOGRAFI DIGITAL */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-55 bg-[linear-gradient(to_right,#8C5E3C18_1px,transparent_1px),linear-gradient(to_bottom,#8C5E3C18_1px,transparent_1px)] bg-[size:36px_36px] sm:bg-[size:52px_52px] md:bg-[size:64px_64px]"
        />

        {/* GAMBAR PETA SEBAGAI FULL BACKGROUND (object-contain agar pulau presisi 100%) */}
        <img
          src="/images/indonesia-map-batik.png?v=7"
          alt="Peta Budaya Kepulauan Nusantara WaraNusa"
          className="absolute inset-0 h-full w-full object-contain object-center pointer-events-none select-none drop-shadow-sm"
          loading="eager"
          decoding="async"
        />

        {/* HEADER JUDUL & CTA DI ATAS BACKGROUND PETA (MELAYANG DI RUANG LAUT UTARA TERBUKA) */}
        <div className="relative z-20 pt-3 sm:pt-5 md:pt-6 lg:pt-8 px-4 text-center max-w-2xl sm:max-w-4xl lg:max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              id="hero-title"
              className="font-serif text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-[#2D1E12] leading-tight drop-shadow-xs whitespace-nowrap"
            >
              {t("hero.title", "Jelajahi Ragam Budaya Nusantara")}
            </h1>
            <p className="mt-1 sm:mt-2 md:mt-2.5 text-xs sm:text-sm md:text-base text-stone-700 max-w-xl mx-auto font-medium whitespace-nowrap sm:whitespace-normal">
              {t("hero.subtitle", "Dari Sabang hingga Merauke, setiap tradisi punya cerita.")}
            </p>
          </motion.div>

          {/* Tombol CTA: Peta 38 Provinsi & Katalog Budaya */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2.5 sm:mt-3.5 md:mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="btn-waranusa rounded-full px-5 sm:px-7 py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg min-h-[44px]"
            >
              <Link href="#/jelajah" className="flex items-center gap-2">
                {t("hero.map_btn", "Peta 38 Provinsi")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border border-stone-400/60 bg-white/85 hover:bg-white text-stone-800 px-5 sm:px-6 py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-xs hover:shadow-sm transition-all min-h-[44px]"
            >
              <Link href="#/katalog" className="flex items-center gap-2">
                {t("hero.catalog_btn", "Katalog Budaya")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Garis-Garis Petunjuk SVG Relatif (Hanya di layar MD+ agar bersih di layar kecil) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full z-10 hidden md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {CULTURAL_TAGS.map((tag) => {
            if (!tag.dashedLine) return null;
            return (
              <line
                key={`line-${tag.id}`}
                x1={tag.dashedLine.from.x}
                y1={tag.dashedLine.from.y}
                x2={tag.dashedLine.to.x}
                y2={tag.dashedLine.to.y}
                stroke="#7D573B"
                strokeWidth="0.4"
                strokeDasharray="1.2 1.2"
              />
            );
          })}
        </svg>

        {/* Pin Penanda Lokasi Interaktif di Atas Pulau */}
        {CULTURAL_TAGS.map((tag, idx) => {
          const isHovered = hoveredTag === tag.id;

          return (
            <div key={tag.id} className="contents">
              {/* Pin Penanda Lokasi Peta (Touch-friendly target) */}
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-full transition-transform duration-300"
                style={{
                  left: `${tag.pin.x}%`,
                  top: `${tag.pin.y}%`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  onMouseEnter={() => setHoveredTag(tag.id)}
                  onMouseLeave={() => setHoveredTag(null)}
                  aria-label={`Lihat budaya ${tag.title} (${tag.region})`}
                  className={cn(
                    "flex flex-col items-center justify-center group/pin focus:outline-none min-w-[48px] min-h-[48px] p-1.5",
                    isHovered ? "scale-115" : "hover:scale-110"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full shadow-lg border-2 border-white transition-all duration-300",
                      isHovered
                        ? "bg-[#482B18] text-white ring-4 ring-[#482B18]/30"
                        : "bg-[#53341E] text-[#F4EAD4] group-hover/pin:bg-[#3D2514]"
                    )}
                  >
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white shadow-xs" />
                  </div>
                  <div className="w-1.5 h-1.5 bg-[#53341E] rotate-45 -mt-1 shadow-xs" />
                </button>
              </div>

              {/* Kartu Pratinjau Budaya Melayang (Desktop / Layar Lebar md+) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.15 + idx * 0.08,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "hidden md:block absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                  isHovered ? "z-40" : "z-30"
                )}
                style={{
                  left: `${tag.card.x}%`,
                  top: `${tag.card.y}%`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "group flex items-center gap-2.5 lg:gap-3 rounded-2xl bg-white/95 backdrop-blur-md px-2.5 py-1.5 lg:px-3 lg:py-2 shadow-lg border border-stone-200/90 text-left transition-all duration-300",
                    "hover:scale-105 hover:shadow-2xl hover:border-stone-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
                  )}
                >
                  {/* Thumbnail Foto Budaya */}
                  <div className="relative h-9 w-9 lg:h-11 lg:w-11 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner">
                    <img
                      src={tag.image}
                      alt={tag.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Teks Wilayah & Nama Budaya */}
                  <div className="pr-2">
                    <p className="text-[10px] lg:text-[11px] font-semibold text-stone-700 leading-tight">
                      {tag.region}:
                    </p>
                    <p className="text-xs lg:text-sm font-bold text-stone-900 leading-tight group-hover:text-[#53341E] transition-colors whitespace-nowrap">
                      {tag.title}
                    </p>
                  </div>
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* KHUSUS MOBILE: STRIP KARTU BUDAYA HORIZONTAL (TOUCH-FRIENDLY & NO OVERFLOW) */}
      {/* ========================================================================= */}
      <div className="block md:hidden px-4 mt-2">
        <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-700" />
          <span>{t("hero.touch_hint", "Sentuh Pin Peta atau Jelajahi Ikon Budaya:")}</span>
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 snap-x">
          {CULTURAL_TAGS.map((tag) => (
            <button
              key={`mobile-chip-${tag.id}`}
              type="button"
              onClick={() => setActiveTag(tag)}
              className="flex-shrink-0 flex items-center gap-2.5 rounded-2xl bg-white/95 border border-stone-200/90 p-2 pr-3.5 shadow-sm active:bg-amber-50 active:scale-95 transition-all text-left snap-start min-h-[48px]"
              aria-label={`Buka detail ${tag.title} (${tag.region})`}
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                <img
                  src={tag.image}
                  alt={tag.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-stone-700 font-semibold">{tag.region}</p>
                <p className="text-xs font-bold text-stone-900">{tag.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= MODAL DETAIL BUDAYA PIN INTERAKTIF ================= */}
      <Dialog open={!!activeTag} onOpenChange={(open) => !open && setActiveTag(null)}>
        <DialogContent className="max-w-lg rounded-3xl border border-stone-200 bg-[#FCFAF6] p-6 text-stone-900 shadow-2xl">
          {activeTag && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A5B38]">
                  <Sparkles className="h-4 w-4" />
                  {activeTag.region}
                </div>
                <DialogTitle className="mt-1 font-serif text-2xl font-bold text-[#2D1E12]">
                  {activeTag.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 shadow-md">
                <img
                  src={activeTag.image}
                  alt={activeTag.title}
                  className="aspect-video w-full object-cover"
                />
              </div>

              <DialogDescription className="mt-4 text-sm leading-relaxed text-stone-700">
                {activeTag.description}
              </DialogDescription>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveTag(null)}
                  className="rounded-full border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    setActiveTag(null);
                    navigate(activeTag.routeHref.replace("#", ""));
                  }}
                  className="btn-waranusa rounded-full px-6 py-2.5 font-bold shadow-md text-white hover:brightness-110 active:scale-95 transition-all"
                >
                  Jelajahi Detail Budaya
                  <ExternalLink className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
