"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "ID" | "EN";

export const TRANSLATIONS = {
  ID: {
    // Navigasi Header
    "nav.home": "Beranda",
    "nav.explore": "Jelajah Nusantara",
    "nav.catalog": "Katalog Budaya",
    "nav.3d": "Eksplorasi 3D",
    "nav.instruments": "Instrumen Virtual",
    "nav.login": "Masuk",
    "nav.register": "Daftar",
    "nav.search_placeholder": "Cari budaya, rumah adat, tarian, musik...",
    "nav.search_btn": "Cari",

    // Hero Banner & Peta
    "hero.badge": "Peta Interaktif Budaya Nusantara",
    "hero.title": "Jelajahi Ragam Budaya Nusantara",
    "hero.subtitle": "Dari Sabang hingga Merauke, setiap tradisi punya cerita.",
    "hero.map_btn": "Peta 38 Provinsi",
    "hero.catalog_btn": "Katalog Budaya",
    "hero.touch_hint": "Sentuh Pin Peta atau Jelajahi Ikon Budaya:",

    // Statistik Budaya
    "stats.objects": "Objek budaya terpublikasi",
    "stats.provinces": "Provinsi terpetakan penuh",
    "stats.categories": "Rumpun kategori budaya",
    "stats.sources": "Konten bersumber rujukan",

    // Ticker Lengkung
    "ticker.phrase":
      "✦ WARISAN BUDAYA NUSANTARA • 3D ARTEFAK & RUMAH ADAT • PETA 38 PROVINSI • INSTRUMEN VIRTUAL • DOKUMENTASI TERVERIFIKASI ",

    // Pameran 3D Interaktif
    "3d.title": "Eksplorasi Budaya 3D",
    "3d.houses_tab": "Arsitektur Rumah Adat",
    "3d.instruments_tab": "Alat Musik Tradisional",
    "3d.houses_heading": "Rancang Bangun Rumah Adat Nusantara",
    "3d.houses_desc":
      "Model 3D interaktif untuk mempelajari struktur konstruksi tahan gempa tanpa paku besi.",
    "3d.instruments_heading": "Resonansi Musik Tradisional Nusantara",
    "3d.instruments_desc":
      "Instrumen daerah interaktif yang dapat dimainkan langsung dengan simulasi tangga nada dan akustik alami.",
    "3d.houses_btn": "Buka 38 Rumah Adat",
    "3d.instruments_btn": "Buka 38 Alat Musik",
    "3d.tip_house":
      "Tip: Putar, geser, dan perbesar model 3D untuk mengamati susunan saka guru dan atap tumpangsari.",
    "3d.tip_instrument":
      "Tip: Ketuk bilah nada di bawah atau klik/usap pada model 3D untuk memicu suara instrumen.",
    "3d.badge_interactive": "Model 3D Interaktif • 360°",
    "3d.badge_audio": "Interaktif 3D • Web Audio",

    // Asisten & Aksesibilitas
    "chat.ask_ai": "Tanya AI",
    "chat.title": "WaraNusa AI Assistant",
    "a11y.title": "Menu Aksesibilitas",

    // Footer
    "footer.tagline":
      "Platform eksplorasi & pelestarian budaya Indonesia — peta interaktif, katalog bersumber, model 3D, dan instrumen musik virtual.",
    "footer.explore_title": "Jelajahi",
    "footer.contribute_title": "Ikut Serta",
    "footer.contribute_action": "Kirim Dokumentasi",
    "footer.login_action": "Akun Pengelola",
    "footer.rights": "Hak cipta dilindungi undang-undang.",
  },
  EN: {
    // Navigasi Header
    "nav.home": "Home",
    "nav.explore": "Explore Archipelago",
    "nav.catalog": "Cultural Catalog",
    "nav.3d": "3D Heritage",
    "nav.instruments": "Virtual Instruments",
    "nav.login": "Sign In",
    "nav.register": "Register",
    "nav.search_placeholder": "Search heritage, architecture, dances, music...",
    "nav.search_btn": "Search",

    // Hero Banner & Peta
    "hero.badge": "Interactive Archipelago Cultural Map",
    "hero.title": "Explore the Diversity of the Archipelago",
    "hero.subtitle": "From Sabang to Merauke, every tradition holds a living story.",
    "hero.map_btn": "38 Provinces Map",
    "hero.catalog_btn": "Cultural Catalog",
    "hero.touch_hint": "Tap map pins or explore cultural highlights:",

    // Statistik Budaya
    "stats.objects": "Documented cultural assets",
    "stats.provinces": "Provinces fully mapped",
    "stats.categories": "Distinct cultural categories",
    "stats.sources": "Verified archival references",

    // Ticker Lengkung
    "ticker.phrase":
      "✦ INDONESIAN CULTURAL HERITAGE • 3D ARTIFACTS & ARCHITECTURE • 38 PROVINCES MAP • VIRTUAL INSTRUMENTS • VERIFIED DOCUMENTATION ",

    // Pameran 3D Interaktif
    "3d.title": "3D Cultural Exploration",
    "3d.houses_tab": "Traditional Architecture",
    "3d.instruments_tab": "Traditional Instruments",
    "3d.houses_heading": "Architectural Blueprint of Nusantara",
    "3d.houses_desc":
      "Interactive 3D models to study earthquake-resistant interlocking timber construction without iron nails.",
    "3d.instruments_heading": "Resonance of Traditional Nusantara Music",
    "3d.instruments_desc":
      "Playable interactive regional instruments simulated with authentic Pelog & Slendro tuning scales.",
    "3d.houses_btn": "Explore 38 Houses",
    "3d.instruments_btn": "Play 38 Instruments",
    "3d.tip_house":
      "Tip: Rotate, pan, and zoom the 3D model to examine timber joinery and tiered roof construction.",
    "3d.tip_instrument":
      "Tip: Tap the key bars below or swipe over the 3D model to trigger acoustic resonance.",
    "3d.badge_interactive": "Interactive 3D • 360°",
    "3d.badge_audio": "Interactive 3D • Web Audio",

    // Asisten & Aksesibilitas
    "chat.ask_ai": "Ask AI",
    "chat.title": "WaraNusa AI Assistant",
    "a11y.title": "Accessibility Menu",

    // Footer
    "footer.tagline":
      "Platform for exploring & preserving Indonesian cultural heritage — interactive maps, sourced catalog, 3D models, and virtual instruments.",
    "footer.explore_title": "Explore",
    "footer.contribute_title": "Get Involved",
    "footer.contribute_action": "Submit Documentation",
    "footer.login_action": "Curator Portal",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["ID"];

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

export const useTranslation = create<I18nState>()(
  persist(
    (set, get) => ({
      language: "ID",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "ID" ? "EN" : "ID" })),
      t: (key, fallback) => {
        const lang = get().language;
        const dict = TRANSLATIONS[lang] as Record<string, string>;
        if (dict && dict[key]) {
          return dict[key];
        }
        // Fallback ke bahasa Indonesia jika belum ada terjemahan
        const idDict = TRANSLATIONS.ID as Record<string, string>;
        if (idDict && idDict[key]) {
          return idDict[key];
        }
        return fallback ?? key;
      },
    }),
    {
      name: "waranusa_language_preference",
    }
  )
);
