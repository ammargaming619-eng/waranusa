"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HashLink as Link } from "@/components/shared/hash-link";
import { navigate } from "@/lib/router";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface CulturalTag {
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
    title: "Rumah Gadang",
    image: "/uploads/seed/rumah-gadang.png",
    description:
      "Arsitektur khas Minangkabau dengan atap gonjong bertanduk kerbau yang menjulang tinggi, dinding ukiran sarat falsafah alam, dan ketahanan terhadap gempa bumi.",
    routeHref: "#/budaya/rumah-gadang",
    pin: { x: 17.2, y: 56.5 },
    card: { x: 17.5, y: 48.5 },
  },
  {
    id: "kalimantan",
    region: "Kalimantan",
    title: "Rumah Bentang & Tameng",
    image: "/uploads/seed/rumah-betang.png",
    description:
      "Rumah Betang panggung suku Dayak dari kayu ulin kokoh sebagai pusat kebersamaan komunitas adat, berdampingan dengan tameng Talawang bermotif magis penjaga rimba Borneo.",
    routeHref: "#/katalog?wilayah=ID-KB",
    pin: { x: 44.5, y: 44.5 },
    card: { x: 47.0, y: 35.5 },
  },
  {
    id: "jogja",
    region: "Yogyakarta",
    title: "Wayang & Batik",
    image: "/uploads/seed/wayang-kulit.png",
    description:
      "Warisan agung mahakarya kemanusiaan dunia UNESCO: filosofi kehidupan dalam lakon Wayang Kulit dan kehalusan motif Batik tulis Kraton Yogyakarta.",
    routeHref: "#/budaya/batik",
    pin: { x: 35.8, y: 73.5 },
    card: { x: 32.5, y: 84.5 },
    dashedLine: { from: { x: 35.8, y: 73.5 }, to: { x: 34.0, y: 79.5 } },
  },
  {
    id: "bali",
    region: "Bali",
    title: "Tari Tradisional",
    image: "/uploads/seed/tari-bali.png",
    description:
      "Gerak ekspresif mata (seledet), liukan jemari mudra, dan ritme dinamis gamelan gong kebyar yang menyatu dalam persembahan sakral seni tari Pulau Dewata.",
    routeHref: "#/budaya/kecak",
    pin: { x: 46.2, y: 76.5 },
    card: { x: 46.5, y: 86.5 },
    dashedLine: { from: { x: 46.2, y: 76.5 }, to: { x: 46.4, y: 81.5 } },
  },
  {
    id: "sulsel",
    region: "Sulawesi Selatan",
    title: "Kapal Pinisi",
    image: "/uploads/seed/kapal-pinisi.png",
    description:
      "Mahakarya pelaut ulung Bugis-Makassar yang dirakit dari kayu bitti tanpa paku besi, mengarungi samudera dunia dengan tujuh hingga delapan layar megah.",
    routeHref: "#/katalog?wilayah=ID-SN",
    pin: { x: 53.2, y: 65.5 },
    card: { x: 59.5, y: 59.5 },
  },
  {
    id: "papua",
    region: "Papua",
    title: "Rumah Honai & Noken",
    image: "/uploads/seed/honai-noken.png",
    description:
      "Rumah bundar jerami Honai lembah Baliem penahan hawa dingin pegunungan salju tropis, bersanding dengan rajutan Noken serat kayu simbol kehidupan ibu bumi Papua.",
    routeHref: "#/katalog?wilayah=ID-PA",
    pin: { x: 86.8, y: 61.5 },
    card: { x: 84.5, y: 51.5 },
  },
];

