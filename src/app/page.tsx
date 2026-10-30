"use client";

/**
 * WaraNusa — Shell SPA
 * Seluruh aplikasi (situs publik + CMS) hidup di path "/" dengan hash routing
 * (#/jelajah, #/katalog, #/admin/...) sesuai batasan lingkungan preview.
 * Setiap view bertanggung jawab mengambil datanya sendiri via REST API.
 */
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const BrandPreloader = dynamic(
  () => import("@/components/shared/brand-preloader").then((m) => m.BrandPreloader),
  { ssr: false }
);

import { useRoute, navigate } from "@/lib/router";
import { useAuth } from "@/lib/auth-store";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import LandingView from "@/components/landing/landing-view";
import CatalogView from "@/components/catalog/catalog-view";
import ArchiveView from "@/components/archive/archive-view";
import ContributeView from "@/components/contribute/contribute-view";
import LoginView from "@/components/account/login-view";
import MyContributionsView from "@/components/account/my-contributions-view";

const ExploreView = dynamic(() => import("@/components/explore/explore-view"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#FAF5EC]" />,
});
const InstrumentView = dynamic(() => import("@/components/instrument/instrument-view"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#1A110B]" />,
});
const Exploration3DView = dynamic(() => import("@/components/explore/exploration-3d-view"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#FCF8EC]" />,
});
const CultureDetailView = dynamic(() => import("@/components/culture/culture-detail-view"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#FCF8EC]" />,
});
const AdminApp = dynamic(() => import("@/components/admin/admin-app"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-stone-900" />,
});

import { Loader } from "@/components/shared/states";
import { useSiteSettings } from "@/lib/settings-store";

export default function WaraNusaApp() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const route = useRoute();
  const { init, initialized } = useAuth();
  const settings = useSiteSettings((s) => s.settings);
  const loadSettings = useSiteSettings((s) => s.load);
  const [introRevealed, setIntroRevealed] = useState(true);
  const [introDone, setIntroDone] = useState(true);

  useEffect(() => {
    setMounted(true);
    init();
    loadSettings();

    // Auto-migrasi URL: bila pengguna membuka tautan lama berformat #/..., arahkan ke rute bersih App Router
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/")) {
      const hashPath = window.location.hash.slice(2);
      if (hashPath) {
        const cleanPath = hashPath.startsWith("masuk")
          ? hashPath.replace(/^masuk/, "login")
          : hashPath.startsWith("instrumen")
          ? hashPath.replace(/^instrumen/, "virtual-instruments")
          : hashPath.startsWith("katalog")
          ? hashPath.replace(/^katalog/, "catalog")
          : hashPath;
        router.replace(`/${cleanPath}`);
      }
    }
  }, [init, loadSettings, router]);

  // Jika membuka langsung sub-halaman (bukan beranda), lewati animasi pembuka agar instan
  const isDirectNonLanding = Boolean(route.segments[0] && route.segments[0] !== "");
  useEffect(() => {
    if (isDirectNonLanding) {
      setIntroRevealed(true);
      setIntroDone(true);
    }
  }, [isDirectNonLanding]);

  // Pengaturan situs (untuk footer) diambil ringan dari settings API publik
  const isAdmin = route.segments[0] === "admin";
  const isLogin = route.segments[0] === "masuk" || route.segments[0] === "login";

  // CMS: layout sendiri (sidebar) tanpa header/footer publik
  if (isAdmin) {
    if (!initialized) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-200">
          <Loader label="Menyiapkan panel admin..." />
        </div>
      );
    }
    return <AdminApp route={route} />;
  }

  // Login: tampilan mandiri
  if (isLogin) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <LoginView route={route} />
      </Suspense>
    );
  }

  // Situs publik: header + view + footer (footer menempel di bawah, mt-auto)
  let view: React.ReactNode;
  switch (route.segments[0]) {
    case undefined:
    case "":
      view = <LandingView introRevealed={introRevealed} />;
      break;
    case "jelajah":
      view = <ExploreView route={route} />;
      break;
    case "katalog":
      view = <CatalogView route={route} />;
      break;
    case "budaya":
      view = <CultureDetailView route={route} />;
      break;
    case "instrumen":
    case "virtual-instruments":
      view = <InstrumentView route={route} />;
      break;
    case "eksplorasi-3d":
    case "3d":
    case "3d-heritage":
      view = <Exploration3DView />;
      break;
    case "arsip":
      view = <ArchiveView />;
      break;
    case "kontribusi":
      view = <ContributeView route={route} />;
      break;
    case "kontribusi-saya":
      view = <MyContributionsView route={route} />;
      break;
    default:
      view = (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-28 text-center">
          <p className="text-5xl">🧭</p>
          <h1 className="text-2xl font-extrabold">Halaman tidak ditemukan</h1>
          <p className="text-muted-foreground">Rute <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">#{route.path}</code> tidak dikenali.</p>
          <button onClick={() => navigate("/")} className="rounded-full bg-brand-teal px-6 py-2.5 text-sm font-bold text-white hover:opacity-90">
            Kembali ke Beranda
          </button>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCF8EC] text-stone-900 overflow-x-hidden">
      {!introDone && (
        <BrandPreloader
          onStartDismiss={() => setIntroRevealed(true)}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <SiteHeader route={route} introRevealed={introRevealed} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none relative" role="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={route.segments[0] || "beranda"}
            initial={false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
              {view}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter
        siteName={settings.siteName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        footerNote={settings.footerNote}
      />
    </div>
  );
}
