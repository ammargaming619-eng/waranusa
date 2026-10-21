"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

interface BrandPreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function BrandPreloader({ onComplete, minDuration }: BrandPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [readyToScroll, setReadyToScroll] = useState(false);
  const [progress, setProgress] = useState(25);
  const touchStartY = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    try {
      sessionStorage.setItem("waranusa_intro_seen", "true");
    } catch {}
    if (onComplete) onComplete();
  }, [onComplete]);

  // Efek progress bar saat pertama terbuka
  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(pInterval);
          setReadyToScroll(true);
          return 100;
        }
        const step = Math.max(3, Math.floor((100 - prev) * 0.25));
        return Math.min(100, prev + step);
      });
    }, 50);

    return () => clearInterval(pInterval);
  }, []);

  // Event listener untuk scroll, swipe, dan keyboard + Kunci Scroll Background
  useEffect(() => {
    if (!visible) return;

    // Kunci scroll halaman belakang dan tahan di titik 0
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // 1. Mouse Wheel (Scroll) — cegah scrollbar belakang bergeser
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 10) {
        dismiss();
      }
    };

    // 2. Touch (Usapan layar HP ke atas = scroll ke bawah)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current !== null && e.touches.length > 0) {
        const delta = touchStartY.current - e.touches[0].clientY;
        if (delta > 15) {
          e.preventDefault();
          dismiss();
        }
      }
    };

    // 3. Tombol Keyboard (Panah Bawah, PageDown, Spasi, Enter)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.scrollTo(0, 0);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="waranusa-scroll-intro"
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          }}
          onAnimationComplete={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#140B06] via-[#24130A] to-[#120804] px-4 py-8 text-white select-none cursor-pointer"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Animasi Pembuka WaraNusa"
        >
          {/* Header Atas: Tombol Lewati */}
          <div className="relative z-20 flex w-full items-center justify-end px-2 sm:px-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-stone-300 backdrop-blur-md transition-all hover:border-[#D4AF37]/60 hover:bg-white/15 hover:text-white cursor-pointer"
              aria-label="Lewati intro langsung ke beranda"
            >
              <span>Lewati</span>
              <X className="h-3.5 w-3.5 text-stone-400" />
            </motion.button>
          </div>

          {/* Latar Belakang: Pendaran Aura Emas Berputar & Berdenyut */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {/* Cincin Luar Cahaya */}
            <motion.div
              animate={{
                scale: [0.85, 1.15, 0.95],
                opacity: [0.25, 0.45, 0.3],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-96 w-96 rounded-full bg-gradient-to-tr from-[#8C5E3C]/30 via-[#D4AF37]/20 to-transparent blur-3xl"
            />

            {/* Pendar Inti Emas Hangat */}
            <motion.div
              animate={{
                scale: [0.9, 1.2, 1],
                opacity: [0.4, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-64 w-64 rounded-full bg-[#D4AF37]/25 blur-2xl"
            />

            {/* Lingkaran Garis Geometris Nusantara */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.22 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute h-72 w-72 rounded-full border border-[#D4AF37]/35"
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute h-88 w-88 rounded-full border border-dashed border-[#D4AF37]/25"
            />
          </div>

          {/* Konten Utama Tengah (Logo & Tipografi) */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto">
            {/* Logo Utama Muncul Mengembang */}
            <motion.div
              initial={{ scale: 0.65, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <img
                src="/images/brand/waranusa-logo.png?v=2"
                alt="Logo WaraNusa"
                className="h-28 w-auto sm:h-36 object-contain drop-shadow-[0_14px_40px_rgba(212,175,55,0.45)]"
              />
            </motion.div>

            {/* Teks Brand Merekah (Tracking Reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
              className="mt-6 flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: "0.35em" }}
                animate={{ letterSpacing: "0.14em" }}
                transition={{
                  delay: 0.35,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-3xl sm:text-5xl font-extrabold tracking-widest text-[#FCF8EC] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
              >
                WARANUSA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-2 text-xs sm:text-sm font-medium uppercase tracking-[0.24em] text-[#E6DDD4]/90"
              >
                Pelestarian Budaya Nusantara
              </motion.p>
            </motion.div>

            {/* Garis Pembatas Emas Halus */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120px", opacity: 0.6 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </div>

          {/* Bagian Bawah: Indikator Scroll & Aksi Masuk */}
          <div className="relative z-10 flex flex-col items-center pb-2 sm:pb-4">
            {!readyToScroll ? (
              // Saat awal memuat data
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-1 w-44 sm:w-56 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#8C5E3C] via-[#D4AF37] to-[#FDE047]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <span className="font-mono text-[10px] tracking-wider text-stone-400">
                  MENYIAPKAN PENGALAMAN {progress}%
                </span>
              </div>
            ) : (
              // Saat sudah siap: Tampilkan panduan Scroll / Klik
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-3"
              >
                {/* Tombol Interaktif Gulir / Masuk */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#2D1B10]/90 to-[#432A18]/90 px-5 py-2.5 shadow-[0_4px_20px_rgba(212,175,55,0.25)] backdrop-blur-md transition-colors hover:border-[#FDE047]"
                >
                  <span className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#FCF8EC]">
                    Gulir ke Bawah untuk Menjelajah
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className="h-4 w-4 text-[#FDE047]" />
                  </motion.div>
                </motion.div>

                {/* Animasi Ikon Mouse Bergulir */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-8 w-5 items-start justify-center rounded-full border border-stone-400/50 p-1"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1 rounded-full bg-[#D4AF37]"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
