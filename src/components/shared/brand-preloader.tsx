"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

interface BrandPreloaderProps {
  onComplete?: () => void;
  minDuration?: number; // durasi minimal dalam milidetik (default 2100ms)
}

export function BrandPreloader({
  onComplete,
  minDuration = 2100,
}: BrandPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Jalankan progress bar secara mulus
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(pInterval);
          return 100;
        }
        // akselerasi progress
        const step = Math.max(2, Math.floor((100 - prev) * 0.18));
        return Math.min(100, prev + step);
      });
    }, 60);

    // Timer penutupan otomatis
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        dismiss();
      }, 350);
    }, minDuration);

    return () => {
      clearInterval(pInterval);
      clearTimeout(timer);
    };
  }, [minDuration]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem("waranusa_intro_seen", "true");
    } catch {}
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="waranusa-brand-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(4px)",
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#140B06] via-[#24130A] to-[#120804] px-4 text-white select-none"
          role="status"
          aria-live="polite"
          aria-label="Memuat WaraNusa"
        >
          {/* Tombol Lewati di pojok kanan atas */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={dismiss}
            className="absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-xs font-semibold text-stone-300 backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Lewati animasi pembuka"
          >
            <span>Lewati</span>
            <X className="h-3.5 w-3.5 text-stone-400" />
          </motion.button>

          {/* Latar Belakang: Pendaran Aura Emas Berdenyut */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
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

            {/* Lingkaran Garis Geometris Halus */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute h-72 w-72 rounded-full border border-[#D4AF37]/30"
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute h-84 w-84 rounded-full border border-dashed border-[#D4AF37]/25"
            />
          </div>

          {/* Konten Utama Animasi */}
          <div className="relative z-10 flex flex-col items-center text-center">
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
                className="h-28 w-auto sm:h-32 object-contain drop-shadow-[0_12px_35px_rgba(212,175,55,0.45)]"
              />

              {/* Kilauan Partikel Halus */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] }}
                transition={{ delay: 0.6, duration: 1.2, repeat: Infinity }}
                className="absolute -top-1 -right-1 text-[#FDE047]"
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
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
                transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-3xl sm:text-4xl font-extrabold tracking-widest text-[#FCF8EC] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                WARANUSA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="mt-2 text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-[#E6DDD4]/90"
              >
                Pelestarian Budaya Nusantara
              </motion.p>
            </motion.div>

            {/* Garis Indikator Loading Emas */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="relative h-1 w-44 sm:w-56 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#8C5E3C] via-[#D4AF37] to-[#FDE047]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
                className="font-mono text-[10px] tracking-wider text-stone-400"
              >
                MEMUAT {progress}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
