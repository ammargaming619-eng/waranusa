import type { TraditionalInstrument38 } from "@/data/instruments-data";

export interface NoteStep {
  noteIndex: number;
  durationMs: number;
}

export interface InstrumentMelodyDemo {
  songName: string;
  genre: string;
  notes: NoteStep[];
}

/**
 * Tangga nada berurutan naik lalu turun untuk menguji laras setiap instrumen.
 */
export function getScaleTestSequence(notesCount: number): NoteStep[] {
  const steps: NoteStep[] = [];
  const safeCount = Math.max(1, notesCount);

  // Nada naik
  for (let i = 0; i < safeCount; i++) {
    steps.push({ noteIndex: i, durationMs: 320 });
  }
  // Nada turun kembali ke nada dasar
  for (let i = safeCount - 2; i >= 0; i--) {
    steps.push({ noteIndex: i, durationMs: 340 });
  }

  return steps;
}

/**
 * Melodi lagu daerah & pola tabuhan tradisi yang diselaraskan dengan jumlah nada & karakter alat musik.
 */
export const TRADITIONAL_MELODIES: Record<string, InstrumentMelodyDemo> = {
  // Jawa Tengah — Saron Demung (Pelog 7 nada) -> Gundul-Gundul Pacul
  "saron-demung": {
    songName: "Gundul-Gundul Pacul",
    genre: "Lagu Daerah Jawa Tengah",
    notes: [
      { noteIndex: 0, durationMs: 350 },
      { noteIndex: 2, durationMs: 350 },
      { noteIndex: 0, durationMs: 350 },
      { noteIndex: 2, durationMs: 350 },
      { noteIndex: 3, durationMs: 400 },
      { noteIndex: 4, durationMs: 400 },
      { noteIndex: 4, durationMs: 500 },
      { noteIndex: 6, durationMs: 350 },
      { noteIndex: 5, durationMs: 350 },
      { noteIndex: 4, durationMs: 350 },
      { noteIndex: 3, durationMs: 350 },
      { noteIndex: 2, durationMs: 400 },
      { noteIndex: 0, durationMs: 400 },
      { noteIndex: 0, durationMs: 600 },
    ],
  },

  // Jawa Barat — Angklung (7 nada) -> Manuk Dadali
  "angklung": {
    songName: "Manuk Dadali",
    genre: "Lagu Tradisional Sunda",
    notes: [
      { noteIndex: 0, durationMs: 320 },
      { noteIndex: 1, durationMs: 320 },
      { noteIndex: 2, durationMs: 350 },
      { noteIndex: 4, durationMs: 400 },
      { noteIndex: 2, durationMs: 320 },
      { noteIndex: 1, durationMs: 320 },
      { noteIndex: 0, durationMs: 450 },
      { noteIndex: 2, durationMs: 320 },
      { noteIndex: 4, durationMs: 350 },
      { noteIndex: 5, durationMs: 400 },
      { noteIndex: 4, durationMs: 320 },
      { noteIndex: 2, durationMs: 320 },
      { noteIndex: 0, durationMs: 600 },
    ],
  },

  // NTT — Sasando (7 nada) -> Bolelebo
  "sasando": {
    songName: "Bolelebo",
    genre: "Lagu Daerah Rote NTT",
    notes: [
      { noteIndex: 0, durationMs: 380 },
      { noteIndex: 2, durationMs: 380 },
      { noteIndex: 4, durationMs: 450 },
      { noteIndex: 5, durationMs: 400 },
      { noteIndex: 4, durationMs: 350 },
      { noteIndex: 2, durationMs: 350 },
      { noteIndex: 1, durationMs: 380 },
      { noteIndex: 2, durationMs: 400 },
      { noteIndex: 0, durationMs: 650 },
    ],
  },

  // Sumatera Barat — Talempong (5 nada) -> Tari Piring / Tak Tontong
  "talempong": {
    songName: "Tak Tontong (Tari Piring)",
    genre: "Irama Minangkabau",
    notes: [
      { noteIndex: 0, durationMs: 280 },
      { noteIndex: 1, durationMs: 280 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 3, durationMs: 320 },
      { noteIndex: 2, durationMs: 280 },
      { noteIndex: 1, durationMs: 280 },
      { noteIndex: 0, durationMs: 300 },
      { noteIndex: 2, durationMs: 320 },
      { noteIndex: 4, durationMs: 450 },
      { noteIndex: 3, durationMs: 300 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 0, durationMs: 550 },
    ],
  },

  // Sulawesi Utara — Kolintang (7 nada) -> O Ina Ni Keke
  "kolintang": {
    songName: "O Ina Ni Keke",
    genre: "Lagu Tradisional Minahasa",
    notes: [
      { noteIndex: 0, durationMs: 340 },
      { noteIndex: 2, durationMs: 340 },
      { noteIndex: 4, durationMs: 380 },
      { noteIndex: 3, durationMs: 340 },
      { noteIndex: 2, durationMs: 340 },
      { noteIndex: 0, durationMs: 450 },
      { noteIndex: 2, durationMs: 340 },
      { noteIndex: 4, durationMs: 380 },
      { noteIndex: 5, durationMs: 400 },
      { noteIndex: 4, durationMs: 340 },
      { noteIndex: 2, durationMs: 340 },
      { noteIndex: 0, durationMs: 600 },
    ],
  },

  // Bali — Rindik (7 nada) -> Gending Tabuh Telu
  "rindik": {
    songName: "Tabuh Gamelan Bali",
    genre: "Gending Tradisi Bali",
    notes: [
      { noteIndex: 0, durationMs: 240 },
      { noteIndex: 2, durationMs: 240 },
      { noteIndex: 4, durationMs: 260 },
      { noteIndex: 2, durationMs: 240 },
      { noteIndex: 5, durationMs: 260 },
      { noteIndex: 4, durationMs: 240 },
      { noteIndex: 2, durationMs: 240 },
      { noteIndex: 0, durationMs: 400 },
      { noteIndex: 3, durationMs: 260 },
      { noteIndex: 5, durationMs: 260 },
      { noteIndex: 6, durationMs: 320 },
      { noteIndex: 4, durationMs: 260 },
      { noteIndex: 0, durationMs: 500 },
    ],
  },

  // Aceh — Rapai (4 nada) -> Rampak Rapai Pasee
  "rapai": {
    songName: "Rampak Rapai Pasee",
    genre: "Pola Tabuh Aceh",
    notes: [
      { noteIndex: 0, durationMs: 260 },
      { noteIndex: 0, durationMs: 260 },
      { noteIndex: 1, durationMs: 280 },
      { noteIndex: 0, durationMs: 260 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 1, durationMs: 260 },
      { noteIndex: 3, durationMs: 360 },
      { noteIndex: 2, durationMs: 260 },
      { noteIndex: 1, durationMs: 260 },
      { noteIndex: 0, durationMs: 500 },
    ],
  },

  // Papua — Tifa (4 nada) -> Irama Tifa Nusantara
  "tifa": {
    songName: "Ritme Tifa Papua",
    genre: "Irama Rampak Papua",
    notes: [
      { noteIndex: 0, durationMs: 250 },
      { noteIndex: 0, durationMs: 250 },
      { noteIndex: 1, durationMs: 280 },
      { noteIndex: 2, durationMs: 280 },
      { noteIndex: 0, durationMs: 250 },
      { noteIndex: 1, durationMs: 250 },
      { noteIndex: 3, durationMs: 380 },
      { noteIndex: 1, durationMs: 260 },
      { noteIndex: 0, durationMs: 520 },
    ],
  },

  // Jawa Timur — Kendang Reog (4 nada) -> Irama Warok Ponorogo
  "kendang-reog": {
    songName: "Irama Warok Reog",
    genre: "Pola Gendang Ponorogo",
    notes: [
      { noteIndex: 0, durationMs: 260 },
      { noteIndex: 1, durationMs: 260 },
      { noteIndex: 0, durationMs: 260 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 1, durationMs: 260 },
      { noteIndex: 3, durationMs: 360 },
      { noteIndex: 2, durationMs: 260 },
      { noteIndex: 0, durationMs: 480 },
    ],
  },

  // Riau — Gambus Selodang (5 nada) -> Irama Zapin Melayu
  "gambus-selodang": {
    songName: "Langkah Zapin Melayu",
    genre: "Melodi Petik Melayu",
    notes: [
      { noteIndex: 0, durationMs: 320 },
      { noteIndex: 1, durationMs: 320 },
      { noteIndex: 2, durationMs: 340 },
      { noteIndex: 0, durationMs: 320 },
      { noteIndex: 3, durationMs: 360 },
      { noteIndex: 2, durationMs: 320 },
      { noteIndex: 4, durationMs: 440 },
      { noteIndex: 3, durationMs: 320 },
      { noteIndex: 1, durationMs: 320 },
      { noteIndex: 0, durationMs: 560 },
    ],
  },

  // Sumatera Utara — Hasapi (5 nada) -> O Tano Batak
  "hasapi": {
    songName: "O Tano Batak",
    genre: "Lagu Tradisional Batak",
    notes: [
      { noteIndex: 0, durationMs: 330 },
      { noteIndex: 2, durationMs: 330 },
      { noteIndex: 3, durationMs: 360 },
      { noteIndex: 2, durationMs: 330 },
      { noteIndex: 4, durationMs: 420 },
      { noteIndex: 3, durationMs: 330 },
      { noteIndex: 2, durationMs: 330 },
      { noteIndex: 1, durationMs: 330 },
      { noteIndex: 0, durationMs: 580 },
    ],
  },

  // DI Yogyakarta — Bonang Barung (7 nada) -> Ladrang Wilujeng
  "bonang-barung": {
    songName: "Ladrang Gending Jawa",
    genre: "Karawitan Yogyakarta",
    notes: [
      { noteIndex: 0, durationMs: 300 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 3, durationMs: 320 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 4, durationMs: 360 },
      { noteIndex: 5, durationMs: 380 },
      { noteIndex: 4, durationMs: 320 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 0, durationMs: 520 },
    ],
  },
};

