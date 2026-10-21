"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Sampurasun! Saya asisten budaya AI WaraNusa. Tanyakan apa saja tentang warisan tradisi, filosofi arsitektur, atau instrumen musik Nusantara.",
};

interface QuickChip {
  title: string;
  prompt: string;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    title: "Filosofi Rumah Gadang",
    prompt: "Jelaskan filosofi arsitektur Rumah Gadang Minangkabau dan makna atap gonjongnya.",
  },
  {
    title: "Gamelan Saron & Slendro",
    prompt: "Bagaimana cara memainkan Gamelan Saron dan apa perbedaan laras Pelog dan Slendro?",
  },
  {
    title: "Makna Ragam Motif Batik",
    prompt: "Apa filosofi dan makna di balik motif Batik Parang dan Megamendung?",
  },
  {
    title: "Sejarah Kapal Pinisi",
    prompt: "Ceritakan sejarah dan keistimewaan pembuatan perahu Pinisi Bugis-Makassar.",
  },
];

const CHAT_STORAGE_KEY = "waranusa_assistant_messages";

// ============================================================================
// 1. EMBLEM KECIL GUNUNGAN AI UNTUK SIDE DOCKED TAB & HEADER
// ============================================================================

function WaranusaAIEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-10 h-10 select-none shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="waranusaAIGoldPlate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#996E14" />
          <stop offset="100%" stopColor="#4D3605" />
        </radialGradient>
      </defs>

      {/* Piringan Luar Emas Nusantara */}
      <circle cx="50" cy="50" r="48" fill="url(#waranusaAIGoldPlate)" stroke="#2B1E05" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />

      {/* Piringan Dalam Gelap Elegan */}
      <circle cx="50" cy="50" r="32" fill="#2D1E12" stroke="#D4AF37" strokeWidth="1.2" opacity="0.8" />

      {/* Siluet Gunungan AI Kayon Minimalis */}
      <path
        d="M50 24 C52 25, 68 45, 72 58 C75 68, 70 76, 68 78 C65 80, 56 81, 50 81 C44 81, 35 80, 32 78 C30 76, 25 68, 28 58 C32 45, 48 25, 50 24 Z"
        fill="#D4AF37"
        opacity="0.95"
      />
      {/* Batang Pohon Hayat */}
      <path d="M50 80 V48" stroke="#2D1E12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 64 Q58 58 62 61" stroke="#2D1E12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M50 64 Q42 58 38 61" stroke="#2D1E12" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Bintang AI di Puncak */}
      <circle cx="50" cy="24" r="3.5" fill="#FFF" stroke="#D4AF37" strokeWidth="1" />
    </svg>
  );
}

// ============================================================================
// 2. MASKOT KARSA RAMAH (ILUSTRASI ANIMASI GUNUNGAN MODERN NUSANTARA)
// ============================================================================

function KarsaMascotIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center select-none py-1", className)}>
      <style>{`
        @keyframes karsaFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes karsaBlink {
          0%, 93%, 100% {
            transform: scaleY(1);
          }
          95%, 97% {
            transform: scaleY(0.08);
          }
        }
        @keyframes karsaTwinkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.88;
          }
          50% {
            transform: scale(1.2) rotate(20deg);
            opacity: 0.95;
            filter: drop-shadow(0 0 4px rgba(212,175,55,0.4));
          }
        }
        @keyframes karsaPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.65;
          }
        }
        .karsa-float-anim {
          animation: karsaFloat 3.2s ease-in-out infinite;
        }
        .karsa-eye-anim {
          transform-origin: 60px 50px;
          animation: karsaBlink 3.8s ease-in-out infinite;
        }
        .karsa-star-anim {
          transform-origin: 60px 12px;
          animation: karsaTwinkle 2.5s ease-in-out infinite;
        }
        .karsa-halo-anim {
          animation: karsaPulse 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* Halo Glow Cahaya Emas Lembut Berdenyut */}
      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/30 to-amber-200/15 blur-xl karsa-halo-anim pointer-events-none" />

      {/* SVG Maskot dengan Animasi Melayang */}
      <svg
        viewBox="0 0 120 120"
        className="w-20 h-20 sm:w-24 sm:h-24 relative drop-shadow-md transition-transform duration-300 hover:scale-110 hover:-rotate-2 cursor-pointer karsa-float-anim"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="karsaGununganGrad" x1="60" y1="10" x2="60" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C48847" />
            <stop offset="50%" stopColor="#8C5E3C" />
            <stop offset="100%" stopColor="#4A2E1B" />
          </linearGradient>
          <radialGradient id="karsaAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D4AF37" />
          </radialGradient>
        </defs>

        {/* Bentuk Dasar Siluet Gunungan Wayang Ramah */}
        <path
          d="M60 12 C62 14, 82 42, 88 64 C94 84, 86 100, 84 104 C80 108, 68 110, 60 110 C52 110, 40 108, 36 104 C34 100, 26 84, 32 64 C38 42, 58 14, 60 12 Z"
          fill="url(#karsaGununganGrad)"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />

        {/* Motif Batang Pohon Hayat Keemasan */}
        <path d="M60 108 V55" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <path d="M60 85 Q72 75 78 80" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M60 85 Q48 75 42 80" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M60 70 Q70 60 74 65" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M60 70 Q50 60 46 65" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* Puncak Mahkota Bintang AI Karsa Berpendar */}
        <g className="karsa-star-anim">
          <circle cx="60" cy="12" r="5" fill="url(#karsaAura)" stroke="#FFF" strokeWidth="1" />
          <path d="M60 5 L61.5 10 L66 11.5 L61.5 13 L60 18 L58.5 13 L54 11.5 L58.5 10 Z" fill="#FFF" />
        </g>

        {/* Mata Ramah Tersenyum dengan Animasi Berkedip */}
        <g className="karsa-eye-anim" fill="#FFF">
          {/* Mata Kiri */}
          <ellipse cx="48" cy="50" rx="4.5" ry="5.5" />
          <circle cx="49.5" cy="48.5" r="1.8" fill="#2D1E12" />
          <circle cx="47" cy="51.5" r="0.9" fill="#FFF" />

          {/* Mata Kanan */}
          <ellipse cx="72" cy="50" rx="4.5" ry="5.5" />
          <circle cx="73.5" cy="48.5" r="1.8" fill="#2D1E12" />
          <circle cx="71" cy="51.5" r="0.9" fill="#FFF" />
        </g>

        {/* Pipi Merona Lembut */}
        <circle cx="42" cy="55" r="3" fill="#F87171" opacity="0.6" />
        <circle cx="78" cy="55" r="3" fill="#F87171" opacity="0.6" />

        {/* Senyuman Ramah */}
        <path d="M53 55 Q60 61 67 55" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: WARANUSA AI ASSISTANT (CHATBOT MURNI DI SISI KANAN)
// ============================================================================

export function UnifiedAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // State Chat
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ---------------- Load Storage on Mount ----------------
  useEffect(() => {
    try {
      const savedChat = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Simpan chat ke sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Tutup panel dengan tombol Escape keyboard
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // ---------------- Chat Handlers ----------------
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("Gagal menerima balasan");

      const data = await res.json();
      const botReply = data.content || "Terima kasih atas pertanyaannya seputar budaya Nusantara.";
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      console.error("[Chat Error]:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Mohon maaf, terjadi kendala saat memproses jawaban. Silakan ajukan pertanyaan kembali.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {}
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* TRIGGER: FLOATING PILL DI MOBILE (KANAN BAWAH), SIDE TAB DI DESKTOP        */}
      {/* ========================================================================= */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            // Di Mobile: Tombol kapsul mengambang empuk di pojok kanan bawah (sejajar dengan tombol aksesibilitas)
            "fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full px-3.5 py-2.5 min-h-[44px]",
            "bg-gradient-to-r from-[#5C3B24] via-[#6E472D] to-[#5C3B24] text-[#FAF6F0]",
            "border border-[#8C5E3C]/60 shadow-[0_8px_24px_rgba(45,30,18,0.35)]",
            "hover:shadow-[0_12px_28px_rgba(45,30,18,0.45)] active:scale-95 transition-all duration-300",
            // Di Desktop (md+): Menempel anggun di sisi kanan tengah layar
            "md:fixed md:bottom-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:flex-col md:py-3 md:px-2.5",
            "md:rounded-r-none md:rounded-l-2xl md:border-l md:border-y md:border-r-0 md:hover:-translate-x-1",
            "cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#8C5E3C]/50"
          )}
          aria-label="Buka WaraNusa AI Assistant"
          title="Buka WaraNusa AI Assistant"
        >
          {/* Panah Indikator Buka (Hanya Desktop) */}
          <ChevronLeft className="hidden md:block w-4 h-4 text-[#CBB59D] group-hover:text-white group-hover:scale-125 transition-all" />

          {/* Emblem Mini & Status Ping */}
          <div className="relative shrink-0">
            <WaranusaAIEmblem className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
            </span>
          </div>

          {/* Teks Mobile: 'Tanya AI' Terbaca Jelas & Proporsional */}
          <span className="md:hidden text-xs font-bold tracking-wide text-[#FAF6F0] pr-0.5">
            Tanya AI
          </span>

          {/* Teks Vertikal: WARANUSA AI ASSISTANT (Hanya Tampil di Desktop/Layar Lebar md+) */}
          <span
            className="hidden md:inline-block font-bold text-[10px] sm:text-[11px] tracking-widest text-[#FAF6F0] group-hover:text-[#FDF8EE] transition-colors uppercase whitespace-nowrap my-2.5"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            Waranusa AI Assistant
          </span>

          {/* Panah Indikator Bawah (Hanya Desktop) */}
          <ChevronLeft className="hidden md:block w-4 h-4 text-[#CBB59D] group-hover:text-white group-hover:scale-125 transition-all" />
        </button>
      )}

      {/* ========================================================================= */}
      {/* FLOATING CARD MODAL (CHATBOT BERSIH & LAPANG)                            */}
      {/* ========================================================================= */}
      {isOpen && (
        <>
          {/* Latar Belakang Transparan Lembut */}
          <div
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Kartu Mengambang (Floating Card Dialog) */}
          <div
            className={cn(
              "fixed left-3 right-3 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 z-50",
              "sm:w-[440px] max-w-[94vw] h-[580px] sm:h-[640px] max-h-[85vh] sm:max-h-[88vh]",
              "rounded-3xl bg-[#FAF7F2] border border-stone-300/80",
              "shadow-[0_20px_50px_rgba(45,30,18,0.22)]",
              "flex flex-col overflow-hidden",
              "animate-in zoom-in-95 slide-in-from-right-4 duration-250 font-sans"
            )}
          >
            {/* ============ 1. HEADER KAPSUL WARANUSA AI ASSISTANT ============ */}
            <div className="p-3 mx-3 mt-3 rounded-2xl bg-gradient-to-r from-[#5C3B24] via-[#6E472D] to-[#5C3B24] text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <WaranusaAIEmblem className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-[#FAF6F0] flex items-center gap-1.5 leading-none">
                    WaraNusa AI Assistant
                  </h3>
                  <p className="text-[11px] text-[#E6DDD4]/90 mt-1 leading-none font-normal">
                    siap memandu jelajah budaya
                  </p>
                </div>
              </div>

              {/* Tombol Reset & Tutup Silang di Header */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Mulai percakapan baru"
                  title="Mulai percakapan baru"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Tutup jendela asisten"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ============ 2. AREA KONTEN CHATBOT BERSIH ============ */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#FAF7F2]">
              {/* 2A. SAMBUTAN AWAL BERSIH (MASKOT ANIMASI + HEADING RINGKAS + GRID 2x2) */}
              {messages.length <= 1 ? (
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col items-center justify-center text-center">
                  {/* Maskot Animasi */}
                  <KarsaMascotIllustration className="my-2" />

                  {/* Heading Ramah & Ringkas (Anti-Clutter) */}
                  <h4 className="font-bold text-lg sm:text-xl text-[#2D1E12] mt-2 font-serif">
                    Ada yang bisa saya bantu hari ini?
                  </h4>

                  {/* Grid 2x2 Rekomendasi Pertanyaan Cepat (Minimalis & Elegan) */}
                  <div className="grid grid-cols-2 gap-2.5 mt-5 w-full">
                    {QUICK_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip.prompt)}
                        className="p-3.5 rounded-2xl border border-stone-200/80 bg-[#F5EFEB]/90 hover:border-[#8C5E3C]/60 hover:bg-white hover:shadow-xs transition-all text-left flex items-center justify-between group cursor-pointer"
                      >
                        <span className="text-[11px] sm:text-xs font-semibold text-stone-700 group-hover:text-[#6E472D] transition-colors leading-snug">
                          {chip.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* 2B. PERCAKAPAN AKTIF */
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm text-stone-800">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col max-w-[85%] leading-relaxed",
                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 shadow-xs",
                          msg.role === "user"
                            ? "bg-[#8C5E3C] text-white rounded-br-xs"
                            : "bg-white border border-stone-200/80 text-stone-800 rounded-bl-xs"
                        )}
                      >
                        <ReactMarkdown className="prose prose-xs max-w-none text-current">
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="mr-auto flex items-center gap-1.5 bg-white border border-stone-200/80 text-stone-500 rounded-2xl px-4 py-2.5 rounded-bl-xs text-xs shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px]">WaraNusa AI sedang merangkai jawaban...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* 2C. INPUT BAR & DISCLAIMER DI BAWAH */}
              <div className="p-3 bg-[#FAF7F2] border-t border-stone-200/60 flex flex-col gap-1.5 shrink-0">
                <div className="flex items-center gap-2 bg-[#F5EFEB] border border-stone-200/80 rounded-full px-3.5 py-1.5 focus-within:border-[#8C5E3C] focus-within:ring-2 focus-within:ring-[#8C5E3C]/20 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya tradisi, rumah adat, musik..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="w-7 h-7 rounded-full bg-[#8C5E3C] hover:bg-[#70492E] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    aria-label="Kirim Pesan"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 text-center leading-tight">
                  AI dapat membuat kesalahan. Harap konfirmasi kembali informasi penting ke katalog atau kurator resmi.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
