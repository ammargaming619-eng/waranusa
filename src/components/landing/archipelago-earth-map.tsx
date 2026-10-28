"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n-store";

interface CulturalTag {
  id: string;
  region: string;
  title: string;
  image: string;
  description: string;
  routeHref: string;
  pin: { x: number; y: number };
}

export const CULTURAL_TAGS: CulturalTag[] = [
  {
    id: "sumbar",
    region: "Sumatra Barat",
    title: "Rumah Gadang & Saluang",
    image: "/uploads/seed/rumah-gadang.png",
    description:
      "Arsitektur vernakular Minangkabau dengan atap gonjong bertanduk kerbau yang menjulang tinggi, bersanding dengan alunan syahdu tiupan bambu instrumen Saluang.",
    routeHref: "/eksplorasi-3d?house=rumah-gadang",
    pin: { x: 17.2, y: 56.5 },
  },
  {
    id: "kalimantan",
    region: "Kalimantan",
    title: "Rumah Betang & Sape'",
    image: "/uploads/seed/rumah-betang.png",
    description:
      "Arsitektur panggung kayu ulin suku Dayak sebagai pusat kebersamaan komunitas adat, bersanding dengan petikan dawai merdu instrumen Sape'.",
    routeHref: "/eksplorasi-3d?house=betang",
    pin: { x: 44.5, y: 44.5 },
  },
  {
    id: "jogja",
    region: "Yogyakarta",
    title: "Bangsal Kencono & Gamelan Bonang",
    image: "/uploads/seed/gamelan.png",
    description:
      "Arsitektur adiluhung Kraton Ngayogyakarta beratap lambang gantung bertingkat, bersanding dengan deretan gong perunggu penata gending Gamelan Bonang berlaras Pelog dan Slendro.",
    routeHref: "/virtual-instruments?instrument=bonang-barung",
    pin: { x: 35.8, y: 73.5 },
  },
  {
    id: "bali",
    region: "Bali",
    title: "Seni Tari & Gamelan Bali",
    image: "/uploads/seed/tari-bali.png",
    description:
      "Gerak ekspresif mata (seledet), liukan jemari anggun berbusana prada emas, dan persembahan sakral seni tari Pulau Dewata yang menyatu dalam ritme dinamis gamelan.",
    routeHref: "/eksplorasi-3d?house=gapura-candi-bentar",
    pin: { x: 46.2, y: 76.5 },
  },
  {
    id: "sulsel",
    region: "Sulawesi Selatan",
    title: "Rumah Tongkonan & Keso-Keso",
    image: "/uploads/seed/rumah-tongkonan.png",
    description:
      "Arsitektur panggung perahu kosmis beratap parabolik suku Toraja dihiasi ukiran pa’ssura dan deretan tanduk kabongo, bersanding dengan alunan gesekan dawai Keso-Keso khas Sulawesi Selatan.",
    routeHref: "/eksplorasi-3d?house=tongkonan",
    pin: { x: 53.2, y: 65.5 },
  },
  {
    id: "papua",
    region: "Papua",
    title: "Rumah Honai & Tifa",
    image: "/uploads/seed/honai-noken.png",
    description:
      "Arsitektur bundar beratap jerami penahan dingin pegunungan Baliem dan dentuman ritme sakral alat musik Tifa khas Papua.",
    routeHref: "/eksplorasi-3d?house=honai",
    pin: { x: 86.8, y: 61.5 },
  },
];

