<div align="center">

# 🏛️ WaraNusa — Platform Interaktif Digital Preservasi Budaya Nusantara
### *Digital Cultural Heritage Living Archives & Interactive 3D Exploration Platform*

**Kategori Lomba:** Web Development Competition  
**Ajang Kompetisi:** UIN Informatics Competition (UINIC) 8.0 — Tahun 2026  
**Tim Pengembang:** **I'm Back To Come** — **SMK Negeri 1 Bantul**  

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-1.5_Flash_Vision-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Air_Gamelan_Vision-00A389?style=for-the-badge&logo=google)](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**Kenali Akar, Jelajahi Budaya.**  
Platform digital terpadu untuk eksplorasi, pelestarian, dan pembelajaran warisan hidup budaya 38 provinsi di Nusantara melalui visualisasi digital twin 3D, organologi instrumen akustik virtual berbasis gestur tangan, asisten kurator AI cerdas, serta arsip sumber ilmiah yang terverifikasi (Pencapaian SDG 11.4).

[Jelajahi Beranda](#-panduan-memulai-cepat) • [Fitur Utama](#-fitur-unggulan) • [Arsitektur Proyek](#-arsitektur--struktur-folder) • [Panduan Evaluator Lomba](#-panduan-evaluator--juri-lomba-uinic-80)

---

</div>

## 🌟 Nilai Inovasi & Latar Belakang

Indonesia memiliki lebih dari 1.300 suku bangsa yang tersebar di 38 provinsi dengan kekayaan ragam arsitektur, musik, kriya, dan tradisi lisan yang tiada bandingnya. Namun, dokumentasi budaya sering kali terfragmentasi, sulit diakses generasi muda, dan belum memanfaatkan teknologi web interaktif modern secara maksimal.

**WaraNusa** hadir mentransformasi dokumentasi statis menjadi pengalaman imersif 4-in-1:
1. **Ruang Pamer 3D Vernakular**: Visualisasi digital twin 38 rumah adat tradisional dengan titik hotspot anotasi anatomi struktural.
2. **Atelier Musik Interaktif**: Sintesis audio frekuensi autentik (Laras Pelog & Slendro) untuk 38 instrumen daerah yang dapat dimainkan menggunakan keyboard, mouse, maupun deteksi gestur tangan bebas (*Air Gamelan* via AI Vision).
3. **Kurator AI Multimodal Vision**: Asisten budaya "Karsa" bertenaga Gemini Multimodal yang mampu memindai dan mengidentifikasi ragam motif batik, ornamen rumah adat, dan instrumen dari foto kamera secara terstruktur dan ringkas.
4. **Sistem Kurasi Bersumber (Provenance CMS)**: Manajemen konten multi-peran (Super Admin, Editor, Reviewer, Kontributor) dengan penelusuran atribusi dan rujukan ilmiah yang dapat diverifikasi langsung.

---

## 🚀 Fitur Unggulan

### 1. 🏛️ Eksplorasi 38 Rumah Adat 3D (*Vernacular Architecture 3D Twin*)
- 38 model 3D representatif dari Sabang sampai Merauke (Rumah Krong Bade Aceh, Joglo Jawa, Tongkonan Toraja, Rumah Gadang Minangkabau, Honai Papua, Baloy Mayo Kalimantan Utara, dsb.).
- Interaksi 360° orbital controls, auto-rotation studio lighting, dan titik hotspot anatomi kayu/atap/filosofi ruang.

### 2. 🎵 Atelier Musik 38 Instrumen & AI Air Gamelan (*Interactive Web Audio Engine*)
- Sintesis audio Web Audio API tanpa latensi dengan tuning nada tradisional (Pelog & Slendro) pada frekuensi akustik asli.
- **Air Gamelan MediaPipe**: Pelacakan 21 koordinat sendi tangan secara real-time via webcam untuk memukul bilah saron di udara tanpa menyentuh layar.
- Mode Melodi Contoh & Uji Tangga Nada untuk edukasi organologi akustik.

### 3. 🤖 WaraNusa AI Assistant & Deteksi Foto (*Multimodal Vision AI*)
- Integrasi Google Gemini 1.5/2.0 Flash dengan system instruction kurator budaya terkalibrasi.
- Kompresi cerdas sisi klien (HTML5 Canvas max 1024px) untuk transmisi super cepat dan hemat kuota.
- Identifikasi otomatis objek budaya foto:
  - 🏷️ **Nama Objek**: Ragam motif batik/tenun, nama rumah adat, senjata, alat musik.
  - 📍 **Asal Daerah**: Provinsi, kepulauan, dan suku asal.
  - 💡 **Filosofi & Makna**: Makna tradisi dan fungsi ritual adat.
  - 🔍 **Ciri Khas Visual**: Pola ornamen, sambungan kayu, dan material alami.

### 4. 🌐 Sistem Dwibahasa Reaktif (i18n ID <-> EN)
- Penggantian bahasa instan (Bahasa Indonesia & English) tanpa memicu reload halaman penuh.
- State tersimpan persisten di `localStorage`.
- Respons asisten AI dan suara pembaca layar menyesuaikan secara otomatis.

### 5. ♿ Aksesibilitas Inklusif Ramah Difabel (WCAG 2.1 AA Compliant)
- **Natural Text-to-Speech (TTS)**: Pemilihan suara alami browser (Google Bahasa Indonesia / English Natural) dengan kecepatan santun `rate = 0.95`.
- **Pengaturan Kenyamanan Baca**: 5 level ukuran font, 4 level tinggi garis, 4 level spasi huruf, 4 mode kontras warna (Tinggi, Monokrom, Invert), font ramah disleksia (*OpenDyslexic*), kursor besar, jeda animasi, dan garis bawah tautan.

### 6. 🛡️ RBAC CMS & Provenance Archive
- 4 Peran Pengguna: **Super Admin**, **Editor**, **Reviewer**, dan **Kontributor**.
- Formulir kontribusi publik dengan fitur pelacakan status (`Tracking Code`).
- Media Manager terproteksi dengan validasi keamanan *Magic Bytes* (mencegah file injection).

---

## 🛠️ Stack Teknologi

| Lapisan | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router, Standalone Output), React 19, TypeScript 5 |
| **Styling & UI** | Tailwind CSS 4, Radix UI Primitives, Lucide Icons, Framer Motion |
| **Grafis 3D** | Three.js, React Three Fiber (R3F), React Three Drei |
| **Vision & AI** | Google Gemini API (Multimodal Flash), MediaPipe Tasks Vision (Hand Landmarker) |
| **Audio** | Web Audio API (Synthesizer & Micro-tonal Tuning) |
| **Peta Wilayah** | Leaflet, React-Leaflet, OpenStreetMap Tile Provider |
| **Database & ORM** | PostgreSQL / SQLite via Prisma ORM |
| **State & i18n** | Zustand dengan persistence middleware |

---

## ⚡ Panduan Memulai Cepat

### Prasyarat
- **Node.js** versi 20.x atau lebih baru (atau **Bun** 1.2+)
- Peramban web modern dengan akselerasi WebGL aktif (Chrome, Edge, Firefox, Safari)

### Langkah Instalasi

```bash
# 1. Kloning repositori
git clone https://github.com/username/waranusa.git
cd waranusa

# 2. Instal dependensi
npm install

# 3. Salin berkas lingkungan
cp .env.example .env

# 4. Siapkan skema database (Prisma)
npm run db:push

# 5. Jalankan server pengembangan
npm run dev
```

Buka peramban di `http://localhost:3000` untuk mulai menjelajahi WaraNusa.

---

## 📁 Arsitektur & Struktur Folder

```
waranusa/
├── prisma/                    # Skema Prisma & seeder basis data
│   ├── schema.prisma          # Definisi relasi 13 model tabel
│   └── seed.ts                # Seeder demonstrasi data budaya Nusantara
├── public/                    # Aset statis teroptimasi
│   ├── images/                # Logo SVG/PNG, peta batik Nusantara
│   ├── models/                # 38 GLB Rumah Adat & 38 GLB Alat Musik
│   └── robots.txt             # Panduan bot mesin pencari
├── src/
│   ├── app/                   # Next.js 16 App Router
│   │   ├── api/               # REST API endpoints (Chat, Media, Auth, Admin)
│   │   ├── layout.tsx         # Root layout dengan font display swap & dynamic widgets
│   │   ├── globals.css        # Tailwind 4 theme & CSS utility variables
│   │   └── page.tsx           # Single Page Application router shell
│   ├── components/            # Komponen antarmuka modular
│   │   ├── catalog/           # Kartu katalog budaya & grid pencarian
│   │   ├── culture/           # Tampilan detail objek budaya & galeri
│   │   ├── explore/           # Penjelajahan peta 38 wilayah & ruang pamer 3D
│   │   ├── instrument/        # Panggung atelier musik tradisional
│   │   ├── landing/           # Hero section, 4 pintu tradisi, karusel sorotan
│   │   ├── shared/            # Header, footer, aksesibilitas, asisten AI
│   │   ├── three/             # ModelViewer 3D, Air Gamelan, audio engine
│   │   └── ui/                # Atomic UI components (shadcn/radix)
│   ├── data/                  # Katalog data resmi 38 provinsi, rumah adat, & instrumen
│   ├── lib/                   # Store global (i18n, auth, settings), db client, utils
│   └── server/                # Controller, service, dan validator backend
└── tests/                     # QA Test Suite komprehensif (8 test runners)
```

---

## 👨‍⚖️ Panduan Evaluator & Juri Lomba UINIC 8.0

Untuk mempermudah peninjauan dan evaluasi sistem secara menyeluruh, Dewan Juri UINIC 8.0 dapat mengakses mode evaluasi terisolasi dengan membuka tautan:  
👉 **`https://waranusa.vercel.app/login?demo=evaluator`** (atau via **`/?demo=evaluator`** / klik ganda logo WaraNusa di halaman masuk).

Sistem akan otomatis membuka panel lencana khusus evaluator beserta 4 kartu profil kredensial instan dengan tombol **"Isi otomatis"**:

| Peran Akun (*Role*) | Nama Profil Evaluator | Alamat Email | Kata Sandi (*Password*) | Lingkup Hak Akses (*RBAC*) |
|---|---|---|---|---|
| **Super Admin** | **Dewan Juri UINIC 8.0** | `evaluator@waranusa.id` | `JuriUINIC#2026` | Akses penuh: Dasbor Bento Grid, CRUD seluruh data budaya, moderasi kilat, dan konfigurasi master sistem. |
| **Editor** | **Tim Pengembang WaraNusa** | `dev@waranusa.id` | `DevWaraNusa*2026` | Manajemen katalog budaya, model 3D, hotspot, wilayah, dan kategori. |
| **Reviewer** | **Kurator Ahli Budaya** | `kurator@waranusa.id` | `KurasiWaraNusa&26` | Moderasi dan validasi rujukan ilmiah draf kiriman kontribusi publik. |
| **Kontributor** | **Komunitas Budaya Daerah** | `kontributor@waranusa.id` | `MitraWaraNusa^26` | Mengajukan draf budaya daerah baru ke dalam antrean review (*Crowdsourced Submissions*). |

> **Catatan Pengujian Penjurian:**  
> Dewan Juri dapat berganti-ganti peran secara instan menggunakan fitur *Role Switcher* di pojok kanan atas Dasbor Admin (`/admin`) tanpa perlu logout manual. Hal ini memudahkan verifikasi isolasi batas hak akses (*Role-Based Access Control / RBAC*) secara transparan.

### Skenario Uji Coba Cepat untuk Evaluator:
1. **Uji 3D & Hotspot**: Masuk ke menu `Eksplorasi 3D`, pilih rumah adat dari provinsi mana pun (misal: Rumah Gadang Minangkabau atau Tongkonan Toraja), putar objek 360°, dan klik titik penanda (*hotspot*) untuk melihat anotasi anatomi struktural.
2. **Uji Air Gamelan AI**: Masuk ke menu `Atelier Musik`, aktifkan toggle kamera "Air Gamelan", dan arahkan telunjuk tangan ke kamera untuk memainkan bilah Saron di udara via MediaPipe Vision (21 landmark tracking).
3. **Uji Vision AI Chatbot**: Buka widget asisten di sisi kanan, klik ikon kamera, unggah gambar batik/rumah adat, dan saksikan analisis terstruktur instan dari asisten AI WaraAI berbasis Google Gemini 1.5 Flash.
4. **Uji Aksesibilitas & Mode Suara**: Klik ikon aksesibilitas di kiri bawah, aktifkan "Mode Suara" untuk mendengarkan narasi Web Speech API alami berkecepatan 0.95.
5. **Uji Dasbor CMS Bento Grid**: Akses `/login?demo=evaluator`, pilih akun Super Admin, dan verifikasi tampilan dasbor Bento Grid yang bersih dari tombol melayang (*floating widgets* disembunyikan otomatis saat berada di rute `/admin`).

---

## 🧪 Pengujian & Verifikasi Kualitas

WaraNusa dilengkapi dengan QA Test Runner terotomasi yang mencakup 8 area krusial:
```bash
python3 tests/qa_test_suite.py
```
- ✅ **Test 1**: Syntax & Bracket Balance (185 file TS/TSX)
- ✅ **Test 2**: Module Resolution & Import Paths
- ✅ **Test 3**: Integritas Binary 3D GLB Asset Headers
- ✅ **Test 4**: Kelengkapan Katalog 38 Provinsi (Rumah Adat & Alat Musik)
- ✅ **Test 5**: Palet Warna Emas-Earthy Terkalibrasi (Zero Legacy Red Accents)
- ✅ **Test 6**: Validasi Frekuensi Akustik Mesin Suara (20Hz - 5000Hz)
- ✅ **Test 7**: Integritas Navigasi Rute SPA Hash Link
- ✅ **Test 8**: Metadata Viewport & Responsive Design View

---

## 📄 Lisensi & Atribusi

Proyek ini dikembangkan dengan dedikasi untuk pelestarian warisan budaya bangsa Indonesia. Seluruh model 3D, dokumentasi arsip, dan referensi rujukan tercatat secara transparan pada setiap entri halaman budaya dengan atribusi penuh kepada para akademisi, kurator museum, dan kreator sumber.

<div align="center">
  <br />
  <strong>WaraNusa — Bangga Menjaga Warisan Luhur Nusantara.</strong>
</div>
