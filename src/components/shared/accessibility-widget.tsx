"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCcw,
  Volume2,
  Contrast,
  Pause,
  MousePointer2,
  Link2,
  MoveVertical,
  AlignLeft,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface A11yState {
  fontScale: number; // 90, 100, 110, 120, 130
  highContrast: boolean;
  dyslexicFont: boolean;
  pauseAnimations: boolean;
  largeCursor: boolean;
  underlineLinks: boolean;
  lineHeight: boolean;
  textAlignLeft: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontScale: 100,
  highContrast: false,
  dyslexicFont: false,
  pauseAnimations: false,
  largeCursor: false,
  underlineLinks: false,
  lineHeight: false,
  textAlignLeft: false,
};

const STORAGE_KEY = "waranusa_a11y_prefs_v2";

/**
 * Ikon Universal Aksesibilitas Manusia dalam Lingkaran (Khas Emblem A11y)
 */
function AccessibilityIcon({ className = "w-5 h-5 text-amber-400" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="m8 10 4 1 4-1" />
      <path d="M12 11v5" />
      <path d="m9 20 3-4 3 4" />
    </svg>
  );
}

/**
 * Ikon A+ untuk Increase Text
 */
function APlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M4 19L9.5 5L15 19" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 14H13" strokeLinecap="round" />
      <path d="M18 9V15" strokeLinecap="round" />
      <path d="M15 12H21" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Ikon A- untuk Decrease Text
 */
function AMinusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M4 19L9.5 5L15 19" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 14H13" strokeLinecap="round" />
      <path d="M16 12H22" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Ikon T Serif untuk Dyslexic Font
 */
function DyslexicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 5H18" strokeLinecap="round" />
      <path d="M12 5V19" strokeLinecap="round" />
      <path d="M9 19H15" strokeLinecap="round" />
    </svg>
  );
}