export function ArchipelagoEarthMap({ introRevealed = true }: { introRevealed?: boolean } = {}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTag, setActiveTag] = useState<CulturalTag | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Ref container untuk layer latar belakang dekoratif (kartografi grid + siluet peta batik)
  const bgLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hormati preferensi aksesibilitas pengguna (prefers-reduced-motion)
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgLayerRef.current) {
            const scrollY = window.scrollY;
            // Hanya aktifkan translasi saat Hero masih di dalam viewport (< 1100px)
            if (scrollY < 1100) {
              const translateY = Math.round(scrollY * 0.25 * 10) / 10;
              bgLayerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* ========================================================================= */}
        {/* LAYER LATAR BELAKANG DEKORATIF DENGAN PARALLAX SCROLL PASIF RINGAN (60FPS) */}
        {/* ========================================================================= */}
        <div
          ref={bgLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -bottom-10 -left-2 -right-2 z-0 will-change-transform"
        >
          {/* POLA KOTAK GRID KARTOGRAFI DIGITAL */}
          <div
            className="absolute inset-0 opacity-55 bg-[linear-gradient(to_right,#8C5E3C18_1px,transparent_1px),linear-gradient(to_bottom,#8C5E3C18_1px,transparent_1px)] bg-[size:36px_36px] sm:bg-[size:52px_52px] md:bg-[size:64px_64px]"
          />

          {/* GAMBAR PETA SEBAGAI FULL BACKGROUND (object-contain agar pulau presisi 100%) */}
          <Image
            src="/images/indonesia-map-batik.png"
            alt="Peta Budaya Kepulauan Nusantara WaraNusa"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-contain object-center pointer-events-none select-none drop-shadow-sm"
          />
        </div>

        {/* HEADER JUDUL & CTA DI ATAS BACKGROUND PETA (MELAYANG DI RUANG LAUT UTARA TERBUKA) */}
        <div className="relative z-20 pt-3 sm:pt-5 md:pt-6 lg:pt-8 px-4 text-center max-w-2xl sm:max-w-4xl lg:max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 26 }}
            animate={introRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 26 }}
            transition={{ delay: 0.18, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={introRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
            transition={{ delay: 0.36, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2.5 sm:mt-3.5 md:mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="btn-waranusa rounded-full px-5 sm:px-7 py-2.5 text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg min-h-[44px]"
            >
              <Link href="/jelajah" className="flex items-center gap-2">
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
              <Link href="/catalog" className="flex items-center gap-2">
                {t("hero.catalog_btn", "Katalog Budaya")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Pin Penanda Lokasi Budaya Interaktif dengan Floating Popover Selalu Muncul (Always Visible) */}
        {CULTURAL_TAGS.map((tag, idx) => {
          const isHovered = hoveredTag === tag.id;

          // Pengaturan vertikal agar Bali tidak bertabrakan dengan Jawa/Sulawesi
          const isBelow = tag.id === "bali";

          // Hitung alignment popover horizontal agar selalu strictly di dalam kontainer peta
          const popoverAlignClass =
            tag.pin.x < 25
              ? "left-[-12px] translate-x-0"
              : tag.pin.x > 75
              ? "right-[-12px] translate-x-0"
              : "left-0 -translate-x-1/2";

          const verticalPositionClass = isBelow
            ? "top-[12px]"
            : "bottom-[44px]";

          return (
            <div
              key={tag.id}
              className={cn("absolute w-0 h-0 transition-all duration-300", isHovered ? "z-50" : "z-20")}
              style={{
                left: `${tag.pin.x}%`,
                top: `${tag.pin.y}%`,
              }}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {/* Pin Penanda Titik Lokasi Peta dengan Efek Pulse Elegan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.4, y: 8 }}
                animate={introRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.4, y: 8 }}
                transition={{
                  delay: 0.35 + idx * 0.08,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="-translate-x-1/2 -translate-y-full"
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-label={`Lihat budaya ${tag.title} (${tag.region})`}
                  className={cn(
                    "relative flex flex-col items-center justify-center group/pin focus:outline-none min-w-[36px] min-h-[36px] p-1 transition-transform duration-300 cursor-pointer",
                    isHovered ? "scale-115 z-40" : "hover:scale-110 z-30"
                  )}
                >
                  {/* Lingkaran Berdenyut Halus (Soft Pulse Animation) */}
                  <span className="absolute h-8 w-8 rounded-full bg-[#6E472D]/25 animate-ping opacity-75 pointer-events-none" />

                  {/* Pin Utama */}
                  <div
                    className={cn(
                      "relative flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full shadow-lg border-2 border-white transition-all duration-300",
                      isHovered
                        ? "bg-[#482B18] text-white ring-4 ring-[#482B18]/30 shadow-xl"
                        : "bg-[#53341E] text-[#F4EAD4] group-hover/pin:bg-[#3D2514]"
                    )}
                  >
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white shadow-xs" />
                  </div>
                  {/* Ujung lancip pin */}
                  <div className="w-1.5 h-1.5 bg-[#53341E] rotate-45 -mt-1 shadow-xs" />
                </button>
              </motion.div>

              {/* Floating Cultural Popover Card (Desktop MD+) — LANGSUNG MUNCUL TANPA PERLU HOVER */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: isBelow ? -6 : 6 }}
                animate={
                  introRevealed
                    ? {
                        opacity: 1,
                        scale: isHovered ? 1.05 : 1,
                        y: isHovered ? (isBelow ? 3 : -3) : 0,
                      }
                    : { opacity: 0, scale: 0.85, y: isBelow ? -6 : 6 }
                }
                transition={{
                  delay: 0.45 + idx * 0.08,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "hidden md:block absolute pointer-events-auto transition-all duration-200",
                  verticalPositionClass,
                  popoverAlignClass,
                  isHovered ? "z-50" : "z-30"
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "group relative flex items-center gap-2 lg:gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md px-2.5 py-1.5 lg:px-3 lg:py-2 text-left transition-all duration-200 cursor-pointer shadow-md",
                    "border border-stone-200/90 hover:shadow-xl hover:border-[#6E472D] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#6E472D]/40",
                    isHovered && "ring-2 ring-[#6E472D]/30 border-[#6E472D] shadow-xl"
                  )}
                >
                  {/* Thumbnail Foto Budaya */}
                  <div className="relative h-8 w-8 lg:h-10 lg:w-10 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-inner">
                    <Image
                      src={tag.image}
                      alt={tag.title}
                      fill
                      sizes="40px"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Teks Wilayah & Nama Budaya */}
                  <div className="pr-1 max-w-[130px] lg:max-w-[170px]">
                    <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-[#7A4B29] leading-tight truncate">
                      {tag.region}
                    </p>
                    <p className="text-[11px] lg:text-[12px] font-bold text-stone-900 leading-tight group-hover:text-[#53341E] transition-colors truncate">
                      {tag.title}
                    </p>
                  </div>

                  <span className="h-5 w-5 lg:h-6 lg:w-6 inline-flex items-center justify-center rounded-full bg-stone-100 group-hover:bg-[#6E472D] group-hover:text-white text-stone-500 transition-colors shrink-0">
                    <ArrowRight className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                  </span>

                  {/* Segitiga Penunjuk (Pointing Arrow directly to Pin) */}
                  <div
                    className={cn(
                      "absolute w-2.5 h-2.5 bg-white rotate-45",
                      isBelow
                        ? "bottom-full -mb-1.5 border-l border-t border-stone-200/90"
                        : "top-full -mt-1.5 border-r border-b border-stone-200/90",
                      tag.pin.x < 25
                        ? "left-4"
                        : tag.pin.x > 75
                        ? "right-4"
                        : "left-1/2 -translate-x-1/2"
                    )}
                  />
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* KHUSUS MOBILE: STRIP KARTU BUDAYA HORIZONTAL (TOUCH-FRIENDLY & NO OVERFLOW) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={introRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        transition={{ delay: 0.38, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="block md:hidden px-4 mt-2"
      >
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
                <Image
                  src={tag.image}
                  alt={tag.title}
                  fill
                  sizes="40px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-stone-700 font-semibold">{tag.region}</p>
                <p className="text-xs font-bold text-stone-900">{tag.title}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ================= MODAL DETAIL BUDAYA PIN INTERAKTIF ================= */}
      <Dialog open={!!activeTag} onOpenChange={(open) => !open && setActiveTag(null)}>
        <DialogContent className="max-w-lg rounded-3xl border border-stone-200 bg-[#FCFAF6] p-6 text-stone-900 shadow-2xl">
          {activeTag && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A5B38]">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  {activeTag.region}
                </div>
                <DialogTitle className="mt-1 font-serif text-2xl font-bold text-[#2D1E12]">
                  {activeTag.title}
                </DialogTitle>
              </DialogHeader>

              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-stone-200 shadow-md">
                <Image
                  src={activeTag.image}
                  alt={activeTag.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
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
                    const dest = activeTag.routeHref;
                    setActiveTag(null);
                    router.push(dest);
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
