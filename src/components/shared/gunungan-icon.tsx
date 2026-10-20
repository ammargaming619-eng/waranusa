"use client";

import { cn } from "@/lib/utils";

interface GununganIconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Gunungan (Kayon) Wayang Kulit Icon
 * Simbol kosmos, kehidupan, dan gerbang tradisi Nusantara.
 * Warna default: Cokelat perunggu / emas tua (#9B7042 / #845B32).
 */
export function GununganIcon({ className, size = 32, color = "#9B7042" }: GununganIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0 transition-transform duration-300", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gunungan-bronze" x1="32" y1="2" x2="32" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C49B58" />
          <stop offset="35%" stopColor="#A0723A" />
          <stop offset="70%" stopColor="#805426" />
          <stop offset="100%" stopColor="#5D3A16" />
        </linearGradient>
        <linearGradient id="gunungan-inner" x1="32" y1="12" x2="32" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EAD7B8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Tangkai / Gagang Gunungan (Pangkal Kayon) */}
      <path
        d="M30 68 V78 C30 79 34 79 34 78 V68 Z"
        fill="url(#gunungan-bronze)"
      />

      {/* Siluet Utama Gunungan Kayon */}
      <path
        d="M32 4
           C34 9 37 14 42 18
           C47 22 53 26 55 33
           C57 39 56 46 52 52
           C49 57 44 60 41 62
           C39 63 36 64 36 67
           L28 67
           C28 64 25 63 23 62
           C20 60 15 57 12 52
           C8 46 7 39 9 33
           C11 26 17 22 22 18
           C27 14 30 9 32 4 Z"
        fill="url(#gunungan-bronze)"
      />

      {/* Batas Garis Emas Luar */}
      <path
        d="M32 7
           C33.8 11.5 36.5 16 41 19.8
           C45.5 23.5 50.8 27.2 52.5 33.5
           C54.2 39 53.2 45 49.5 50.2
           C46.8 54.5 42.5 57.2 39.8 59
           C38 60.2 35 61.5 34.5 64.5
           L29.5 64.5
           C29 61.5 26 60.2 24.2 59
           C21.5 57.2 17.2 54.5 14.5 50.2
           C10.8 45 9.8 39 11.5 33.5
           C13.2 27.2 18.5 23.5 23 19.8
           C27.5 16 30.2 11.5 32 7 Z"
        stroke="#EFE3CB"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Pola Tatahan Ukir Kayon Dalam (Pohon Hayat & Gapura) */}
      {/* Batang Pohon Hayat Tengah */}
      <path
        d="M32 12 V56"
        stroke="#FDFBF7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Cabang-Cabang Ranting Kalpataru */}
      <path
        d="M32 20 C36 22 41 24 43 27 M32 20 C28 22 23 24 21 27"
        stroke="#FDFBF7"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M32 28 C38 30 45 33 46 38 M32 28 C26 30 19 33 18 38"
        stroke="#FDFBF7"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M32 37 C39 39 46 43 47 48 M32 37 C25 39 18 43 17 48"
        stroke="#FDFBF7"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Gapura / Gerbang Magis Bawah */}
      <rect
        x="27"
        y="49"
        width="10"
        height="12"
        rx="2"
        stroke="#FDFBF7"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M32 49 V61"
        stroke="#FDFBF7"
        strokeWidth="1"
        strokeDasharray="1.5 1.5"
      />
      <path
        d="M25 49 H39"
        stroke="#FDFBF7"
        strokeWidth="1.4"
      />

      {/* Ornamen Pucuk Mahkota (Cunduk Menul) */}
      <circle cx="32" cy="7" r="1.5" fill="#FFF2D6" />
    </svg>
  );
}
