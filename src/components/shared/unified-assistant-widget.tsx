"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Send,
  RotateCcw,
  ChevronLeft,
  Camera,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n-store";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export interface MessageImage {
  data: string; // Base64 data murni tanpa prefix URL scheme
  mimeType: string;
  previewUrl: string; // Data URL untuk pratinjau instan di browser
}

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: MessageImage;
}

/**
 * Kompresi gambar sisi klien menggunakan HTML5 Canvas.
 * Resize proporsional dengan batas maksimal 1024px dan kualitas JPEG 0.85.
 * Mengurangi ukuran payload dari belasan MB menjadi ~80-180 KB demi transmisi super cepat dan hemat kuota API.
 */
function compressImageFile(file: File, maxDim = 1024, quality = 0.85): Promise<MessageImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context tidak tersedia"));
          return;
        }

        // Latar putih halus untuk menghindari transparansi hitam pada PNG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64Data = dataUrl.split(",")[1] || "";

        resolve({
          data: base64Data,
          mimeType,
          previewUrl: dataUrl,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
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
// 1. EMBLEM KECIL ANGKLUNG EMAS UNTUK SIDE DOCKED TAB & HEADER
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

      {/* Siluet Angklung Emas Ikonis */}
      <rect x="30" y="32" width="2.5" height="38" rx="1" fill="#D4AF37" />
      <rect x="67.5" y="32" width="2.5" height="38" rx="1" fill="#D4AF37" />
      <rect x="49" y="24" width="2.2" height="47" rx="1" fill="#FDE047" />
      <rect x="27" y="34" width="46" height="2.5" rx="1" fill="#D4AF37" />
      <rect x="27" y="68" width="46" height="3.2" rx="1" fill="#D4AF37" />

      {/* Tabung Bambu Kiri (Besar & Potongan Miring) */}
      <path
        d="M37 40 L45 44 V68 H37 Z"
        fill="#FDE047"
      />
      {/* Tabung Bambu Kanan (Sedang & Potongan Miring) */}
      <path
        d="M54 48 L61 51 V68 H54 Z"
        fill="#E5B942"
      />

      {/* Bintang AI Mini di Puncak */}
      <circle cx="50" cy="23" r="2.5" fill="#FFF" />
    </svg>
  );
}

// ============================================================================
// 2. MASKOT ANGKLUNG RAMAH (KARAKTER ANIMASI GOYANG & NADA MELODI)
// ============================================================================

function AngklungMascotIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center select-none py-1 group", className)}>
      <style>{`
        @keyframes angklungGoyang {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          10% {
            transform: rotate(-6deg) translateY(-2px);
          }
          16% {
            transform: rotate(7deg) translateY(-3px);
          }
          22% {
            transform: rotate(-7deg) translateY(-3px);
          }
          28% {
            transform: rotate(6deg) translateY(-2px);
          }
          34% {
            transform: rotate(-4deg) translateY(-1px);
          }
          40% {
            transform: rotate(3deg) translateY(0px);
          }
          46% {
            transform: rotate(0deg) translateY(0px);
          }
          65% {
            transform: rotate(0deg) translateY(-5px);
          }
          80% {
            transform: rotate(0deg) translateY(0px);
          }
        }
        @keyframes angklungBlink {
          0%, 92%, 100% {
            transform: scaleY(1);
          }
          95%, 97% {
            transform: scaleY(0.08);
          }
        }
        @keyframes noteFloatLeft {
          0%, 12% {
            opacity: 0;
            transform: translateY(0) scale(0.4) rotate(0deg);
          }
          22% {
            opacity: 0.95;
          }
          45% {
            opacity: 0;
            transform: translateY(-26px) translateX(-10px) scale(1.1) rotate(-18deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.4);
          }
        }
        @keyframes noteFloatRight {
          0%, 18% {
            opacity: 0;
            transform: translateY(0) scale(0.4) rotate(0deg);
          }
          28% {
            opacity: 0.95;
          }
          52% {
            opacity: 0;
            transform: translateY(-28px) translateX(12px) scale(1.1) rotate(18deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-32px) scale(0.4);
          }
        }
        @keyframes angklungPulseHalo {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.65;
          }
        }
        @keyframes crownTwinkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.88;
          }
          50% {
            transform: scale(1.25) rotate(25deg);
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(253, 224, 71, 0.8));
          }
        }
        .angklung-goyang-anim {
          transform-origin: 50% 88%;
          animation: angklungGoyang 3.2s ease-in-out infinite;
        }
        .angklung-goyang-anim:hover {
          animation-duration: 1.2s;
        }
        .angklung-eye-anim {
          transform-origin: 64px 66px;
          animation: angklungBlink 3.6s ease-in-out infinite;
        }
        .note-float-1 {
          animation: noteFloatLeft 3.2s ease-in-out infinite;
          transform-origin: 46px 36px;
        }
        .note-float-2 {
          animation: noteFloatRight 3.2s ease-in-out infinite;
          transform-origin: 82px 48px;
        }
        .angklung-halo-anim {
          animation: angklungPulseHalo 3.2s ease-in-out infinite;
        }
        .angklung-crown-anim {
          transform-origin: 64px 16px;
          animation: crownTwinkle 2.6s ease-in-out infinite;
        }
      `}</style>

      {/* Halo Glow Cahaya Emas Lembut Berdenyut */}
      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/30 to-amber-200/15 blur-xl angklung-halo-anim pointer-events-none" />

      {/* SVG Maskot Karakter Angklung */}
      <svg
        viewBox="0 0 128 128"
        className="w-24 h-24 sm:w-28 sm:h-28 relative drop-shadow-md transition-transform duration-300 hover:scale-108 cursor-pointer angklung-goyang-anim"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradasi Bambu Kuning Emas Utama */}
          <linearGradient id="bambuTubeGold1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F5D07A" />
            <stop offset="35%" stopColor="#E2A648" />
            <stop offset="85%" stopColor="#B87A2C" />
            <stop offset="100%" stopColor="#7C4C16" />
          </linearGradient>
          <linearGradient id="bambuTubeGold2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F8DE97" />
            <stop offset="40%" stopColor="#EBB65B" />
            <stop offset="85%" stopColor="#C48834" />
            <stop offset="100%" stopColor="#8A5318" />
          </linearGradient>
          {/* Gradasi Rangka Kayu Bambu */}
          <linearGradient id="bambuFrameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D99B49" />
            <stop offset="50%" stopColor="#9C6228" />
            <stop offset="100%" stopColor="#5D3512" />
          </linearGradient>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#EAB308" />
          </radialGradient>
        </defs>

        {/* ================= 1. NOTASI MUSIK EMAS MELAYANG (♪ ♫) ================= */}
        <g className="note-float-1" opacity="0">
          <text x="32" y="32" fill="#D97706" fontSize="16" fontWeight="bold" fontFamily="sans-serif">♪</text>
        </g>
        <g className="note-float-2" opacity="0">
          <text x="88" y="44" fill="#B45309" fontSize="15" fontWeight="bold" fontFamily="sans-serif">♫</text>
        </g>

        {/* ================= 2. RANGKA BAMBU LUAR (FRAME) ================= */}
        {/* Tiang Vertikal Kiri */}
        <rect x="25" y="26" width="5.5" height="74" rx="2.5" fill="url(#bambuFrameGrad)" stroke="#4A2808" strokeWidth="0.8" />
        {/* Tiang Vertikal Kanan */}
        <rect x="97.5" y="26" width="5.5" height="74" rx="2.5" fill="url(#bambuFrameGrad)" stroke="#4A2808" strokeWidth="0.8" />
        {/* Tiang Vertikal Tengah (Gantungan Utama) */}
        <rect x="61.5" y="16" width="5" height="84" rx="2.5" fill="url(#bambuFrameGrad)" stroke="#4A2808" strokeWidth="0.8" />

        {/* Palang Horizontal Atas */}
        <rect x="20" y="28" width="88" height="6" rx="2.5" fill="url(#bambuFrameGrad)" stroke="#4A2808" strokeWidth="0.8" />
        {/* Palang Tabung Resonansi Tengah */}
        <rect x="20" y="52" width="88" height="5" rx="2" fill="url(#bambuFrameGrad)" stroke="#4A2808" strokeWidth="0.8" opacity="0.85" />
        {/* Palang Dasar Bawah (Resonator Base Tempat Goyang) */}
        <rect x="18" y="93" width="92" height="9" rx="3.5" fill="url(#bambuFrameGrad)" stroke="#3D2005" strokeWidth="1" />

        {/* Tali Rotan Pengikat Tradisional (Lilitan Silang) */}
        {/* Kiri Atas */}
        <path d="M24 27 L31 35 M31 27 L24 35" stroke="#311904" strokeWidth="1.8" strokeLinecap="round" />
        {/* Kanan Atas */}
        <path d="M96 27 L104 35 M104 27 L96 35" stroke="#311904" strokeWidth="1.8" strokeLinecap="round" />
        {/* Tengah Atas */}
        <path d="M60 27 L68 35 M68 27 L60 35" stroke="#311904" strokeWidth="1.8" strokeLinecap="round" />
        {/* Kiri Bawah */}
        <path d="M23 92 L32 103 M32 92 L23 103" stroke="#311904" strokeWidth="1.8" strokeLinecap="round" />
        {/* Kanan Bawah */}
        <path d="M96 92 L105 103 M105 92 L96 103" stroke="#311904" strokeWidth="1.8" strokeLinecap="round" />

        {/* ================= 3. DUA TABUNG RESONANSI BAMBU (TABUNG UTAMA & PENYERTA) ================= */}
        {/* Tabung 1 (Kiri - Lebih Tinggi, Potongan Miring Khas Angklung) */}
        <g filter="drop-shadow(0px 2px 3px rgba(45,30,18,0.25))">
          {/* Badan Tabung Kiri */}
          <path
            d="M38 40 L56 50 V93 H38 Z"
            fill="url(#bambuTubeGold1)"
            stroke="#5D3512"
            strokeWidth="1.2"
          />
          {/* Lubang Potongan Miring Dalam Tabung */}
          <path
            d="M38 40 L56 50 L56 54 L38 44 Z"
            fill="#5D3512"
            opacity="0.85"
          />
          {/* Garis Ruas / Buku Bambu Kiri */}
          <line x1="38" y1="74" x2="56" y2="74" stroke="#7C4C16" strokeWidth="1.5" strokeDasharray="1,1" />
          <line x1="38" y1="75.5" x2="56" y2="75.5" stroke="#FDE68A" strokeWidth="1" opacity="0.7" />
        </g>

        {/* Tabung 2 (Kanan - Sedang, Potongan Miring) */}
        <g filter="drop-shadow(0px 2px 3px rgba(45,30,18,0.25))">
          {/* Badan Tabung Kanan */}
          <path
            d="M71 52 L88 61 V93 H71 Z"
            fill="url(#bambuTubeGold2)"
            stroke="#5D3512"
            strokeWidth="1.2"
          />
          {/* Lubang Potongan Miring Tabung Kanan */}
          <path
            d="M71 52 L88 61 L88 64.5 L71 55.5 Z"
            fill="#5D3512"
            opacity="0.85"
          />
          {/* Garis Ruas / Buku Bambu Kanan */}
          <line x1="71" y1="78" x2="88" y2="78" stroke="#7C4C16" strokeWidth="1.5" strokeDasharray="1,1" />
          <line x1="71" y1="79.5" x2="88" y2="79.5" stroke="#FDE68A" strokeWidth="1" opacity="0.7" />
        </g>

        {/* ================= 4. WAJAH RAMAH CHIBI (MATA, PIPI, SENYUM) ================= */}
        {/* Mata Animasi Berkedip */}
        <g className="angklung-eye-anim" fill="#FFF">
          {/* Mata Kiri (Di Tabung Kiri) */}
          <ellipse cx="48" cy="65" rx="4.5" ry="5.5" />
          <circle cx="49.5" cy="63.8" r="2" fill="#2D1E12" />
          <circle cx="47.2" cy="66.2" r="1" fill="#FFF" />

          {/* Mata Kanan (Di Tabung Kanan) */}
          <ellipse cx="79" cy="69" rx="4.5" ry="5.5" />
          <circle cx="80.5" cy="67.8" r="2" fill="#2D1E12" />
          <circle cx="78.2" cy="70.2" r="1" fill="#FFF" />
        </g>

        {/* Pipi Merona Hangat (Blush) */}
        <ellipse cx="43" cy="70" rx="3.5" ry="2.2" fill="#F87171" opacity="0.75" />
        <ellipse cx="84" cy="74" rx="3.5" ry="2.2" fill="#F87171" opacity="0.75" />

        {/* Senyuman Lucu Bersahabat di Tengah */}
        <path
          d="M59 72 Q64 77 69 72"
          stroke="#2D1E12"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* ================= 5. MAHKOTA BINTANG AI WARANUSA ================= */}
        <g className="angklung-crown-anim">
          <circle cx="64" cy="15" r="5" fill="url(#starGlow)" stroke="#FFF" strokeWidth="1" />
          <path d="M64 8 L65.5 13 L70 15 L65.5 17 L64 22 L62.5 17 L58 15 L62.5 13 Z" fill="#FFF" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: WARANUSA AI ASSISTANT (CHATBOT MURNI DI SISI KANAN)
