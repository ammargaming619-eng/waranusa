"use client";

import { HashLink as Link } from "@/components/shared/hash-link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/brand/waranusa-logo.png"
      alt="Logo WaraNusa"
      className={cn("h-9 w-9 object-contain mix-blend-multiply select-none", className)}
      aria-hidden="true"
    />
  );
}

export function BrandLogo({
  compact = false,
  dark = false,
  variant = "earthy",
}: {
  compact?: boolean;
  dark?: boolean;
  variant?: "default" | "earthy";
}) {
  if (variant === "earthy") {
    return (
      <Link
        href="#/"
        className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-full select-none"
        aria-label="WaraNusa — Beranda"
      >
        <img
          src="/images/brand/waranusa-logo.png"
          alt="Logo WaraNusa"
          className="h-9 w-9 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
        />
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-tight transition-colors duration-200",
            dark ? "text-stone-100" : "text-[#2D1E12] group-hover:text-stone-900"
          )}
        >
          WaraNusa
        </span>
      </Link>
    );
  }

  return (
    <Link href="#/" className="flex items-center gap-2.5 group select-none" aria-label="WaraNusa — Beranda">
      <BrandMark className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif text-[1.25rem] font-bold tracking-tight",
              dark ? "text-white" : "text-[#2D1E12]"
            )}
          >
            WaraNusa
          </span>
          <span
            className={cn(
              "text-[0.6rem] font-medium tracking-[0.12em] uppercase mt-0.5",
              dark ? "text-white/70" : "text-stone-600"
            )}
          >
            Pelestarian Budaya Nusantara
          </span>
        </span>
      )}
    </Link>
  );
}
