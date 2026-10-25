"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface A11yState {
  fontStep: number; // 0 (100%), 1 (110%), 2 (120%), 3 (130%), 4 (140%)
  lineHeightStep: number; // 0 (Normal 1.0X), 1 (1.5X), 2 (1.75X), 3 (2.0X)
  letterSpacingStep: number; // 0 (Normal), 1 (Ringan), 2 (Sedang), 3 (Luas)
  contrastStep: number; // 0 (Normal), 1 (Kontras Tinggi), 2 (Saturasi Rendah), 3 (Balikan Warna)
  dyslexicFont: boolean;
  pauseAnimations: boolean;
  largeCursor: boolean;
  underlineLinks: boolean;
  textAlignLeft: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontStep: 0,
  lineHeightStep: 0,
  letterSpacingStep: 0,
  contrastStep: 0,
  dyslexicFont: false,
  pauseAnimations: false,
  largeCursor: false,
  underlineLinks: false,
  textAlignLeft: false,
};

const STORAGE_KEY = "waranusa_a11y_prefs_v3";

// =========================================================================
// IKON-IKON AKSESIBILITAS MODEREN SESUAI REFERENSI VISUAL (USERWAY / A11Y)
// =========================================================================

/** Ikon Utama Aksesibilitas Manusia Universal */
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

/** Ikon TT untuk Perbesar Teks */
function TTIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <path d="M3 6H13M8 6V19" />
      <path d="M14 10H21M17.5 10V19" strokeWidth="2" />
    </svg>
  );
}

/** Ikon Gelombang Suara (Mode Suara / TTS) */
function VoiceWaveIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <path d="M4 10V14" />
      <path d="M8 7V17" />
      <path d="M12 4V20" />
      <path d="M16 7V17" />
      <path d="M20 10V14" />
    </svg>
  );
}

/** Ikon Tinggi Garis (Panah Vertikal Berdamping Garis) */
function LineHeightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4L2.5 7.5H7.5L5 4Z" fill="currentColor" />
      <path d="M5 20L2.5 16.5H7.5L5 20Z" fill="currentColor" />
      <path d="M5 7V17" />
      <path d="M12 6H21" />
      <path d="M12 12H21" />
      <path d="M12 18H21" />
    </svg>
  );
}

/** Ikon Spasi Huruf (Huruf T dengan Panah Kiri-Kanan) */
function LetterSpacingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 5H16M12 5V15" />
      <path d="M3 19L5.5 16.5V21.5L3 19Z" fill="currentColor" />
      <path d="M21 19L18.5 16.5V21.5L21 19Z" fill="currentColor" />
      <path d="M5 19H19" />
    </svg>
  );
}

/** Ikon Kontras / Saturasi / Balikan Warna */
function ContrastIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3V21" />
      <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/** Ikon Df untuk Ramah Disleksia */
function DyslexicDfIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <text x="3" y="17" fontSize="16" fontFamily="sans-serif" fontWeight="900" fill="currentColor" stroke="none">
        Df
      </text>
    </svg>
  );
}

/** Ikon Jeda Animasi */
function PauseAnimIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
      <path d="M10 8V16M14 8V16" strokeWidth="2.5" />
    </svg>
  );
}

/** Ikon Kursor Besar */
function CursorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M4 3L4 18L8.5 14L13.5 21L16 19.5L11 12.5L17 12L4 3Z" />
    </svg>
  );
}

/** Ikon Garis Bawahi Tautan */
function UnderlineLinkIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <path d="M7 4V10C7 12.7614 9.23858 15 12 15C14.7614 15 17 12.7614 17 10V4" />
      <path d="M5 20H19" strokeWidth="2.5" />
    </svg>
  );
}

/** Ikon Rata Kiri */
function AlignLeftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={className}>
      <path d="M4 6H20" />
      <path d="M4 11H14" />
      <path d="M4 16H18" />
      <path d="M4 21H10" />
    </svg>
  );
}

