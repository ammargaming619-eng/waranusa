"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "ID" | "EN";

export const TRANSLATIONS = {
  ID: {
    // Navigasi Header
    "nav.home": "Beranda",
    "nav.explore": "Jelajah Nusantara",
    "nav.catalog": "Katalog Budaya",
    "nav.3d": "Eksplorasi 3D",
    "nav.instruments": "Instrumen Virtual",
    "nav.login": "Masuk",
    "nav.register": "Daftar",
    "nav.search_placeholder": "Cari budaya, rumah adat, tarian, musik...",
    "nav.search_btn": "Cari",

    // Hero Banner & Peta
    "hero.badge": "Peta Interaktif Budaya Nusantara",
    "hero.title": "Jelajahi Ragam Budaya Nusantara",
    "hero.subtitle": "Dari Sabang hingga Merauke, setiap tradisi punya cerita.",
    "hero.map_btn": "Peta 38 Provinsi",
    "hero.catalog_btn": "Katalog Budaya",
    "hero.touch_hint": "Sentuh Pin Peta atau Jelajahi Ikon Budaya:",

    // Statistik Budaya
    "stats.objects": "Objek budaya terpublikasi",
    "stats.provinces": "Provinsi terpetakan penuh",
    "stats.categories": "Rumpun kategori budaya",
    "stats.sources": "Konten bersumber rujukan",

    // Ticker Lengkung
    "ticker.phrase":
      "✦ WARISAN BUDAYA NUSANTARA • 3D ARTEFAK & RUMAH ADAT • PETA 38 PROVINSI • INSTRUMEN VIRTUAL • DOKUMENTASI TERVERIFIKASI ",

    // Pameran 3D Interaktif
    "3d.title": "Eksplorasi Budaya 3D",
    "3d.houses_tab": "Arsitektur Rumah Adat",
    "3d.instruments_tab": "Alat Musik Tradisional",
    "3d.houses_heading": "Rancang Bangun Rumah Adat Nusantara",
    "3d.houses_desc":
      "Model 3D interaktif untuk mempelajari struktur konstruksi tahan gempa tanpa paku besi.",
    "3d.instruments_heading": "Resonansi Musik Tradisional Nusantara",
    "3d.instruments_desc":
      "Instrumen daerah interaktif yang dapat dimainkan langsung dengan simulasi tangga nada dan akustik alami.",
    "3d.houses_btn": "Buka 38 Rumah Adat",
    "3d.instruments_btn": "Buka 38 Alat Musik",
    "3d.tip_house":
      "Tip: Putar, geser, dan perbesar model 3D untuk mengamati susunan saka guru dan atap tumpangsari.",
    "3d.tip_instrument":
      "Tip: Ketuk bilah nada di bawah atau klik/usap pada model 3D untuk memicu suara instrumen.",
    "3d.badge_interactive": "Model 3D Interaktif • 360°",
    "3d.badge_audio": "Interaktif 3D • Web Audio",
    "3d.chip_saka": "Saka Guru & Tumpangsari",
    "3d.chip_rotate": "360° Rotasi Bebas",
    "3d.chip_houses_count": "38 Rumah Adat Lengkap",
    "3d.h1_title": "Saka Guru & Tumpangsari",
    "3d.h1_desc": "Struktur balok kayu bertingkat presisi yang kokoh tanpa paku besi.",
    "3d.h2_title": "360° Rotasi & Hotspot",
    "3d.h2_desc": "Amati konstruksi atap tajug dan detail sambungan pasak secara leluasa.",
    "3d.h3_title": "38 Rumah Adat Provinsi",
    "3d.h3_desc": "Dokumentasi digital arsitektur adat lengkap dari Sabang sampai Merauke.",
    "3d.chip_bronze": "Bilah Logam Perunggu",
    "3d.chip_pelog": "Tangga Pelog & Slendro",
    "3d.chip_instruments_count": "38 Instrumen Nusantara",
    "3d.i1_title": "Model 3D Nyata",
    "3d.i1_desc": "Amati rancakan kayu ukir berprada emas dan bilah logam perunggu.",
    "3d.i2_title": "Tangga Nada Pelog & Slendro",
    "3d.i2_desc": "Sentuh bilah nada 1–7 untuk memicu denting synthesizer Web Audio.",
    "3d.i3_title": "38 Instrumen Daerah",
    "3d.i3_desc": "Studio lengkap alat musik petik, tabuh, tiup, dan gesek nusantara.",

    // Fitur "Empat Pintu Mengenal Tradisi"
    "features.heading": "Empat Pintu Mengenal Tradisi",
    "features.desc":
      "Dirancang layaknya ruang baca dan galeri museum terbuka — memudahkan pelajar, peneliti, maupun masyarakat umum menelusuri akar budaya Nusantara.",
    "features.f1_title": "Peta 38 Wilayah Budaya",
    "features.f1_desc":
      "Temukan asal-usul setiap objek pada peta interaktif 38 provinsi — dari Sumatera hingga Papua — lengkap dengan ibu kota dan pusaka tiap daerah.",
    "features.f2_title": "Dokumentasi Bersumber",
    "features.f2_desc":
      "Setiap artikel dilengkapi rujukan buku, jurnal ilmiah, situs museum, atau arsip yang dapat diverifikasi langsung dari halaman objek.",
    "features.f3_title": "Ruang Pamer 3D Interaktif",
    "features.f3_desc":
      "Putar dan perbesar model tiga dimensi rumah adat serta artefak, lengkap dengan titik penjelasan anatomi pada struktur utamanya.",
    "features.f4_title": "Atelier Musik Virtual",
    "features.f4_desc":
      "Mainkan replika digital instrumen nusantara langsung dari peramban untuk mengenal tangga nada, laras, dan organologi akustiknya.",

    // Sorotan Budaya & Ajakan Berkontribusi
    "highlights.title": "Sorotan Budaya Nusantara",
    "highlights.desc":
      "Koleksi objek pilihan dari katalog kami — mulai dari arsitektur vernakular hingga seni pertunjukan sakral.",
    "highlights.all_btn": "Lihat semua katalog",
    "contribute.badge": "Gerakan Dokumentasi Bersama",
    "contribute.title": "Punya pengetahuan budaya daerah? Rawat bersama kami.",
    "contribute.desc":
      "Dokumentasi budaya adalah kerja bersama. Kirim tulisan, foto, atau rujukan Anda — tim kurator akan meninjau dan menerbitkannya dengan atribusi atas nama Anda.",
    "contribute.btn": "Kirim Dokumentasi",
    "contribute.note": "Tinjauan kurator terpercaya · Hak cipta & atribusi atas nama Anda",

    // Asisten & Aksesibilitas
    "chat.ask_ai": "Tanya AI",
    "chat.title": "WaraNusa AI Assistant",
    "chat.subtitle": "Asisten Kurasi Budaya Nusantara",
    "chat.welcome_heading": "Ada yang bisa saya bantu hari ini?",
    "chat.welcome_initial":
      "Sampurasun! Saya asisten budaya AI WaraNusa. Tanyakan apa saja tentang warisan tradisi, filosofi arsitektur, atau instrumen musik Nusantara.",
    "chat.placeholder": "Tanya tradisi, rumah adat, musik...",
    "chat.placeholder_photo": "Tanya detail tentang foto ini...",
    "chat.photo_ready": "Foto siap dipindai",
    "chat.photo_hint": "Ketik pertanyaan atau klik kirim untuk analisis",
    "chat.scanning": "Memindai detail objek budaya Nusantara...",
    "chat.thinking": "WaraNusa AI sedang merangkai jawaban...",
    "chat.new_chat": "Mulai percakapan baru",
    "chat.disclaimer":
      "AI dapat membuat kesalahan. Harap konfirmasi kembali informasi penting ke katalog atau kurator resmi.",
    "chat.quick_house": "Filosofi Rumah Gadang",
    "chat.quick_house_prompt":
      "Jelaskan filosofi arsitektur Rumah Gadang Minangkabau dan makna atap gonjongnya.",
    "chat.quick_gamelan": "Gamelan Saron & Slendro",
    "chat.quick_gamelan_prompt":
      "Bagaimana cara memainkan Gamelan Saron dan apa perbedaan laras Pelog dan Slendro?",
    "chat.quick_batik": "Makna Ragam Motif Batik",
    "chat.quick_batik_prompt":
      "Apa filosofi dan makna di balik motif Batik Parang dan Megamendung?",
    "chat.quick_pinisi": "Sejarah Kapal Pinisi",
    "chat.quick_pinisi_prompt":
      "Ceritakan sejarah dan keistimewaan pembuatan perahu Pinisi Bugis-Makassar.",

    "a11y.title": "Aksesibilitas",
    "a11y.subtitle": "Kenyamanan membaca & interaksi",
    "a11y.reset": "Reset",
    "a11y.close": "Tutup",
    "a11y.voice_mode": "Mode Suara",
    "a11y.voice_reading": "Membaca...",
    "a11y.voice_inactive": "Nonaktif",
    "a11y.text_size": "Perbesar Teks",
    "a11y.line_height": "Tinggi Garis",
    "a11y.letter_spacing": "Spasi Huruf",
    "a11y.contrast": "Kontras & Warna",
    "a11y.dyslexic": "Ramah Disleksia",
    "a11y.pause_anim": "Jeda Animasi",
    "a11y.large_cursor": "Kursor Besar",
    "a11y.underline_links": "Garis Tautan",
    "a11y.text_align": "Rata Kiri",
    "a11y.status_default": "Bawaan",
    "a11y.status_normal": "Normal",
    "a11y.status_standard": "Standar",
    "a11y.status_active": "Aktif",
    "a11y.status_paused": "Dijeda",
    "a11y.contrast_normal": "Normal",
    "a11y.contrast_high": "Kontras Tinggi",
    "a11y.contrast_low": "Saturasi Rendah",
    "a11y.contrast_invert": "Balikan Warna",
    "a11y.spacing_normal": "Normal",
    "a11y.spacing_light": "Ringan",
    "a11y.spacing_medium": "Sedang",
    "a11y.spacing_wide": "Luas",
    "a11y.lh_normal": "Normal (1.0X)",
    "a11y.lh_medium": "Sedang (1.5X)",
    "a11y.lh_high": "Tinggi (1.75X)",
    "a11y.lh_extra": "Ekstra (2.0X)",
    "a11y.saved_notice": "Pengaturan tersimpan otomatis di perangkat",
    "a11y.btn_label": "Buka Menu Aksesibilitas Ramah Difabel",
    "a11y.btn_title": "Menu Aksesibilitas (Ramah Difabel)",
    "a11y.reset_title": "Kembalikan semua setelan ke bawaan",
    "a11y.close_title": "Tutup panel aksesibilitas",

    // Footer
    "footer.tagline":
      "Platform eksplorasi & pelestarian budaya Indonesia — peta interaktif, katalog bersumber, model 3D, dan instrumen musik virtual.",
    "footer.explore_title": "Jelajahi",
    "footer.contribute_title": "Ikut Serta",
    "footer.contribute_action": "Kirim Dokumentasi",
    "footer.login_action": "Akun Pengelola",
    "footer.rights": "Hak cipta dilindungi undang-undang.",

    // Kepulauan & Wilayah Umum
    "islands.all": "Semua Wilayah",
    "islands.sumatera": "Sumatera",
    "islands.jawa": "Jawa",
    "islands.kalimantan": "Kalimantan",
    "islands.sulawesi": "Sulawesi",
    "islands.bali_nusa": "Bali & Nusa Tenggara",
    "islands.papua_maluku": "Papua & Maluku",
    "islands.maluku": "Maluku",
    "islands.papua": "Papua",

    // Studio Instrumen Virtual
    "instruments.studio_badge": "Studio Musik Tradisional 3D",
    "instruments.studio_provinces": "38 Provinsi",
    "instruments.select_btn": "Pilih dari 38 Alat Musik",
    "instruments.select_title": "Pilih dari 38 Alat Musik Nusantara",
    "instruments.search_placeholder": "Cari provinsi, nama alat musik, suku...",
    "instruments.tab_all": "Semua Cara Main (38)",
    "instruments.tab_strike": "Pukul / Tabuh",
    "instruments.tab_pluck": "Petik / Dawai",
    "instruments.tab_bow": "Gesek / Busur",
    "instruments.tab_shake": "Goyang / Bambu",
    "instruments.tab_blow": "Tiup / Napas",
    "instruments.master_volume": "Volume Master",
    "instruments.controls_tab": "Tab Nada & Panduan",
    "instruments.culture_tab": "Organologi & Budaya",
    "instruments.guide_heading": "Daftar Bilah Nada & Cara Memainkan",
    "instruments.guide_sub": "Sentuh bilah nada atau tekan tombol angka keyboard 1–7 untuk memainkan resonansi Web Audio.",
    "instruments.tap_model_hint": "Tip: Klik atau usap pada kanvas model 3D untuk memicu denting audio secara visual.",
    "instruments.prop_province": "Provinsi Asal",
    "instruments.prop_ethnic": "Suku / Etnis",
    "instruments.prop_vernacular": "Nama Vernakular",
    "instruments.prop_organology": "Rumpun Organologi",
    "instruments.prop_tuning": "Sistem Tangga Nada",
    "instruments.prop_material": "Material Akustik",
    "instruments.prop_playing": "Teknik Permainan",
    "instruments.prop_ensemble": "Fungsi Musik & Ensemble",
    "instruments.explore_catalog": "Buka di Katalog Budaya",
    "instruments.empty_filtered": "Tidak ada instrumen yang cocok dengan filter",
    "instruments.empty_filtered_sub": "Coba ubah kata kunci pencarian atau pilih kategori pulau yang berbeda.",

    // Eksplorasi 3D Rumah Adat
    "explore3d.header_badge": "Eksplorasi Budaya 3D",
    "explore3d.header_title": "Arsitektur Vernakular Nusantara",
    "explore3d.header_sub": "Rancang bangun tahan gempa 38 rumah adat nusantara dengan sambungan pasak kayu tanpa paku besi.",
    "explore3d.select_btn": "Pilih dari 38 Rumah Adat",
    "explore3d.select_title": "Pilih dari 38 Rumah Adat Provinsi",
    "explore3d.search_placeholder": "Cari nama rumah adat, provinsi, suku...",
    "explore3d.view_strip": "Lajur",
    "explore3d.view_grid": "Kisi",
    "explore3d.auto_rotate": "Putar Otomatis",
    "explore3d.pause_rotate": "Jeda Putar",
    "explore3d.reset_angle": "Reset Sudut",
    "explore3d.fullscreen": "Layar Penuh",
    "explore3d.exit_fullscreen": "Keluar",
    "explore3d.specs_heading": "Bedah Anatomi & Filosofi Arsitektur",
    "explore3d.spec_structure": "Struktur Pasak Bebas Paku",
    "explore3d.spec_material": "Bahan Alami Vernakular",
    "explore3d.spec_roof": "Geometri Atap & Aerodinamika",
    "explore3d.spec_sacred": "Fungsi Sosial & Sakral",
    "explore3d.open_catalog": "Pelajari Lengkap di Katalog Budaya",
    "explore3d.hotspot_title": "Titik Struktur Anatomi",
    "explore3d.tip_controls": "Gunakan mouse (klik-seret untuk rotasi 360°, scroll untuk zoom, klik kanan untuk geser).",

    // Peta Jelajah / Atlas Nusantara
    "atlas.header_badge": "Peta Interaktif Wilayah Budaya",
    "atlas.header_title": "38 Wilayah Budaya Nusantara",
    "atlas.header_sub": "Telusuri pusaka, rumah adat, instrumen musik, dan ragam tradisi dari Sabang sampai Merauke.",
    "atlas.search_placeholder": "Cari provinsi atau ibu kota...",
    "atlas.filter_all": "Semua (38)",
    "atlas.map_tip": "Klik pin atau nama provinsi pada peta untuk membuka kurasi wilayah.",
    "atlas.capital": "Ibu Kota",
    "atlas.ethnic": "Suku Dominan",
    "atlas.mapped_count": "Objek Budaya Terpetakan",
    "atlas.house_label": "Rumah Adat",
    "atlas.instrument_label": "Alat Musik",
    "atlas.open_profile": "Buka Profil Provinsi",
    "atlas.view_catalog": "Lihat di Katalog Budaya",
    "atlas.no_province": "Pilih salah satu provinsi pada peta atau daftar di atas untuk melihat rangkuman kurasi.",

    // Katalog Budaya
    "catalog.header_title": "Katalog Budaya Nusantara",
    "catalog.header_sub": "Khazanah kekayaan budaya yang terverifikasi dan bersumber rujukan kredibel.",
    "catalog.search_placeholder": "Cari objek budaya, tradisi, arsitektur...",
    "catalog.all_categories": "Semua Kategori",
    "catalog.all_regions": "Semua Wilayah (38)",
    "catalog.sort_label": "Urutan",
    "catalog.sort_newest": "Terbaru",
    "catalog.sort_oldest": "Terlama",
    "catalog.sort_popular": "Terpopuler",
    "catalog.sort_title": "Judul A–Z",
    "catalog.found_count": "Ditemukan {count} objek budaya",
    "catalog.reset_filters": "Reset Filter",
    "catalog.empty_title": "Objek budaya tidak ditemukan",
    "catalog.empty_sub": "Coba gunakan kata kunci lain atau kosongkan filter kategori dan wilayah.",
    "catalog.showing_page": "Halaman {current} dari {total}",

    // CMS & Panel Admin
    "admin.portal": "CMS Pengelolaan",
    "admin.back_to_public": "Kembali ke Beranda Publik",
    "admin.evaluator_session": "Sesi Evaluator Lomba Aktif",
    "admin.public_site": "Situs Publik",
    "admin.logout": "Keluar",
    "admin.dashboard": "Dashboard",
    "admin.cultural_items": "Objek Budaya",
    "admin.regions": "Wilayah",
    "admin.categories": "Kategori",
    "admin.media": "Media Manager",
    "admin.sources": "Sumber & Atribusi",
    "admin.contributions": "Kontribusi",
    "admin.users": "Pengguna",
    "admin.settings": "Pengaturan",
    "admin.stat_items": "Total Objek Budaya",
    "admin.stat_regions": "Wilayah Terpetakan",
    "admin.stat_categories": "Rumpun Kategori",
    "admin.stat_contributions": "Kontribusi Masuk",
    "admin.stat_published": "Terbit Publik",
    "admin.stat_review": "Menunggu Tinjauan",
    "admin.recent_activity": "Aktivitas Terbaru",
    "admin.quick_actions": "Aksi Cepat",
    "admin.add_item": "Tambah Objek Budaya",
    "admin.upload_media": "Unggah Foto / Media",
    "admin.review_contributions": "Tinjau Kontribusi",
    "admin.system_online": "Sistem Online",
  },
  EN: {
    // Navigasi Header
    "nav.home": "Home",
    "nav.explore": "Explore Archipelago",
    "nav.catalog": "Cultural Catalog",
    "nav.3d": "3D Heritage",
    "nav.instruments": "Virtual Instruments",
    "nav.login": "Sign In",
    "nav.register": "Register",
    "nav.search_placeholder": "Search heritage, architecture, dances, music...",
    "nav.search_btn": "Search",

    // Hero Banner & Peta
    "hero.badge": "Interactive Archipelago Cultural Map",
    "hero.title": "Explore the Diversity of the Archipelago",
    "hero.subtitle": "From Sabang to Merauke, every tradition holds a living story.",
    "hero.map_btn": "38 Provinces Map",
    "hero.catalog_btn": "Cultural Catalog",
    "hero.touch_hint": "Tap map pins or explore cultural highlights:",

    // Statistik Budaya
    "stats.objects": "Documented cultural assets",
    "stats.provinces": "Provinces fully mapped",
    "stats.categories": "Distinct cultural categories",
    "stats.sources": "Verified archival references",

    // Ticker Lengkung
    "ticker.phrase":
      "✦ INDONESIAN CULTURAL HERITAGE • 3D ARTIFACTS & ARCHITECTURE • 38 PROVINCES MAP • VIRTUAL INSTRUMENTS • VERIFIED DOCUMENTATION ",

    // Pameran 3D Interaktif
    "3d.title": "3D Cultural Exploration",
    "3d.houses_tab": "Traditional Architecture",
    "3d.instruments_tab": "Traditional Instruments",
    "3d.houses_heading": "Architectural Blueprint of Nusantara",
    "3d.houses_desc":
      "Interactive 3D models to study earthquake-resistant interlocking timber construction without iron nails.",
    "3d.instruments_heading": "Resonance of Traditional Nusantara Music",
    "3d.instruments_desc":
      "Playable interactive regional instruments simulated with authentic Pelog & Slendro tuning scales.",
    "3d.houses_btn": "Explore 38 Houses",
    "3d.instruments_btn": "Play 38 Instruments",
    "3d.tip_house":
      "Tip: Rotate, pan, and zoom the 3D model to examine timber joinery and tiered roof construction.",
    "3d.tip_instrument":
      "Tip: Tap the key bars below or swipe over the 3D model to trigger acoustic resonance.",
    "3d.badge_interactive": "Interactive 3D • 360°",
    "3d.badge_audio": "Interactive 3D • Web Audio",
    "3d.chip_saka": "Timber Joinery & Tiered Roof",
    "3d.chip_rotate": "360° Free Rotation",
    "3d.chip_houses_count": "38 Complete Traditional Houses",
    "3d.h1_title": "Saka Guru & Tiered Timber Joinery",
    "3d.h1_desc": "Interlocking timber joinery engineered to withstand seismic tremors without iron nails.",
    "3d.h2_title": "360° Free Rotation & Hotspots",
    "3d.h2_desc": "Freely inspect timber mortise-and-tenon craftsmanship and ornate tiered eaves.",
    "3d.h3_title": "38 Provincial Traditional Houses",
    "3d.h3_desc": "Comprehensive digital vernacular architecture archive from Sabang to Merauke.",
    "3d.chip_bronze": "Bronze Metallophone Bars",
    "3d.chip_pelog": "Pelog & Slendro Scales",
    "3d.chip_instruments_count": "38 Nusantara Instruments",
    "3d.i1_title": "Authentic 3D Virtual Instruments",
    "3d.i1_desc": "Examine gilded teakwood frames and tuned bronze metallophone bars.",
    "3d.i2_title": "Pelog & Slendro Microtonal Scales",
    "3d.i2_desc": "Tap keys 1–7 to trigger authentic synthesized Web Audio harmonic resonance.",
    "3d.i3_title": "38 Regional Musical Instruments",
    "3d.i3_desc": "Full interactive atelier spanning plucked, struck, blown, and bowed traditions.",

    // Fitur "Empat Pintu Mengenal Tradisi"
    "features.heading": "Four Portals to Heritage",
    "features.desc":
      "Designed like an open museum gallery and reading room — empowering students, researchers, and cultural enthusiasts to explore Indonesian heritage.",
    "features.f1_title": "Interactive Map of 38 Cultural Regions",
    "features.f1_desc":
      "Discover the origin of each cultural treasure on an interactive map across all 38 provinces — from Sumatra to Papua — complete with regional capitals and living legacies.",
    "features.f2_title": "Verified & Sourced Documentation",
    "features.f2_desc":
      "Every cultural entry includes verified archival references, academic journals, museum catalogs, and scholarly bibliography accessible directly from each page.",
    "features.f3_title": "Interactive 3D Virtual Showroom",
    "features.f3_desc":
      "Rotate, inspect, and zoom interactive 3D digital twins of vernacular architecture and traditional artifacts with anatomical structural hotspots.",
    "features.f4_title": "Virtual Musical Atelier",
    "features.f4_desc":
      "Play digital replicas of Indonesian instruments directly in your browser to experience authentic acoustic organology, Pelog, and Slendro scales.",

    // Sorotan Budaya & Ajakan Berkontribusi
    "highlights.title": "Indonesian Heritage Highlights",
    "highlights.desc":
      "Curated selection from our archive — spanning vernacular architecture to sacred performing arts.",
    "highlights.all_btn": "Explore Full Catalog",
    "contribute.badge": "Collaborative Archiving Initiative",
    "contribute.title": "Have indigenous cultural knowledge? Preserve it with us.",
    "contribute.desc":
      "Preserving living heritage is a collective effort. Submit field notes, photographs, or archival references — our curatorial board will review and publish with direct attribution.",
    "contribute.btn": "Submit Cultural Records",
    "contribute.note": "Trusted peer-curated review · Retain copyright & full attribution",

    // Asisten & Aksesibilitas
    "chat.ask_ai": "Ask AI",
    "chat.title": "WaraNusa AI Assistant",
    "chat.subtitle": "Ready to guide your cultural exploration",
    "chat.welcome_heading": "How can I guide your cultural discovery today?",
    "chat.welcome_initial":
      "Greetings! I am WaraNusa's AI Cultural Curator. Ask me anything about living traditions, indigenous architecture, textiles, or virtual instruments.",
    "chat.placeholder": "Ask about traditions, traditional houses, music...",
    "chat.placeholder_photo": "Ask about this cultural photo...",
    "chat.photo_ready": "Photo ready to analyze",
    "chat.photo_hint": "Add questions or click send for AI vision analysis",
    "chat.scanning": "Scanning Indonesian cultural heritage details...",
    "chat.thinking": "WaraNusa AI is synthesizing response...",
    "chat.new_chat": "Start new conversation",
    "chat.disclaimer":
      "AI may generate approximations. Verify crucial cultural records with our sourced catalog or curators.",
    "chat.quick_house": "Philosophy of Gadang House",
    "chat.quick_house_prompt":
      "Explain the architectural philosophy of Minangkabau Rumah Gadang and the symbolism of its gonjong roof.",
    "chat.quick_gamelan": "Saron Gamelan & Slendro Tuning",
    "chat.quick_gamelan_prompt":
      "How is the Gamelan Saron played and what is the acoustic distinction between Pelog and Slendro tuning scales?",
    "chat.quick_batik": "Symbolism of Batik Motifs",
    "chat.quick_batik_prompt":
      "What is the philosophical meaning behind Parang and Megamendung batik motifs?",
    "chat.quick_pinisi": "Heritage of Pinisi Ship",
    "chat.quick_pinisi_prompt":
      "Recount the heritage and UNESCO master shipwright techniques of Bugis-Makassar Pinisi schooners.",

    "a11y.title": "Accessibility",
    "a11y.subtitle": "Reading comfort & interaction",
    "a11y.reset": "Reset",
    "a11y.close": "Close",
    "a11y.voice_mode": "Voice Narration Mode",
    "a11y.voice_reading": "Reading...",
    "a11y.voice_inactive": "Inactive",
    "a11y.text_size": "Text Size",
    "a11y.line_height": "Line Height",
    "a11y.letter_spacing": "Letter Spacing",
    "a11y.contrast": "Contrast & Color",
    "a11y.dyslexic": "Dyslexia Friendly",
    "a11y.pause_anim": "Pause Animations",
    "a11y.large_cursor": "Large Cursor",
    "a11y.underline_links": "Underline Links",
    "a11y.text_align": "Left Align",
    "a11y.status_default": "Default",
    "a11y.status_normal": "Normal",
    "a11y.status_standard": "Standard",
    "a11y.status_active": "Active",
    "a11y.status_paused": "Paused",
    "a11y.contrast_normal": "Normal",
    "a11y.contrast_high": "High Contrast",
    "a11y.contrast_low": "Low Saturation",
    "a11y.contrast_invert": "Invert Colors",
    "a11y.spacing_normal": "Normal",
    "a11y.spacing_light": "Light",
    "a11y.spacing_medium": "Medium",
    "a11y.spacing_wide": "Wide",
    "a11y.lh_normal": "Normal (1.0X)",
    "a11y.lh_medium": "Medium (1.5X)",
    "a11y.lh_high": "High (1.75X)",
    "a11y.lh_extra": "Extra (2.0X)",
    "a11y.saved_notice": "Settings saved automatically on device",
    "a11y.btn_label": "Open Accessibility Menu",
    "a11y.btn_title": "Accessibility Menu (Inclusive)",
    "a11y.reset_title": "Reset all settings to default",
    "a11y.close_title": "Close accessibility panel",

    // Footer
    "footer.tagline":
      "Platform for exploring & preserving Indonesian cultural heritage — interactive maps, sourced catalog, 3D models, and virtual instruments.",
    "footer.explore_title": "Explore",
    "footer.contribute_title": "Get Involved",
    "footer.contribute_action": "Submit Documentation",
    "footer.login_action": "Curator Portal",
    "footer.rights": "All rights reserved.",

    // Islands & Common Regions
    "islands.all": "All Regions",
    "islands.sumatera": "Sumatra",
    "islands.jawa": "Java",
    "islands.kalimantan": "Kalimantan",
    "islands.sulawesi": "Sulawesi",
    "islands.bali_nusa": "Bali & Nusa Tenggara",
    "islands.papua_maluku": "Papua & Maluku",
    "islands.maluku": "Maluku",
    "islands.papua": "Papua",

    // Virtual Instruments Studio
    "instruments.studio_badge": "3D Traditional Music Studio",
    "instruments.studio_provinces": "38 Provinces",
    "instruments.select_btn": "Select from 38 Instruments",
    "instruments.select_title": "Select from 38 Indonesian Musical Instruments",
    "instruments.search_placeholder": "Search province, instrument name, ethnic group...",
    "instruments.tab_all": "All Playing Techniques (38)",
    "instruments.tab_strike": "Strike / Percussion",
    "instruments.tab_pluck": "Pluck / Strings",
    "instruments.tab_bow": "Bow / Strings",
    "instruments.tab_shake": "Shake / Bamboo",
    "instruments.tab_blow": "Blow / Wind",
    "instruments.master_volume": "Master Volume",
    "instruments.controls_tab": "Notes & Playing Guide",
    "instruments.culture_tab": "Organology & Heritage",
    "instruments.guide_heading": "Note Keys & Playing Technique",
    "instruments.guide_sub": "Tap key bars or press number keys 1–7 to trigger authentic Web Audio harmonic resonance.",
    "instruments.tap_model_hint": "Tip: Click or swipe over the 3D model canvas to visually trigger acoustic resonance.",
    "instruments.prop_province": "Origin Province",
    "instruments.prop_ethnic": "Ethnic Group",
    "instruments.prop_vernacular": "Vernacular Name",
    "instruments.prop_organology": "Organology Classification",
    "instruments.prop_tuning": "Tuning Scale System",
    "instruments.prop_material": "Acoustic Material",
    "instruments.prop_playing": "Performance Technique",
    "instruments.prop_ensemble": "Ensemble Role & Function",
    "instruments.explore_catalog": "Explore in Cultural Catalog",
    "instruments.empty_filtered": "No instruments match the selected filter",
    "instruments.empty_filtered_sub": "Try modifying your search query or selecting a different island region.",

    // 3D Traditional House Exploration
    "explore3d.header_badge": "3D Cultural Exploration",
    "explore3d.header_title": "Vernacular Architecture of Nusantara",
    "explore3d.header_sub": "Earthquake-resistant timber engineering across 38 traditional houses constructed without iron nails.",
    "explore3d.select_btn": "Select from 38 Traditional Houses",
    "explore3d.select_title": "Select from 38 Provincial Traditional Houses",
    "explore3d.search_placeholder": "Search traditional house, province, ethnic group...",
    "explore3d.view_strip": "Strip",
    "explore3d.view_grid": "Grid",
    "explore3d.auto_rotate": "Auto Rotate",
    "explore3d.pause_rotate": "Pause",
    "explore3d.reset_angle": "Reset View",
    "explore3d.fullscreen": "Fullscreen",
    "explore3d.exit_fullscreen": "Exit",
    "explore3d.specs_heading": "Anatomical Dissection & Architectural Philosophy",
    "explore3d.spec_structure": "Nail-Free Timber Joinery",
    "explore3d.spec_material": "Indigenous Natural Materials",
    "explore3d.spec_roof": "Roof Aerodynamics & Geometry",
    "explore3d.spec_sacred": "Social & Sacred Function",
    "explore3d.open_catalog": "Read Full Sourced Record in Catalog",
    "explore3d.hotspot_title": "Structural Hotspots",
    "explore3d.tip_controls": "Use mouse controls (click-drag to rotate 360°, scroll to zoom, right-click to pan).",

    // Interactive Map / Atlas
    "atlas.header_badge": "Interactive Cultural Region Map",
    "atlas.header_title": "38 Cultural Regions of Nusantara",
    "atlas.header_sub": "Explore living traditions, vernacular houses, and musical instruments across Indonesia from Sabang to Merauke.",
    "atlas.search_placeholder": "Search province or regional capital...",
    "atlas.filter_all": "All (38)",
    "atlas.map_tip": "Click pins or regional names on the map to inspect curatorial details.",
    "atlas.capital": "Provincial Capital",
    "atlas.ethnic": "Dominant Ethnic Groups",
    "atlas.mapped_count": "Mapped Cultural Assets",
    "atlas.house_label": "Traditional Architecture",
    "atlas.instrument_label": "Musical Instrument",
    "atlas.open_profile": "Open Province Profile",
    "atlas.view_catalog": "View in Cultural Catalog",
    "atlas.no_province": "Select any province on the map or island filter above to inspect verified curatorial records.",

    // Cultural Catalog
    "catalog.header_title": "Indonesian Cultural Catalog",
    "catalog.header_sub": "Verified repository of living traditions with academic citations and archival bibliography.",
    "catalog.search_placeholder": "Search cultural objects, dances, crafts...",
    "catalog.all_categories": "All Categories",
    "catalog.all_regions": "All Regions (38)",
    "catalog.sort_label": "Sort By",
    "catalog.sort_newest": "Newest",
    "catalog.sort_oldest": "Oldest",
    "catalog.sort_popular": "Most Popular",
    "catalog.sort_title": "Title A–Z",
    "catalog.found_count": "Found {count} cultural records",
    "catalog.reset_filters": "Reset Filters",
    "catalog.empty_title": "No cultural records found",
    "catalog.empty_sub": "Try adjusting your search terms or clearing selected category and region filters.",
    "catalog.showing_page": "Page {current} of {total}",

    // CMS & Admin Panel
    "admin.portal": "Curator Portal",
    "admin.back_to_public": "Back to Public Home",
    "admin.evaluator_session": "Evaluator / Judge Active Session",
    "admin.public_site": "Public Site",
    "admin.logout": "Log Out",
    "admin.dashboard": "Dashboard",
    "admin.cultural_items": "Cultural Items",
    "admin.regions": "Regions",
    "admin.categories": "Categories",
    "admin.media": "Media Manager",
    "admin.sources": "Sources & Attribution",
    "admin.contributions": "Submissions",
    "admin.users": "Users",
    "admin.settings": "Settings",
    "admin.stat_items": "Total Cultural Records",
    "admin.stat_regions": "Mapped Provinces",
    "admin.stat_categories": "Cultural Categories",
    "admin.stat_contributions": "Received Submissions",
    "admin.stat_published": "Published Live",
    "admin.stat_review": "Pending Review",
    "admin.recent_activity": "Recent Activity",
    "admin.quick_actions": "Quick Actions",
    "admin.add_item": "Create Cultural Record",
    "admin.upload_media": "Upload Photo / Media",
    "admin.review_contributions": "Review Submissions",
    "admin.system_online": "System Online",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["ID"];

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

export const useTranslation = create<I18nState>()(
  persist(
    (set, get) => ({
      language: "ID",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "ID" ? "EN" : "ID" })),
      t: (key, fallback) => {
        const lang = get().language;
        const dict = TRANSLATIONS[lang] as Record<string, string>;
        if (dict && dict[key]) {
          return dict[key];
        }
        // Fallback ke bahasa Indonesia jika belum ada terjemahan
        const idDict = TRANSLATIONS.ID as Record<string, string>;
        if (idDict && idDict[key]) {
          return idDict[key];
        }
        return fallback ?? key;
      },
    }),
    {
      name: "waranusa_language_preference",
    }
  )
);
