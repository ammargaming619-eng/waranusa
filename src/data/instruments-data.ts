import type { CulturalItem } from "@/lib/types";
import type { IslandRegion } from "@/data/traditional-houses";

export type PlayInteractionType = "strike" | "pluck" | "bow" | "shake" | "blow";
export type InteractionType = PlayInteractionType;
export type InteractionFilter = "ALL" | PlayInteractionType;

export type SynthPresetType =
  | "strike_drum"
  | "strike_metal_wood"
  | "pluck"
  | "bow"
  | "shake"
  | "blow";
export type SynthPreset = SynthPresetType;

export type OrganologyCategory = "IDIOFON" | "KORDOFON" | "MEMBRANOFON" | "AEROFON";
export type OrganologyType = "ALL" | OrganologyCategory;

export interface OrganologySpecs {
  tuningSystem: string;
  materialAcoustic: string;
  playingTechnique: string;
  ensembleFunction: string;
}

export interface InstrumentNoteSpec {
  id: number;
  label: string;
  subLabel: string;
  key: string;
  code?: string;
  freq: number;
}

export interface InstrumentGestureGuide {
  badgeLabel: string;
  mouseTouch: string;
  cameraAi: string;
  micOrKey: string;
}

export interface TraditionalInstrument38 {
  id: string;
  slug: string;
  provinceNumber: number;
  province: string;
  provinceCode: string;
  provinceSlug: string;
  islandRegion: Exclude<IslandRegion, "ALL">;
  title: string;
  vernacularName: string;
  ethnicGroup: string;
  interactionType: PlayInteractionType;
  synthPreset: SynthPresetType;
  organology: OrganologyCategory;
  organologyLabel: string;
  glbUrl: string;
  modelUrl: string;
  hasGlb: boolean;
  hasGlbAsset: boolean;
  hasAudioSample?: boolean;
  audioSampleUrl: string;
  mouseGuide: string;
  cameraGuide: string;
  notes: InstrumentNoteSpec[];
  gestureGuide: InstrumentGestureGuide;
  philosophy: string;
  specs: OrganologySpecs;
  fallbackItem: CulturalItem;
}

export const INTERACTION_META: Record<
  PlayInteractionType,
  { badge: string; label: string; shortHint: string }
> = {
  strike: {
    badge: "Pukul / Tabuh",
    label: "Pukul",
    shortHint: "Ketuk bilah atau klik model 3D untuk memicu denting dan getaran.",
  },
  pluck: {
    badge: "Petik / Dawai",
    label: "Petik",
    shortHint: "Usap kursor melintasi senar virtual atau ketuk dawai untuk memainkan melodi.",
  },
  bow: {
    badge: "Gesek / Busur",
    label: "Gesek",
    shortHint: "Tahan dan geser kiri-kanan di atas kanvas untuk membunyikan gesekan dawai.",
  },
  shake: {
    badge: "Goyang / Bambu",
    label: "Goyang",
    shortHint: "Goyangkan kursor cepat kiri-kanan atau klik tombol goyang untuk getaran tabung.",
  },
  blow: {
    badge: "Tiup / Napas",
    label: "Tiup",
    shortHint: "Tahan tombol tiup atau aktifkan mikrofon untuk meniup langsung dari perangkat.",
  },
};

export const INTERACTION_TABS: Array<{
  id: "ALL" | PlayInteractionType;
  label: string;
  shortDesc: string;
}> = [
  { id: "ALL", label: "Semua Cara Main (38)", shortDesc: "Lengkap 38 instrumen bersertifikasi 3D GLB" },
  { id: "strike", label: "Pukul / Tabuh", shortDesc: "Klik / ketuk membran & bilah" },
  { id: "pluck", label: "Petik / Dawai", shortDesc: "Usap / petik senar virtual" },
  { id: "bow", label: "Gesek / Busur", shortDesc: "Tahan & geser kiri-kanan" },
  { id: "shake", label: "Goyang / Bambu", shortDesc: "Gerakkan cepat / tahan goyang" },
  { id: "blow", label: "Tiup / Napas", shortDesc: "Tahan tombol tiup / sensor mikrofon" },
];

const PELOG_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "1", subLabel: "Ji", key: "1", freq: 277.2 },
  { id: 2, label: "2", subLabel: "Ro", key: "2", freq: 298.4 },
  { id: 3, label: "3", subLabel: "Lu", key: "3", freq: 324.0 },
  { id: 4, label: "4", subLabel: "Pat", key: "4", freq: 379.5 },
  { id: 5, label: "5", subLabel: "Mo", key: "5", freq: 405.8 },
  { id: 6, label: "6", subLabel: "Nem", key: "6", freq: 432.0 },
  { id: 7, label: "7", subLabel: "Pi", key: "7", freq: 486.0 },
];

const SLENDRO_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "1", subLabel: "Ji", key: "1", freq: 261.6 },
  { id: 2, label: "2", subLabel: "Ro", key: "2", freq: 299.4 },
  { id: 3, label: "3", subLabel: "Lu", key: "3", freq: 342.8 },
  { id: 4, label: "5", subLabel: "Mo", key: "4", freq: 392.4 },
  { id: 5, label: "6", subLabel: "Nem", key: "5", freq: 449.2 },
  { id: 6, label: "1'", subLabel: "Ji Tinggi", key: "6", freq: 523.2 },
  { id: 7, label: "2'", subLabel: "Ro Tinggi", key: "7", freq: 598.8 },
];

const DRUM_MEMBRANE_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "Bem", subLabel: "Pusat Bass", key: "1", freq: 88.0 },
  { id: 2, label: "Dung", subLabel: "Tengah Dalam", key: "2", freq: 112.0 },
  { id: 3, label: "Dah", subLabel: "Tengah Terbuka", key: "3", freq: 138.0 },
  { id: 4, label: "Tung", subLabel: "Tepi Dalam", key: "4", freq: 168.0 },
  { id: 5, label: "Tak", subLabel: "Tepi Rim Kiri", key: "5", freq: 215.0 },
  { id: 6, label: "Pak", subLabel: "Tamparan Nyaring", key: "6", freq: 256.0 },
  { id: 7, label: "Cak", subLabel: "Aksen Rim Kanan", key: "7", freq: 295.0 },
];

const STRING_PLUCK_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "Dawai 1", subLabel: "Nada Dasar (Do)", key: "1", freq: 196.0 },
  { id: 2, label: "Dawai 2", subLabel: "Nada Kedua (Re)", key: "2", freq: 220.0 },
  { id: 3, label: "Dawai 3", subLabel: "Nada Ketiga (Mi)", key: "3", freq: 246.9 },
  { id: 4, label: "Dawai 4", subLabel: "Nada Keempat (Sol)", key: "4", freq: 293.7 },
  { id: 5, label: "Dawai 5", subLabel: "Nada Kelima (La)", key: "5", freq: 329.6 },
  { id: 6, label: "Dawai 6", subLabel: "Oktaf Atas (Do')", key: "6", freq: 392.0 },
  { id: 7, label: "Dawai 7", subLabel: "Oktaf Puncak (Re')", key: "7", freq: 440.0 },
];

const BOWED_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "Posisi I", subLabel: "Laras Dasar", key: "1", freq: 246.9 },
  { id: 2, label: "Posisi II", subLabel: "Nada Kedua", key: "2", freq: 277.2 },
  { id: 3, label: "Posisi III", subLabel: "Nada Ketiga", key: "3", freq: 311.1 },
  { id: 4, label: "Posisi IV", subLabel: "Nada Keempat", key: "4", freq: 369.9 },
  { id: 5, label: "Posisi V", subLabel: "Nada Kelima", key: "5", freq: 415.3 },
  { id: 6, label: "Posisi VI", subLabel: "Nada Keenam", key: "6", freq: 493.9 },
  { id: 7, label: "Posisi VII", subLabel: "Oktaf Tinggi", key: "7", freq: 554.4 },
];

const ANGKLUNG_SHAKE_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "Da (1)", subLabel: "C4 + C5", key: "1", freq: 261.6 },
  { id: 2, label: "Mi (2)", subLabel: "D4 + D5", key: "2", freq: 293.7 },
  { id: 3, label: "Na (3)", subLabel: "E4 + E5", key: "3", freq: 329.6 },
  { id: 4, label: "Ti (4)", subLabel: "G4 + G5", key: "4", freq: 392.0 },
  { id: 5, label: "La (5)", subLabel: "A4 + A5", key: "5", freq: 440.0 },
  { id: 6, label: "Da' (1')", subLabel: "C5 + C6", key: "6", freq: 523.3 },
  { id: 7, label: "Mi' (2')", subLabel: "D5 + D6", key: "7", freq: 587.3 },
];

const WIND_BLOW_NOTES: InstrumentNoteSpec[] = [
  { id: 1, label: "Lubang 1", subLabel: "Nada Dasar", key: "1", freq: 220.0 },
  { id: 2, label: "Lubang 2", subLabel: "Nada Kedua", key: "2", freq: 246.9 },
  { id: 3, label: "Lubang 3", subLabel: "Nada Ketiga", key: "3", freq: 277.2 },
  { id: 4, label: "Lubang 4", subLabel: "Nada Keempat", key: "4", freq: 329.6 },
  { id: 5, label: "Lubang 5", subLabel: "Nada Kelima", key: "5", freq: 369.9 },
  { id: 6, label: "Lubang 6", subLabel: "Overblow I", key: "6", freq: 440.0 },
  { id: 7, label: "Lubang 7", subLabel: "Overblow II", key: "7", freq: 493.9 },
];

function getDefaultNotes(preset: SynthPresetType, organology: OrganologyCategory): InstrumentNoteSpec[] {
  switch (preset) {
    case "strike_drum":
      return DRUM_MEMBRANE_NOTES;
    case "strike_metal_wood":
      return organology === "IDIOFON" ? PELOG_NOTES : SLENDRO_NOTES;
    case "pluck":
      return STRING_PLUCK_NOTES;
    case "bow":
      return BOWED_NOTES;
    case "shake":
      return ANGKLUNG_SHAKE_NOTES;
    case "blow":
      return WIND_BLOW_NOTES;
  }
}

function getGestureGuide(interactionType: PlayInteractionType): InstrumentGestureGuide {
  switch (interactionType) {
    case "strike":
      return {
        badgeLabel: "Cara Main: Pukul / Tabuh",
        mouseTouch: "Klik/Ketuk pada model 3D atau panel bilah nada di bawah untuk menabuh.",
        cameraAi: "Geser tangan kiri-kanan untuk memilih nada, lalu ketuk ke bawah atau cubit (pinch) jari untuk menabuh.",
        micOrKey: "Gunakan tombol angka 1–7 atau Space pada keyboard komputer.",
      };
    case "pluck":
      return {
        badgeLabel: "Cara Main: Petik Dawai",
        mouseTouch: "Usap (swipe/hover) kursor melintasi garis senar virtual di atas model 3D.",
        cameraAi: "Geser tangan kiri-kanan melintasi senar virtual, atau cubit (pinch) jari untuk memetik nada.",
        micOrKey: "Tekan tombol angka 1–7 untuk memetik masing-masing dawai.",
      };
    case "bow":
      return {
        badgeLabel: "Cara Main: Gesek Busur",
        mouseTouch: "Klik tahan (drag & hold) lalu geser kiri-kanan untuk membunyikan gesekan dawai.",
        cameraAi: "Gerakkan tangan kiri-kanan secara berkesinambungan; posisi tangan menentukan nada yang digesek.",
        micOrKey: "Tahan tombol angka 1–7 untuk memilih posisi nada saat menggesek.",
      };
    case "shake":
      return {
        badgeLabel: "Cara Main: Goyang Bambu",
        mouseTouch: "Gerakkan kursor cepat kiri-kanan di atas model 3D atau tahan tombol Goyangkan.",
        cameraAi: "Goyangkan tangan ke kiri-kanan dengan santai di depan kamera untuk menggetarkan tabung nada.",
        micOrKey: "Tahan tombol angka 1–7 atau Space untuk menggoyangkan nada angklung.",
      };
    case "blow":
      return {
        badgeLabel: "Cara Main: Tiup (Mikrofon / Tahan)",
        mouseTouch: "Tahan tombol 'Tiup Instrumen' atau pilih lubang nada 1–7 di bawah kanvas.",
        cameraAi: "Gerakkan tangan kiri-kanan untuk memilih nada, dan naik-turunkan tangan untuk mengatur tiupan.",
        micOrKey: "Aktifkan 'Sensor Tiup Mikrofon' lalu tiup langsung ke mikrofon perangkat Anda!",
      };
  }
}