// ============================================================================

export function UnifiedAssistantWidget() {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const welcomeText = t(
    "chat.welcome_initial",
    "Sampurasun! Saya asisten budaya AI WaraNusa. Tanyakan apa saja tentang warisan tradisi, filosofi arsitektur, atau instrumen musik Nusantara."
  );

  // State Chat
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: welcomeText,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perbarui pesan awal jika belum ada percakapan dan bahasa berubah
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant" && !prev[0].image) {
        return [{ role: "assistant", content: welcomeText }];
      }
      return prev;
    });
  }, [welcomeText]);

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
  }, [messages, isLoading, isOpen, selectedImage]);

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

  // Handler pemilihan file foto (Kamera HP / File Explorer)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressImageFile(file);
      setSelectedImage(compressed);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error("[Kompresi Foto Gagal]:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const quickChips = [
    {
      title: t("chat.quick_house", "Filosofi Rumah Gadang"),
      prompt: t(
        "chat.quick_house_prompt",
        "Jelaskan filosofi arsitektur Rumah Gadang Minangkabau dan makna atap gonjongnya."
      ),
    },
    {
      title: t("chat.quick_gamelan", "Gamelan Saron & Slendro"),
      prompt: t(
        "chat.quick_gamelan_prompt",
        "Bagaimana cara memainkan Gamelan Saron dan apa perbedaan laras Pelog dan Slendro?"
      ),
    },
    {
      title: t("chat.quick_batik", "Makna Ragam Motif Batik"),
      prompt: t(
        "chat.quick_batik_prompt",
        "Apa filosofi dan makna di balik motif Batik Parang dan Megamendung?"
      ),
    },
    {
      title: t("chat.quick_pinisi", "Sejarah Kapal Pinisi"),
      prompt: t(
        "chat.quick_pinisi_prompt",
        "Ceritakan sejarah dan keistimewaan pembuatan perahu Pinisi Bugis-Makassar."
      ),
    },
  ];

  // ---------------- Chat Handlers ----------------
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    const imageToSend = selectedImage;

    // Boleh kirim jika ada teks ATAU ada gambar yang dipilih
    if ((!text && !imageToSend) || isLoading) return;

    const defaultPhotoPrompt =
      language === "EN"
        ? "Please identify the Indonesian cultural heritage object in this photo."
        : "Mohon identifikasi objek warisan budaya Nusantara pada foto ini.";

    const userMessage: Message = {
      role: "user",
      content: text || (imageToSend ? defaultPhotoPrompt : ""),
      image: imageToSend || undefined,
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue("");
    setSelectedImage(null);
    setIsLoading(true);
    setIsAnalyzingImage(Boolean(imageToSend));

    try {
      let res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, language }),
      });

      if (!res.ok) {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages, language }),
        });
      }

      if (!res.ok) throw new Error("Gagal menerima balasan");

      const data = await res.json();
      const defaultReply =
        language === "EN"
          ? "The AI assistant connection is currently unstable. Please try again in a moment."
          : "Koneksi asisten AI sedang tidak stabil. Silakan coba beberapa saat lagi.";
      const botReply = data.content || defaultReply;
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      console.error("[Chat Error]:", err);
      const errorMsg =
        language === "EN"
          ? "The AI assistant connection is currently unstable. Please try again in a moment."
          : "Koneksi asisten AI sedang tidak stabil. Silakan coba beberapa saat lagi.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsAnalyzingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: welcomeText }]);
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {}
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* TRIGGER: DESKTOP SIDE TAB DI SISI KANAN, MOBILE LINGKARAN DI KANAN BAWAH   */}
      {/* ========================================================================= */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            // 1. DI MOBILE (< md): Tombol Lingkaran di pojok kanan bawah
            "!fixed bottom-4 right-4 z-[9990]",
            "group flex items-center justify-center",
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full",
            "btn-waranusa text-white shadow-[0_8px_24px_rgba(45,30,18,0.38)]",
            "hover:shadow-[0_14px_36px_rgba(45,30,18,0.5)] active:scale-95 transition-all duration-300",
            // 2. DI DESKTOP (md+): Tab Samping Pinned di Sisi Kanan Layar (Vertikal Center)
            "md:!fixed md:bottom-auto md:right-3 md:top-1/2 md:-translate-y-1/2",
            "md:w-auto md:h-auto md:flex-col md:py-3.5 md:px-2.5",
            "md:rounded-full md:border md:border-[#8C5E3C]/40 md:hover:scale-105",
            "cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#8C5E3C]/50"
          )}
          aria-label={t("chat.title", "WaraNusa AI Assistant")}
          title={t("chat.title", "WaraNusa AI Assistant")}
        >
          {/* Panah Indikator Atas (Hanya Tampil di Desktop md+) */}
          <ChevronLeft className="hidden md:block w-4 h-4 text-[#CBB59D] group-hover:text-white group-hover:scale-125 transition-all" />

          {/* Emblem Mini Angklung Emas */}
          <div className="relative shrink-0 flex items-center justify-center">
            <WaranusaAIEmblem className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" />

            {/* Badge pendar aktif Kuning Emas Nusantara */}
            <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-amber-400 border border-[#533019]"></span>
            </span>
          </div>

          {/* Teks Vertikal: WARANUSA AI ASSISTANT (Hanya Tampil di Desktop md+) */}
          <span
            className="hidden md:inline-block font-bold text-[10px] sm:text-[11px] tracking-widest text-[#FAF6F0] group-hover:text-[#FDF8EE] transition-colors uppercase whitespace-nowrap my-2.5"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            {t("chat.title", "WaraNusa AI Assistant")}
          </span>

          {/* Panah Indikator Bawah (Hanya Tampil di Desktop md+) */}
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
            <div className="p-3 mx-3 mt-3 rounded-2xl btn-waranusa text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <WaranusaAIEmblem className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-[#FAF6F0] flex items-center gap-1.5 leading-none">
                    {t("chat.title", "WaraNusa AI Assistant")}
                  </h3>
                  <p className="text-[11px] text-[#E6DDD4]/90 mt-1 leading-none font-normal">
                    {t("chat.subtitle", "siap memandu jelajah budaya")}
                  </p>
                </div>
              </div>

              {/* Tombol Reset & Tutup Silang di Header */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetChat}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={t("chat.new_chat", "Mulai percakapan baru")}
                  title={t("chat.new_chat", "Mulai percakapan baru")}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={t("a11y.close", "Tutup")}
                  title={`${t("a11y.close", "Tutup")} (Esc)`}
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
                  {/* Maskot Karakter Angklung Animasi Goyang */}
                  <AngklungMascotIllustration className="my-2" />

                  {/* Heading Ramah & Ringkas */}
                  <h4 className="font-bold text-lg sm:text-xl text-[#2D1E12] mt-2 font-serif">
                    {t("chat.welcome_heading", "Ada yang bisa saya bantu hari ini?")}
                  </h4>

                  {/* Grid 2x2 Rekomendasi Pertanyaan Cepat */}
                  <div className="grid grid-cols-2 gap-2.5 mt-5 w-full">
                    {quickChips.map((chip, idx) => (
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
                            ? "btn-waranusa text-white rounded-br-xs"
                            : "bg-white border border-stone-200/80 text-stone-800 rounded-bl-xs"
                        )}
                      >
                        {/* Tampilkan foto di bubble pesan jika dikirim pengguna */}
                        {msg.image && (
                          <div className="mb-2.5 overflow-hidden rounded-xl border border-white/25 shadow-xs max-w-[240px]">
                            <img
                              src={msg.image.previewUrl || `data:${msg.image.mimeType};base64,${msg.image.data}`}
                              alt="Foto warisan budaya yang diunggah"
                              className="max-h-[180px] w-full object-cover"
                            />
                          </div>
                        )}

                        {msg.content && (
                          <ReactMarkdown className="prose prose-xs max-w-none text-current">
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="mr-auto flex items-center gap-2 bg-white border border-stone-200/80 text-stone-700 rounded-2xl px-4 py-2.5 rounded-bl-xs text-xs shadow-xs">
                      {isAnalyzingImage ? (
                        <>
                          <Sparkles className="w-4 h-4 text-[#8C5E3C] animate-spin shrink-0" />
                          <span className="text-[11px] font-semibold text-[#52331C]">
                            {t("chat.scanning", "Memindai detail objek budaya Nusantara...")}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-[#8C5E3C] animate-bounce [animation-delay:0.4s]" />
                          <span className="ml-1 text-[11px]">
                            {t("chat.thinking", "WaraNusa AI sedang merangkai jawaban...")}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* 2C. INPUT BAR & PREVIEW FOTO DI BAWAH */}
              <div className="p-3 bg-[#FAF7F2] border-t border-stone-200/60 flex flex-col gap-2 shrink-0">
                {/* Thumbnail Preview Foto yang Sudah Dipilih */}
                {selectedImage && (
                  <div className="flex items-center gap-2.5 p-2 px-3 bg-[#EFE7DE] rounded-2xl border border-stone-300/80">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 shrink-0 shadow-xs">
                      <img
                        src={selectedImage.previewUrl}
                        alt="Pratinjau foto terpilih"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#52331C] truncate flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-[#8C5E3C]" />
                        <span>{t("chat.photo_ready", "Foto siap dipindai")}</span>
                      </p>
                      <p className="text-[10px] text-stone-600 truncate">
                        {t("chat.photo_hint", "Ketik pertanyaan atau klik kirim untuk analisis")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="w-6 h-6 rounded-full bg-stone-200/90 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      aria-label={language === "EN" ? "Remove photo" : "Hapus foto terpilih"}
                      title={language === "EN" ? "Remove photo" : "Hapus foto"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F5EFEB] border border-stone-200/80 rounded-full px-2.5 sm:px-3 py-1.5 focus-within:border-[#8C5E3C] focus-within:ring-2 focus-within:ring-[#8C5E3C]/20 transition-all">
                  {/* Input File Tersembunyi untuk Kamera / Galeri */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isLoading || isCompressing}
                  />

                  {/* Tombol Kamera / Unggah Gambar */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isCompressing}
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer",
                      selectedImage
                        ? "bg-[#6E472D] text-white ring-2 ring-[#6E472D]/30"
                        : "text-stone-600 hover:text-[#52331C] hover:bg-stone-200/70"
                    )}
                    aria-label={language === "EN" ? "Scan or Upload Cultural Photo" : "Pindai atau Unggah Foto Budaya"}
                    title={
                      selectedImage
                        ? language === "EN"
                          ? "Change photo"
                          : "Ganti foto budaya"
                        : language === "EN"
                        ? "Scan / Upload Cultural Photo (Mobile Camera)"
                        : "Pindai / Unggah Foto Budaya (Kamera HP)"
                    }
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isCompressing
                        ? language === "EN"
                          ? "Preparing photo..."
                          : "Menyiapkan foto..."
                        : selectedImage
                        ? t("chat.placeholder_photo", "Tanya detail tentang foto ini...")
                        : t("chat.placeholder", "Tanya tradisi, rumah adat, musik...")
                    }
                    className="flex-1 bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none min-w-0"
                    disabled={isLoading || isCompressing}
                  />

                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading || isCompressing}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full btn-waranusa disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                    aria-label={language === "EN" ? "Send Message" : "Kirim Pesan"}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 text-center leading-tight">
                  {t(
                    "chat.disclaimer",
                    "AI dapat membuat kesalahan. Harap konfirmasi kembali informasi penting ke katalog atau kurator resmi."
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