export function AccessibilityWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Terapkan semua class ke elemen root HTML
  const applyDOMState = (s: A11yState) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // 1. Font scale
    root.classList.remove(
      "font-scale-90",
      "font-scale-100",
      "font-scale-110",
      "font-scale-120",
      "font-scale-130"
    );
    root.classList.add(`font-scale-${s.fontScale}`);

    // 2. High contrast
    if (s.highContrast) root.classList.add("high-contrast");
    else root.classList.remove("high-contrast");

    // 3. Dyslexic font
    if (s.dyslexicFont) root.classList.add("dyslexic-font");
    else root.classList.remove("dyslexic-font");

    // 4. Pause animations
    if (s.pauseAnimations) root.classList.add("pause-animations");
    else root.classList.remove("pause-animations");

    // 5. Large cursor
    if (s.largeCursor) root.classList.add("large-cursor");
    else root.classList.remove("large-cursor");

    // 6. Underline links
    if (s.underlineLinks) root.classList.add("underline-links");
    else root.classList.remove("underline-links");

    // 7. Line height
    if (s.lineHeight) root.classList.add("line-height-expanded");
    else root.classList.remove("line-height-expanded");

    // 8. Text align
    if (s.textAlignLeft) root.classList.add("text-align-left");
    else root.classList.remove("text-align-left");
  };

  const updateState = (updater: (prev: A11yState) => A11yState) => {
    setState((prev) => {
      const next = updater(prev);
      applyDOMState(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Abaikan bila storage penuh
      }
      return next;
    });
  };

  // Muat setelan saat mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<A11yState>;
        const merged: A11yState = { ...DEFAULT_STATE, ...parsed };
        setState(merged);
        applyDOMState(merged);
      }
    } catch {
      // noop
    }
  }, []);

  // Tutup popover saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Hentikan suara saat unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ================= AKSESOR FITUR =================

  // 1. Voice Mode (Web Speech API TTS)
  const toggleVoiceMode = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const mainEl = document.querySelector("main") || document.querySelector("article");
    const container = mainEl || document.body;
    const clone = container.cloneNode(true) as HTMLElement;

    const ignoreEls = clone.querySelectorAll(
      "header, nav, footer, script, style, svg, button, [data-a11y-ignore], [aria-hidden='true']"
    );
    ignoreEls.forEach((el) => el.remove());

    const paragraphs = clone.querySelectorAll("h1, h2, h3, h4, p, li");
    const textPieces: string[] = [];
    paragraphs.forEach((el) => {
      const t = el.textContent?.trim();
      if (t && t.length > 2) textPieces.push(t);
    });

    const readableText = textPieces.length > 0 ? textPieces.join(". ") : clone.innerText?.trim() || "";
    if (!readableText) return;

    const utterance = new SpeechSynthesisUtterance(readableText);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes("id") ||
        v.name.toLowerCase().includes("indonesia") ||
        v.lang === "id-ID"
    );
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // 2. Increase Text
  const handleIncreaseText = () => {
    updateState((prev) => ({
      ...prev,
      fontScale: Math.min(130, prev.fontScale + 10),
    }));
  };

  // 3. Decrease Text
  const handleDecreaseText = () => {
    updateState((prev) => ({
      ...prev,
      fontScale: Math.max(90, prev.fontScale - 10),
    }));
  };

  // 4. High Contrast
  const handleToggleHighContrast = () => {
    updateState((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  // 5. Dyslexic Font
  const handleToggleDyslexic = () => {
    updateState((prev) => ({ ...prev, dyslexicFont: !prev.dyslexicFont }));
  };

  // 6. Pause Animations
  const handleToggleAnimations = () => {
    updateState((prev) => ({ ...prev, pauseAnimations: !prev.pauseAnimations }));
  };

  // 7. Large Cursor
  const handleToggleCursor = () => {
    updateState((prev) => ({ ...prev, largeCursor: !prev.largeCursor }));
  };

  // 8. Underline Links
  const handleToggleUnderline = () => {
    updateState((prev) => ({ ...prev, underlineLinks: !prev.underlineLinks }));
  };

  // 9. Line Height
  const handleToggleLineHeight = () => {
    updateState((prev) => ({ ...prev, lineHeight: !prev.lineHeight }));
  };

  // 10. Text Align
  const handleToggleTextAlign = () => {
    updateState((prev) => ({ ...prev, textAlignLeft: !prev.textAlignLeft }));
  };

  // Reset
  const handleReset = () => {
    setState(DEFAULT_STATE);
    applyDOMState(DEFAULT_STATE);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  };

  const hasAnyActive =
    state.fontScale !== 100 ||
    state.highContrast ||
    state.dyslexicFont ||
    state.pauseAnimations ||
    state.largeCursor ||
    state.underlineLinks ||
    state.lineHeight ||
    state.textAlignLeft ||
    isSpeaking;

  if (!mounted) return null;

  return (
    <div data-a11y-ignore className="select-none">
      {/* ================= FLOATING TRIGGER BUTTON (Pojok Kiri Bawah - Agak Gede) ================= */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9999]",
          "group flex items-center justify-center",
          "w-14 h-14 sm:w-16 sm:h-16 rounded-full",
          "bg-gradient-to-br from-[#2D1E12] via-[#3D2817] to-[#1F140C]",
          "border-2 border-[#D4AF37] hover:border-[#FDE047]",
          "shadow-[0_8px_25px_rgba(45,30,18,0.5),0_0_16px_rgba(212,175,55,0.35)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.6)]",
          "transition-all duration-300 transform hover:scale-105 active:scale-95",
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
        )}
        aria-label="Buka Menu Aksesibilitas Ramah Difabel"
        title="Menu Aksesibilitas (Ramah Difabel)"
      >
        <AccessibilityIcon className="w-8 h-8 sm:w-9 sm:h-9 text-[#FDE047] pointer-events-none transition-transform duration-300 group-hover:scale-110" />

        {/* Badge pendar aktif */}
        {hasAnyActive && (
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border border-[#2D1E12]"></span>
          </span>
        )}
      </button>

      {/* ================= POPOVER PANEL AKSESIBILITAS ================= */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Panel Kontrol Aksesibilitas"
          className={cn(
            "fixed bottom-22 sm:bottom-26 left-3 right-3 sm:left-6 sm:right-auto z-[9999]",
            "w-auto sm:w-[380px] max-w-[calc(100vw-1.5rem)] rounded-[24px] sm:rounded-[28px] overflow-hidden",
            "max-h-[82vh] overflow-y-auto",
            "bg-white shadow-[0_25px_60px_rgba(45,30,18,0.35),0_0_20px_rgba(0,0,0,0.08)]",
            "border border-stone-200/90",
            "animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans"
          )}
        >
          {/* ============ 1. HEADER PANEL ============ */}
          <div className="bg-gradient-to-r from-[#2D1E12] via-[#482D19] to-[#2D1E12] px-3.5 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between text-white">
            {/* Sisi Kiri: Ikon + Judul */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                <AccessibilityIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDE047]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#FDF8EE] leading-none">
                  Aksesibilitas
                </h2>
                <p className="text-[11px] text-amber-200/80 mt-1 leading-none font-normal">
                  Kenyamanan membaca & interaksi
                </p>
              </div>
            </div>

            {/* Sisi Kanan: Reset & Close */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan semua setelan ke bawaan"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup panel aksesibilitas"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ============ 2. GRID 10 KONTROL (EARTHY NUSANTARA & BAHASA INDONESIA) ============ */}
          <div className="p-2.5 sm:p-3.5 bg-[#FAF7F2] grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* 1. Baca Layar (Voice Mode TTS) */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                isSpeaking
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSpeaking ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", isSpeaking ? "text-[#8C5E3C]" : "text-stone-800")}>
                Baca<br />Layar
              </span>
            </button>

            {/* 2. Perbesar Teks */}
            <button
              type="button"
              onClick={handleIncreaseText}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.fontScale > 100
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.fontScale > 100 ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <APlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.fontScale > 100 ? "text-[#8C5E3C]" : "text-stone-800")}>
                Perbesar<br />Teks
              </span>
            </button>

            {/* 3. Perkecil Teks */}
            <button
              type="button"
              onClick={handleDecreaseText}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.fontScale < 100
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.fontScale < 100 ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <AMinusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.fontScale < 100 ? "text-[#8C5E3C]" : "text-stone-800")}>
                Perkecil<br />Teks
              </span>
            </button>

            {/* 4. Kontras Tinggi */}
            <button
              type="button"
              onClick={handleToggleHighContrast}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.highContrast
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.highContrast ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <Contrast className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.highContrast ? "text-[#8C5E3C]" : "text-stone-800")}>
                Kontras<br />Tinggi
              </span>
            </button>

            {/* 5. Font Disleksia */}
            <button
              type="button"
              onClick={handleToggleDyslexic}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.dyslexicFont
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.dyslexicFont ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <DyslexicIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.dyslexicFont ? "text-[#8C5E3C]" : "text-stone-800")}>
                Font<br />Disleksia
              </span>
            </button>

            {/* 6. Jeda Animasi */}
            <button
              type="button"
              onClick={handleToggleAnimations}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.pauseAnimations
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.pauseAnimations ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.pauseAnimations ? "text-[#8C5E3C]" : "text-stone-800")}>
                Jeda<br />Animasi
              </span>
            </button>

            {/* 7. Kursor Besar */}
            <button
              type="button"
              onClick={handleToggleCursor}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.largeCursor
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.largeCursor ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <MousePointer2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.largeCursor ? "text-[#8C5E3C]" : "text-stone-800")}>
                Kursor<br />Besar
              </span>
            </button>

            {/* 8. Garis Tautan */}
            <button
              type="button"
              onClick={handleToggleUnderline}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.underlineLinks
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.underlineLinks ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.underlineLinks ? "text-[#8C5E3C]" : "text-stone-800")}>
                Garis<br />Tautan
              </span>
            </button>

            {/* 9. Jarak Baris */}
            <button
              type="button"
              onClick={handleToggleLineHeight}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.lineHeight
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.lineHeight ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <MoveVertical className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.lineHeight ? "text-[#8C5E3C]" : "text-stone-800")}>
                Jarak<br />Baris
              </span>
            </button>

            {/* 10. Rata Kiri */}
            <button
              type="button"
              onClick={handleToggleTextAlign}
              className={cn(
                "p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-150 cursor-pointer text-left",
                state.textAlignLeft
                  ? "bg-amber-50/80 border-2 border-[#8C5E3C] shadow-xs"
                  : "bg-white border border-stone-200/90 hover:border-[#8C5E3C] hover:bg-[#FFFDF9] hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.textAlignLeft ? "bg-[#8C5E3C] text-white shadow-xs" : "bg-amber-100/70 text-[#8C5E3C]"
                )}
              >
                <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.textAlignLeft ? "text-[#8C5E3C]" : "text-stone-800")}>
                Rata<br />Kiri
              </span>
            </button>
          </div>

          {/* ============ 3. FOOTER PANEL ============ */}
          <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">
              Pengaturan tersimpan otomatis di perangkat
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