/**
 * Mengambil melodi demo lagu untuk instrumen tertentu.
 * Jika instrumen belum memiliki melodi khusus, disediakan melodi generik harmonis
 * yang disesuaikan dengan jumlah nadanya (4, 5, atau 7 nada).
 */
export function getInstrumentMelody(instrument: TraditionalInstrument38): InstrumentMelodyDemo {
  // Cek kamus spesifik berdasarkan id atau slug
  const matched = TRADITIONAL_MELODIES[instrument.id] || TRADITIONAL_MELODIES[instrument.slug];
  if (matched) return matched;

  const count = instrument.notes.length;

  // Pola generik 7 nada (diatonik/pelog)
  if (count >= 7) {
    return {
      songName: `Melodi Laras ${instrument.title}`,
      genre: `Tradisi ${instrument.province}`,
      notes: [
        { noteIndex: 0, durationMs: 330 },
        { noteIndex: 2, durationMs: 330 },
        { noteIndex: 4, durationMs: 360 },
        { noteIndex: 3, durationMs: 330 },
        { noteIndex: 5, durationMs: 380 },
        { noteIndex: 4, durationMs: 330 },
        { noteIndex: 2, durationMs: 330 },
        { noteIndex: 1, durationMs: 330 },
        { noteIndex: 0, durationMs: 550 },
      ],
    };
  }

  // Pola generik 5 nada (pentatonik slendro)
  if (count === 5) {
    return {
      songName: `Gending Harmoni ${instrument.title}`,
      genre: `Tradisi ${instrument.province}`,
      notes: [
        { noteIndex: 0, durationMs: 320 },
        { noteIndex: 1, durationMs: 320 },
        { noteIndex: 2, durationMs: 350 },
        { noteIndex: 3, durationMs: 350 },
        { noteIndex: 4, durationMs: 420 },
        { noteIndex: 3, durationMs: 320 },
        { noteIndex: 2, durationMs: 320 },
        { noteIndex: 0, durationMs: 540 },
      ],
    };
  }

  // Pola generik 4 nada (ritmis / perkusi)
  return {
    songName: `Pola Tabuh Rampak ${instrument.title}`,
    genre: `Pola Irama ${instrument.province}`,
    notes: [
      { noteIndex: 0, durationMs: 270 },
      { noteIndex: 0, durationMs: 270 },
      { noteIndex: 1, durationMs: 290 },
      { noteIndex: 2, durationMs: 300 },
      { noteIndex: 1, durationMs: 270 },
      { noteIndex: 3, durationMs: 380 },
      { noteIndex: 2, durationMs: 280 },
      { noteIndex: 0, durationMs: 500 },
    ],
  };
}