interface RawInstrumentSeed {
  provinceNumber: number;
  province: string;
  provinceCode: string;
  provinceSlug: string;
  islandRegion: Exclude<IslandRegion, "ALL">;
  id: string;
  slug: string;
  title: string;
  vernacularName: string;
  ethnicGroup: string;
  interactionType: PlayInteractionType;
  synthPreset: SynthPresetType;
  organology: OrganologyCategory;
  organologyLabel: string;
  hasGlb: boolean;
  philosophy: string;
  mouseGuide?: string;
  specs: {
    tuningSystem: string;
    materialAcoustic: string;
    playingTechnique: string;
    ensembleFunction: string;
  };
  notes?: InstrumentNoteSpec[];
}

const RAW_INSTRUMENTS_38: RawInstrumentSeed[] = [
{
provinceNumber: 1,
province: "Aceh",
provinceCode: "ID-AC",
provinceSlug: "aceh",
islandRegion: "SUMATERA",
id: "rapai-aceh",
slug: "rapai-aceh",
title: "Rapai",
vernacularName: "Rapai Pase & Daboh",
ethnicGroup: "Aceh",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Rebana bingkai kayu & kulit",
hasGlb: true,
    mouseGuide: "Ketuk model 3D atau panel variasi tabuh rapai untuk menabuh.",
philosophy: "“Gema zikir dan keteguhan hati serambi Mekkah” — Tabuhan serempak rapai menyatukan detak batin masyarakat dalam syiar dan persaudaraan.",
    notes: [
      { id: 1, label: "Gedug / Bas", subLabel: "95 Hz", key: "1", code: "1", freq: 95.0 },
      { id: 2, label: "Pak / Tengah", subLabel: "180 Hz", key: "2", code: "2", freq: 180.0 },
      { id: 3, label: "Ting / Lenting", subLabel: "340 Hz", key: "3", code: "3", freq: 340.0 },
      { id: 4, label: "Kleng / Tepi", subLabel: "620 Hz", key: "4", code: "4", freq: 620.0 },
      { id: 5, label: "Cap / Slap", subLabel: "850 Hz", key: "5", code: "5", freq: 850.0 },
    ],
    specs: {
tuningSystem: "Perkusi Membran Ritmis Aceh — Perkusi ritmis multi-timbre (suara Bem/Tung di tengah membran dan suara Cak/Pak nyaring di tepi bingkai).",
materialAcoustic: "Bingkai kayu nangka tua pilihan yang dibubut tebal, selaput kulit kambing betina, dan kepingan logam gemerincing.",
playingTechnique: "Dipangku dengan tangan kiri dan ditepuk kuat menggunakan telapak serta jemari tangan kanan dalam tempo bertingkat.",
ensembleFunction: "Pengiring utama kesenian Rapai Geleng, Debus (Daboh), dan penyambutan tamu kehormatan adat Aceh.",
},
},

{
provinceNumber: 2,
province: "Sumatera Utara",
provinceCode: "ID-SU",
provinceSlug: "sumatera-utara",
islandRegion: "SUMATERA",
id: "hasapi-sumut",
slug: "hasapi-batak",
title: "Hasapi",
vernacularName: "Hasapi Batak Toba (Ende & Doal)",
ethnicGroup: "Batak Toba",
interactionType: "pluck",
synthPreset: "pluck",
organology: "KORDOFON",
organologyLabel: "Lute berdawai 2 Batak Toba",
hasGlb: true,
    mouseGuide: "Petik senar pada model 3D atau panel nada dawai Hasapi Batak Toba.",
philosophy: "“Dua dawai pengikat rasa dalihan na tolu” — Petikan hasapi yang hening dan meditatif mengiringi syair tonggo-tonggo dan ratap batin suku Batak.",
    notes: [
      { id: 1, label: "Do / F#3", subLabel: "185 Hz", key: "1", code: "1", freq: 185.0 },
      { id: 2, label: "Re / G#3", subLabel: "207 Hz", key: "2", code: "2", freq: 207.0 },
      { id: 3, label: "Mi / A#3", subLabel: "233 Hz", key: "3", code: "3", freq: 233.0 },
      { id: 4, label: "Sol / C#4", subLabel: "277 Hz", key: "4", code: "4", freq: 277.0 },
      { id: 5, label: "La / D#4", subLabel: "311 Hz", key: "5", code: "5", freq: 311.0 },
    ],
    specs: {
tuningSystem: "Pentatonis Dawai Batak — Dua dawai bernada kuart murni (C3 - F3) atau kuint untuk melodi merdu dan ritme pengiring berulang.",
materialAcoustic: "Pahatan utuh kayu ingul atau johar yang dikeruk berongga lonjong, fret kayu (singkam), dan pasak putar tengon.",
playingTechnique: "Dipetik dengan ujung jari atau bilah tanduk tipis (plektrum) dengan teknik picking naik-turun yang rapat.",
ensembleFunction: "Instrumen melodi inti dalam ansambel Gondang Hasapi, mengiringi ritus sakral, tor-tor, dan sastra lisan Batak.",
},
},

{
provinceNumber: 3,
province: "Sumatera Barat",
provinceCode: "ID-SB",
provinceSlug: "sumatera-barat",
islandRegion: "SUMATERA",
id: "talempong-sumbar",
slug: "talempong-minang",
title: "Talempong",
vernacularName: "Talempong Pacik & Duduk",
ethnicGroup: "Minangkabau",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "Gong pencon perunggu Minang",
hasGlb: true,
    mouseGuide: "Ketuk pencon logam talempong untuk menghasilkan dentingan.",
philosophy: "“Basamo mangko manjadi” — Jalinan nada talempong yang saling bersahutan melambangkan musyawarah mufakat dan kegotongroyongan nagari.",
    notes: [
      { id: 1, label: "G4", subLabel: "392 Hz", key: "1", code: "1", freq: 392.0 },
      { id: 2, label: "A4", subLabel: "440 Hz", key: "2", code: "2", freq: 440.0 },
      { id: 3, label: "B4", subLabel: "494 Hz", key: "3", code: "3", freq: 494.0 },
      { id: 4, label: "D5", subLabel: "587 Hz", key: "4", code: "4", freq: 587.0 },
      { id: 5, label: "E5", subLabel: "659 Hz", key: "5", code: "5", freq: 659.0 },
    ],
    specs: {
tuningSystem: "Pentatonis Minangkabau — Tangga nada pentatonis/diatonis Minangkabau dengan karakter frekuensi logam pencu yang hangat dan nyaring.",
materialAcoustic: "Campuran tembaga dan timah putih (perunggu tuang) berbentuk bundar dengan pencu menonjol di titik pusat.",
playingTechnique: "Ditabuh dengan stik kayu berlilit kain/benang (teknik pacik dipegang tangan atau diletakkan pada rancakan kayu).",
ensembleFunction: "Pengiring Tari Piring, Tari Pasambahan, arak-arakan pengantin anak daro-marapulai, dan pesta batagak penghulu.",
},
},

{
provinceNumber: 4,
province: "Riau",
provinceCode: "ID-RI",
provinceSlug: "riau",
islandRegion: "SUMATERA",
id: "gambus-selodang-riau",
slug: "gambus-selodang",
title: "Gambus Selodang",
vernacularName: "Gambus Selodang Melayu Siak",
ethnicGroup: "Melayu Riau",
interactionType: "pluck",
synthPreset: "pluck",
organology: "KORDOFON",
organologyLabel: "Lute berdawai perahu Melayu",
hasGlb: true,
    mouseGuide: "Petik dawai gambus untuk melodi khas pesisir Melayu Riau.",
philosophy: "“Petikan syair penyejuk kalbu” — Alunan dawai gambus yang lembut menjadi jembatan petuah adat, pantun, dan kesantunan budaya Melayu.",
    notes: [
      { id: 1, label: "A2", subLabel: "110 Hz", key: "1", code: "1", freq: 110.0 },
      { id: 2, label: "B2", subLabel: "123 Hz", key: "2", code: "2", freq: 123.0 },
      { id: 3, label: "C3", subLabel: "131 Hz", key: "3", code: "3", freq: 131.0 },
      { id: 4, label: "D3", subLabel: "147 Hz", key: "4", code: "4", freq: 147.0 },
      { id: 5, label: "E3", subLabel: "165 Hz", key: "5", code: "5", freq: 165.0 },
      { id: 6, label: "F3", subLabel: "175 Hz", key: "6", code: "6", freq: 175.0 },
      { id: 7, label: "G3", subLabel: "196 Hz", key: "7", code: "7", freq: 196.0 },
    ],
    specs: {
tuningSystem: "Diatonis Makam Melayu — Tujuh hingga sembilan dawai berpasangan (double-course) dengan tala kuart murni bernuansa modal Melayu.",
materialAcoustic: "Pahatan kayu nangka atau cempedak utuh berlapis kulit ikan pari/kambing tipis pada dada resonator.",
playingTechnique: "Dipetik menggunakan plektrum tanduk kerbau (risha) dengan ornamentasi triller khas zapin Melayu.",
ensembleFunction: "Iringan utama Tari Zapin Melayu Riau, senandung syair gurindam, dan perhelatan majelis adat kesultanan.",
},
},

{
provinceNumber: 5,
province: "Kepulauan Riau",
provinceCode: "ID-KR",
provinceSlug: "kepulauan-riau",
islandRegion: "SUMATERA",
id: "gendang-panjang-kepri",
slug: "gendang-panjang",
title: "Gendang Panjang",
vernacularName: "Gendang Silat Melayu Kepri",
ethnicGroup: "Melayu Kepulauan",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Gendang silinder dua sisi",
hasGlb: true,
    mouseGuide: "Tabuh sisi induk bas atau anak gendang panjang.",
philosophy: "“Rentak samudra pengikat pulau” — Ketukan dinamis gendang panjang mengobarkan ketangkasan silat dan persatuan masyarakat bahari.",
    notes: [
      { id: 1, label: "Babah / Induk Bas", subLabel: "90 Hz", key: "1", code: "1", freq: 90.0 },
      { id: 2, label: "Dedak / Tengah", subLabel: "145 Hz", key: "2", code: "2", freq: 145.0 },
      { id: 3, label: "Ting / Lenting", subLabel: "320 Hz", key: "3", code: "3", freq: 320.0 },
      { id: 4, label: "Cing / Anak Tepi", subLabel: "510 Hz", key: "4", code: "4", freq: 510.0 },
    ],
    specs: {
tuningSystem: "Ritmis Rentak Melayu — Dua permukaan membran berbeda ukuran: sisi induk (nada rendah/bem) dan sisi anak (nada tinggi/pak).",
materialAcoustic: "Tabung kayu leban atau merbau dengan kulit kambing di sisi tinggi dan kulit lembu di sisi rendah, diikat rotan.",
playingTechnique: "Sisi besar ditepuk tangan kosong sedangkan sisi kecil dipukul dengan bilah rotan lentur.",
ensembleFunction: "Pengiring pencak silat pengantin Melayu, teater Bangsawan, dan penyambutan tamu agung di Kepulauan Riau.",
},
},

{
provinceNumber: 6,
province: "Jambi",
provinceCode: "ID-JA",
provinceSlug: "jambi",
islandRegion: "SUMATERA",
id: "kelintang-kayu-jambi",
slug: "kelintang-kayu",
title: "Kelintang Kayu",
vernacularName: "Kelintang Kayu Mahang",
ethnicGroup: "Melayu Jambi",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "Bilah kayu berjejer Jambi",
hasGlb: true,
    mouseGuide: "Ketuk bilah kayu untuk resonansi akustik melodi khas Jambi.",
philosophy: "“Titian harmoni Batanghari” — Denting bilah kelintang mengalir jernih laksana sungai Batanghari yang menghidupi peradaban Melayu Jambi.",
    notes: [
      { id: 1, label: "C4", subLabel: "261 Hz", key: "1", code: "1", freq: 261.0 },
      { id: 2, label: "D4", subLabel: "294 Hz", key: "2", code: "2", freq: 294.0 },
      { id: 3, label: "E4", subLabel: "329 Hz", key: "3", code: "3", freq: 329.0 },
      { id: 4, label: "G4", subLabel: "392 Hz", key: "4", code: "4", freq: 392.0 },
      { id: 5, label: "A4", subLabel: "440 Hz", key: "5", code: "5", freq: 440.0 },
    ],
    specs: {
tuningSystem: "Pentatonis Kayu Resonan — Susunan 5 hingga 6 nada pentatonis Melayu Jambi dengan resonansi kayu alami yang empuk.",
materialAcoustic: "Bilah kayu mahang atau merawan berserat padat yang disusun di atas kotak resonator kayu berukir pucuk rebung.",
playingTechnique: "Ditabuh dengan dua pemukul kayu bundar mengikuti pola ritme ostinato gerak tari adat.",
ensembleFunction: "Iringan Tari Sekapur Sirih, Tari Rentak Besapih, dan helaran upacara adat masyarakat Jambi.",
},
},

{
provinceNumber: 7,
province: "Sumatera Selatan",
provinceCode: "ID-SS",
provinceSlug: "sumatera-selatan",
islandRegion: "SUMATERA",
id: "burdah-sumsel",
slug: "burdah-palembang",
title: "Burdah",
vernacularName: "Burdah Gendang Oku Palembang",
ethnicGroup: "Palembang & Komering",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Gendang hadrah diameter lebar",
hasGlb: true,
    mouseGuide: "Tabuh membran rebana hadrah Burdah berdiameter besar.",
philosophy: "“Syi'ar dan persaudaraan tanah Sriwijaya” — Tabuhan rebana burdah berukuran besar mengiringi lantunan kasidah dan puji-pujian adat Palembang.",
    notes: [
      { id: 1, label: "Dung / Bas", subLabel: "110 Hz", key: "1", code: "1", freq: 110.0 },
      { id: 2, label: "Dang / Dengung", subLabel: "190 Hz", key: "2", code: "2", freq: 190.0 },
      { id: 3, label: "Tek / Sisi", subLabel: "420 Hz", key: "3", code: "3", freq: 420.0 },
      { id: 4, label: "Klet / Slap", subLabel: "680 Hz", key: "4", code: "4", freq: 680.0 },
    ],
    specs: {
tuningSystem: "Karakter Membran Tebal — Perkusi bernada tunggal dalam dan berdengung hangat khas rebana berdiameter sekitar 50 cm.",
materialAcoustic: "Batang kayu nangka pilihan berbentuk mangkuk dangkal tebal, selaput kulit kerbau betina, dan pasak rotan.",
playingTechnique: "Dipangku atau dipegang miring dengan tangan kiri lalu ditepuk kuat di pusat dan tepi membran dengan jari tangan kanan.",
ensembleFunction: "Iringan pembacaan syair kasidah Burdah, syukuran adat pernikahan Palembang, dan festival kebudayaan Islam.",
},
},

{
provinceNumber: 8,
province: "Kepulauan Bangka Belitung",
provinceCode: "ID-BB",
provinceSlug: "kepulauan-bangka-belitung",
islandRegion: "SUMATERA",
id: "dambus-babel",
slug: "dambus-babel",
title: "Dambus",
vernacularName: "Dambus Melayu Kepala Rusa",
ethnicGroup: "Melayu Bangka & Belitung",
interactionType: "pluck",
synthPreset: "pluck",
organology: "KORDOFON",
organologyLabel: "Gitar bertanduk rusa Belitung",
hasGlb: true,
    mouseGuide: "Petik senar dambus kepala rusa beresonansi hangat.",
philosophy: "“Sepintu Sedulang dalam alunan dawai” — Petikan dambus mengiringi keceriaan malam bulan purnama dan keakraban warga pulau timah.",
    notes: [
      { id: 1, label: "C3", subLabel: "131 Hz", key: "1", code: "1", freq: 131.0 },
      { id: 2, label: "E3", subLabel: "165 Hz", key: "2", code: "2", freq: 165.0 },
      { id: 3, label: "G3", subLabel: "196 Hz", key: "3", code: "3", freq: 196.0 },
      { id: 4, label: "A3", subLabel: "220 Hz", key: "4", code: "4", freq: 220.0 },
      { id: 5, label: "C4", subLabel: "262 Hz", key: "5", code: "5", freq: 262.0 },
    ],
    specs: {
tuningSystem: "Melodis Senar Pesisir — Enam senar nilon/logam berpasangan (3 pasang nada) yang disetel selaras dengan vokal dendang Melayu.",
materialAcoustic: "Kayu cempedak atau meranti utuh dengan ciri khas ukiran kepala rusa/kijang pada ujung kepala pasak.",
playingTechnique: "Dipetik secara ritmis dan melodis menggunakan potongan plastik/tanduk sambil duduk bersila.",
ensembleFunction: "Pengiring utama Tari Campak, Tari Sepen, dan hiburan rakyat bedambus di Bangka Belitung.",
},
},

{
provinceNumber: 9,
province: "Bengkulu",
provinceCode: "ID-BE",
provinceSlug: "bengkulu",
islandRegion: "SUMATERA",
id: "dol-bengkulu",
slug: "dol-bengkulu",
title: "Dol",
vernacularName: "Beduk Dol Bonggol Kelapa",
ethnicGroup: "Melayu Bengkulu",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Drum bonggol kelapa perayaan Tabut",
hasGlb: true,
    mouseGuide: "Tabuh drum dol perkusi tabut bertenaga bas mantap.",
philosophy: "“Gemuruh semangat pesisir barat” — Hentakan dol yang menggelegar membangkitkan keberanian, keteguhan, dan solidaritas warga Bengkulu.",
    notes: [
      { id: 1, label: "Dum Sub-bass", subLabel: "65 Hz", key: "1", code: "1", freq: 65.0 },
      { id: 2, label: "Dlong Bas", subLabel: "95 Hz", key: "2", code: "2", freq: 95.0 },
      { id: 3, label: "Pang Tebas", subLabel: "220 Hz", key: "3", code: "3", freq: 220.0 },
      { id: 4, label: "Tang Hantam", subLabel: "380 Hz", key: "4", code: "4", freq: 380.0 },
    ],
    specs: {
tuningSystem: "Sub-bass Hantaman Tabut — Resonansi frekuensi bass rendah-tengah yang bulat dan menggelegar karena bagian bawah dol tertutup rapat.",
materialAcoustic: "Bonggol pohon kelapa tua yang dilubangi bagian atasnya saja, ditutup kulit sapi tebal dan diikat rotan.",
playingTechnique: "Dipukul dengan dua stik kayu bulat berlapis kain menggunakan tiga ritme pokok: Suwena, Tamatam, dan Suwari.",
ensembleFunction: "Puncak perayaan ritual Festival Tabot Bengkulu dan penyambutan tamu besar provinsi.",
},
},

{
provinceNumber: 10,
province: "Lampung",
provinceCode: "ID-LA",
provinceSlug: "lampung",
islandRegion: "SUMATERA",
id: "gamolan-pekhing-lampung",
slug: "gamolan-pekhing",
title: "Gamolan Pekhing",
vernacularName: "Cetik / Gamolan Pekhing 8 Bilah",
ethnicGroup: "Lampung Pepadun & Saibatin",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "7 Bilah bambu cetik Lampung",
hasGlb: true,
    mouseGuide: "Ketuk susunan 7 bilah bambu gamolan cetik Lampung.",
philosophy: "“Piil Pesenggiri dalam denting bambu” — Kejernihan suara bilah bambu purba yang mencerminkan kehormatan diri dan keterbukaan masyarakat Lampung.",
    notes: [
      { id: 1, label: "G4", subLabel: "392 Hz", key: "1", code: "1", freq: 392.0 },
      { id: 2, label: "A4", subLabel: "440 Hz", key: "2", code: "2", freq: 440.0 },
      { id: 3, label: "B4", subLabel: "494 Hz", key: "3", code: "3", freq: 494.0 },
      { id: 4, label: "C5", subLabel: "523 Hz", key: "4", code: "4", freq: 523.0 },
      { id: 5, label: "D5", subLabel: "587 Hz", key: "5", code: "5", freq: 587.0 },
      { id: 6, label: "E5", subLabel: "659 Hz", key: "6", code: "6", freq: 659.0 },
      { id: 7, label: "G5", subLabel: "784 Hz", key: "7", code: "7", freq: 784.0 },
    ],
    specs: {
tuningSystem: "7 Tangga Nada Bambu Cetik — Tujuh hingga delapan bilah nada pentatonis khas Lampung yang dirangkai di atas tabung bambu besar.",
materialAcoustic: "Bambu betung (pekhing) tua kering pilihan dengan tali rotan pengikat di atas kotak resonator bambu.",
playingTechnique: "Ditabuh dengan sepasang pemukul kayu (pekul) oleh satu pemain dengan pola tabuhan cepat.",
ensembleFunction: "Pengiring Tari Sigeh Penguten, Tari Melinting, dan upacara adat Begawi Cakak Pepadun.",
},
},

{
provinceNumber: 11,
province: "Banten",
provinceCode: "ID-BT",
provinceSlug: "banten",
islandRegion: "JAWA",
id: "dogdog-lojor-banten",
slug: "dogdog-lojor",
title: "Dogdog Lojor",
vernacularName: "Dogdog Lojor Kasepuhan & Baduy",
ethnicGroup: "Sunda Banten & Kasepuhan",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Silinder kayu panjang Banten Kidul",
hasGlb: true,
    mouseGuide: "Tabuh silinder kayu panjang untuk ritme tradisi Banten Kidul.",
philosophy: "“Detak bumi dan doa syukur panen” — Tabuhan berirama dogdog lojor mengiringi langkah para sesepuh mengantar padi ke leuit lumbung berkah.",
    notes: [
      { id: 1, label: "Dung / Bas", subLabel: "115 Hz", key: "1", code: "1", freq: 115.0 },
      { id: 2, label: "Dong / Tengah", subLabel: "165 Hz", key: "2", code: "2", freq: 165.0 },
      { id: 3, label: "Deung / Resonan", subLabel: "240 Hz", key: "3", code: "3", freq: 240.0 },
      { id: 4, label: "Pak / Rim", subLabel: "430 Hz", key: "4", code: "4", freq: 430.0 },
    ],
    specs: {
tuningSystem: "Resonansi Tabung Kayu — Tabung silinder panjang (lojor) berukuran sekitar 90-100 cm penghasil nada ketukan ritmis mantap.",
materialAcoustic: "Batang kayu bungur atau kayu mahoni berlubang silinder dengan membran kulit kambing diikat sabuk rotan.",
playingTechnique: "Disandang di pundak dengan tali kain, ditepuk dengan telapak tangan bebas dalam ritme ostinato teratur.",
ensembleFunction: "Iringan upacara adat Seren Taun Cisungsang / Ciptagelar dan perayaan komunal masyarakat adat Banten Kidul.",
},
},

{
provinceNumber: 12,
province: "DKI Jakarta",
provinceCode: "ID-JK",
provinceSlug: "dki-jakarta",
islandRegion: "JAWA",
id: "tehyan-jakarta",
slug: "tehyan-jakarta",
title: "Tehyan",
vernacularName: "Tehyan Gambang Kromong Betawi",
ethnicGroup: "Betawi",
interactionType: "bow",
synthPreset: "bow",
organology: "KORDOFON",
organologyLabel: "Rebab 2 senar tempurung kelapa",
hasGlb: true,
    mouseGuide: "Gesek dawai tempurung tehyan Betawi berdawai dua.",
philosophy: "“Akulturasi harmonis kota pelabuhan” — Perpaduan budaya Betawi dan Tionghoa yang melahirkan melodi lincah, jenaka, dan penuh keakraban.",
    notes: [
      { id: 1, label: "A4", subLabel: "440 Hz", key: "1", code: "1", freq: 440.0 },
      { id: 2, label: "B4", subLabel: "494 Hz", key: "2", code: "2", freq: 494.0 },
      { id: 3, label: "C#5", subLabel: "554 Hz", key: "3", code: "3", freq: 554.0 },
      { id: 4, label: "E5", subLabel: "659 Hz", key: "4", code: "4", freq: 659.0 },
      { id: 5, label: "F#5", subLabel: "740 Hz", key: "5", code: "5", freq: 740.0 },
    ],
    specs: {
tuningSystem: "Dawai Gesek Gambang Kromong — Dua dawai kawat baja yang disetel berjarak interval kuini (5 nada) dalam tangga nada pentatonis Cina-Betawi.",
materialAcoustic: "Tabung resonator tempurung kelapa pilihan, leher kayu keras, dan busur gesek bulu ekor kuda.",
playingTechnique: "Bulu busur disisipkan di antara kedua senar lalu digesek ke kiri dan kanan sambil jari menekan dawai tanpa fret.",
ensembleFunction: "Pembawa melodi utama dalam orkes Gambang Kromong, pengiring Tari Cokek, dan teater Lenong Betawi.",
},
},

{
provinceNumber: 13,
province: "Jawa Barat",
provinceCode: "ID-JB",
provinceSlug: "jawa-barat",
islandRegion: "JAWA",
id: "angklung-jabar",
slug: "angklung",
title: "Angklung",
vernacularName: "Angklung Sunda Padaeng",
ethnicGroup: "Sunda",
interactionType: "shake",
synthPreset: "shake",
organology: "IDIOFON",
organologyLabel: "Tabung bambu gantung bergetar",
hasGlb: true,
    mouseGuide: "Goyang tabung bambu angklung untuk nada berdering.",
philosophy: "“Silih asah, silih asih, silih asuh” — Satu angklung hanya mewakili satu nada; keindahan musiknya lahir ketika dimainkan bersama dalam harmoni.",
    notes: [
      { id: 1, label: "Do / C4", subLabel: "262 Hz", key: "1", code: "1", freq: 262.0 },
      { id: 2, label: "Re / D4", subLabel: "294 Hz", key: "2", code: "2", freq: 294.0 },
      { id: 3, label: "Mi / E4", subLabel: "330 Hz", key: "3", code: "3", freq: 330.0 },
      { id: 4, label: "Fa / F4", subLabel: "349 Hz", key: "4", code: "4", freq: 349.0 },
      { id: 5, label: "Sol / G4", subLabel: "392 Hz", key: "5", code: "5", freq: 392.0 },
      { id: 6, label: "La / A4", subLabel: "440 Hz", key: "6", code: "6", freq: 440.0 },
      { id: 7, label: "Si / B4", subLabel: "494 Hz", key: "7", code: "7", freq: 494.0 },
    ],
    specs: {
tuningSystem: "Diatonis Standar Daeng Soetigna — Laras Salendro, Pelog, hingga Diatonis (inovasi Daeng Soetigna) dengan resonansi dua hingga tiga tabung bambu per unit.",
materialAcoustic: "Bambu hitam (awi wulung) dan bambu putih (awi temen) yang ditebang pada musim kemarau dan diperam satu tahun.",
playingTechnique: "Tangan kiri memegang tiang vertikal, sedangkan tangan kanan menggoyangkan dasar tabung ke kiri-kanan (getar kuruluk).",
ensembleFunction: "Upacara adat padi Dewi Sri, pertunjukan orkestra angklung dunia, dan pendidikan karakter kebersamaan.",
},
},

{
provinceNumber: 14,
province: "Jawa Tengah",
provinceCode: "ID-JT",
provinceSlug: "jawa-tengah",
islandRegion: "JAWA",
id: "saron-demung-jateng",
slug: "gamelan-jawa",
title: "Saron Demung",
vernacularName: "Saron Barung & Demung Laras Pelog",
ethnicGroup: "Jawa",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "Bilah perunggu gamelan Jawa",
hasGlb: true,
    mouseGuide: "Klik/Ketuk pada model 3D atau panel bilah nada untuk menabuh.",
philosophy: "“Memayu hayuning bawana” — Denting bening bilah gangsa yang menuntun ketenangan batin dan keselarasan hidup manusia dengan semesta.",
    notes: [
      { id: 1, label: "Bem", subLabel: "277 Hz", key: "1", code: "1", freq: 277.0 },
      { id: 2, label: "Gulu", subLabel: "298 Hz", key: "2", code: "2", freq: 298.0 },
      { id: 3, label: "Dada", subLabel: "324 Hz", key: "3", code: "3", freq: 324.0 },
      { id: 4, label: "Pelog", subLabel: "380 Hz", key: "4", code: "4", freq: 380.0 },
      { id: 5, label: "Lima", subLabel: "406 Hz", key: "5", code: "5", freq: 406.0 },
      { id: 6, label: "Nem", subLabel: "432 Hz", key: "6", code: "6", freq: 432.0 },
      { id: 7, label: "Barang", subLabel: "486 Hz", key: "7", code: "7", freq: 486.0 },
    ],
    specs: {
tuningSystem: "Laras Pélog Standar Keraton — Tujuh bilah nada Laras Pelog (1: Ji, 2: Ro, 3: Lu, 4: Pat, 5: Mo, 6: Nem, 7: Pi) di atas rancakan kayu jati.",
materialAcoustic: "Perunggu gangsa (campuran 10 bagian tembaga dan 3 bagian timah putih) yang ditempa membara oleh empu gamelan.",
playingTechnique: "Tangan kanan menabuh bilah dengan tabuh kayu, sedangkan jari tangan kiri memencet (mematuk) bilah sebelumnya agar tidak berdengung.",
ensembleFunction: "Pemegang balungan (kerangka melodi pokok) dalam karawitan Jawa, iringan wayang kulit, dan tari bedhaya.",
},
},

{
provinceNumber: 15,
province: "D.I. Yogyakarta",
provinceCode: "ID-YO",
provinceSlug: "daerah-istimewa-yogyakarta",
islandRegion: "JAWA",
id: "bonang-barung-diy",
slug: "bonang-barung",
title: "Bonang Barung",
vernacularName: "Bonang Barung Gagrak Ngayogyakarta",
ethnicGroup: "Jawa Yogyakarta",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "Rancakan ganda pencon perunggu",
hasGlb: true,
    mouseGuide: "Ketuk pencon perunggu bonang laras slendro kraton.",
philosophy: "“Sawiji, Greget, Sengguh, Ora Mingkuh” — Konsentrasi total dan kewibawaan alunan gending keraton Ngayogyakarta Hadiningrat.",
    notes: [
      { id: 1, label: "Barang", subLabel: "277 Hz", key: "1", code: "1", freq: 277.0 },
      { id: 2, label: "Gulu", subLabel: "311 Hz", key: "2", code: "2", freq: 311.0 },
      { id: 3, label: "Dada", subLabel: "349 Hz", key: "3", code: "3", freq: 349.0 },
      { id: 4, label: "Lima", subLabel: "415 Hz", key: "4", code: "4", freq: 415.0 },
      { id: 5, label: "Nem", subLabel: "466 Hz", key: "5", code: "5", freq: 466.0 },
    ],
    specs: {
tuningSystem: "Laras Slendro Gamelan Jawa — Dua baris pencon perunggu (12–14 pencon) mencakup dua oktaf laras Pelog dan Slendro keraton.",
materialAcoustic: "Pencon perunggu tempa yang ditumpangkan di atas jalinan tali pluntur pada rancakan kayu jati berukir prada emas.",
playingTechnique: "Ditabuh menggunakan sepasang bindhi (stik kayu panjang berlilit benang merah) dengan teknik gembyang dan imbal-imbalan.",
ensembleFunction: "Pemimpin buka gending dan penghias melodi utama dalam Gamelan Sekaten serta upacara Grebeg Kraton Yogyakarta.",
},
},

{
provinceNumber: 16,
province: "Jawa Timur",
provinceCode: "ID-JI",
provinceSlug: "jawa-timur",
islandRegion: "JAWA",
id: "kendang-reog-jatim",
slug: "kendang-reog",
title: "Kendang Reog",
vernacularName: "Kendang Reog Ponorogo",
ethnicGroup: "Jawa Ponorogo & Arekan",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Kendang tabung merah Ponorogo",
hasGlb: true,
    mouseGuide: "Tabuh kendang penari Reog Ponorogo berenergi tinggi.",
philosophy: "“Detak keprajuritan Singo Barong” — Hentakan ritmis kendang reog mengalirkan daya magis dan kegagahan atraksi tari topeng terbesar nusantara.",
    notes: [
      { id: 1, label: "Dlung / Bas", subLabel: "85 Hz", key: "1", code: "1", freq: 85.0 },
      { id: 2, label: "Dhah / Tengah", subLabel: "115 Hz", key: "2", code: "2", freq: 115.0 },
      { id: 3, label: "Tung / Resonan", subLabel: "210 Hz", key: "3", code: "3", freq: 210.0 },
      { id: 4, label: "Ket / Redam", subLabel: "440 Hz", key: "4", code: "4", freq: 440.0 },
      { id: 5, label: "Tong / Tepi", subLabel: "720 Hz", key: "5", code: "5", freq: 720.0 },
    ],
    specs: {
tuningSystem: "Dinamika Membran Kulit Reog — Dua tebokan kulit dengan tegangan tinggi penghasil suara dhung bulat dan tak tajam menggelegar.",
materialAcoustic: "Batang kayu nangka padat berongga kerucut ganda dengan kulit sapi pilihan dan tali rami/kulit janget.",
playingTechnique: "Ditepak dengan kedua telapak tangan secara atraktif berkecepatan tinggi mengikuti lompatan barongan.",
ensembleFunction: "Pemimpin tempo dan dinamika pertunjukan Reog Ponorogo, Tari Jathil, dan helaran festival budaya Jawa Timur.",
},
},

{
provinceNumber: 17,
province: "Bali",
provinceCode: "ID-BA",
provinceSlug: "bali",
islandRegion: "BALI_NUSA",
id: "rindik-bali",
slug: "rindik-bali",
title: "Rindik",
vernacularName: "Rindik Bambu Laras Selisir",
ethnicGroup: "Bali",
interactionType: "strike",
synthPreset: "strike_metal_wood",
organology: "IDIOFON",
organologyLabel: "Bilah bambu pelupuh Bali",
hasGlb: true,
    mouseGuide: "Tabuh bilah bambu rindik bergaya selisir khas Bali.",
philosophy: "“Ketenangan alam Pulau Dewata” — Getaran lembut bilah bambu rindik menghadirkan kedamaian pedesaan Bali dan rasa syukur ke hadapan Sang Hyang Semara Ratih.",
    notes: [
      { id: 1, label: "Ding", subLabel: "370 Hz", key: "1", code: "1", freq: 370.0 },
      { id: 2, label: "Dong", subLabel: "415 Hz", key: "2", code: "2", freq: 415.0 },
      { id: 3, label: "Deng", subLabel: "466 Hz", key: "3", code: "3", freq: 466.0 },
      { id: 4, label: "Dung", subLabel: "554 Hz", key: "4", code: "4", freq: 554.0 },
      { id: 5, label: "Dang", subLabel: "622 Hz", key: "5", code: "5", freq: 622.0 },
    ],
    specs: {
tuningSystem: "Laras Selisir Bambu Bali — Tangga nada 5 nada Pelog Selisir (Nding, Ndong, Ndeng, Ndung, Ndang) berpasangan pengumbang-pengisep.",
materialAcoustic: "11 hingga 14 bilah bambu wulung/petung di atas rancakan bambu berongga resonator alami.",
playingTechnique: "Ditabuh dengan dua panggul kayu bertangkai karet secara kotekan interlocking lincah.",
ensembleFunction: "Iringan Tari Joged Bumbung, penyambutan tetamu di bale banjar, dan penghias suasana senja agraris Bali.",
},
},

{
provinceNumber: 18,
province: "Nusa Tenggara Barat",
provinceCode: "ID-NB",
provinceSlug: "nusa-tenggara-barat",
islandRegion: "BALI_NUSA",
id: "gendang-beleq-ntb",
slug: "gendang-beleq",
title: "Gendang Beleq",
vernacularName: "Gendang Beleq Sasak Lombok",
ethnicGroup: "Sasak",
interactionType: "strike",
synthPreset: "strike_drum",
organology: "MEMBRANOFON",
organologyLabel: "Gendang tabung besar suku Sasak",
hasGlb: true,
    mouseGuide: "Tabuh membran gendang besar suku Sasak Lombok.",
philosophy: "“Semangat ksatria dan kehormatan tanah Sasak” — Tabuhan megah dan membahana Gendang Beleq mengobarkan ketangkasan prajurit kerajaan Lombok dan memeriahkan upacara adat Begawe.",
    notes: [
      { id: 1, label: "Dhum / Bas", subLabel: "75 Hz", key: "1", code: "1", freq: 75.0 },
      { id: 2, label: "Berr / Resonan", subLabel: "120 Hz", key: "2", code: "2", freq: 120.0 },
      { id: 3, label: "Pak / Rapat", subLabel: "280 Hz", key: "3", code: "3", freq: 280.0 },
      { id: 4, label: "Crak / Tepi", subLabel: "520 Hz", key: "4", code: "4", freq: 520.0 },
    ],
    specs: {
tuningSystem: "Dentuman Bas Tabung Sasak — Dua tebokan membran: sisi depan (suara tinggi/pak) dan sisi belakang (suara rendah/dhum) dalam irama beleq yang menggelegar.",
materialAcoustic: "Batang kayu meranti atau kayu nangka berdiameter besar (beleq berarti besar), selaput kulit sapi jantan pilihan, dan sabuk penegang kulit.",
playingTechnique: "Disandang di pundak dengan selempang kain, ditabuh sambil menari atraktif menggunakan dua stik pemukul kayu berlilit kain dan tepukan tangan.",
ensembleFunction: "Iringan tari prajurit perang Sasak kuno, upacara adat Begawe Merariq (pernikahan), khitanan, dan festival budaya Lombok Nusa Tenggara Barat.",
},
},

{
    provinceNumber: 19,
    province: "Nusa Tenggara Timur",
    provinceCode: "ID-NT",
    provinceSlug: "nusa-tenggara-timur",
    islandRegion: "BALI_NUSA",
    id: "sasando-ntt",
    slug: "sasando-rote",
    title: "Sasando",
    vernacularName: "Sasando Gong & Biola Rote",
    ethnicGroup: "Rote",
    interactionType: "pluck",
    synthPreset: "pluck",
    organology: "KORDOFON",
    organologyLabel: "Tabung bambu & wadah daun lontar",
    hasGlb: true,
    mouseGuide: "Petik senar di sekeliling tabung bambu lontar Pulau Rote.",
    philosophy: "“Petikan harpa lontar dari selatan nusantara” — Getaran dawai sasando di dalam wadah daun haik memancarkan kelembutan jiwa, romantisme lisan, dan kearifan masyarakat pulau Rote.",
        notes: [
      { id: 1, label: "Do / C4", subLabel: "262 Hz", key: "1", code: "1", freq: 262.0 },
      { id: 2, label: "Re / D4", subLabel: "294 Hz", key: "2", code: "2", freq: 294.0 },
      { id: 3, label: "Mi / E4", subLabel: "330 Hz", key: "3", code: "3", freq: 330.0 },
      { id: 4, label: "Fa / F4", subLabel: "349 Hz", key: "4", code: "4", freq: 349.0 },
      { id: 5, label: "Sol / G4", subLabel: "392 Hz", key: "5", code: "5", freq: 392.0 },
      { id: 6, label: "La / A4", subLabel: "440 Hz", key: "6", code: "6", freq: 440.0 },
      { id: 7, label: "Si / B4", subLabel: "494 Hz", key: "7", code: "7", freq: 494.0 },
    ],
    specs: {
      tuningSystem: "Diatonis Resonan Akustik Lontar — 28 hingga 32 dawai kawat dengan ganjal kayu (senda) melingkari tabung bambu dalam tangga nada pentatonis Sasando Gong atau diatonis.",
      materialAcoustic: "Tabung bambu pilihan berongga tipis, bantalan kayu keras, dan lembaran daun lontar (haik) yang dirajut melengkung sebagai mangkuk resonansi akustik alami.",
      playingTechnique: "Dipetik dengan jemari kedua belah tangan secara serempak: tangan kiri memainkan akor bass dan tangan kanan memainkan melodi solo melodius.",
      ensembleFunction: "Pengiring syair adat Sangane, ratap dukacita, pesta penyambutan tamu terhormat, dan pesta rakyat perayaan panen nira lontar di Rote NTT.",
    },
  },

{
    provinceNumber: 20,
    province: "Kalimantan Barat",
    provinceCode: "ID-KB",
    provinceSlug: "kalimantan-barat",
    islandRegion: "KALIMANTAN",
    id: "tuma-kalbar",
    slug: "tuma-dayak",
    title: "Tuma",
    vernacularName: "Gendang Tuma Dayak Kanayatn",
    ethnicGroup: "Dayak Kanayatn",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Gendang silinder ramping Dayak",
    hasGlb: true,
    mouseGuide: "Tabuh drum silinder panjang Dayak Kanayatn.",
    philosophy: "“Gendang persatuan hutan Borneo” — Irama tegap tabuhan tuma menghidupkan tarian adat Naik Dango sebagai ungkapan syukur panen padi kepada Jubata (Sang Pencipta).",
        notes: [
      { id: 1, label: "Dum / Bas", subLabel: "125 Hz", key: "1", code: "1", freq: 125.0 },
      { id: 2, label: "Tum / Tengah", subLabel: "195 Hz", key: "2", code: "2", freq: 195.0 },
      { id: 3, label: "Tok / Sisi", subLabel: "380 Hz", key: "3", code: "3", freq: 380.0 },
      { id: 4, label: "Cak / Slap", subLabel: "610 Hz", key: "4", code: "4", freq: 610.0 },
    ],
    specs: {
      tuningSystem: "Membran Silinder Kayu Dayak — Membran berdiameter 20-25 cm dengan panjang bodi mencapai 1 meter, menghasilkan dentuman midrange hangat dan mantap.",
      materialAcoustic: "Batang kayu tebelian atau kayu gelondongan hutan keras, membran kulit labi-labi (tuntong) atau kulit lembu hutan diikat simpai rotan.",
      playingTechnique: "Ditepuk dengan kedua telapak tangan secara ritmis berdiri atau disandarkan pada badan pemusik mengikuti langkah penari.",
      ensembleFunction: "Pengiring utama tari perang, ritual Naik Dango Dayak Kanayatn, dan pesta gawai Dayak di Kalimantan Barat.",
    },
  },

{
    provinceNumber: 21,
    province: "Kalimantan Tengah",
    provinceCode: "ID-KT",
    provinceSlug: "kalimantan-tengah",
    islandRegion: "KALIMANTAN",
    id: "japen-kalteng",
    slug: "japen-kalteng",
    title: "Japen",
    vernacularName: "Kecapi Japen Dayak Ngaju",
    ethnicGroup: "Dayak Ngaju & Ot Danum",
    interactionType: "pluck",
    synthPreset: "pluck",
    organology: "KORDOFON",
    organologyLabel: "Kecapi perahu ukir Dayak Ngaju",
    hasGlb: true,
    mouseGuide: "Petik senar kecapi perahu Japen Dayak Ngaju berlaras akustik khas.",
    philosophy: "“Bunyi yang meloloskan duka, menyapa leluhur” — Melodi sape' yang tenang mengalir seperti riam sungai pedalaman hutan, menenangkan jiwa dan memanggil roh kebaikan.",
        notes: [
      { id: 1, label: "1", subLabel: "147 Hz", key: "1", code: "1", freq: 147.0 },
      { id: 2, label: "2", subLabel: "185 Hz", key: "2", code: "2", freq: 185.0 },
      { id: 3, label: "3", subLabel: "220 Hz", key: "3", code: "3", freq: 220.0 },
      { id: 4, label: "4", subLabel: "294 Hz", key: "4", code: "4", freq: 294.0 },
      { id: 5, label: "5", subLabel: "330 Hz", key: "5", code: "5", freq: 330.0 },
    ],
    specs: {
      tuningSystem: "Pentatonis Dayak Ngaju — Empat dawai baja dengan fret kayu yang disetel pada nada pentatonis Dayak (satu dawai melodi utama, tiga dawai dengung/drone).",
      materialAcoustic: "Pahatan utuh kayu jelutung atau kayu adau dengan ukiran motif pakis Dayak dan pasak pemutar kayu keras.",
      playingTechnique: "Dawai pertama dipetik untuk melodi sedangkan dawai lainnya disapu berulang sebagai drone pengiring ritmis yang meditatif.",
      ensembleFunction: "Iringan tari Kancet Papatai (tari perang), tari Mandau, serta ritual penyembuhan Balian masyarakat Dayak Kalimantan Tengah.",
    },
  },

{
    provinceNumber: 22,
    province: "Kalimantan Selatan",
    provinceCode: "ID-KS",
    provinceSlug: "kalimantan-selatan",
    islandRegion: "KALIMANTAN",
    id: "panting-kalsel",
    slug: "musik-panting",
    title: "Panting",
    vernacularName: "Gambus Panting Banjar",
    ethnicGroup: "Banjar",
    interactionType: "pluck",
    synthPreset: "pluck",
    organology: "KORDOFON",
    organologyLabel: "Gambus mini 4 senar suku Banjar",
    hasGlb: true,
    mouseGuide: "Petik petikan gambus mini Banjar bernada ceria.",
    philosophy: "“Alunan riang tepian Sungai Martapura” — Petikan cepat dan lincah panting mencerminkan kegembiraan, keterbukaan, dan keramahan masyarakat Banjar.",
        notes: [
      { id: 1, label: "1", subLabel: "220 Hz", key: "1", code: "1", freq: 220.0 },
      { id: 2, label: "2", subLabel: "277 Hz", key: "2", code: "2", freq: 277.0 },
      { id: 3, label: "3", subLabel: "330 Hz", key: "3", code: "3", freq: 330.0 },
      { id: 4, label: "4", subLabel: "440 Hz", key: "4", code: "4", freq: 440.0 },
      { id: 5, label: "5", subLabel: "494 Hz", key: "5", code: "5", freq: 494.0 },
    ],
    specs: {
      tuningSystem: "Senar Gambus Banjar — Tiga hingga empat senar yang disetel dalam akor diatonis ceria untuk melodi cepat berirama gembira.",
      materialAcoustic: "Kayu kuring atau kayu nangka yang dipahat ramping menyerupai gitar mini, penutup dada kulit katak puru atau kulit biawak, dan kawat nilon.",
      playingTechnique: "Dipetik dengan plektrum tanduk atau bambu tipis dengan teknik strumming cepat bercampur ketukan bodi.",
      ensembleFunction: "Instrumen primadona dalam Musik Panting Banjar bersama babun, suling, dan agung untuk mengiringi tari Radap Rahayu dan teater Mamanda.",
    },
  },

{
    provinceNumber: 23,
    province: "Kalimantan Timur",
    provinceCode: "ID-KI",
    provinceSlug: "kalimantan-timur",
    islandRegion: "KALIMANTAN",
    id: "sampe-kaltim",
    slug: "sampe-dayak-kaltim",
    title: "Sape",
    vernacularName: "Sampe' Khas Dayak Kenyah",
    ethnicGroup: "Dayak Kenyah",
    interactionType: "pluck",
    synthPreset: "pluck",
    organology: "KORDOFON",
    organologyLabel: "Lute kayu perahu ukir Dayak Kenyah",
    hasGlb: true,
    mouseGuide: "Petik alunan senar melodi perahu Dayak Kenyah.",
    philosophy: "“Dawai yang memeluk batin hutan raya” — Setiap petikan sampe' Dayak dipercaya mampu menyatukan hati manusia dengan alam rimba raya dan restu para leluhur Apo Kayan.",
        notes: [
      { id: 1, label: "1", subLabel: "131 Hz", key: "1", code: "1", freq: 131.0 },
      { id: 2, label: "2", subLabel: "147 Hz", key: "2", code: "2", freq: 147.0 },
      { id: 3, label: "3", subLabel: "175 Hz", key: "3", code: "3", freq: 175.0 },
      { id: 4, label: "4", subLabel: "196 Hz", key: "4", code: "4", freq: 196.0 },
      { id: 5, label: "5", subLabel: "220 Hz", key: "5", code: "5", freq: 220.0 },
      { id: 6, label: "6", subLabel: "262 Hz", key: "6", code: "6", freq: 262.0 },
      { id: 7, label: "7", subLabel: "294 Hz", key: "7", code: "7", freq: 294.0 },
    ],
    specs: {
      tuningSystem: "Pentatonis Sakral Sape Dayak — 3 hingga 4 dawai baja dengan fret kayu yang direkatkan damar pohon; tangga nada pentatonis Dayak khas Kenyah.",
      materialAcoustic: "Batang kayu marangan atau pelantan yang dilubangi belakangnya, diukir motif aso' (naga anjing) Dayak berpewarna alami.",
      playingTechnique: "Dipetik dengan jemari tangan sambil memeluk bodi instrumen, memadukan melodi tinggi dengan gesekan harmoni senar rendah.",
      ensembleFunction: "Iringan tari Kancet Ledo (tari gong wanita), pesta panen adat Mecaq Boteng, dan penyambutan tamu kehormatan di Lamin adat.",
    },
  },

{
    provinceNumber: 24,
    province: "Kalimantan Utara",
    provinceCode: "ID-KU",
    provinceSlug: "kalimantan-utara",
    islandRegion: "KALIMANTAN",
    id: "jatung-utang-kaltara",
    slug: "jatung-utang",
    title: "Jatung Utang",
    vernacularName: "Xilofon Bilah Kayu Gantung Jatung Utang",
    ethnicGroup: "Dayak Kenyah Kayan",
    interactionType: "strike",
    synthPreset: "strike_metal_wood",
    organology: "IDIOFON",
    organologyLabel: "Bilah kayu gantung terikat",
    hasGlb: true,
    mouseGuide: "Ketuk bilah-bilah kayu gantung Dayak di pedalaman.",
    philosophy: "“Denting kayu rimba perbatasan negeri” — Ketukan bilah kayu jatung utang merajut keakraban di ladang huma dan pengingat kelestarian hutan adat Kayan.",
        notes: [
      { id: 1, label: "1", subLabel: "196 Hz", key: "1", code: "1", freq: 196.0 },
      { id: 2, label: "2", subLabel: "220 Hz", key: "2", code: "2", freq: 220.0 },
      { id: 3, label: "3", subLabel: "262 Hz", key: "3", code: "3", freq: 262.0 },
      { id: 4, label: "4", subLabel: "294 Hz", key: "4", code: "4", freq: 294.0 },
      { id: 5, label: "5", subLabel: "330 Hz", key: "5", code: "5", freq: 330.0 },
    ],
    specs: {
      tuningSystem: "Resonansi Bilah Kayu Hutan — 9 hingga 13 bilah kayu berukuran bervariasi yang dirangkai sejajar dengan tali rotan dan direntangkan di atas paha atau rangka kayu.",
      materialAcoustic: "Kayu lempung hutan pilihan yang kering dan bersuara nyaring (kayu emang/marangan), tali rotan pengikat, dan sepasang stik kayu bundar.",
      playingTechnique: "Dipukul dengan dua batang stik kayu pendek secara berpasangan dengan tempo bersahutan ceria.",
      ensembleFunction: "Hiburan saat istirahat menanam padi ladang, pengiring upacara syukuran pascapanen, dan tarian pergaulan muda-mudi Dayak Kenyah Kaltara.",
    },
  },

{
    provinceNumber: 25,
    province: "Sulawesi Utara",
    provinceCode: "ID-SA",
    provinceSlug: "sulawesi-utara",
    islandRegion: "SULAWESI",
    id: "kolintang-sulut",
    slug: "kolintang-minahasa",
    title: "Kolintang",
    vernacularName: "Kolintang Kayu Cempaka Minahasa",
    ethnicGroup: "Minahasa",
    interactionType: "strike",
    synthPreset: "strike_metal_wood",
    organology: "IDIOFON",
    organologyLabel: "Xylophone kayu peti Minahasa",
    hasGlb: true,
    mouseGuide: "Ketuk bilah kayu melodi Minahasa yang jernih.",
    philosophy: "“Harmoni nada persaudaraan Mapalus” — Bunyi merdu 'tong-ting-tang' kolintang mencerminkan semangat gotong royong dan keselarasan sosial Minahasa yang mendunia.",
        notes: [
      { id: 1, label: "Do / C4", subLabel: "262 Hz", key: "1", code: "1", freq: 262.0 },
      { id: 2, label: "Re / D4", subLabel: "294 Hz", key: "2", code: "2", freq: 294.0 },
      { id: 3, label: "Mi / E4", subLabel: "330 Hz", key: "3", code: "3", freq: 330.0 },
      { id: 4, label: "Fa / F4", subLabel: "349 Hz", key: "4", code: "4", freq: 349.0 },
      { id: 5, label: "Sol / G4", subLabel: "392 Hz", key: "5", code: "5", freq: 392.0 },
      { id: 6, label: "La / A4", subLabel: "440 Hz", key: "6", code: "6", freq: 440.0 },
      { id: 7, label: "Si / B4", subLabel: "494 Hz", key: "7", code: "7", freq: 494.0 },
    ],
    specs: {
      tuningSystem: "Diatonis Standar Melodi Kayu — Tangga nada diatonis lengkap 2 hingga 3 oktaf yang ditata rapi di atas peti kayu berongga resonator.",
      materialAcoustic: "Bilah kayu cempaka, telur, atau wenuang lokal yang ringan berserat lurus dan diangin-anginkan hingga kering mutlak.",
      playingTechnique: "Ditabuh menggunakan tiga stik kayu dengan bantalan karet (dua stik di tangan kiri dan satu di tangan kanan atau sebaliknya).",
      ensembleFunction: "Orkestra Kolintang Minahasa: melodi, bass, juk, cello, dan kontra-bass dalam upacara adat, misa gereja, hingga konser simfoni.",
    },
  },

{
    provinceNumber: 26,
    province: "Gorontalo",
    provinceCode: "ID-GO",
    provinceSlug: "gorontalo",
    islandRegion: "SULAWESI",
    id: "polopalo-gorontalo",
    slug: "polopalo-gorontalo",
    title: "Polopalo",
    vernacularName: "Polopalo Bambu Garpu Nada",
    ethnicGroup: "Gorontalo",
    interactionType: "strike",
    synthPreset: "strike_metal_wood",
    organology: "IDIOFON",
    organologyLabel: "Garpu bambu rongga pukul",
    hasGlb: true,
    mouseGuide: "Benturkan garpu bambu untuk memicu getaran resonansi.",
    philosophy: "“Denting kelembutan Serambi Madinah Gorontalo” — Benturan bilah bambu polopalo melambangkan kejujuran bertutur dan ketenangan batin dalam bermusyawarah.",
        notes: [
      { id: 1, label: "Rendah", subLabel: "480 Hz", key: "1", code: "1", freq: 480.0 },
      { id: 2, label: "Sedang", subLabel: "620 Hz", key: "2", code: "2", freq: 620.0 },
      { id: 3, label: "Tinggi", subLabel: "780 Hz", key: "3", code: "3", freq: 780.0 },
      { id: 4, label: "Puncak", subLabel: "1050 Hz", key: "4", code: "4", freq: 1050.0 },
    ],
    specs: {
      tuningSystem: "Modulasi Garpu Bambu — Bilah berlidah dua menyerupai garpu tala dengan rongga tabung pangkal yang disetel dalam nada pentatonis khas Gorontalo.",
      materialAcoustic: "Bambu pagar (bambu water) atau bambu gading tua yang dibelah rapi ujungnya menyisakan tabung pangkal pegangan.",
      playingTechnique: "Ditepuk atau dipukulkan secara ringan ke lutut pemain atau stik pemukul berlapis karet hingga lidah bambu bergetar berdenting.",
      ensembleFunction: "Iringan tari tradisional Gorontalo, musik pengisi waktu luang petani di sawah, dan pertunjukan seni festival Danau Limboto.",
    },
  },

{
    provinceNumber: 27,
    province: "Sulawesi Tengah",
    provinceCode: "ID-ST",
    provinceSlug: "sulawesi-tengah",
    islandRegion: "SULAWESI",
    id: "gimba-sulteng",
    slug: "gimba-kaili",
    title: "Gimba",
    vernacularName: "Gimba Kendang Upacara Kaili",
    ethnicGroup: "Kaili & Kulawi",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Drum berkaki upacara Kaili",
    hasGlb: true,
    mouseGuide: "Tabuh membran kendang ritual suku Kaili.",
    philosophy: "“Detak sakral lembah Palu” — Tabuhan ganda memanggil sanubari warga untuk menjaga keharmonisan alam, tanah pusaka, dan kekerabatan adat Kaili.",
        notes: [
      { id: 1, label: "Gom / Bas", subLabel: "95 Hz", key: "1", code: "1", freq: 95.0 },
      { id: 2, label: "Geng / Dengung", subLabel: "150 Hz", key: "2", code: "2", freq: 150.0 },
      { id: 3, label: "Tek / Pinggir", subLabel: "340 Hz", key: "3", code: "3", freq: 340.0 },
      { id: 4, label: "Pik / Redam", subLabel: "580 Hz", key: "4", code: "4", freq: 580.0 },
    ],
    specs: {
      tuningSystem: "Membran Ritual Suku Kaili — Dua bidang kulit pada kedua ujung silinder berdiameter berbeda (tebokan besar bersuara berat, tebokan kecil bersuara lentur nyaring).",
      materialAcoustic: "Batang kayu cendana hutan atau nangka dibubut bulat, selaput kulit kerbau atau kambing hutan dengan anyaman tali rotan pengikat.",
      playingTechnique: "Digantung pada leher atau dipangku, ditabuh bergantian dengan telapak tangan kanan dan stik pemukul tangan kiri.",
      ensembleFunction: "Iringan tari Dero (tari persaudaraan melingkar), upacara penyembuhan adat Balia, dan pesta panen Padungku di Sulawesi Tengah.",
    },
  },

{
    provinceNumber: 28,
    province: "Sulawesi Barat",
    provinceCode: "ID-SR",
    provinceSlug: "sulawesi-barat",
    islandRegion: "SULAWESI",
    id: "kecapi-mandar-sulbar",
    slug: "kecapi-mandar",
    title: "Kecapi Mandar",
    vernacularName: "Kecapi Perahu Ramping Mandar",
    ethnicGroup: "Mandar",
    interactionType: "strike",
    synthPreset: "strike_metal_wood",
    organology: "IDIOFON",
    organologyLabel: "Kecapi perahu ramping pesisir",
    hasGlb: true,
    mouseGuide: "Petik dua senar kecapi ramping khas pesisir Mandar.",
    philosophy: "“Nyanyian bahari pelaut Mandar” — Suara calong yang renyah dan syahdu melantunkan kenangan laut lepas perahu Sandeq dan ketabahan hati para penjelajah samudra.",
        notes: [
      { id: 1, label: "1", subLabel: "98 Hz", key: "1", code: "1", freq: 98.0 },
      { id: 2, label: "2", subLabel: "147 Hz", key: "2", code: "2", freq: 147.0 },
      { id: 3, label: "3", subLabel: "196 Hz", key: "3", code: "3", freq: 196.0 },
      { id: 4, label: "4", subLabel: "247 Hz", key: "4", code: "4", freq: 247.0 },
      { id: 5, label: "5", subLabel: "294 Hz", key: "5", code: "5", freq: 294.0 },
    ],
    specs: {
      tuningSystem: "Nada Dawai Perahu Mandar — Empat bilah bambu dengan interval nada pentatonis khas Mandar yang ditopang di atas separuh batok kelapa tua.",
      materialAcoustic: "Bilah bambu murni (bambu toli) yang diikat pada potongan batok kelapa kering (kalabbang) di atas alas papan kayu jati.",
      playingTechnique: "Ditabuh secara bergantian menggunakan dua stik kayu berujung tumpul dengan ketukan sinkopasi lincah.",
      ensembleFunction: "Hiburan melepas lelah para nelayan usai berlayar mencari ikan, pesta adat Sayyang Pattu'du (kuda menari), dan upacara syukuran Mandar.",
    },
  },

{
    provinceNumber: 29,
    province: "Sulawesi Selatan",
    provinceCode: "ID-SN",
    provinceSlug: "sulawesi-selatan",
    islandRegion: "SULAWESI",
    id: "keso-keso-sulsel",
    slug: "keso-keso",
    title: "Keso-Keso",
    vernacularName: "Keso-Keso / Pa'keso Toraja & Makassar",
    ethnicGroup: "Toraja, Bugis & Makassar",
    interactionType: "bow",
    synthPreset: "bow",
    organology: "KORDOFON",
    organologyLabel: "Rebab 2 senar tempurung labu",
    hasGlb: true,
    mouseGuide: "Gesek dawai tempurung labu Toraja bernada syahdu.",
    philosophy: "“Ratapan syahdu lembah Toraja” — Gesekan pilu keso-keso menyuarakan doa pengantaran arwah menuju Puya dan penghormatan luhur kepada para leluhur.",
        notes: [
      { id: 1, label: "1", subLabel: "294 Hz", key: "1", code: "1", freq: 294.0 },
      { id: 2, label: "2", subLabel: "330 Hz", key: "2", code: "2", freq: 330.0 },
      { id: 3, label: "3", subLabel: "392 Hz", key: "3", code: "3", freq: 392.0 },
      { id: 4, label: "4", subLabel: "440 Hz", key: "4", code: "4", freq: 440.0 },
      { id: 5, label: "5", subLabel: "523 Hz", key: "5", code: "5", freq: 523.0 },
    ],
    specs: {
      tuningSystem: "Dawai Gesek Toraja/Bugis — Dua dawai kawat baja/usus yang disetel berjarak interval kuint nada pentatonis mistis Toraja-Makassar.",
      materialAcoustic: "Tempurung kelapa setengah lingkaran berpenutup membran kulit katak hijau atau kulit kambing, leher kayu keras berukir Pa'tedong.",
      playingTechnique: "Busur gesek dari bilah bambu bertali rambut kuda digesek melintasi dawai sambil jari menekan dawai di papan leher.",
      ensembleFunction: "Iringan utama sastra lisan Massinggi, ritus pemakaman Rambu Solo' di Tana Toraja, dan teater tradisional Sinrilik Makassar.",
    },
  },

{
    provinceNumber: 30,
    province: "Sulawesi Tenggara",
    provinceCode: "ID-SG",
    provinceSlug: "sulawesi-tenggara",
    islandRegion: "SULAWESI",
    id: "lado-lado-sultra",
    slug: "lado-lado",
    title: "Ladolado",
    vernacularName: "Ladolado Bilah Bambu Buton",
    ethnicGroup: "Buton & Muna",
    interactionType: "bow",
    synthPreset: "bow",
    organology: "KORDOFON",
    organologyLabel: "Bilah kayu berpembuluh Buton",
    hasGlb: true,
    mouseGuide: "Pukul atau gesek bilah bambu berdawai Buton / Tolaki.",
    philosophy: "“Hikmah kesultanan benteng Buton” — Dawai gesek lado-lado melagukan petuah moral kesantunan Bula Malino dan sejarah peradaban bahari Buton.",
        notes: [
      { id: 1, label: "1", subLabel: "330 Hz", key: "1", code: "1", freq: 330.0 },
      { id: 2, label: "2", subLabel: "415 Hz", key: "2", code: "2", freq: 415.0 },
      { id: 3, label: "3", subLabel: "494 Hz", key: "3", code: "3", freq: 494.0 },
      { id: 4, label: "4", subLabel: "659 Hz", key: "4", code: "4", freq: 659.0 },
    ],
    specs: {
      tuningSystem: "Resonansi Bambu Kering — Empat dawai gesek berpasangan yang disetel dalam nada harmonis untuk alunan lagu pengiring tutur sejarah.",
      materialAcoustic: "Batang kayu mahoni atau nangka utuh berlubang rongga suara lonjong memanjang, dilapisi kulit tipis dan dilengkapi pasak pemutar.",
      playingTechnique: "Diletakkan tegak di atas pangkuan dan digesek menggunakan busur senar bersapu getah pinus dengan ketepatan intonasi halus.",
      ensembleFunction: "Pengiring tradisi bertutur Kantola di Pulau Muna, upacara adat Posuo (pingitan gadis), dan majelis kesultanan Buton.",
    },
  },

{
    provinceNumber: 31,
    province: "Maluku",
    provinceCode: "ID-MA",
    provinceSlug: "maluku",
    islandRegion: "PAPUA_MALUKU",
    id: "tifa-maluku",
    slug: "tifa-totobuang",
    title: "Totobuang",
    vernacularName: "Totobuang Gong Logam Pencon Maluku",
    ethnicGroup: "Ambon & Maluku Tengah",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Gong logam pencon Maluku",
    hasGlb: true,
    mouseGuide: "Ketuk gong kecil berjejer bernada riang kepulauan.",
    philosophy: "“Pela Gandong dalam rentak tifa” — Gema tabuhan tifa menyatukan tali persaudaraan antar negeri di kepulauan rempah tanpa memandang perbedaan.",
        notes: [
      { id: 1, label: "C5", subLabel: "523 Hz", key: "1", code: "1", freq: 523.0 },
      { id: 2, label: "D5", subLabel: "587 Hz", key: "2", code: "2", freq: 587.0 },
      { id: 3, label: "E5", subLabel: "659 Hz", key: "3", code: "3", freq: 659.0 },
      { id: 4, label: "F5", subLabel: "698 Hz", key: "4", code: "4", freq: 698.0 },
      { id: 5, label: "G5", subLabel: "784 Hz", key: "5", code: "5", freq: 784.0 },
      { id: 6, label: "A5", subLabel: "880 Hz", key: "6", code: "6", freq: 880.0 },
      { id: 7, label: "B5", subLabel: "988 Hz", key: "7", code: "7", freq: 988.0 },
    ],
    specs: {
      tuningSystem: "Tangga Nada Logam Maluku — Satu permukaan kulit rusa dengan resonator silinder tinggi berpenyetel ganjal kayu linggua penghasil dengung hangat khas Maluku.",
      materialAcoustic: "Batang kayu linggua hutan keras yang dikeruk bulat memanjang, selaput kulit rusa timor pilihan, dan lilitan rotan penegang.",
      playingTechnique: "Disandang di ketiak atau dipangku, ditepuk dengan telapak tangan bebas dan ujung jari dengan ritme bergelombang cepat.",
      ensembleFunction: "Pengiring tari Lenso, tari Cakalele, nyanyian pujian gereja/masjid, dan upacara cuci negeri di Ambon Maluku.",
    },
  },

{
    provinceNumber: 32,
    province: "Maluku Utara",
    provinceCode: "ID-MU",
    provinceSlug: "maluku-utara",
    islandRegion: "PAPUA_MALUKU",
    id: "fu-malut",
    slug: "fu-kerang",
    title: "Fu",
    vernacularName: "Terompet Kulit Kerang Fu Moloku",
    ethnicGroup: "Ternate & Tidore",
    interactionType: "blow",
    synthPreset: "blow",
    organology: "AEROFON",
    organologyLabel: "Kerang Triton tiup pesisir",
    hasGlb: true,
    mouseGuide: "Embus ke mikrofon atau klik untuk meniup kerang laut.",
    philosophy: "“Tiupan sangkakala bahari empat kesultanan” — Suara megah tahuri yang membelah ombak laut Maluku Utara adalah panggilan persatuan Moloku Kie Raha.",
        notes: [
      { id: 1, label: "Dron Dasar / F3", subLabel: "175 Hz", key: "1", code: "1", freq: 175.0 },
      { id: 2, label: "Oktaf / F4", subLabel: "350 Hz", key: "2", code: "2", freq: 350.0 },
      { id: 3, label: "Kuint / C5", subLabel: "525 Hz", key: "3", code: "3", freq: 525.0 },
      { id: 4, label: "Puncak / F5", subLabel: "700 Hz", key: "4", code: "4", freq: 700.0 },
    ],
    specs: {
      tuningSystem: "Kolom Udara Kerang Alami — Menghasilkan nada tiup akustik resonansi kerang yang bulat, tebal, dan menjangkau jarak berkilo-kilometer di perairan terbuka.",
      materialAcoustic: "Cangkang kerang triton laut dalam (Charonia tritonis) besar yang dilubangi pada bagian ujung pucuk spiral kerucutnya.",
      playingTechnique: "Ditiup dengan getaran bibir (embouchure) terfokus di lubang tiup sambil memanfaatkan rongga napas diafragma kuat.",
      ensembleFunction: "Pemberi sinyal panggilan rapat kesultanan Ternate-Tidore, tanda bahaya laut, serta pembuka upacara adat Kololi Kie.",
    },
  },

{
    provinceNumber: 33,
    province: "Papua Barat Daya",
    provinceCode: "ID-PD",
    provinceSlug: "papua-barat-daya",
    islandRegion: "PAPUA_MALUKU",
    id: "triton-pbd",
    slug: "triton-raja-ampat",
    title: "Triton",
    vernacularName: "Triton Terompet Kerang Raja Ampat",
    ethnicGroup: "Moi & Maya Raja Ampat",
    interactionType: "blow",
    synthPreset: "blow",
    organology: "AEROFON",
    organologyLabel: "Terompet kulit kerang laut Raja Ampat",
    hasGlb: true,
    mouseGuide: "Embus kerang sangkakala laut beresonansi megah.",
    philosophy: "“Gema samudra surga bahari karang dunia” — Gemuruh tiupan kerang triton mengingatkan masyarakat adat untuk senantiasa menjaga kelestarian terumbu karang laut warisan leluhur.",
        notes: [
      { id: 1, label: "Dengung Rendah", subLabel: "196 Hz", key: "1", code: "1", freq: 196.0 },
      { id: 2, label: "Dengung Tengah", subLabel: "294 Hz", key: "2", code: "2", freq: 294.0 },
      { id: 3, label: "Resonansi Buka", subLabel: "392 Hz", key: "3", code: "3", freq: 392.0 },
      { id: 4, label: "Tiupan Lepas", subLabel: "587 Hz", key: "4", code: "4", freq: 587.0 },
    ],
    specs: {
      tuningSystem: "Resonansi Akustik Kulit Kerang — Frekuensi nada fundamental aerofon alami yang kuat dan megah dengan harmonik resonansi liukan ruang cangkang kerang.",
      materialAcoustic: "Kulit siput kerang laut berukuran ekstra besar yang dipoles halus dengan lubang bibir tiup presisi di pucuk.",
      playingTechnique: "Ditiup tegak lurus dengan tekanan bibir rapat dan tiupan napas teratur menghasilkan deru berwibawa.",
      ensembleFunction: "Pemanggil penduduk pulau saat musyawarah adat kampung, penanda tiba perahu tamu terhormat, dan pesta adat festival Raja Ampat.",
    },
  },

{
    provinceNumber: 34,
    province: "Papua Barat",
    provinceCode: "ID-PB",
    provinceSlug: "papua-barat",
    islandRegion: "PAPUA_MALUKU",
    id: "guoto-papua-barat",
    slug: "guoto-arfak",
    title: "Guoto",
    vernacularName: "Guoto Kordofon Kulit Hewan Pegunungan Arfak",
    ethnicGroup: "Arfak (Meyah & Hatam)",
    interactionType: "pluck",
    synthPreset: "pluck",
    organology: "KORDOFON",
    organologyLabel: "Senar kulit di atas kayu bulat",
    hasGlb: true,
    mouseGuide: "Petik senar kulit di atas kayu bulat Papua Barat.",
    philosophy: "“Bisikan damai pegunungan Arfak” — Petikan guoto yang lembut menirukan gemericik air sungai dan kicauan burung pintar di kaki bukit Papua Barat.",
        notes: [
      { id: 1, label: "1", subLabel: "131 Hz", key: "1", code: "1", freq: 131.0 },
      { id: 2, label: "2", subLabel: "165 Hz", key: "2", code: "2", freq: 165.0 },
      { id: 3, label: "3", subLabel: "196 Hz", key: "3", code: "3", freq: 196.0 },
      { id: 4, label: "4", subLabel: "262 Hz", key: "4", code: "4", freq: 262.0 },
    ],
    specs: {
      tuningSystem: "Getaran Senar Kulit Lembu — Dawai tunggal atau ganda dari serat rotan halus yang disetel dengan bantalan kayu di atas bilik kulit penutup.",
      materialAcoustic: "Bilah kayu hutan berongga persegi yang dilapisi membran kulit kanguru pohon atau kuskus hutan serta dawai serat tanaman.",
      playingTechnique: "Ditarik dan dipetik menggunakan ujung jempol atau bilah bambu kecil sambil tangan satunya menekan titik intonasi dawai.",
      ensembleFunction: "Iringan tari Tumbutanah (tari lompat tanah Arfak), hiburan keluarga di rumah kaki seribu, dan upacara adat penyambutan sahabat.",
    },
  },

{
    provinceNumber: 35,
    province: "Papua Tengah",
    provinceCode: "ID-PT",
    provinceSlug: "papua-tengah",
    islandRegion: "PAPUA_MALUKU",
    id: "tifa-kamoro-papua-tengah",
    slug: "tifa-kamoro",
    title: "Tifa Kamoro",
    vernacularName: "Tifa Ramping Suku Kamoro Mimika",
    ethnicGroup: "Mee & Damal",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Tifa ramping ukir pesisir Mimika",
    hasGlb: true,
    mouseGuide: "Tabuh membran ramping berukir suku Kamoro Mimika.",
    philosophy: "“Nyanyian persaudaraan danau Paniai” — Tabuhan tifa mee menjaga keseimbangan relasi antara manusia suku Mee dengan alam pegunungan tengah Papua.",
        notes: [
      { id: 1, label: "Wum / Bas", subLabel: "110 Hz", key: "1", code: "1", freq: 110.0 },
      { id: 2, label: "Wam / Gema", subLabel: "180 Hz", key: "2", code: "2", freq: 180.0 },
      { id: 3, label: "Tok / Sisi", subLabel: "310 Hz", key: "3", code: "3", freq: 310.0 },
      { id: 4, label: "Cek / Tampar", subLabel: "530 Hz", key: "4", code: "4", freq: 530.0 },
    ],
    specs: {
      tuningSystem: "Karakter Membran Biawak Mimika — Rongga kayu memanjang dengan diameter lubang sedang menghasilkan suara tapukan bernada tegas dan melompat lincah.",
      materialAcoustic: "Kayu matoa hutan keras berukir geometri segitiga khas Pegunungan Tengah, selaput kulit biawak/kadal hutan dengan getah perekat alami.",
      playingTechnique: "Ditopang pada satu sisi pinggang dan ditabuh dengan ayunan tangan dinamis mengikuti tempo tarian Yuwo.",
      ensembleFunction: "Iringan perhelatan pesta babi adat Yuwo, pelantikan kepala suku, dan tarian syukur perdamaian antar marga.",
    },
  },

{
    provinceNumber: 36,
    province: "Papua",
    provinceCode: "ID-PA",
    provinceSlug: "papua",
    islandRegion: "PAPUA_MALUKU",
    id: "tifa-sentani-papua",
    slug: "tifa-sentani",
    title: "Tifa Sentani",
    vernacularName: "Tifa Berpegangan Lengkung Danau Sentani",
    ethnicGroup: "Asmat & Sentani",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Tifa berpegangan lengkung Sentani",
    hasGlb: true,
    mouseGuide: "Ketuk kulit tifa kayu danau Sentani berongga kering.",
    philosophy: "“Detak jantung bumi Cenderawasih” — Tifa bukan sekadar alat musik melainkan simbol penghormatan tinggi kepada roh nenek moyang dan keberanian manusia Papua.",
        notes: [
      { id: 1, label: "Dhum / Bas", subLabel: "130 Hz", key: "1", code: "1", freq: 130.0 },
      { id: 2, label: "Dong / Tengah", subLabel: "210 Hz", key: "2", code: "2", freq: 210.0 },
      { id: 3, label: "Pak / Kering", subLabel: "360 Hz", key: "3", code: "3", freq: 360.0 },
      { id: 4, label: "Tik / Tepi", subLabel: "640 Hz", key: "4", code: "4", freq: 640.0 },
    ],
    specs: {
      tuningSystem: "Rongga Kayu Hutan Sentani — Tala membran distabilkan dengan menempelkan beberapa butir getah damar pohon di tengah kulit biawak untuk mengatur timbre bunyi.",
      materialAcoustic: "Batang kayu pohon soang atau kayu besi berukir ukiran ukiran khas leluhur Asmat, kulit biawak (soa-soa), dan tangkai pegangan utuh.",
      playingTechnique: "Dipegang erat pada lekukan pegangannya dengan tangan kiri lalu ditabuh penuh semangat dengan telapak tangan kanan sambil melangkah serempak.",
      ensembleFunction: "Instrumen nomor satu di seluruh tarian adat Papua: tari perang, pesta ukiran Asmat, perahu naga Sentani, dan perayaan pesta panen sagu.",
    },
  },

{
    provinceNumber: 37,
    province: "Papua Pegunungan",
    provinceCode: "ID-PE",
    provinceSlug: "papua-pegunungan",
    islandRegion: "PAPUA_MALUKU",
    id: "pikon-papua-pegunungan",
    slug: "pikon-dani",
    title: "Pikon",
    vernacularName: "Pikon / Piku Lembah Baliem Dani",
    ethnicGroup: "Dani & Hubula",
    interactionType: "blow",
    synthPreset: "blow",
    organology: "IDIOFON",
    organologyLabel: "Harpa mulut bambu suku Dani",
    hasGlb: true,
    mouseGuide: "Tarik benang getar dan tiup rongga mulut Wamena.",
    philosophy: "“Suara hening kabut Lembah Baliem” — Getaran lidi bambu pikon di rongga mulut menyalurkan perasaan cinta, kerinduan, dan ketenangan jiwa di dalam rumah honai.",
        notes: [
      { id: 1, label: "Dron", subLabel: "185 Hz", key: "1", code: "1", freq: 185.0 },
      { id: 2, label: "Rongga O", subLabel: "233 Hz", key: "2", code: "2", freq: 233.0 },
      { id: 3, label: "Rongga A", subLabel: "277 Hz", key: "3", code: "3", freq: 277.0 },
      { id: 4, label: "Rongga E", subLabel: "370 Hz", key: "4", code: "4", freq: 370.0 },
      { id: 5, label: "Rongga I", subLabel: "466 Hz", key: "5", code: "5", freq: 466.0 },
    ],
    specs: {
      tuningSystem: "Formant Rongga Resonansi Mulut — Tangga nada mikrotonal yang dibentuk oleh perubahan volume rongga mulut dan tenggorokan peniup saat lidah bambu bergetar.",
      materialAcoustic: "Bilah bambu khusus (huli) berukuran kecil sekitar 10 cm, serat tali pohon alami (yut) yang diikatkan pada lidah getar tengah.",
      playingTechnique: "Diletakkan di depan bibir yang agak terbuka sebagai kotak resonansi, sementara tangan kanan menarik-narik tali penggetar secara teratur.",
      ensembleFunction: "Musik relaksasi pribadi di dalam honai saat hawa dingin menyelimuti lembah Baliem, serta festival budaya Lembah Baliem.",
    },
  },

{
    provinceNumber: 38,
    province: "Papua Selatan",
    provinceCode: "ID-PS",
    provinceSlug: "papua-selatan",
    islandRegion: "PAPUA_MALUKU",
    id: "tifa-asmat-papua-selatan",
    slug: "tifa-asmat",
    title: "Tifa Asmat",
    vernacularName: "Tifa Kayu Besi Bertatah Ukir Asmat",
    ethnicGroup: "Marind-Anim",
    interactionType: "strike",
    synthPreset: "strike_drum",
    organology: "MEMBRANOFON",
    organologyLabel: "Tifa kepala bertatah motif ukir leluhur",
    hasGlb: true,
    mouseGuide: "Tabuh tifa kayu besi ukiran totem suku Asmat.",
    philosophy: "“Gema rawa dan sabana Merauke” — Tabuhan ritmis tifa kandara mengiringi langkah para kesatria Marind menjaga tanah adat di ufuk timur nusantara.",
        notes: [
      { id: 1, label: "Bhum / Bas", subLabel: "95 Hz", key: "1", code: "1", freq: 95.0 },
      { id: 2, label: "Dhom / Gema", subLabel: "155 Hz", key: "2", code: "2", freq: 155.0 },
      { id: 3, label: "Tap / Telapak", subLabel: "290 Hz", key: "3", code: "3", freq: 290.0 },
      { id: 4, label: "Kak / Rim", subLabel: "480 Hz", key: "4", code: "4", freq: 480.0 },
    ],
    specs: {
      tuningSystem: "Resonansi Kayu Besi Totem Asmat — Resonansi akustik bodi berpinggang jam pasir (hourglass) dengan suara dentuman tegas yang mantap mengiringi langkah penari bersenjata busur.",
      materialAcoustic: "Batang kayu busur hutan Papua Selatan yang dipahat ramping di bagian tengah, membran kulit kadal soa-soa atau rusa, dan ikatan serat rotan.",
      playingTechnique: "Disandang di sisi badan atau dijepit di bawah ketiak sambil ditepuk menggunakan telapak tangan dalam langkah koreografi ritmis.",
      ensembleFunction: "Iringan tari adat Gada, pesta kesuburan tanah adat Marind-Anim, dan penyambutan pesta komunal di Merauke Papua Selatan.",
    },
  },
];

