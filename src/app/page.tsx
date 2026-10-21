"use client";

/**
 * WaraNusa — Shell SPA
 * Seluruh aplikasi (situs publik + CMS) hidup di path "/" dengan hash routing
 * (#/jelajah, #/katalog, #/admin/...) sesuai batasan lingkungan preview.
 * Setiap view bertanggung jawab mengambil datanya sendiri via REST API.
 */
import { useEffect, useState } from "react";
import { BrandPreloader } from "@/components/shared/brand-preloader";
import { useRoute, navigate } from "@/lib/router";
import { useAuth } from "@/lib/auth-store";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

import LandingView from "@/components/landing/landing-view";
import ExploreView from "@/components/explore/explore-view";
import CatalogView from "@/components/catalog/catalog-view";
import CultureDetailView from "@/components/culture/culture-detail-view";
import InstrumentView from "@/components/instrument/instrument-view";
import Exploration3DView from "@/components/explore/exploration-3d-view";
import ArchiveView from "@/components/archive/archive-view";
import ContributeView from "@/components/contribute/contribute-view";
import LoginView from "@/components/account/login-view";
import MyContributionsView from "@/components/account/my-contributions-view";
import AdminApp from "@/components/admin/admin-app";

import { Loader } from "@/components/shared/states";
import { useSiteSettings } from "@/lib/settings-store";

export default function WaraNusaApp() {
  const route = useRoute();
  const { init, initialized } = useAuth();
  const settings = useSiteSettings((s) => s.settings);
  const loadSettings = useSiteSettings((s) => s.load);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    init();
    loadSettings();
  }, [init, loadSettings]);

  // Pengaturan situs (untuk footer) diambil ringan dari settings API publik
  const isAdmin = route.segments[0] === "admin";
  const isLogin = route.segments[0] === "masuk";
  const isDirectNonLanding = Boolean(route.segments[0] && route.segments[0] !== "");

  // Jika membuka langsung sub-halaman (bukan beranda), lewati animasi pembuka agar instan
  useEffect(() => {
    if (isDirectNonLanding) {
      setIntroRevealed(true);
      setIntroDone(true);
    }
  }, [isDirectNonLanding]);

  // CMS: layout sendiri (sidebar) tanpa header/footer publik
  if (isAdmin) {
    if (!initialized) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-200">
          <Loader text="Menyiapkan panel admin..." />
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
    <div className="flex min-h-screen flex-col bg-[#FCF8EC] text-stone-900">
      {!introDone && (
        <BrandPreloader
          onStartDismiss={() => setIntroRevealed(true)}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <SiteHeader route={route} introRevealed={introRevealed} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none" role="main">
        {view}
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
