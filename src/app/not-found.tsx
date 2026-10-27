import Link from "next/link";
import { Compass, ArrowLeft, LayoutGrid, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCF8EC] px-4 py-16 text-stone-900 selection:bg-[#6E472D] selection:text-white">
      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center text-center">
        {/* Lingkaran aksen hiasan */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 h-64 w-64 rounded-full bg-[#EADBCC]/50 blur-3xl" />

        {/* Ikon Kompas Budaya */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#DFD2BF] bg-[#FAF5EC] text-[#7A4B29] shadow-md">
          <Compass className="h-10 w-10 animate-pulse text-[#7A4B29]" aria-hidden="true" />
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A4B29]">
          Galat 404 &bull; Rute Tidak Dikenal
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#2D1E12] sm:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
          Maaf, halaman atau objek budaya yang Anda cari tidak tersedia, sedang dalam pemeliharaan, atau alamat tautan telah diperbarui.
        </p>

        {/* Tombol Aksi Navigasi */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="btn-waranusa rounded-full px-7 font-bold shadow-md text-white hover:brightness-105 active:scale-95 transition-all"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-[#C8B8A2] bg-white text-[#2D1E12] hover:bg-[#FAF7F2] font-semibold shadow-xs"
          >
            <Link href="/catalog">
              <LayoutGrid className="mr-2 h-4 w-4 text-[#7A4B29]" aria-hidden="true" />
              Buka Katalog
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full text-stone-600 hover:text-stone-900 font-semibold"
          >
            <Link href="/virtual-instruments">
              <Music4 className="mr-2 h-4 w-4 text-[#7A4B29]" aria-hidden="true" />
              Instrumen Virtual
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