export const INSTRUMENTS_38_CATALOGUE: TraditionalInstrument38[] = RAW_INSTRUMENTS_38.map((raw) => {
  const glbUrl = `/models/instruments/${raw.provinceSlug}.glb`;
  const audioSampleUrl = `/audio/instruments/${raw.id}.mp3`;
  const notes = (raw.notes && raw.notes.length > 0)
    ? raw.notes
    : getDefaultNotes(raw.synthPreset, raw.organology);
  const gestureGuide = getGestureGuide(raw.interactionType);
  if (raw.mouseGuide) {
    gestureGuide.mouseTouch = raw.mouseGuide;
  }

  const fallbackItem: CulturalItem = {
    id: `seed-inst-${raw.id}`,
    slug: raw.slug,
    title: raw.title,
    summary: `${raw.organologyLabel} khas Suku ${raw.ethnicGroup} (${raw.province}) — ${raw.philosophy}`,
    description: `${raw.title} (${raw.vernacularName}) merupakan instrumen musik tradisional dari provinsi ${raw.province} yang dimainkan oleh masyarakat Suku ${raw.ethnicGroup}.\n\n${raw.philosophy}`,
    history: `Sistem Tangga Nada & Akustik:\n${raw.specs.tuningSystem}\n\nMaterial Alami:\n${raw.specs.materialAcoustic}`,
    meaning: `Teknik Memainkan:\n${raw.specs.playingTechnique}\n\nFungsi Adat & Sosial:\n${raw.specs.ensembleFunction}`,
    practices: raw.specs.ensembleFunction,
    status: "PUBLISHED",
    featured: raw.hasGlb,
    viewCount: 180 + raw.provinceNumber * 7,
    category: {
      id: "cat-musik",
      slug: "alat-musik",
      name: "Alat Musik Tradisional",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    region: {
      id: raw.provinceCode,
      code: raw.provinceCode,
      name: raw.province,
      islandGroup: raw.islandRegion,
      summary: `Provinsi ${raw.province}`,
      lat: -2.5,
      lng: 118.0,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    modelMedia: raw.hasGlb
      ? {
          id: `media-inst-${raw.id}`,
          name: `${raw.title} 3D Model`,
          type: "MODEL_3D",
          format: "glb",
          mimeType: "model/gltf-binary",
          size: 2500000,
          storagePath: glbUrl,
          url: glbUrl,
          attribution: `Koleksi Digitalisasi Instrumen 3D WaraNusa (${raw.province})`,
        }
      : undefined,
    hotspots: [
      {
        id: `hs-inst-1-${raw.id}`,
        itemId: `seed-inst-${raw.id}`,
        title: "Bagian Utama Penghasil Bunyi",
        description: raw.specs.tuningSystem,
        x: 0,
        y: 0.65,
        z: 0,
        published: true,
      },
      {
        id: `hs-inst-2-${raw.id}`,
        itemId: `seed-inst-${raw.id}`,
        title: "Badan Resonator Akustik",
        description: raw.specs.materialAcoustic,
        x: 0.35,
        y: 0.3,
        z: 0.2,
        published: true,
      },
      {
        id: `hs-inst-3-${raw.id}`,
        itemId: `seed-inst-${raw.id}`,
        title: "Teknik Artikulasi Tradisional",
        description: raw.specs.playingTechnique,
        x: -0.35,
        y: 0.45,
        z: 0,
        published: true,
      },
    ],
    sources: [
      {
        id: `src-inst-${raw.id}`,
        title: `Ensiklopedia Musik & Organologi Tradisional ${raw.province}: ${raw.title}`,
        author: "Direktorat Pelindungan Kebudayaan Kemendikbudristek RI",
        year: 2023,
        type: "BOOK",
        url: "https://warisanbudaya.kemdikbud.go.id",
      },
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };

  return {
    ...raw,
    glbUrl,
    modelUrl: glbUrl,
    hasGlbAsset: raw.hasGlb,
    hasAudioSample: false,
    mouseGuide: raw.mouseGuide ?? gestureGuide.mouseTouch,
    cameraGuide: gestureGuide.cameraAi,
    audioSampleUrl,
    notes: notes.map((n) => ({ ...n, code: n.code ?? n.key })),
    gestureGuide,
    fallbackItem,
  };
});

// Alias kompatibilitas
export const INSTRUMENTS_17_CATALOGUE: TraditionalInstrument38[] = INSTRUMENTS_38_CATALOGUE;
export const INSTRUMENTS_18_CATALOGUE: TraditionalInstrument38[] = INSTRUMENTS_38_CATALOGUE;
export const INSTRUMENTS_CATALOGUE: TraditionalInstrument38[] = INSTRUMENTS_38_CATALOGUE;
