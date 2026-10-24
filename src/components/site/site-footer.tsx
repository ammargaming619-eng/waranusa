"use client";

import { HashLink as Link } from "@/components/shared/hash-link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Separator } from "@/components/ui/separator";
import { Compass, LayoutGrid, Music4, Archive, HandHeart, ShieldCheck } from "lucide-react";

/**
 * Footer publik — menempel di bawah viewport saat konten pendek (mt-auto
 * pada wrapper min-h-screen flex) dan terdorong alami saat konten panjang.
 */
export function SiteFooter({ siteName, tagline, contactEmail, footerNote }: {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  footerNote?: string;
}) {
  const name = siteName || "WaraNusa";
  return (
    <footer className="relative mt-auto border-t border-[#D4A843]/20 bg-gradient-to-b from-[#1C120B] via-[#160E08] to-[#0E0704] text-stone-300">
      {/* Garis aksen emas halus penegas tema museum digital */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A843]/35 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <BrandLogo dark />
            <p className="max-w-md text-sm leading-relaxed text-stone-400">
              {tagline ||
                "Platform eksplorasi & pelestarian budaya Indonesia — peta interaktif, katalog bersumber, model 3D, dan instrumen musik virtual."}
            </p>
            {footerNote && <p className="max-w-md text-xs text-stone-500">{footerNote}</p>}
          </div>

          <nav aria-label="Navigasi footer">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#E5B869]">Jelajahi</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "#/jelajah", label: "Peta Wilayah", icon: Compass },
                { href: "#/katalog", label: "Katalog Budaya", icon: LayoutGrid },
                { href: "#/instrumen", label: "Instrumen Virtual", icon: Music4 },
                { href: "#/arsip", label: "Arsip & Sumber", icon: Archive },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex items-center gap-2 text-stone-300 transition-colors hover:text-white">
                    <l.icon className="h-3.5 w-3.5 text-[#D4A843]/80" /> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#E5B869]">Ikut Serta</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#/kontribusi" className="inline-flex items-center gap-2 text-stone-300 transition-colors hover:text-white">
                  <HandHeart className="h-3.5 w-3.5 text-[#D4A843]/80" /> Kirim Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="#/masuk" className="inline-flex items-center gap-2 text-stone-300 transition-colors hover:text-white">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#D4A843]/80" /> Akun Pengelola
                </Link>
              </li>
            </ul>
            {contactEmail && (
              <p className="mt-4 text-xs text-stone-400">
                Kontak: <a className="font-medium text-[#E5B869] hover:underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
            )}
          </div>
        </div>

        <Separator className="my-7 bg-[#2E1E14]" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-stone-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {name}. {tagline || "Platform Eksplorasi & Pelestarian Budaya Indonesia"}.
          </p>
          <p className="text-[11px] leading-relaxed text-stone-500 sm:text-right">
            Konten menampilkan sumber &amp; atribusi. Media ilustrasi demo dibuat dengan generator AI,{" "}
            <span className="whitespace-nowrap">bukan foto arsip asli.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
