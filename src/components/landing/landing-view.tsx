"use client";

/**
 * WaraNusa — LandingView (Beranda Publik)
 * Tema "Editorial & Museum Digital Nusantara":
 * Ritme kontras ruang pamer (Lontar Hangat & Dark Exhibition Stage),
 * aksen Merah Marun Songket & Emas Gamelan selaras dengan logo WaraNusa,
 * serta tipografi editorial bersih tanpa elemen dekoratif berlebihan.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { HashLink as Link } from "@/components/shared/hash-link";
import { motion, MotionConfig, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Box,
  Compass,
  ImageOff,
  Landmark,
  MessageSquarePlus,
  Music4,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { navigate } from "@/lib/router";
import { useAsyncData } from "@/hooks/use-async-data";
import { useSiteSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/states";
import { CultureCard } from "@/components/catalog/culture-card";
import { CultureCardCarousel } from "@/components/landing/culture-card-carousel";
import { HOUSES_38_CATALOGUE } from "@/data/traditional-houses";
import { INSTRUMENTS_38_CATALOGUE } from "@/data/instruments-data";
import dynamic from "next/dynamic";
import type { CulturalItem } from "@/lib/types";
import { ArchipelagoEarthMap } from "@/components/landing/archipelago-earth-map";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n-store";

void MessageSquarePlus;
void Sparkles;

const ModelViewer = dynamic(() => import("@/components/three/model-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[480px] w-full rounded-2xl bg-stone-800/60" />,
});

const Instrument3DStage = dynamic(
  () =>
    import("@/components/three/instrument-3d-stage").then((m) => m.Instrument3DStage),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[460px] w-full rounded-2xl bg-[#EADBCC]/60" />,
  }
);

const SARON_DEMUNG_DATA =
  INSTRUMENTS_38_CATALOGUE.find((inst) => inst.id === "saron-demung-jateng") ??
  INSTRUMENTS_38_CATALOGUE[0];

const JOGLO_HOUSE_DATA = HOUSES_38_CATALOGUE.find((h) => h.id === "joglo");

const FALLBACK_LANDING_JOGLO: CulturalItem = JOGLO_HOUSE_DATA?.fallbackItem ?? {
  id: "seed-joglo-landing",
  slug: "joglo",
  title: "Joglo",
  summary:
    "Mahakarya arsitektur kayu Jawa bertingkat tumpangsari yang dipikul oleh empat pilar saka guru tanpa paku besi.",
  description:
    "Rumah Joglo merupakan manifestasi filosofi hidup orang Jawa yang memadukan ruang terbuka egaliter di pendapa dengan ruang sakral.",
  status: "PUBLISHED",
  featured: true,
  viewCount: 150,
  category: {
    id: "cat-arsitektur",
    slug: "arsitektur",
    name: "Arsitektur",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  region: {
    id: "ID-JT",
    code: "ID-JT",
    name: "Jawa Tengah",
    islandGroup: "JAWA",
    summary: "Jawa Tengah",
    lat: -7.0,
    lng: 110.4,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  modelMedia: {
    id: "model-joglo-landing",
    name: "Joglo 3D",
    type: "MODEL_3D",
    format: "glb",
    mimeType: "model/gltf-binary",
    size: 2500000,
    storagePath: "/api/models/houses/jawa-tengah.glb",
    url: "/api/models/houses/jawa-tengah.glb",
    attribution: "Digitalisasi Warisan 3D WaraNusa",
  },
  hotspots: [
    {
      id: "h1",
      itemId: "seed-joglo-landing",
      title: "Saka Guru",
      description: "Empat tiang penyangga utama penopang struktur atap tumpangsari bertingkat",
      x: 0,
      y: 0.8,
      z: 0,
      published: true,
    },
    {
      id: "h2",
      itemId: "seed-joglo-landing",
      title: "Atap Tajug",
      description: "Bentuk atap Tajug piramidal bertingkat melambangkan kedewasaan spiritual",
      x: 0,
      y: 1.5,
      z: 0,
      published: true,
    },
  ],
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

export default function LandingView({ introRevealed = true }: { introRevealed?: boolean } = {}) {
  const { language, t } = useTranslation();
  const settings = useSiteSettings((s) => s.settings);
  const contributionNotice =
    settings.contributionNotice ||
    t(
      "contribute.desc",
      "Dokumentasi budaya adalah kerja bersama. Kirim tulisan, foto, atau rujukan Anda — tim kurator akan meninjau dan menerbitkannya dengan atribusi atas nama Anda."
    );

  const features = useMemo(
    () => [
      {
        icon: Compass,
        title: t("features.f1_title", "Peta 38 Wilayah Budaya"),
        desc: t(
          "features.f1_desc",
          "Temukan asal-usul setiap objek pada peta interaktif 38 provinsi — dari Sumatera hingga Papua — lengkap dengan ibu kota dan pusaka tiap daerah."
        ),
      },
      {
        icon: BookOpen,
        title: t("features.f2_title", "Dokumentasi Bersumber"),
        desc: t(
          "features.f2_desc",
          "Setiap artikel dilengkapi rujukan buku, jurnal ilmiah, situs museum, atau arsip yang dapat diverifikasi langsung dari halaman objek."
        ),
      },
      {
        icon: Box,
        title: t("features.f3_title", "Ruang Pamer 3D Interaktif"),
        desc: t(
          "features.f3_desc",
          "Putar dan perbesar model tiga dimensi rumah adat serta artefak, lengkap dengan titik penjelasan anatomi pada struktur utamanya."
        ),
      },
      {
        icon: Music4,
        title: t("features.f4_title", "Atelier Musik Virtual"),
        desc: t(
          "features.f4_desc",
          "Mainkan replika digital instrumen nusantara langsung dari peramban untuk mengenal tangga nada, laras, dan organologi akustiknya."
        ),
      },
    ],
    [language, t]
  );

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
        regions: Math.max(regionsRes.data.length, 38),
        categories: categoriesRes.data.length,
      },
    };
  }, []);

  // ---- Sorotan budaya (featured dulu, muat 7 item untuk panggung 3D carousel) ----
  const highlights = useAsyncData(() => api.items.list({ pageSize: 7, sort: "newest" }), []);
  const highlightItems = useMemo(
    () =>
      highlights.data
        ? [...highlights.data].sort((a, b) => Number(b.featured) - Number(a.featured))
        : [],
    [highlights.data]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-[#6E472D] selection:text-white">
        {/* ========================================================================= */}
        {/* HERO SECTION — GRADASI LONTAR HANGAT DENGAN SOROTAN CAHAYA RADIAL         */}
        {/* ========================================================================= */}
        <section
          className="relative w-full overflow-hidden pt-16 sm:pt-20 lg:pt-22 pb-2 sm:pb-4 bg-[radial-gradient(ellipse_85%_60%_at_50%_38%,#FCF7EB_0%,#F6EEE0_55%,#EDE1CE_100%)]"
          aria-labelledby="hero-title"
        >
          <div id="peta-nusantara" className="relative w-full">
            <ArchipelagoEarthMap introRevealed={introRevealed} />
          </div>
        </section>

        {/* ================= STRIP STATISTIK EDITORIAL ================= */}
        <section
          aria-label="Statistik platform"
          className="border-y border-[#DFD3C2] bg-gradient-to-r from-[#F8F2E7] via-[#F2E8D7] to-[#F8F2E7]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-9 sm:px-6 md:grid-cols-4 md:divide-x md:divide-[#DFD3C2] lg:px-8">
            {stats.loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 md:px-6 first:md:pl-0">
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
                  <Stat
                    value={stats.data.published}
                    label={t("stats.objects", "Objek budaya terpublikasi")}
                    delay={0.05}
                    className="md:pr-6"
                  />
                  <Stat
                    value={stats.data.regions}
                    label={t("stats.provinces", "Provinsi terpetakan penuh")}
                    delay={0.15}
                    className="md:px-6"
                  />
                  <Stat
                    value={stats.data.categories}
                    label={t("stats.categories", "Rumpun kategori budaya")}
                    delay={0.25}
                    className="md:px-6"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 22 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="md:pl-6"
                  >
                    <p className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2D1E12]">
                      <AnimatedCounter value={100} suffix="%" duration={1.6} />
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 font-medium">
                      <ShieldCheck className="h-4 w-4 text-[#7A4B29]" aria-hidden="true" />
                      {t("stats.sources", "Konten bersumber rujukan")}
                    </p>
                  </motion.div>
                </>
              )
            )}
          </div>
        </section>

        {/* ================= CURVED RIBBON TICKER (SESUAI REFERENSI, ORGANIK TANPA KOTAK) ================= */}
        <NusantaraCurvedTicker />

        {/* ================= FITUR UTAMA (EDITORIAL LAYOUT - TERANG BERSIH) ================= */}
        <section
          id="fitur"
          className="relative bg-[#FAF7F2] border-b border-[#E8DDD0]"
          aria-labelledby="fitur-title"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionHeading
                title={t("features.heading", "Empat Pintu Mengenal Tradisi")}
                description={t(
                  "features.desc",
                  "Dirancang layaknya ruang baca dan galeri museum terbuka — memudahkan pelajar, peneliti, maupun masyarakat umum menelusuri akar budaya Nusantara."
                )}
                variant="maroon-sans"
              />
            </motion.div>
            <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {features.map((f, i) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex gap-5 border-t border-[#E2D6C5] pt-7"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F7EFE2] to-[#EBE0CE] text-[#6E472D] border border-[#DFD2BE] shadow-xs transition-colors group-hover:border-[#6E472D]/40">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-widest text-[#7A4B29]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true" className="h-[1px] w-4 bg-[#D4A843]" />
                    </div>
                    <h3 className="mt-1 font-serif text-lg sm:text-xl font-bold text-[#2D1E12]">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= SOROTAN BUDAYA (PARCHMENT WARM CONTRAST) ================= */}
        <section
          className="relative bg-gradient-to-b from-[#EFE2D2] via-[#F4E9DC] to-[#EAE0D0] border-b border-[#D8C6AF]"
          aria-labelledby="sorotan"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.90, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <SectionHeading
                title={t("highlights.title", "Sorotan Budaya Nusantara")}
                description={t(
                  "highlights.desc",
                  "Koleksi objek pilihan dari katalog kami — mulai dari arsitektur vernakular hingga seni pertunjukan sakral."
                )}
                variant="maroon-sans"
              />
              <Link
                href="#/katalog"
                className="btn-waranusa rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2 text-white hover:brightness-105 active:scale-95 transition-all"
              >
                {t("highlights.all_btn", "Lihat semua katalog")}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>

            {highlights.error ? (
              <p className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
                Sorotan budaya sementara tidak dapat dimuat.{" "}
                <Link
                  href="#/katalog"
                  className="font-bold text-[#6E472D] underline-offset-2 hover:underline"
                >
                  Buka katalog langsung
                </Link>
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <CultureCardCarousel
                  items={highlightItems}
                  loading={highlights.loading}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RUANG PAMER DIGITAL 3D TERPADU (TAB SWITCHER SESUAI REFERENSI)            */}
        {/* ========================================================================= */}
        <Interactive3DPavilion />

        {/* ================= AJAKAN BERKONTRIBUSI ================= */}
        <section
          id="tentang-kami"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8"
          aria-labelledby="kontribusi-cta"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.90, y: 26 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#4E3528] bg-[#3C2517] px-6 py-12 text-white shadow-xl sm:px-10 md:py-16"
          >
            {/* Bentuk Lingkaran Geometris Bersih (Sesuai Referensi Pengguna — Tanpa Blur) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 sm:-right-24 sm:-top-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#503B2E]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-2xl"
            >
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4A843]">
                <span aria-hidden="true" className="inline-block h-[1.5px] w-6 bg-[#D4A843]" />
                <span>{t("contribute.badge", "Gerakan Dokumentasi Bersama")}</span>
              </div>
              <h2
                id="kontribusi-cta"
                className="mt-3 font-serif text-2xl font-bold leading-snug sm:text-3xl md:text-4xl text-[#FAF6F0]"
              >
                {t("contribute.title", "Punya pengetahuan budaya daerah? Rawat bersama kami.")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-300 md:text-base">
                {contributionNotice}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#FAF6F0] text-[#3C2517] hover:bg-white px-7 text-sm font-bold shadow-md"
                >
                  <Link href="#/kontribusi">
                    {t("contribute.btn", "Kirim Dokumentasi")}{" "}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <span className="text-xs text-stone-400">
                  {t("contribute.note", "Tinjauan kurator terpercaya · Hak cipta & atribusi atas nama Anda")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
}

function Interactive3DPavilion() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"HOUSES" | "INSTRUMENTS">("HOUSES");
  const [volume, setVolume] = useState<number>(0.8);
  const activeInstrument = SARON_DEMUNG_DATA;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EB] via-[#F5EBDD] to-[#EFE4D3] text-[#2D1E12] border-b border-[#E2D5C3]"
      aria-labelledby="ruang-pamer-3d"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#CBB59D]/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-24 lg:px-8">
        {/* Header Seksi & Tab Switcher (Sesuai Desain Referensi Singkat) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="ruang-pamer-3d"
            className="font-sans text-2xl font-black tracking-tight text-[#482B18] sm:text-3xl md:text-4xl"
          >
            {t("3d.title", "Eksplorasi Budaya 3D")}
          </h2>

          {/* Segmented Capsule Tab Buttons */}
          <div className="mt-5 sm:mt-6 inline-flex items-center rounded-full border border-[#DCD0BE] bg-[#EFE4D3] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("HOUSES")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer",
                activeTab === "HOUSES"
                  ? "bg-[#6E472D] text-white shadow-md border border-[#583720]"
                  : "text-[#6E472D] hover:text-[#2D1E12]"
              )}
              aria-pressed={activeTab === "HOUSES"}
            >
              <Landmark className="h-4 w-4" aria-hidden="true" />
              <span>{t("3d.houses_tab", "Arsitektur Rumah Adat")}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("INSTRUMENTS")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer",
                activeTab === "INSTRUMENTS"
                  ? "bg-[#6E472D] text-white shadow-md border border-[#583720]"
                  : "text-[#6E472D] hover:text-[#2D1E12]"
              )}
              aria-pressed={activeTab === "INSTRUMENTS"}
            >
              <Music4 className="h-4 w-4" aria-hidden="true" />
              <span>{t("3d.instruments_tab", "Alat Musik Tradisional")}</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic 3D Stage & Editorial Columns (Di Mobile: 3D Stage Tampil Pertama / order-1) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-10 lg:mt-12 grid items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-14 min-w-0"
        >
          {/* Kolom 3D Interaktif (Mobile: order-1 agar langsung kelihatan tanpa scroll) */}
          <div
            className={cn(
              "order-1 min-w-0 lg:col-span-7",
              activeTab === "HOUSES" ? "lg:order-2" : "lg:order-1"
            )}
          >
            <div className="relative rounded-2xl sm:rounded-3xl border border-[#DCD0BE] bg-white/90 backdrop-blur-xs p-3 sm:p-5 shadow-xl overflow-hidden">
              {activeTab === "HOUSES" ? (
                <div>
                  <div className="mb-2.5 sm:mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#EADBCC] pb-2.5 sm:pb-3 px-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6E472D]/10 text-[#6E472D] shrink-0">
                        <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D1E12] truncate">
                          Rumah Joglo — Jawa Tengah
                        </h3>
                        <p className="text-[11px] text-stone-600 truncate">
                          Arsitektur Tradisional &bull; Suku Jawa
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FAF5EC] px-2.5 py-1 text-[10px] font-bold text-[#6E472D] border border-[#E0D2C0]">
                      {t("3d.badge_interactive", "Model 3D Interaktif • 360°")}
                    </span>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#EADBCC]">
                    <ModelViewer
                      item={FALLBACK_LANDING_JOGLO}
                      autoRotate
                      className="h-[290px] xs:h-[330px] sm:h-[390px] lg:h-[460px] w-full"
                    />
                  </div>

                  <p className="mt-2.5 sm:mt-3 px-1 text-center text-xs text-stone-600">
                    {t("3d.tip_house", "Tip: Putar, geser, dan perbesar model 3D untuk mengamati susunan saka guru dan atap tumpangsari.")}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-2.5 sm:mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#EADBCC] pb-2.5 sm:pb-3 px-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6E472D]/10 text-[#6E472D] shrink-0">
                        <Music4 className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D1E12] truncate">
                          {activeInstrument.title} — {activeInstrument.province}
                        </h3>
                        <p className="text-[11px] text-stone-600 truncate">
                          {activeInstrument.organologyLabel} &bull; Suku {activeInstrument.ethnicGroup}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FAF5EC] px-2.5 py-1 text-[10px] font-bold text-[#6E472D] border border-[#E0D2C0]">
                      {t("3d.badge_audio", "Interaktif 3D • Web Audio")}
                    </span>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#EADBCC]">
                    <Instrument3DStage
                      instrument={activeInstrument}
                      volume={volume}
                      onVolumeChange={setVolume}
                    />
                  </div>

                  <p className="mt-2.5 sm:mt-3 px-1 text-center text-xs text-stone-600">
                    {t("3d.tip_instrument", "Tip: Ketuk bilah nada di bawah atau klik/usap pada model 3D untuk memicu suara instrumen.")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Editorial (Mobile: order-2 berada di bawah kanvas dengan teks padat & chip ringkas) */}
          <div
            className={cn(
              "order-2 min-w-0 lg:col-span-5 lg:pt-2",
              activeTab === "HOUSES" ? "lg:order-1" : "lg:order-2"
            )}
          >
            {activeTab === "HOUSES" ? (
              <div>
                <SectionHeading
                  title={t("3d.houses_heading", "Rancang Bangun Rumah Adat Nusantara")}
                  description={t("3d.houses_desc", "Model 3D interaktif untuk mempelajari struktur konstruksi tahan gempa tanpa paku besi.")}
                  variant="maroon-sans"
                />

                {/* Tampilan Mobile (< lg): 3 Chip Fitur Ringkas & Hemat Ruang */}
                <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    Saka Guru &amp; Tumpangsari
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    360&deg; Rotasi Bebas
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    38 Rumah Adat Lengkap
                  </span>
                </div>

                {/* Tampilan Desktop (>= lg): Penjelasan Lengkap dengan Semantik <ol> / <li> Valid */}
                <ol className="hidden lg:block mt-8 space-y-4 border-t border-[#DFD2BF] pt-6 text-sm list-none p-0">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">01</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">Saka Guru &amp; Tumpangsari</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Struktur balok kayu bertingkat presisi yang kokoh tanpa paku besi.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">02</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">360&deg; Rotasi &amp; Hotspot</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Amati konstruksi atap tajug dan detail sambungan pasak secara leluasa.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">03</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">38 Rumah Adat Provinsi</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Dokumentasi digital arsitektur adat lengkap dari Sabang sampai Merauke.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="btn-waranusa rounded-full px-7 font-bold shadow-md w-full sm:w-auto"
                  >
                    <Link href="#/eksplorasi-3d">
                      {t("3d.houses_btn", "Buka 38 Rumah Adat")}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <SectionHeading
                  title={t("3d.instruments_heading", "Resonansi Musik Tradisional Nusantara")}
                  description={t("3d.instruments_desc", "Instrumen daerah interaktif yang dapat dimainkan langsung dengan simulasi tangga nada dan akustik alami.")}
                  variant="maroon-sans"
                />

                {/* Tampilan Mobile (< lg): 3 Chip Fitur Ringkas & Hemat Ruang */}
                <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    Bilah Logam Perunggu
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    Tangga Pelog &amp; Slendro
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD2BF] bg-[#FAF5EC] px-3 py-1.5 text-xs font-semibold text-[#52331C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8C5835]" />
                    38 Instrumen Nusantara
                  </span>
                </div>

                {/* Tampilan Desktop (>= lg): Penjelasan Lengkap dengan Semantik <ol> / <li> Valid */}
                <ol className="hidden lg:block mt-8 space-y-4 border-t border-[#DFD2BF] pt-6 text-sm list-none p-0">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">01</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">Model 3D Nyata</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Amati rancakan kayu ukir berprada emas dan bilah logam perunggu.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">02</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">Tangga Nada Pelog &amp; Slendro</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Sentuh bilah nada 1–7 untuk memicu denting synthesizer Web Audio.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-[#7A4B29]">03</span>
                    <div>
                      <h4 className="font-bold text-[#2D1E12]">38 Instrumen Daerah</h4>
                      <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                        Studio lengkap alat musik petik, tabuh, tiup, dan gesek nusantara.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="btn-waranusa rounded-full px-7 font-bold shadow-md w-full sm:w-auto"
                  >
                    <Link href="#/instrumen">
                      {t("3d.instruments_btn", "Buka 38 Alat Musik")}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(update);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {new Intl.NumberFormat("id-ID").format(count)}
      {suffix}
    </span>
  );
}

function Stat({
  value,
  label,
  delay = 0,
  className,
}: {
  value: number;
  label: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 22 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <p className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2D1E12]">
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-1.5 text-xs sm:text-sm text-stone-600 font-medium">{label}</p>
    </motion.div>
  );
}

function NusantaraCurvedTicker() {
  const { t } = useTranslation();
  const phrase = t(
    "ticker.phrase",
    "✦ WARISAN BUDAYA NUSANTARA • 3D ARTEFAK & RUMAH ADAT • PETA 38 PROVINSI • INSTRUMEN VIRTUAL • DOKUMENTASI TERVERIFIKASI "
  );
  const repeatedTicker = useMemo(() => Array(7).fill(phrase).join(""), [phrase]);

  const containerRef = useRef<HTMLDivElement>(null);
  const textPathMobileRef = useRef<SVGTextPathElement>(null);
  const textPathDesktopRef = useRef<SVGTextPathElement>(null);
  const measureMobileRef = useRef<SVGTextElement>(null);
  const measureDesktopRef = useRef<SVGTextElement>(null);
  const [phraseWidthMobile, setPhraseWidthMobile] = useState(0);
  const [phraseWidthDesktop, setPhraseWidthDesktop] = useState(0);

  useEffect(() => {
    if (measureMobileRef.current) {
      const len = measureMobileRef.current.getComputedTextLength();
      if (len > 0) setPhraseWidthMobile(len);
    }
    if (measureDesktopRef.current) {
      const len = measureDesktopRef.current.getComputedTextLength();
      if (len > 0) setPhraseWidthDesktop(len);
    }
  }, [phrase]);

  useEffect(() => {
    let animId: number;
    let offsetMobile = 0;
    let offsetDesktop = 0;
    let isVisible = true;
    const unitMobile = phraseWidthMobile > 0 ? phraseWidthMobile : 420;
    const unitDesktop = phraseWidthDesktop > 0 ? phraseWidthDesktop : 560;

    const step = () => {
      if (!isVisible) return;
      offsetMobile -= 0.65;
      if (Math.abs(offsetMobile) >= unitMobile) {
        offsetMobile += unitMobile;
      }
      if (textPathMobileRef.current) {
        textPathMobileRef.current.setAttribute("startOffset", `${offsetMobile}px`);
      }

      offsetDesktop -= 0.85;
      if (Math.abs(offsetDesktop) >= unitDesktop) {
        offsetDesktop += unitDesktop;
      }
      if (textPathDesktopRef.current) {
        textPathDesktopRef.current.setAttribute("startOffset", `${offsetDesktop}px`);
      }

      animId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(step);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    animId = requestAnimationFrame(step);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [phraseWidthMobile, phraseWidthDesktop]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden py-4 sm:py-7 md:py-10 select-none [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
    >
      {/* ========================================================================= */}
      {/* 1. KHUSUS MOBILE (< md): PITA LEBAR, TEBAL KE BAWAH, DAN BOLD MAJESTIC   */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 540 110"
        className="relative z-10 w-full h-26 sm:h-32 text-stone-900 pointer-events-none md:hidden"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ribbon-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A2E1B" />
            <stop offset="25%" stopColor="#6C4325" />
            <stop offset="50%" stopColor="#8A5832" />
            <stop offset="75%" stopColor="#6C4325" />
            <stop offset="100%" stopColor="#4A2E1B" />
          </linearGradient>

          <filter id="ribbon-shadow-mobile" x="-5%" y="-20%" width="110%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#26160B" floodOpacity="0.32" />
          </filter>
        </defs>

        <text
          ref={measureMobileRef}
          className="fill-transparent text-[15.5px] font-sans font-black tracking-[0.2em] uppercase"
          style={{ visibility: "hidden" }}
        >
          {phrase}
        </text>

        <path
          id="nusantara-ribbon-path-mobile"
          d="M -300,55 C -150,55 -70,34 100,34 C 270,34 320,76 490,76 C 660,76 710,34 880,34 C 1050,34 1100,76 1270,76"
          fill="none"
          stroke="url(#ribbon-gradient-mobile)"
          strokeWidth="62"
          strokeLinecap="round"
          filter="url(#ribbon-shadow-mobile)"
        />

        <path
          d="M -300,55 C -150,55 -70,34 100,34 C 270,34 320,76 490,76 C 660,76 710,34 880,34 C 1050,34 1100,76 1270,76"
          fill="none"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="10"
          strokeLinecap="round"
          className="pointer-events-none"
        />

        <text
          dominantBaseline="central"
          className="fill-[#FAF6F0] text-[15.5px] font-sans font-black tracking-[0.2em] uppercase select-none drop-shadow-sm"
        >
          <textPath ref={textPathMobileRef} href="#nusantara-ribbon-path-mobile" startOffset="0px">
            {repeatedTicker}
          </textPath>
        </text>
      </svg>

      {/* ========================================================================= */}
      {/* 2. KHUSUS DESKTOP (>= md): PITA MEWAH TEBAL BENTANG LUAS 1600PX            */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1600 170"
        className="relative z-10 w-full hidden md:block h-38 md:h-44 lg:h-48 text-stone-900 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ribbon-gradient-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A2E1B" />
            <stop offset="25%" stopColor="#6C4325" />
            <stop offset="50%" stopColor="#8A5832" />
            <stop offset="75%" stopColor="#6C4325" />
            <stop offset="100%" stopColor="#4A2E1B" />
          </linearGradient>

          <filter id="ribbon-shadow-desktop" x="-5%" y="-20%" width="110%" height="160%">
            <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#26160B" floodOpacity="0.28" />
          </filter>
        </defs>

        <text
          ref={measureDesktopRef}
          className="fill-transparent text-[20px] font-sans font-black tracking-[0.24em] uppercase"
          style={{ visibility: "hidden" }}
        >
          {phrase}
        </text>

        <path
          id="nusantara-ribbon-path-desktop"
          d="M -450,85 C -90,85 -10,54 350,54 C 710,54 790,116 1150,116 C 1510,116 1590,54 1950,54 C 2310,54 2390,116 2750,116"
          fill="none"
          stroke="url(#ribbon-gradient-desktop)"
          strokeWidth="66"
          strokeLinecap="round"
          filter="url(#ribbon-shadow-desktop)"
        />

        <path
          d="M -450,85 C -90,85 -10,54 350,54 C 710,54 790,116 1150,116 C 1510,116 1590,54 1950,54 C 2310,54 2390,116 2750,116"
          fill="none"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="11"
          strokeLinecap="round"
          className="pointer-events-none"
        />

        <text
          dominantBaseline="central"
          className="fill-[#FAF6F0] text-[20px] font-sans font-black tracking-[0.24em] uppercase select-none drop-shadow-sm"
        >
          <textPath ref={textPathDesktopRef} href="#nusantara-ribbon-path-desktop" startOffset="0px">
            {repeatedTicker}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
