"use client";

/**
 * WaraNusa — CultureCard
 * Kartu objek budaya dipakai di Katalog, Landing,
 * dan Konten Terkait pada halaman detail.
 * Dilengkapi tombol aksi langsung ("Buka Model 3D", "Mainkan Nada", atau "Lihat").
 */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, ImageOff, Layers, MapPin, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CulturalItem } from "@/lib/types";

export function CultureCard({ item, compact = false }: { item: CulturalItem; compact?: boolean }) {
  const router = useRouter();
  const [imgFailed, setImgFailed] = useState(false);
  const cover = item.coverMedia?.url ?? null;
  const showImage = cover !== null && !imgFailed;

  const isHouse = item.category?.slug === "rumah-adat" || item.category?.slug === "arsitektur";
  const isInstrument = item.category?.slug === "alat-musik";

  const actionUrl = isHouse
    ? `/eksplorasi-3d?house=${item.slug}`
    : isInstrument
    ? `/virtual-instruments?instrument=${item.slug}`
    : `/budaya/${item.slug}`;

  const actionLabel = isHouse ? "Buka Model 3D" : isInstrument ? "Mainkan Nada" : "Lihat";

  return (
    <Link
      href={`/budaya/${item.slug}`}
      aria-label={`Lihat detail ${item.title}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-stone-200/90 bg-white text-left transition-all duration-300 hover:border-[#8C5E3C]/40 hover:shadow-xl",
        compact ? "rounded-xl" : "sm:rounded-3xl shadow-sm"
      )}
    >
      {/* Cover */}
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-[#FAF6EE]", compact && "aspect-[16/10]")}>
        {showImage ? (
          <Image
            src={cover}
            alt={`Gambar ${item.title}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 380px, 300px"
            quality={70}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu will-change-transform"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EFE5D4] via-[#F4ECE0] to-[#E9DEC9]"
            role="img"
            aria-label={`Sampul belum tersedia untuk ${item.title}`}
          >
            <ImageOff className="h-8 w-8 text-stone-400" aria-hidden="true" />
          </div>
        )}

        {/* Badge Kategori */}
        <span className="absolute left-3 top-3 rounded-full bg-[#1F1710]/80 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-md shadow-xs">
          {item.category?.name ?? "Budaya"}
        </span>

        {/* Badge Unggulan jika ada */}
        {item.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-[#52331C] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            Unggulan
          </span>
        )}
      </div>

      {/* Isi & Metadata */}
      <div className={cn("flex flex-col justify-between p-4 sm:p-5", compact && "p-3.5")}>
        <div>
          <h3
            className={cn(
              "font-serif font-bold text-[#1E140C] transition-colors group-hover:text-[#6E472D] line-clamp-1 leading-snug tracking-tight",
              compact ? "text-sm" : "text-base sm:text-lg"
            )}
          >
            {item.title}
          </h3>
          <p className={cn("mt-1.5 text-stone-600 font-normal leading-relaxed line-clamp-2", compact ? "text-xs line-clamp-1 mt-1" : "text-xs sm:text-[13px]")}>
            {item.summary}
          </p>
        </div>

        {/* Footer Bar */}
        <div className={cn("mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2 text-xs text-stone-500", compact && "mt-2.5 pt-2")}>
          <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-stone-700">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7A4B29]" aria-hidden="true" />
            <span className="truncate">{item.region?.name ?? "Indonesia"}</span>
          </span>

          <div className="flex items-center gap-2">
            <span
              className="flex shrink-0 items-center gap-1 text-[11px] text-stone-500"
              aria-label={`Dilihat ${item.viewCount} kali`}
            >
              <Eye className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
              <span>{new Intl.NumberFormat("id-ID").format(item.viewCount)}</span>
            </span>

            {!compact && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(actionUrl);
                }}
                className="ml-1 inline-flex items-center gap-1 rounded-full btn-waranusa px-3 py-1 text-[11px] font-bold text-white shadow-xs transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                aria-label={`${actionLabel} ${item.title}`}
              >
                {actionLabel}
                {isHouse ? (
                  <Layers className="h-3 w-3" aria-hidden="true" />
                ) : isInstrument ? (
                  <Music className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
