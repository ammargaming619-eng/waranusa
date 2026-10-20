"use client";

/**
 * WaraNusa — LandingView (Beranda Publik)
 * Tema "Earthy Nusantara": palet krem hangat, kontur topografi elegan,
 * floating glassmorphism navbar, judul serif anggun, dan peta interaktif
 * kepulauan bernuansa kayu/terakota dengan kartu pin budaya melayang.
 */
import { useMemo, useState } from "react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Box,
  Compass,
  ImageOff,
  Music4,
  Play,
  ShieldCheck,
  MessageSquarePlus,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { navigate } from "@/lib/router";
import { useAsyncData } from "@/hooks/use-async-data";
import { useSiteSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/states";
import { CultureCard } from "@/components/catalog/culture-card";
import ModelViewer from "@/components/three/model-viewer";
import { ArchipelagoEarthMap } from "@/components/landing/archipelago-earth-map";
import { cn } from "@/lib/utils";

const DEFAULT_ABOUT =
  "WaraNusa adalah platform dokumentasi budaya Indonesia yang transparan sumbernya: jelajahi peta wilayah, katalog objek budaya, model 3D, dan instrumen musik virtual — semuanya terbuka untuk dipelajari dan dikontribusikan siapa pun.";

/** Gambar dengan fallback gradient hangat bila aset belum tersedia */
function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#8C5E3C]/30 via-[#CBB59D]/40 to-[#785032]/30",
          className
        )}
      >
        <ImageOff className="h-10 w-10 text-stone-400" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

const FEATURES = [
  {
    icon: Compass,
    title: "Peta Wilayah Budaya",
    desc: "Temukan asal-usul setiap objek pada peta interaktif Nusantara — dari Sumatera hingga Papua — lengkap dengan ringkasan tiap wilayah.",
  },
  {
    icon: BookOpen,
    title: "Dokumentasi Bersumber",
    desc: "Setiap artikel dilengkapi rujukan: buku, jurnal, situs museum, atau arsip — dapat diverifikasi langsung dari halaman objek.",
  },
  {
    icon: Box,
    title: "Pengalaman 3D Interaktif",
    desc: "Putar dan perbesar model tiga dimensi rumah adat dan artefak, dengan titik-titik penjelasan pada bagian pentingnya.",
  },
  {
    icon: Music4,
    title: "Instrumen Musik Virtual",
    desc: "Mainkan replika digital instrumen nusantara langsung dari peramban — cara menyenangkan mengenal nada dan laras.",
  },
] as const;

