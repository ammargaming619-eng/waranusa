"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pointer, X } from "lucide-react";

interface BrandPreloaderProps {
  onStartDismiss?: () => void;
  onComplete?: () => void;
  minDuration?: number;
}

export function BrandPreloader({ onStartDismiss, onComplete, minDuration }: BrandPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [readyToScroll, setReadyToScroll] = useState(false);
  const [progress, setProgress] = useState(30);
  const touchStartY = useRef<number | null>(null);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    try {
      sessionStorage.setItem("waranusa_intro_seen", "true");
    } catch {}
    if (onStartDismiss) onStartDismiss();
  }, [onStartDismiss]);

  // Efek progress bar yang halus dan pasti selesai dalam waktu maksimal 900ms
  useEffect(() => {
    // Jika sudah pernah melihat intro di sesi ini, langsung buka
    try {
      if (sessionStorage.getItem("waranusa_intro_seen") === "true") {
        dismiss();
        if (onComplete) onComplete();
        return;
      }
    } catch {}

    const startTime = Date.now();
    const duration = 850; // target durasi progress bar

    const pInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round(30 + (elapsed / duration) * 70));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(pInterval);
        setReadyToScroll(true);
      }
    }, 30);

    // Failsafe timer: pastikan dalam 1.2 detik selalu siap scroll / tap, dan maksimal 2.8 detik otomatis lanjut
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setReadyToScroll(true);
    }, 1100);

    const autoContinueTimer = setTimeout(() => {
      dismiss();
    }, 2800);

    return () => {
      clearInterval(pInterval);
      clearTimeout(safetyTimer);
      clearTimeout(autoContinueTimer);
    };
  }, [dismiss, onComplete]);

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
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          }}
          onAnimationComplete={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            if (!visible && onComplete) {
              onComplete();
            }
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#140B06] via-[#24130A] to-[#120804] px-4 py-8 text-white select-none cursor-pointer shadow-[0_35px_90px_rgba(0,0,0,0.95)] border-b-2 border-[#D4AF37]/30"
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
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-[#D4AF37]/80 hover:bg-white/20 hover:text-white cursor-pointer touch-manipulation active:scale-95 shadow-md"
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
                scale: [0.9, 1.25, 1],
                opacity: [0.4, 0.75, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-[#D4AF37]/25 blur-3xl"
            />

            {/* Lingkaran Garis Geometris Nusantara (Diperbesar Sesuai Logo) */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.22 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="absolute h-[340px] w-[340px] sm:h-[460px] sm:w-[460px] md:h-[520px] md:w-[520px] rounded-full border border-[#D4AF37]/35"
            />
            <motion.div
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute h-[420px] w-[420px] sm:h-[560px] sm:w-[560px] md:h-[640px] md:w-[640px] rounded-full border border-dashed border-[#D4AF37]/25"
            />

            {/* Gelombang Kejut Cahaya Emas Merekah saat Logo Muncul Keluar */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0 }}
              animate={{ scale: [0.15, 1.7, 2.4], opacity: [0, 0.75, 0] }}
              transition={{ delay: 0.25, duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute h-72 w-72 rounded-full border-2 border-[#D4AF37]/70 bg-gradient-to-tr from-[#D4AF37]/30 via-[#8C5E3C]/20 to-transparent blur-md"
            />
          </div>

          {/* Konten Utama Tengah (Logo & Tipografi) */}
          <motion.div exit={{ y: -80, opacity: 0.75, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }} className="relative z-10 flex flex-col items-center text-center my-auto">
            {/* Logo Utama: Dari Tidak Ada (Kecil + Blur) Melesat Keluar (Pop & Emerge) */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0, filter: "blur(18px)" }}
              animate={{
                scale: [0.15, 1.08, 1],
                opacity: [0, 1, 1],
                filter: ["blur(18px)", "blur(0px)", "blur(0px)"],
              }}
              transition={{
                delay: 0.22,
                duration: 1.05,
                times: [0, 0.7, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Pendaran Emas di Belakang Logo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 sm:h-64 sm:w-64 rounded-full bg-[#D4AF37]/25 blur-3xl"
              />

              {/* Animasi Mengapung Halus (Floating Physics) Setelah Merekah */}
              <motion.div
                animate={{ y: [-4, 5, -4] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.3 }}
              >
                <img
                  src="/images/brand/waranusa-logo.png?v=2"
                  alt="Logo WaraNusa"
                  className="h-36 w-auto sm:h-48 md:h-56 lg:h-64 object-contain drop-shadow-[0_20px_55px_rgba(212,175,55,0.55)]"
                />
              </motion.div>
            </motion.div>

            {/* Teks Brand Merekah (Tracking Reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: "easeOut" }}
              className="mt-6 sm:mt-8 flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: "0.35em" }}
                animate={{ letterSpacing: "0.14em" }}
                transition={{
                  delay: 0.55,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-widest text-[#FCF8EC] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              >
                WARANUSA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-2 text-xs sm:text-base font-medium uppercase tracking-[0.26em] text-[#E6DDD4]/90"
              >
                Pelestarian Budaya Nusantara
              </motion.p>
            </motion.div>

            {/* Garis Pembatas Emas Halus */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "160px", opacity: 0.7 }}
              transition={{ delay: 0.95, duration: 0.8 }}
              className="mt-6 sm:mt-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </motion.div>

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

                {/* Animasi Ikon Kursor Tangan (Pointer) */}
                <motion.div
                  animate={{ y: [0, 6, 0], scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center pt-1"
                >
                  <Pointer className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4AF37] drop-shadow-[0_2px_12px_rgba(212,175,55,0.6)]" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
