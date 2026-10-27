"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WaraNusa Global Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCF8EC] px-4 py-16 text-stone-900 selection:bg-[#6E472D] selection:text-white">
      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center text-center">
        {/* Lingkaran hiasan */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 h-64 w-64 rounded-full bg-[#EADBCC]/50 blur-3xl" />

        {/* Ikon Peringatan */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#DFD2BF] bg-[#FAF5EC] text-amber-800 shadow-md">
          <AlertTriangle className="h-10 w-10 text-amber-800" aria-hidden="true" />
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A4B29]">
          Kendala Operasional Sesi
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#2D1E12] sm:text-4xl">
          Terjadi Kendala Memuat Halaman
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
          Maaf, terjadi kesalahan tak terduga saat memuat antarmuka. Anda dapat mencoba memuat ulang halaman atau kembali ke beranda utama.
        </p>

        {error?.message && (
          <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-stone-300 bg-white/80 p-3 text-left font-mono text-xs text-stone-600">
            <span className="font-bold text-stone-800">Detail:</span> {error.message}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            size="lg"
            className="btn-waranusa rounded-full px-7 font-bold shadow-md text-white hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Muat Ulang Halaman
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-[#C8B8A2] bg-white text-[#2D1E12] hover:bg-[#FAF7F2] font-semibold shadow-xs"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
