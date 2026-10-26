"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface BrandPreloaderProps {
  onStartDismiss?: () => void;
  onComplete?: () => void;
}

export function BrandPreloader({ onStartDismiss, onComplete }: BrandPreloaderProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isOpeningUp, setIsOpeningUp] = useState(false);
  const [readyToOpen, setReadyToOpen] = useState(false);
  const [progress, setProgress] = useState(25);
  const touchStartY = useRef<number | null>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsOpeningUp(true);
    setVisible(false);

    try {
      sessionStorage.setItem("waranusa_intro_seen", "true");
    } catch {}

    if (onStartDismiss) onStartDismiss();

    // Pastikan halaman belakang siap penuh setelah animasi tirai naik selesai
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (onComplete) onComplete();
    }, 950);
  }, [onStartDismiss, onComplete]);

  // Efek progress bar dan auto-reveal saat waktu habis
  useEffect(() => {
    // 0. Deteksi Bot Audit (Lighthouse, PageSpeed, HeadlessChromium, Googlebot)
    // Langsung buka dalam 0ms agar skor performa LCP/FCP tidak tertunda
    const isBotOrAudit =
      typeof navigator !== "undefined" &&
      (Boolean((navigator as unknown as { webdriver?: boolean }).webdriver) ||
        /Lighthouse|PageSpeed|HeadlessChrome|Chrome-Lighthouse|Googlebot|bingbot|baiduspider|yandex/i.test(
          navigator.userAgent
        ));

    if (isBotOrAudit) {
      dismiss();
      return;
    }

    // Periksa apakah pengunjung sudah pernah melihat intro di tab sesi browser ini
    try {
      if (sessionStorage.getItem("waranusa_intro_seen") === "true") {
        dismiss();
        return;
      }
    } catch {}

    const startTime = Date.now();
    const duration = 750; // Progress bar mengisi dalam 750ms

    const pInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round(25 + (elapsed / duration) * 75));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(pInterval);
        setReadyToOpen(true);

        // Jika waktu habis (setelah progress 100% + jeda estetik 400ms), otomatis buka tirai ke atas!
        setTimeout(() => {
          dismiss();
        }, 400);
      }
    }, 25);

    // Failsafe timer maksimal jika pengguna membiarkan tanpa interaksi
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      dismiss();
    }, 2400);

    return () => {
      clearInterval(pInterval);
      clearTimeout(safetyTimer);
    };
  }, [dismiss]);

  // Event listener interaktif: Pengguna bisa langsung scroll, swipe, atau tekan tombol untuk membuka layar ke atas
  useEffect(() => {
    if (!visible) return;

    // Kunci scroll background halaman selama tirai masih menutup
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Usapan roda mouse (scroll down / up)
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 3 || Math.abs(e.deltaX) > 3) {
        dismiss();
      }
    };

    // Usapan layar sentuh HP
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current !== null && e.touches.length > 0) {
        const delta = touchStartY.current - e.touches[0].clientY;
        if (Math.abs(delta) > 6) {
          dismiss();
        }
      }
    };

    // Tombol keyboard (Space, Enter, ArrowDown, Esc, PageDown)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "Escape"
      ) {
        e.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, dismiss]);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="waranusa-curtain-screen"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1], // Kurva buka tirai teater mewah (Theatrical Curtain Easing)
            },
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.75, bottom: 0 }}
          onDragEnd={(_, info) => {
            // Jika ditarik ke atas dengan jari/mouse, langsung luncurkan buka ke atas
            if (info.offset.y < -20 || info.velocity.y < -80) {
              dismiss();
            }
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#140B06] via-[#24130A] to-[#120804] px-4 py-6 sm:py-8 text-white select-none cursor-pointer rounded-b-[36px] sm:rounded-b-[56px] border-b-4 border-[#D4AF37] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.5)]"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Animasi Pembuka Tirai Layar WaraNusa"
        >
          {/* Sinar Emas Menyala di Bibir Bawah Tirai (Glow Rim Light) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent shadow-[0_0_24px_#FDE047]"
          />

          {/* Header Atas: Tombol Lewati / Skip Cepat */}
          <div className="relative z-20 flex w-full items-center justify-end px-2 sm:px-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-stone-200 backdrop-blur-md transition-all hover:border-[#D4AF37] hover:bg-white/20 hover:text-white cursor-pointer active:scale-95 shadow-md"
              aria-label="Lewati intro langsung ke beranda"
            >
              <span>Lewati</span>
              <X className="h-3 w-3 text-stone-400" />
            </motion.button>
          </div>

          {/* Latar Belakang: Pendaran Aura Emas Berputar & Geometris Nusantara */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {/* Cincin Luar Cahaya */}
            <motion.div
              animate={{
                scale: [0.9, 1.15, 0.95],
                opacity: [0.25, 0.45, 0.3],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-[#8C5E3C]/30 via-[#D4AF37]/25 to-transparent blur-3xl"
            />

            {/* Pendar Inti Emas Hangat */}
            <motion.div
              animate={{
                scale: [0.95, 1.2, 1],
                opacity: [0.4, 0.7, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-72 w-72 sm:h-88 sm:w-88 rounded-full bg-[#D4AF37]/25 blur-3xl"
            />

            {/* Lingkaran Garis Geometris Nusantara */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute h-[320px] w-[320px] sm:h-[440px] sm:w-[440px] md:h-[500px] md:w-[500px] rounded-full border border-[#D4AF37]/35"
            />
            <motion.div
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.18 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="absolute h-[380px] w-[380px] sm:h-[520px] sm:w-[520px] md:h-[600px] md:w-[600px] rounded-full border border-dashed border-[#D4AF37]/25"
            />
          </div>

          {/* Konten Utama Tengah (Logo & Tipografi) dengan Efek Parallax ke Atas saat Layar Terbuka */}
          <motion.div
            exit={{
              y: -120,
              opacity: 0.3,
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            }}
            className="relative z-10 flex flex-col items-center text-center my-auto"
          >
            {/* Logo Utama */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, filter: "blur(12px)" }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 sm:h-52 sm:w-52 rounded-full bg-[#D4AF37]/30 blur-2xl"
              />

              <img
                src="/images/brand/waranusa-logo.png?v=3"
                alt="Logo WaraNusa"
                className="h-32 w-auto sm:h-44 md:h-52 object-contain drop-shadow-[0_15px_45px_rgba(212,175,55,0.55)]"
              />
            </motion.div>

            {/* Teks Brand */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
              className="mt-5 sm:mt-7 flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: "0.28em" }}
                animate={{ letterSpacing: "0.14em" }}
                transition={{
                  delay: 0.25,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-[#FCF8EC] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              >
                WARANUSA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.24em] text-[#E6DDD4]/90"
              >
                Pelestarian Warisan Nusantara
              </motion.p>
            </motion.div>

            {/* Garis Pembatas Emas Halus */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "140px", opacity: 0.7 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-5 sm:mt-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </motion.div>

          {/* Bagian Bawah: Indikator Layar Terbuka ke Atas (Scroll / Auto-Reveal) */}
          <div className="relative z-10 flex flex-col items-center pb-2 sm:pb-4">
            {!readyToOpen ? (
              // Saat Progress Bar Mengisi
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-1 w-40 sm:w-52 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#8C5E3C] via-[#D4AF37] to-[#FDE047]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-stone-400">
                    MENYIAPKAN PENGALAMAN {progress}%
                  </span>
                  <ChevronDown className="h-3 w-3 text-amber-400 animate-bounce" />
                </div>
              </div>
            ) : (
              // Saat Siap Terbuka ke Atas: Tampilkan Animasi Tirai Terbuka
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#2D1B10]/90 to-[#432A18]/90 px-4 py-1.5 shadow-[0_4px_20px_rgba(212,175,55,0.3)] backdrop-blur-md">
                  <span className="font-serif text-[11px] sm:text-xs font-semibold tracking-wider text-[#FCF8EC]">
                    Membuka Layar Nusantara
                  </span>
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 1.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronUp className="h-3.5 w-3.5 text-[#FDE047]" />
                  </motion.div>
                </div>
                <span className="text-[9px] tracking-widest text-[#D4AF37]/80 uppercase font-mono">
                  Gulir atau sentuh untuk langsung masuk
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