// =========================================================================
// KOMPONEN INDIKATOR BATANG TINGKAT ("UKURAN" SESUAI REFERENSI FOTO)
// =========================================================================
function StepIndicator({
  total = 3,
  current = 0,
}: {
  total?: number;
  current?: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 w-full">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i < current;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              isActive
                ? "w-4 sm:w-5 bg-[#6E472D] shadow-xs"
                : "w-2.5 sm:w-3 bg-stone-300/80"
            )}
          />
        );
      })}
    </div>
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

    // 1. Font scale (0 -> 100%, 1 -> 110%, 2 -> 120%, 3 -> 130%, 4 -> 140%)
    root.classList.remove(
      "font-scale-90",
      "font-scale-100",
      "font-scale-110",
      "font-scale-120",
      "font-scale-130",
      "font-scale-140"
    );
    const fontScales = [100, 110, 120, 130, 140];
    const scale = fontScales[s.fontStep] ?? 100;
    root.classList.add(`font-scale-${scale}`);

    // 2. Line height
    root.classList.remove(
      "line-height-1",
      "line-height-2",
      "line-height-3",
      "line-height-expanded"
    );
    if (s.lineHeightStep === 1) root.classList.add("line-height-1");
    else if (s.lineHeightStep === 2) root.classList.add("line-height-2");
    else if (s.lineHeightStep === 3) root.classList.add("line-height-3");

    // 3. Letter spacing
    root.classList.remove(
      "letter-spacing-1",
      "letter-spacing-2",
      "letter-spacing-3"
    );
    if (s.letterSpacingStep === 1) root.classList.add("letter-spacing-1");
    else if (s.letterSpacingStep === 2) root.classList.add("letter-spacing-2");
    else if (s.letterSpacingStep === 3) root.classList.add("letter-spacing-3");

    // 4. Contrast & Color Mode (0: Normal, 1: High Contrast, 2: Low Saturation, 3: Invert)
    root.classList.remove("high-contrast", "low-saturation", "invert-colors");
    if (s.contrastStep === 1) root.classList.add("high-contrast");
    else if (s.contrastStep === 2) root.classList.add("low-saturation");
    else if (s.contrastStep === 3) root.classList.add("invert-colors");

    // 5. Dyslexic font
    if (s.dyslexicFont) root.classList.add("dyslexic-font");
    else root.classList.remove("dyslexic-font");

    // 6. Pause animations
    if (s.pauseAnimations) root.classList.add("pause-animations");
    else root.classList.remove("pause-animations");

    // 7. Large cursor
    if (s.largeCursor) root.classList.add("large-cursor");
    else root.classList.remove("large-cursor");

    // 8. Underline links
    if (s.underlineLinks) root.classList.add("underline-links");
    else root.classList.remove("underline-links");

    // 9. Text align left
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

  // ================= HANDLERS FITUR BERTINGKAT ("UKURAN") =================

  // 1. Mode Suara (Web Speech API TTS)
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

    const readableText =
      textPieces.length > 0 ? textPieces.join(". ") : clone.innerText?.trim() || "";
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

  // 2. Siklus Perbesar Teks (4 Tahap: 100% -> 110% -> 120% -> 130% -> 140% -> Reset)
  const handleCycleFont = () => {
    updateState((prev) => ({
      ...prev,
      fontStep: (prev.fontStep + 1) % 5,
    }));
  };

  // 3. Siklus Tinggi Garis (3 Tahap: Normal -> 1.5X -> 1.75X -> 2.0X -> Reset)
  const handleCycleLineHeight = () => {
    updateState((prev) => ({
      ...prev,
      lineHeightStep: (prev.lineHeightStep + 1) % 4,
    }));
  };

  // 4. Siklus Spasi Huruf (3 Tahap: Normal -> Ringan -> Sedang -> Luas -> Reset)
  const handleCycleLetterSpacing = () => {
    updateState((prev) => ({
      ...prev,
      letterSpacingStep: (prev.letterSpacingStep + 1) % 4,
    }));
  };

  // 5. Siklus Warna & Kontras (3 Tahap: Normal -> Kontras Tinggi -> Saturasi Rendah -> Balikan Warna -> Reset)
  const handleCycleContrast = () => {
    updateState((prev) => ({
      ...prev,
      contrastStep: (prev.contrastStep + 1) % 4,
    }));
  };

  // 6. Ramah Disleksia (Toggle)
  const handleToggleDyslexic = () => {
    updateState((prev) => ({ ...prev, dyslexicFont: !prev.dyslexicFont }));
  };

  // 7. Jeda Animasi (Toggle)
  const handleToggleAnimations = () => {
    updateState((prev) => ({ ...prev, pauseAnimations: !prev.pauseAnimations }));
  };

  // 8. Kursor Besar (Toggle)
  const handleToggleCursor = () => {
    updateState((prev) => ({ ...prev, largeCursor: !prev.largeCursor }));
  };

  // 9. Garis Bawahi Tautan (Toggle)
  const handleToggleUnderline = () => {
    updateState((prev) => ({ ...prev, underlineLinks: !prev.underlineLinks }));
  };

  // 10. Rata Kiri Teks (Toggle)
  const handleToggleTextAlign = () => {
    updateState((prev) => ({ ...prev, textAlignLeft: !prev.textAlignLeft }));
  };

  // Reset Semua Pengaturan
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
    state.fontStep > 0 ||
    state.lineHeightStep > 0 ||
    state.letterSpacingStep > 0 ||
    state.contrastStep > 0 ||
    state.dyslexicFont ||
    state.pauseAnimations ||
    state.largeCursor ||
    state.underlineLinks ||
    state.textAlignLeft ||
    isSpeaking;

  if (!mounted) return null;

  // Nilai teks dinamis untuk sublabel
  const fontPercentLabels = ["Normal", "110%", "120%", "130%", "140%"];
  const lineHeightLabels = ["Normal", "1.5X", "1.75X", "2.0X"];
  const letterSpacingLabels = ["Normal", "Ringan", "Sedang", "Luas"];
  const contrastLabels = ["Normal", "Kontras", "Monokrom", "Invert"];

  return (
    <div data-a11y-ignore className="select-none">
      {/* ================= FLOATING TRIGGER BUTTON (Pojok Kiri Bawah) ================= */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "!fixed bottom-4 left-4 sm:bottom-8 sm:left-8 md:left-14 z-[9999]",
          "group flex items-center justify-center",
          "w-12 h-12 sm:w-16 sm:h-16 rounded-full",
          "btn-waranusa",
          "shadow-[0_8px_24px_rgba(45,30,18,0.38)] hover:shadow-[0_14px_36px_rgba(45,30,18,0.5)]",
          "backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95",
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C5E3C]/50"
        )}
        aria-label="Buka Menu Aksesibilitas Ramah Difabel"
        title="Menu Aksesibilitas (Ramah Difabel)"
      >
        <AccessibilityIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white pointer-events-none transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />

        {/* Badge pendar aktif (Kuning Emas Nusantara) */}
        {hasAnyActive && (
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-amber-400 border border-[#533019]"></span>
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
            "fixed bottom-24 sm:bottom-28 left-4 right-4 sm:left-12 md:left-14 sm:right-auto z-[9999]",
            "w-auto sm:w-[410px] max-w-[calc(100vw-2rem)] rounded-[24px] sm:rounded-[28px] overflow-hidden",
            "max-h-[82vh] overflow-y-auto",
            "bg-[#FAF7F2] shadow-[0_24px_60px_rgba(45,30,18,0.25)]",
            "border border-stone-300/80",
            "animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans"
          )}
        >
          {/* ============ 1. HEADER PANEL ============ */}
          <div className="btn-waranusa px-4 py-3.5 flex items-center justify-between text-white border-b border-white/10">
            {/* Sisi Kiri: Ikon + Judul */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <AccessibilityIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FAF6F0]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#FAF6F0] leading-none">
                  Aksesibilitas
                </h2>
                <p className="text-[11px] text-[#E6DDD4]/90 mt-1 leading-none font-normal">
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

          {/* ============ 2. GRID KONTROL BER-INDIKATOR TINGKAT ("UKURAN") ============ */}
          <div className="p-3 sm:p-3.5 bg-[#FAF7F2] grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* 1. Mode Suara (TTS) */}
            <button
              type="button"
              onClick={toggleVoiceMode}
              aria-label="Baca teks halaman dengan sintesis suara"
              aria-pressed={isSpeaking}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                isSpeaking
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSpeaking ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <VoiceWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", isSpeaking ? "text-[#6E472D]" : "text-stone-800")}>
                  Mode Suara
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {isSpeaking ? "Membaca..." : "Nonaktif"}
                </span>
              </div>
              <StepIndicator total={2} current={isSpeaking ? 2 : 0} />
            </button>

            {/* 2. Perbesar Teks (4 Ukuran / Steps) */}
            <button
              type="button"
              onClick={handleCycleFont}
              aria-label={`Perbesar ukuran teks (aktif: ${fontPercentLabels[state.fontStep]})`}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.fontStep > 0
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.fontStep > 0 ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <TTIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.fontStep > 0 ? "text-[#6E472D]" : "text-stone-800")}>
                  Perbesar Teks
                </span>
                <span className={cn("text-[10px] font-semibold mt-0.5", state.fontStep > 0 ? "text-[#6E472D]" : "text-stone-500")}>
                  {fontPercentLabels[state.fontStep]}
                </span>
              </div>
              <StepIndicator total={4} current={state.fontStep} />
            </button>

            {/* 3. Tinggi Garis (3 Ukuran / Steps) */}
            <button
              type="button"
              onClick={handleCycleLineHeight}
              aria-label={`Sesuaikan jarak antar baris teks (aktif: ${lineHeightLabels[state.lineHeightStep]})`}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.lineHeightStep > 0
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.lineHeightStep > 0 ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <LineHeightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.lineHeightStep > 0 ? "text-[#6E472D]" : "text-stone-800")}>
                  Tinggi Garis
                </span>
                <span className={cn("text-[10px] font-semibold mt-0.5", state.lineHeightStep > 0 ? "text-[#6E472D]" : "text-stone-500")}>
                  {lineHeightLabels[state.lineHeightStep]}
                </span>
              </div>
              <StepIndicator total={3} current={state.lineHeightStep} />
            </button>

            {/* 4. Spasi Huruf (3 Ukuran / Steps) */}
            <button
              type="button"
              onClick={handleCycleLetterSpacing}
              aria-label={`Sesuaikan spasi antar huruf (aktif: ${letterSpacingLabels[state.letterSpacingStep]})`}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.letterSpacingStep > 0
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.letterSpacingStep > 0 ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <LetterSpacingIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.letterSpacingStep > 0 ? "text-[#6E472D]" : "text-stone-800")}>
                  Spasi Huruf
                </span>
                <span className={cn("text-[10px] font-semibold mt-0.5", state.letterSpacingStep > 0 ? "text-[#6E472D]" : "text-stone-500")}>
                  {letterSpacingLabels[state.letterSpacingStep]}
                </span>
              </div>
              <StepIndicator total={3} current={state.letterSpacingStep} />
            </button>

            {/* 5. Warna & Kontras (3 Ukuran / Mode) */}
            <button
              type="button"
              onClick={handleCycleContrast}
              aria-label={`Ganti mode kontras dan warna (aktif: ${contrastLabels[state.contrastStep]})`}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.contrastStep > 0
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.contrastStep > 0 ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <ContrastIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.contrastStep > 0 ? "text-[#6E472D]" : "text-stone-800")}>
                  Kontras &amp; Warna
                </span>
                <span className={cn("text-[10px] font-semibold mt-0.5", state.contrastStep > 0 ? "text-[#6E472D]" : "text-stone-500")}>
                  {contrastLabels[state.contrastStep]}
                </span>
              </div>
              <StepIndicator total={3} current={state.contrastStep} />
            </button>

            {/* 6. Ramah Disleksia (Toggle) */}
            <button
              type="button"
              onClick={handleToggleDyslexic}
              aria-label="Ganti ke font khusus disleksia"
              aria-pressed={state.dyslexicFont}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.dyslexicFont
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.dyslexicFont ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <DyslexicDfIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.dyslexicFont ? "text-[#6E472D]" : "text-stone-800")}>
                  Ramah Disleksia
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {state.dyslexicFont ? "Aktif" : "Bawaan"}
                </span>
              </div>
              <StepIndicator total={2} current={state.dyslexicFont ? 2 : 0} />
            </button>

            {/* 7. Jeda Animasi (Toggle) */}
            <button
              type="button"
              onClick={handleToggleAnimations}
              aria-label="Jeda animasi visual di halaman"
              aria-pressed={state.pauseAnimations}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.pauseAnimations
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.pauseAnimations ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <PauseAnimIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.pauseAnimations ? "text-[#6E472D]" : "text-stone-800")}>
                  Jeda Animasi
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {state.pauseAnimations ? "Dijeda" : "Normal"}
                </span>
              </div>
              <StepIndicator total={2} current={state.pauseAnimations ? 2 : 0} />
            </button>

            {/* 8. Kursor Besar (Toggle) */}
            <button
              type="button"
              onClick={handleToggleCursor}
              aria-label="Perbesar ukuran penunjuk kursor mouse"
              aria-pressed={state.largeCursor}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.largeCursor
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.largeCursor ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <CursorIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.largeCursor ? "text-[#6E472D]" : "text-stone-800")}>
                  Kursor Besar
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {state.largeCursor ? "Aktif" : "Standar"}
                </span>
              </div>
              <StepIndicator total={2} current={state.largeCursor ? 2 : 0} />
            </button>

            {/* 9. Garis Bawahi Tautan (Toggle) */}
            <button
              type="button"
              onClick={handleToggleUnderline}
              aria-label="Beri garis bawah pada semua tautan link"
              aria-pressed={state.underlineLinks}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.underlineLinks
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.underlineLinks ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <UnderlineLinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.underlineLinks ? "text-[#6E472D]" : "text-stone-800")}>
                  Garis Tautan
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {state.underlineLinks ? "Aktif" : "Standar"}
                </span>
              </div>
              <StepIndicator total={2} current={state.underlineLinks ? 2 : 0} />
            </button>

            {/* 10. Rata Kiri Teks (Toggle) */}
            <button
              type="button"
              onClick={handleToggleTextAlign}
              aria-label="Ratakan semua teks bacaan ke sisi kiri"
              aria-pressed={state.textAlignLeft}
              className={cn(
                "flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center min-h-[96px]",
                state.textAlignLeft
                  ? "bg-white border-2 border-[#6E472D] shadow-sm ring-2 ring-[#6E472D]/10"
                  : "bg-[#F5EFEB]/90 border border-stone-200/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  state.textAlignLeft ? "bg-[#6E472D] text-white shadow-xs" : "bg-[#EAE2D8] text-[#6E472D]"
                )}
              >
                <AlignLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-1 flex flex-col items-center">
                <span className={cn("font-bold text-xs sm:text-[13px] leading-tight", state.textAlignLeft ? "text-[#6E472D]" : "text-stone-800")}>
                  Rata Kiri
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {state.textAlignLeft ? "Aktif" : "Standar"}
                </span>
              </div>
              <StepIndicator total={2} current={state.textAlignLeft ? 2 : 0} />
            </button>
          </div>

          {/* ============ 3. FOOTER STATUS TERKUNCI ============ */}
          <div className="px-3.5 py-2.5 bg-[#FAF6EE] border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>Pengaturan tersimpan otomatis di perangkat</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
