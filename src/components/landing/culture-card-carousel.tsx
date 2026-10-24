"use client";

/**
 * WaraNusa — CultureCardCarousel
 * 3D Coverflow Card Carousel untuk seksi Sorotan Budaya Nusantara.
 * Menghadirkan panggung kartu bersusun dengan kartu tengah terangkat (center-elevated),
 * kartu samping berdimensi perspektif, tombol panah melayang, dan navigasi usap/klik.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, ImageOff, MapPin } from "lucide-react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CulturalItem } from "@/lib/types";

interface CultureCardCarouselProps {
  items: CulturalItem[];
  loading?: boolean;
}

export function CultureCardCarousel({ items, loading }: CultureCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deteksi ukuran layar untuk menyesuaikan rentang offset kartu
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const count = items.length;

  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  // Dukungan Navigasi Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Gestur usap (swipe / drag)
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  // State skeleton saat memuat data
  if (loading || count === 0) {
    return (
      <div className="relative mt-8 py-8 w-full overflow-hidden">
        <div className="mx-auto flex items-center justify-center gap-4 sm:gap-6">
          {/* Kartu samping kiri skeleton */}
          <div className="hidden sm:block w-[320px] md:w-[360px] scale-90 opacity-40 rounded-3xl border border-stone-200 bg-white p-3 shadow-md">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-2.5 p-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Kartu tengah utama skeleton */}
          <div className="w-[320px] xs:w-[360px] sm:w-[410px] md:w-[450px] scale-100 rounded-3xl border-2 border-[#DCD0BE] bg-white p-4 shadow-2xl">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-3 p-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Kartu samping kanan skeleton */}
          <div className="hidden sm:block w-[320px] md:w-[360px] scale-90 opacity-40 rounded-3xl border border-stone-200 bg-white p-3 shadow-md">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-2.5 p-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Besaran offset horizontal antar kartu
  const baseSpacing = isMobile ? 170 : 315;

  return (
    <div
      ref={containerRef}
      className="relative mt-6 sm:mt-8 w-full overflow-hidden select-none py-6 sm:py-10"
      aria-roledescription="carousel"
      aria-label="Koleksi Sorotan Budaya Nusantara"
    >
      {/* Panggung Kartu 3D Berperspektif */}
      <div
        className="relative mx-auto flex h-[490px] xs:h-[510px] sm:h-[540px] md:h-[560px] w-full max-w-7xl items-center justify-center [perspective:1000px]"
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            // Hitung jarak sirkular relatif terhadap kartu aktif (-2, -1, 0, 1, 2, dll)
            let dist = index - activeIndex;
            if (dist > count / 2) dist -= count;
            if (dist < -count / 2) dist += count;

            const isCenter = dist === 0;
            const isVisible = Math.abs(dist) <= 2;

            if (!isVisible) return null;

            // KARTU TENGAH (isCenter): Wajib scale 1.0 persis (resolusi 1:1) tanpa preserve-3d agar teks kristal tajam bebas blur
            const xOffset = dist * baseSpacing;
            const scale = isCenter ? 1.0 : Math.max(0.72, 0.86 - (Math.abs(dist) - 1) * 0.14);
            const zIndex = isCenter ? 30 : 25 - Math.abs(dist) * 5;
            const opacity = isCenter ? 1 : Math.max(0.40, 1 - Math.abs(dist) * 0.30);
            const rotateY = isCenter ? 0 : dist * (isMobile ? -6 : -9);

            return (
              <motion.div
                key={item.id}
                layout
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 cursor-pointer subpixel-antialiased",
                  isCenter ? "cursor-default" : "cursor-pointer"
                )}
                style={{
                  zIndex,
                  transformStyle: isCenter ? "flat" : "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                }}
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  rotateY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 26,
                  mass: 0.9,
                }}
              >
                <div
                  className={cn(
                    "w-[320px] xs:w-[360px] sm:w-[410px] md:w-[450px] lg:w-[460px] rounded-3xl overflow-hidden bg-white text-left transition-all duration-300 subpixel-antialiased",
                    isCenter
                      ? "border-2 border-[#6E472D]/35 shadow-[0_22px_60px_rgba(45,30,18,0.24)] ring-4 ring-[#6E472D]/15"
                      : "border border-stone-200/90 shadow-[0_12px_32px_rgba(45,30,18,0.12)] hover:border-stone-400"
                  )}
                >
                  <CarouselCardContent item={item} isCenter={isCenter} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Tombol Navigasi Melayang Kiri (btn-waranusa cokelat kayu elegan) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Sorotan budaya sebelumnya"
          className="absolute left-2 sm:left-4 z-40 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full btn-waranusa text-white shadow-xl hover:scale-110 hover:shadow-2xl active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C5E3C]/50 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>

        {/* Tombol Navigasi Melayang Kanan (btn-waranusa cokelat kayu elegan) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Sorotan budaya berikutnya"
          className="absolute right-2 sm:right-4 z-40 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full btn-waranusa text-white shadow-xl hover:scale-110 hover:shadow-2xl active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C5E3C]/50 transition-all duration-200"
        >
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Indikator Titik (Dot Pagination) */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
        {items.map((it, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`dot-${it.id}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Buka sorotan nomor ${idx + 1}: ${it.title}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                isActive
                  ? "w-7 sm:w-8 bg-[#442816] shadow-xs"
                  : "w-2 bg-stone-300 hover:bg-stone-400"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Konten Visual & Metadata Kartu Budaya di Dalam Carousel
 */
function CarouselCardContent({
  item,
  isCenter,
}: {
  item: CulturalItem;
  isCenter: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const cover = item.coverMedia?.url ?? null;
  const showImage = cover !== null && !imgFailed;

  return (
    <div className="flex flex-col">
      {/* Cover Gambar */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF6EE]">
        {showImage ? (
          <img
            src={cover}
            alt={item.title}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EFE5D4] via-[#F4ECE0] to-[#E9DEC9]"
            role="img"
            aria-label={`Foto ${item.title}`}
          >
            <ImageOff className="h-9 w-9 text-stone-400" aria-hidden="true" />
          </div>
        )}

        {/* Badge Kategori Budaya */}
        <div className="absolute left-3 top-3 rounded-full bg-[#1F1710]/80 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-md shadow-xs">
          <span>{item.category.name}</span>
        </div>

        {/* Featured Ribbon / Badge bila item unggulan */}
        {item.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-[#52331C] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            Unggulan
          </div>
        )}
      </div>

      {/* Badan Teks & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 select-text">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E140C] line-clamp-1 leading-snug tracking-tight">
            {item.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-[13px] text-stone-700 font-normal line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        </div>

        {/* Footer Bar: Wilayah, Kunjungan, dan Tombol Buka */}
        <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2 text-xs text-stone-500">
          <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-stone-700">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7A4B29]" aria-hidden="true" />
            <span className="truncate">{item.region.name}</span>
          </span>

          <div className="flex items-center gap-2">
            <span
              className="flex shrink-0 items-center gap-1 text-[11px] text-stone-500"
              aria-label={`Dilihat ${item.viewCount} kali`}
            >
              <Eye className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
              <span>{new Intl.NumberFormat("id-ID").format(item.viewCount)}</span>
            </span>

            {isCenter && (
              <Link
                href={`#/budaya/${item.slug}`}
                className="ml-1 inline-flex items-center gap-1 rounded-full btn-waranusa px-3.5 py-1 text-[11px] font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition-all"
              >
                Lihat
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
