"use client";

/**
 * WaraNusa — Shell SPA
 * Seluruh aplikasi (situs publik + CMS) hidup di path "/" dengan hash routing
 * (#/jelajah, #/katalog, #/admin/...) sesuai batasan lingkungan preview.
 * Setiap view bertanggung jawab mengambil datanya sendiri via REST API.
 */
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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

function ViewSkeleton({ label = "Memuat halaman..." }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#159D9A]/30 border-t-[#159D9A]" />
      <p className="text-xs font-medium text-stone-500">{label}</p>
    </div>
  );
}

const ExploreView = dynamic(() => import("@/components/explore/explore-view"), {
  loading: () => <ViewSkeleton label="Memuat Peta Atlas Nusantara..." />,
});
const CatalogView = dynamic(() => import("@/components/catalog/catalog-view"), {
  loading: () => <ViewSkeleton label="Memuat Katalog Budaya..." />,
});
const CultureDetailView = dynamic(() => import("@/components/culture/culture-detail-view"), {
  loading: () => <ViewSkeleton label="Memuat Dokumentasi Budaya..." />,
});
const InstrumentView = dynamic(() => import("@/components/instrument/instrument-view"), {
  loading: () => <ViewSkeleton label="Menyiapkan Studio Musik 3D..." />,
});
const Exploration3DView = dynamic(() => import("@/components/explore/exploration-3d-view"), {
  loading: () => <ViewSkeleton label="Memuat Ruang Pamer 3D..." />,
});
const ArchiveView = dynamic(() => import("@/components/archive/archive-view"), {
  loading: () => <ViewSkeleton label="Memuat Arsip Sumber..." />,
});
const ContributeView = dynamic(() => import("@/components/contribute/contribute-view"), {
  loading: () => <ViewSkeleton label="Memuat Formulir Kontribusi..." />,
});
const LoginView = dynamic(() => import("@/components/account/login-view"), {
  loading: () => <ViewSkeleton label="Memuat Halaman Masuk..." />,
});
const MyContributionsView = dynamic(() => import("@/components/account/my-contributions-view"), {
  loading: () => <ViewSkeleton label="Memuat Riwayat Kontribusi..." />,
});
const AdminApp = dynamic(() => import("@/components/admin/admin-app"), {
  loading: () => <ViewSkeleton label="Menyiapkan Panel CMS..." />,
});

import { Loader } from "@/components/shared/states";
import { useSiteSettings } from "@/lib/settings-store";

export default function WaraNusaApp() {
  const [mounted, setMounted] = useState(false);
  const route = useRoute();
  const { init, initialized } = useAuth();
  const settings = useSiteSettings((s) => s.settings);
  const loadSettings = useSiteSettings((s) => s.load);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    init();
    loadSettings();
  }, [init, loadSettings]);

  // Jika membuka langsung sub-halaman (bukan beranda), lewati animasi pembuka agar instan
  const isDirectNonLanding = Boolean(route.segments[0] && route.segments[0] !== "");
  useEffect(() => {
    if (isDirectNonLanding) {
      setIntroRevealed(true);
      setIntroDone(true);
    }
  }, [isDirectNonLanding]);

  // Hindari perbedaan SSR vs Client Hydration pada hash router SPA
  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FCF8EC] text-stone-900 overflow-x-hidden">
        <div className="h-16 w-full border-b border-stone-200/40 bg-[#FCF8EC]" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="h-9 w-9 animate-pulse rounded-full bg-[#159D9A]/30" />
            <p className="text-xs font-medium text-stone-500">Memuat WaraNusa…</p>
          </div>
        </main>
      </div>
    );
  }

  // Pengaturan situs (untuk footer) diambil ringan dari settings API publik
  const isAdmin = route.segments[0] === "admin";
  const isLogin = route.segments[0] === "masuk";

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
    return <LoginView />;
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
      view = <InstrumentView route={route} />;
      break;
    case "eksplorasi-3d":
    case "3d":
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
        <AnimatePresence mode="wait">
          <motion.div
            key={route.segments[0] || "beranda"}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {view}
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