export default function LandingView() {
  const settings = useSiteSettings((s) => s.settings);
  const contributionNotice =
    settings.contributionNotice ||
    "Dokumentasi budaya adalah kerja bersama. Kirim tulisan, foto, atau rujukan Anda — tim kurator akan meninjau dan menerbitkannya dengan atribusi atas nama Anda.";

  // ---- Statistik nyata ----
  const stats = useAsyncData(async () => {
    const [itemsRes, regionsRes, categoriesRes] = await Promise.all([
      api.items.list({ pageSize: 1 }),
      api.regions.list(),
      api.categories.list(),
    ]);
    return {
      data: {
        published: itemsRes.meta?.total ?? 0,
        regions: regionsRes.data.length,
        categories: categoriesRes.data.length,
      },
    };
  }, []);

  // ---- Sorotan budaya (featured dulu) ----
  const highlights = useAsyncData(() => api.items.list({ pageSize: 3, sort: "newest" }), []);
  const highlightItems = useMemo(
    () =>
      highlights.data
        ? [...highlights.data].sort((a, b) => Number(b.featured) - Number(a.featured))
        : [],
    [highlights.data]
  );

  // ---- Preview 3D: rumah gadang ----
  const gadang = useAsyncData(() => api.items.detail("rumah-gadang"), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#FCF8EC] text-stone-900 selection:bg-[#8C5E3C] selection:text-white">
        {/* ========================================================================= */}
        {/* HERO SECTION — EARTHY NUSANTARA (FULL BACKGROUND MAP)                     */}
        {/* ========================================================================= */}
        <section
          className="relative w-full overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-8 bg-[#FCF8EC]"
          aria-labelledby="hero-title"
        >
          <div id="peta-nusantara" className="relative w-full">
            <ArchipelagoEarthMap />
          </div>

          {/* Floating Feedback Pill (Pojok Kanan Bawah) */}
          <div className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => navigate("/kontribusi")}
              className="flex items-center gap-2.5 rounded-full bg-white/95 backdrop-blur-md px-5 py-2.5 text-sm sm:text-base font-bold text-stone-800 shadow-lg border border-stone-200/90 hover:bg-white hover:border-[#8C5E3C] hover:text-[#8C5E3C] hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4 sm:h-5 sm:w-5 text-[#8C5E3C]" />
              <span>Floating feedback</span>
            </button>
          </div>
        </section>

        {/* ================= STRIP STATISTIK ================= */}
        <section aria-label="Statistik platform" className="border-y border-stone-200 bg-[#FAF7F2]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : stats.error ? (
              <div className="col-span-2 py-4 text-sm text-stone-500 md:col-span-4">
                Statistik sementara tidak dapat dimuat — konten di bawah tetap tersedia.
              </div>
            ) : (
              stats.data && (
                <>
                  <Stat value={stats.data.published} label="Objek budaya terpublikasi" />
                  <Stat value={stats.data.regions} label="Wilayah terpetakan" />
                  <Stat value={stats.data.categories} label="Kategori budaya" />
                  <div>
                    <p className="font-serif text-3xl font-extrabold tracking-tight text-[#2D1E12]">100%</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600">
                      <ShieldCheck className="h-4 w-4 text-[#8C5E3C]" aria-hidden="true" />
                      Konten bersumber rujukan
                    </p>
                  </div>
                </>
              )
            )}
          </div>
        </section>

        {/* ================= FITUR UTAMA ================= */}
        <section id="fitur" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" aria-labelledby="fitur-title">
          <SectionHeading
            eyebrow="Apa yang bisa Anda lakukan"
            title="Fitur Utama WaraNusa"
            description="Empat pintu masuk untuk mengenal kekayaan tradisi Nusantara — dirancang untuk pelajar, pendidik, dan siapa pun yang ingin merawat akarnya."
          />
          <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-4 border-t border-stone-200 pt-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFE8DE] text-[#6E472D] shadow-sm">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-serif text-xs font-bold tracking-widest text-[#8C5E3C]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold text-[#2D1E12]">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* ================= SOROTAN BUDAYA ================= */}
        <section className="bg-[#FAF7F2] border-y border-stone-200" aria-labelledby="sorotan">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Pilihan kurator"
                title="Sorotan Budaya Nusantara"
                description="Koleksi objek pilihan dari katalog kami — mulai dari arsitektur vernakular hingga seni pertunjukan sakral."
              />
              <Link
                href="#/katalog"
                className="group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-[#6E472D] hover:bg-[#EFE8DE] transition-colors"
              >
                Lihat semua katalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <Skeleton className="aspect-[4/3] rounded-none" />
                    <div className="space-y-2.5 p-4">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              {highlights.error && (
                <p className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
                  Sorotan budaya sementara tidak dapat dimuat.{" "}
                  <Link href="#/katalog" className="font-bold text-[#6E472D] underline-offset-2 hover:underline">
                    Buka katalog langsung
                  </Link>
                </p>
              )}
              {highlightItems.map((item) => (
                <CultureCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= PENGALAMAN 3D ================= */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" aria-labelledby="pengalaman3d">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Lebih dari sekadar bacaan"
                title="Pengalaman 3D Interaktif"
                description="Objek budaya didigitalisasi menjadi model tiga dimensi yang bisa diputar, didekati, dan dipelajari — lengkap dengan titik penjelasan pada setiap detail arsitektur."
              />
              <ul className="mt-6 space-y-3 text-sm text-stone-600">
                <li className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#8C5E3C]" />
                  Seret kursor untuk memutar sudut pandang 360 derajat
                </li>
                <li className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#8C5E3C]" />
                  Klik titik emas interaktif untuk membaca filosofi struktur bangunan
                </li>
                <li className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#8C5E3C]" />
                  Ringan dan responsif di peramban komputer maupun layar ponsel
                </li>
              </ul>
              <Button
                asChild
                className="mt-8 rounded-full bg-[#6E472D] hover:bg-[#5A3821] text-white px-7 font-bold shadow-md"
              >
                <Link href="#/budaya/rumah-gadang">
                  Jelajahi Rumah Gadang 3D <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-lg sm:p-6">
              {gadang.data ? (
                <ModelViewer item={gadang.data} height={380} autoRotate showHotspots />
              ) : gadang.error ? (
                <div className="flex h-[380px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#FAF7F2] text-center">
                  <Box className="h-8 w-8 text-[#8C5E3C]" aria-hidden="true" />
                  <p className="max-w-xs text-sm text-stone-500">
                    Pratinjau 3D sementara tidak dapat dimuat. Halaman budaya tetap bisa dibuka.
                  </p>
                </div>
              ) : (
                <Skeleton className="h-[380px] w-full rounded-2xl" />
              )}
            </div>
          </div>
        </section>

        {/* ================= INSTRUMEN VIRTUAL ================= */}
        <section className="bg-[#FAF7F2] border-y border-stone-200" aria-labelledby="instrumen">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative order-2 lg:order-1">
              <HeroImage
                src="/uploads/seed/gamelan.png"
                alt="Set gamelan Jawa dengan saron dan gong perunggu"
                className="aspect-[4/3] w-full rounded-3xl shadow-xl border border-stone-200/80"
              />
              <button
                type="button"
                onClick={() => navigate("/instrumen")}
                aria-label="Coba instrumen musik virtual"
                className="group absolute inset-0 flex items-center justify-center rounded-3xl focus-visible:outline-2 focus-visible:outline-[#8C5E3C]"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform duration-300 group-hover:scale-115">
                  <Play className="ml-1 h-7 w-7 text-[#6E472D]" aria-hidden="true" />
                </span>
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Belajar lewat alunan nada"
                title="Instrumen Musik Virtual"
                description="Coba gamelan saron langsung dari peramban Anda — ketuk bilah perunggunya, nikmati laras pelog tradisional, dan pahami harmoni ensambel karawitan Nusantara."
              />
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-[#8C5E3C] hover:bg-[#785032] text-white px-7 font-bold shadow-md"
              >
                <Link href="#/instrumen">
                  <Music4 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Mainkan Saron Virtual
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ================= AJAKAN BERKONTRIBUSI ================= */}
        <section id="tentang-kami" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" aria-labelledby="kontribusi-cta">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A2E1C] via-[#6E472D] to-[#8C5E3C] px-6 py-12 text-white shadow-2xl sm:px-10 md:py-16"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/10 blur-xl" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EFE3CB]">
                Gerakan Dokumentasi Bersama
              </p>
              <h2 id="kontribusi-cta" className="mt-3 font-serif text-2xl font-bold leading-snug sm:text-3xl md:text-4xl text-[#FAF6F0]">
                Punya pengetahuan budaya? Rawat bersama kami.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-200 md:text-base">
                {contributionNotice}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-[#4A2E1C] hover:bg-stone-100 px-7 text-sm font-bold shadow-lg"
                >
                  <Link href="#/kontribusi">
                    Kirim Dokumentasi <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <span className="text-xs text-stone-300">
                  Tinjauan kurator terpercaya &middot; Hak cipta &amp; atribusi atas nama Anda
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl font-extrabold tracking-tight text-[#2D1E12]">
        {new Intl.NumberFormat("id-ID").format(value)}
      </p>
      <p className="mt-1 text-sm text-stone-600">{label}</p>
    </div>
  );
}