export function ArchipelagoEarthMap() {
  const [activeTag, setActiveTag] = useState<CulturalTag | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const scrollToSection = () => {
    const el = document.getElementById("fitur");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/jelajah");
    }
  };

  return (
    <>
      {/* Kontainer Kanvas Peta Penuh — Menyatukan Background Peta, Judul, & Pin Interaktif */}
      <div className="relative w-full max-w-[1560px] mx-auto aspect-[1024/720] sm:aspect-[1024/620] md:aspect-[1024/572] select-none">
        {/* GAMBAR PETA SEBAGAI FULL BACKGROUND */}
        <img
          src="/images/indonesia-map-earth.png?v=4"
          alt="Peta Budaya Kepulauan Nusantara WaraNusa"
          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none drop-shadow-sm"
          loading="eager"
        />

        {/* HEADER JUDUL & CTA DI ATAS BACKGROUND PETA (TERLETAK DI AREA ATAS PETA YANG TERBUKA) */}
        <div className="relative z-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-4 text-center max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              id="hero-title"
              className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2D1E12] leading-[1.12] drop-shadow-sm"
            >
              Kenali Akar, Jelajahi Budaya
            </h1>
            <p className="mt-1.5 sm:mt-2.5 md:mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-stone-700 max-w-xl mx-auto font-medium">
              Dari Sabang hingga Merauke, setiap tradisi punya cerita.
            </p>

            <div className="mt-2.5 sm:mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-[#6E472D] to-[#8C5E3C] hover:from-[#5C3B24] hover:to-[#785032] text-white px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Link href="#/jelajah" className="flex items-center gap-2">
                  Mulai Jelajahi
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                type="button"
                onClick={scrollToSection}
                size="lg"
                variant="outline"
                className="rounded-full border border-stone-400/60 bg-white/70 hover:bg-white text-stone-800 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-sm transition-all"
              >
                Lihat Peta
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Garis-Garis Petunjuk SVG Relatif */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full z-10"
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

        {/* Pin Penanda & Floating Cultural Cards di Atas Pulau */}
        {CULTURAL_TAGS.map((tag) => {
          const isHovered = hoveredTag === tag.id;

          return (
            <div key={tag.id} className="contents">
              {/* Pin Penanda Lokasi Peta (Teardrop Marker) */}
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
                    "group flex flex-col items-center focus:outline-none",
                    isHovered ? "scale-125" : "hover:scale-115"
                  )}
                >
                  <svg width="22" height="30" viewBox="0 0 24 32" fill="none">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 32 12 32C12 32 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z"
                      fill="#6B4931"
                      className="transition-colors group-hover:fill-[#53341E]"
                    />
                    <circle cx="12" cy="11" r="4.5" fill="#FDFBF7" />
                  </svg>
                  {isHovered && (
                    <span className="absolute -bottom-1 h-2 w-4 rounded-full bg-stone-900/20 blur-[1px] animate-pulse" />
                  )}
                </button>
              </div>

              {/* Floating Glassmorphism Cultural Card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                  isHovered ? "z-40" : "z-30"
                )}
                style={{
                  left: `${tag.card.x}%`,
                  top: `${tag.card.y}%`,
                }}
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "group flex items-center gap-1.5 sm:gap-2.5 md:gap-3 rounded-2xl bg-white/95 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 shadow-lg border border-stone-200/90 text-left transition-all duration-300",
                    "hover:scale-105 hover:shadow-2xl hover:border-stone-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
                  )}
                >
                  {/* Thumbnail Foto Budaya */}
                  <div className="relative h-7 w-7 sm:h-9 sm:w-9 md:h-11 md:w-11 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner">
                    <img
                      src={tag.image}
                      alt={tag.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Teks Wilayah & Nama Budaya */}
                  <div className="pr-1 sm:pr-2">
                    <p className="text-[8px] sm:text-[10px] md:text-[11px] font-medium text-stone-500 leading-tight">
                      {tag.region}:
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight group-hover:text-[#53341E] transition-colors whitespace-nowrap">
                      {tag.title}
                    </p>
                  </div>
                </button>
              </motion.div>
            </div>
          );
        })}
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
                  className="rounded-full bg-gradient-to-r from-[#6E472D] to-[#8C5E3C] text-white hover:brightness-110"
                >
                  Jelajahi Detail Budaya
                  <ExternalLink className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
