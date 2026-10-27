import type { CulturalItem, Category, Region } from "@/lib/types";

export const CULTURAL_CATEGORIES_DATASET: Category[] = [
  {
    "id": "cat-rumah-adat",
    "slug": "rumah-adat",
    "name": "Rumah Adat & Arsitektur",
    "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
    "icon": "landmark",
    "sortOrder": 1
  },
  {
    "id": "cat-alat-musik",
    "slug": "alat-musik",
    "name": "Alat Musik Tradisional",
    "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
    "icon": "music",
    "sortOrder": 2
  },
  {
    "id": "cat-tekstil",
    "slug": "tekstil",
    "name": "Pakaian Adat & Tekstil",
    "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
    "icon": "shirt",
    "sortOrder": 3
  },
  {
    "id": "cat-tarian",
    "slug": "tarian",
    "name": "Tarian & Seni Pertunjukan",
    "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
    "icon": "drama",
    "sortOrder": 4
  },
  {
    "id": "cat-kuliner",
    "slug": "kuliner",
    "name": "Makanan Khas",
    "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
    "icon": "utensils-crossed",
    "sortOrder": 5
  },
  {
    "id": "cat-tradisi",
    "slug": "tradisi",
    "name": "Tradisi & Pengetahuan Lokal",
    "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
    "icon": "book-open",
    "sortOrder": 6
  }
];

export const PROVINCES_38_ALPHABETICAL: Region[] = [
  {
    id: "reg-id-ac",
    code: "ID-AC",
    name: "Aceh",
    islandGroup: "SUMATERA",
    summary: "Aceh",
  },
  {
    id: "reg-id-ba",
    code: "ID-BA",
    name: "Bali",
    islandGroup: "BALI_NUSA",
    summary: "Bali",
  },
  {
    id: "reg-id-bt",
    code: "ID-BT",
    name: "Banten",
    islandGroup: "JAWA",
    summary: "Banten",
  },
  {
    id: "reg-id-be",
    code: "ID-BE",
    name: "Bengkulu",
    islandGroup: "SUMATERA",
    summary: "Bengkulu",
  },
  {
    id: "reg-id-yo",
    code: "ID-YO",
    name: "D.I. Yogyakarta",
    islandGroup: "JAWA",
    summary: "D.I. Yogyakarta",
  },
  {
    id: "reg-id-jk",
    code: "ID-JK",
    name: "D.K.I. Jakarta",
    islandGroup: "JAWA",
    summary: "D.K.I. Jakarta",
  },
  {
    id: "reg-id-go",
    code: "ID-GO",
    name: "Gorontalo",
    islandGroup: "SULAWESI",
    summary: "Gorontalo",
  },
  {
    id: "reg-id-ja",
    code: "ID-JA",
    name: "Jambi",
    islandGroup: "SUMATERA",
    summary: "Jambi",
  },
  {
    id: "reg-id-jb",
    code: "ID-JB",
    name: "Jawa Barat",
    islandGroup: "JAWA",
    summary: "Jawa Barat",
  },
  {
    id: "reg-id-jt",
    code: "ID-JT",
    name: "Jawa Tengah",
    islandGroup: "JAWA",
    summary: "Jawa Tengah",
  },
  {
    id: "reg-id-ji",
    code: "ID-JI",
    name: "Jawa Timur",
    islandGroup: "JAWA",
    summary: "Jawa Timur",
  },
  {
    id: "reg-id-kb",
    code: "ID-KB",
    name: "Kalimantan Barat",
    islandGroup: "KALIMANTAN",
    summary: "Kalimantan Barat",
  },
  {
    id: "reg-id-ks",
    code: "ID-KS",
    name: "Kalimantan Selatan",
    islandGroup: "KALIMANTAN",
    summary: "Kalimantan Selatan",
  },
  {
    id: "reg-id-kt",
    code: "ID-KT",
    name: "Kalimantan Tengah",
    islandGroup: "KALIMANTAN",
    summary: "Kalimantan Tengah",
  },
  {
    id: "reg-id-ki",
    code: "ID-KI",
    name: "Kalimantan Timur",
    islandGroup: "KALIMANTAN",
    summary: "Kalimantan Timur",
  },
  {
    id: "reg-id-ku",
    code: "ID-KU",
    name: "Kalimantan Utara",
    islandGroup: "KALIMANTAN",
    summary: "Kalimantan Utara",
  },
  {
    id: "reg-id-bb",
    code: "ID-BB",
    name: "Kepulauan Bangka Belitung",
    islandGroup: "SUMATERA",
    summary: "Kepulauan Bangka Belitung",
  },
  {
    id: "reg-id-kr",
    code: "ID-KR",
    name: "Kepulauan Riau",
    islandGroup: "SUMATERA",
    summary: "Kepulauan Riau",
  },
  {
    id: "reg-id-la",
    code: "ID-LA",
    name: "Lampung",
    islandGroup: "SUMATERA",
    summary: "Lampung",
  },
  {
    id: "reg-id-ma",
    code: "ID-MA",
    name: "Maluku",
    islandGroup: "MALUKU",
    summary: "Maluku",
  },
  {
    id: "reg-id-mu",
    code: "ID-MU",
    name: "Maluku Utara",
    islandGroup: "MALUKU",
    summary: "Maluku Utara",
  },
  {
    id: "reg-id-nb",
    code: "ID-NB",
    name: "Nusa Tenggara Barat",
    islandGroup: "BALI_NUSA",
    summary: "Nusa Tenggara Barat",
  },
  {
    id: "reg-id-nt",
    code: "ID-NT",
    name: "Nusa Tenggara Timur",
    islandGroup: "BALI_NUSA",
    summary: "Nusa Tenggara Timur",
  },
  {
    id: "reg-id-pa",
    code: "ID-PA",
    name: "Papua",
    islandGroup: "PAPUA",
    summary: "Papua",
  },
  {
    id: "reg-id-pb",
    code: "ID-PB",
    name: "Papua Barat",
    islandGroup: "PAPUA",
    summary: "Papua Barat",
  },
  {
    id: "reg-id-pd",
    code: "ID-PD",
    name: "Papua Barat Daya",
    islandGroup: "PAPUA",
    summary: "Papua Barat Daya",
  },
  {
    id: "reg-id-pe",
    code: "ID-PE",
    name: "Papua Pegunungan",
    islandGroup: "PAPUA",
    summary: "Papua Pegunungan",
  },
  {
    id: "reg-id-ps",
    code: "ID-PS",
    name: "Papua Selatan",
    islandGroup: "PAPUA",
    summary: "Papua Selatan",
  },
  {
    id: "reg-id-pt",
    code: "ID-PT",
    name: "Papua Tengah",
    islandGroup: "PAPUA",
    summary: "Papua Tengah",
  },
  {
    id: "reg-id-ri",
    code: "ID-RI",
    name: "Riau",
    islandGroup: "SUMATERA",
    summary: "Riau",
  },
  {
    id: "reg-id-sr",
    code: "ID-SR",
    name: "Sulawesi Barat",
    islandGroup: "SULAWESI",
    summary: "Sulawesi Barat",
  },
  {
    id: "reg-id-sn",
    code: "ID-SN",
    name: "Sulawesi Selatan",
    islandGroup: "SULAWESI",
    summary: "Sulawesi Selatan",
  },
  {
    id: "reg-id-st",
    code: "ID-ST",
    name: "Sulawesi Tengah",
    islandGroup: "SULAWESI",
    summary: "Sulawesi Tengah",
  },
  {
    id: "reg-id-sg",
    code: "ID-SG",
    name: "Sulawesi Tenggara",
    islandGroup: "SULAWESI",
    summary: "Sulawesi Tenggara",
  },
  {
    id: "reg-id-sa",
    code: "ID-SA",
    name: "Sulawesi Utara",
    islandGroup: "SULAWESI",
    summary: "Sulawesi Utara",
  },
  {
    id: "reg-id-sb",
    code: "ID-SB",
    name: "Sumatera Barat",
    islandGroup: "SUMATERA",
    summary: "Sumatera Barat",
  },
  {
    id: "reg-id-ss",
    code: "ID-SS",
    name: "Sumatera Selatan",
    islandGroup: "SUMATERA",
    summary: "Sumatera Selatan",
  },
  {
    id: "reg-id-su",
    code: "ID-SU",
    name: "Sumatera Utara",
    islandGroup: "SUMATERA",
    summary: "Sumatera Utara",
  },
];

export const MASTER_CULTURAL_CATALOGUE: CulturalItem[] = [
  {
    "id": "item-inst-angklung",
    "slug": "angklung",
    "title": "Alat Musik Angklung",
    "summary": "Tabung bambu gantung bergetar tradisional khas suku Sunda dari Jawa Barat, dimainkan dengan cara shake.",
    "description": "Tabung bambu gantung bergetar tradisional khas suku Sunda dari Jawa Barat, dimainkan dengan cara shake.\n\nFalsafah & Resonansi Budaya:\n“Silih asah, silih asih, silih asuh” — Satu angklung hanya mewakili satu nada; keindahan musiknya lahir ketika dimainkan bersama dalam harmoni.",
    "philosophy": "“Silih asah, silih asih, silih asuh” — Satu angklung hanya mewakili satu nada; keindahan musiknya lahir ketika dimainkan bersama dalam harmoni.",
    "featured": true,
    "viewCount": 3892,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-jb",
      "code": "ID-JB",
      "name": "Jawa Barat",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-angklung",
      "name": "Foto Alat Musik Angklung",
      "url": "/images/catalog/angklung.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-angklung",
      "name": "Model 3D Alat Musik Angklung",
      "url": "/api/models/instruments/angklung.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=angklung"
  },
  {
    "id": "item-inst-bonang-barung",
    "slug": "bonang-barung",
    "title": "Alat Musik Bonang Barung",
    "summary": "Rancakan ganda pencon perunggu tradisional khas suku Jawa Yogyakarta dari D.I. Yogyakarta, dimainkan dengan cara strike.",
    "description": "Rancakan ganda pencon perunggu tradisional khas suku Jawa Yogyakarta dari D.I. Yogyakarta, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Sawiji, Greget, Sengguh, Ora Mingkuh” — Konsentrasi total dan kewibawaan alunan gending keraton Ngayogyakarta Hadiningrat.",
    "philosophy": "“Sawiji, Greget, Sengguh, Ora Mingkuh” — Konsentrasi total dan kewibawaan alunan gending keraton Ngayogyakarta Hadiningrat.",
    "featured": false,
    "viewCount": 4074,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-yo",
      "code": "ID-YO",
      "name": "D.I. Yogyakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-bonang-barung",
      "name": "Foto Alat Musik Bonang Barung",
      "url": "/images/catalog/bonang-barung.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-bonang-barung",
      "name": "Model 3D Alat Musik Bonang Barung",
      "url": "/api/models/instruments/bonang-barung.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=bonang-barung"
  },
  {
    "id": "item-inst-burdah-palembang",
    "slug": "burdah-palembang",
    "title": "Alat Musik Burdah",
    "summary": "Gendang hadrah diameter lebar tradisional khas suku Palembang & Komering dari Sumatera Selatan, dimainkan dengan cara strike.",
    "description": "Gendang hadrah diameter lebar tradisional khas suku Palembang & Komering dari Sumatera Selatan, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Syi'ar dan persaudaraan tanah Sriwijaya” — Tabuhan rebana burdah berukuran besar mengiringi lantunan kasidah dan puji-pujian adat Palembang.",
    "philosophy": "“Syi'ar dan persaudaraan tanah Sriwijaya” — Tabuhan rebana burdah berukuran besar mengiringi lantunan kasidah dan puji-pujian adat Palembang.",
    "featured": false,
    "viewCount": 3346,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ss",
      "code": "ID-SS",
      "name": "Sumatera Selatan",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-burdah-palembang",
      "name": "Foto Alat Musik Burdah",
      "url": "/images/catalog/burdah-palembang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-burdah-palembang",
      "name": "Model 3D Alat Musik Burdah",
      "url": "/api/models/instruments/burdah-palembang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=burdah-palembang"
  },
  {
    "id": "item-inst-dambus-babel",
    "slug": "dambus-babel",
    "title": "Alat Musik Dambus",
    "summary": "Gitar bertanduk rusa Belitung tradisional khas suku Melayu Bangka & Belitung dari Kepulauan Bangka Belitung, dimainkan dengan cara pluck.",
    "description": "Gitar bertanduk rusa Belitung tradisional khas suku Melayu Bangka & Belitung dari Kepulauan Bangka Belitung, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Sepintu Sedulang dalam alunan dawai” — Petikan dambus mengiringi keceriaan malam bulan purnama dan keakraban warga pulau timah.",
    "philosophy": "“Sepintu Sedulang dalam alunan dawai” — Petikan dambus mengiringi keceriaan malam bulan purnama dan keakraban warga pulau timah.",
    "featured": false,
    "viewCount": 3437,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-bb",
      "code": "ID-BB",
      "name": "Kepulauan Bangka Belitung",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-dambus-babel",
      "name": "Foto Alat Musik Dambus",
      "url": "/images/catalog/dambus-babel.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-dambus-babel",
      "name": "Model 3D Alat Musik Dambus",
      "url": "/api/models/instruments/dambus-babel.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=dambus-babel"
  },
  {
    "id": "item-inst-dogdog-lojor",
    "slug": "dogdog-lojor",
    "title": "Alat Musik Dogdog Lojor",
    "summary": "Silinder kayu panjang Banten Kidul tradisional khas suku Sunda Banten & Kasepuhan dari Banten, dimainkan dengan cara strike.",
    "description": "Silinder kayu panjang Banten Kidul tradisional khas suku Sunda Banten & Kasepuhan dari Banten, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Detak bumi dan doa syukur panen” — Tabuhan berirama dogdog lojor mengiringi langkah para sesepuh mengantar padi ke leuit lumbung berkah.",
    "philosophy": "“Detak bumi dan doa syukur panen” — Tabuhan berirama dogdog lojor mengiringi langkah para sesepuh mengantar padi ke leuit lumbung berkah.",
    "featured": false,
    "viewCount": 3710,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-bt",
      "code": "ID-BT",
      "name": "Banten",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-dogdog-lojor",
      "name": "Foto Alat Musik Dogdog Lojor",
      "url": "/images/catalog/dogdog-lojor.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-dogdog-lojor",
      "name": "Model 3D Alat Musik Dogdog Lojor",
      "url": "/api/models/instruments/dogdog-lojor.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=dogdog-lojor"
  },
  {
    "id": "item-inst-dol-bengkulu",
    "slug": "dol-bengkulu",
    "title": "Alat Musik Dol",
    "summary": "Drum bonggol kelapa perayaan Tabut tradisional khas suku Melayu Bengkulu dari Bengkulu, dimainkan dengan cara strike.",
    "description": "Drum bonggol kelapa perayaan Tabut tradisional khas suku Melayu Bengkulu dari Bengkulu, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Gemuruh semangat pesisir barat” — Hentakan dol yang menggelegar membangkitkan keberanian, keteguhan, dan solidaritas warga Bengkulu.",
    "philosophy": "“Gemuruh semangat pesisir barat” — Hentakan dol yang menggelegar membangkitkan keberanian, keteguhan, dan solidaritas warga Bengkulu.",
    "featured": false,
    "viewCount": 3528,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-be",
      "code": "ID-BE",
      "name": "Bengkulu",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-dol-bengkulu",
      "name": "Foto Alat Musik Dol",
      "url": "/images/catalog/dol-bengkulu.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-dol-bengkulu",
      "name": "Model 3D Alat Musik Dol",
      "url": "/api/models/instruments/dol-bengkulu.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=dol-bengkulu"
  },
  {
    "id": "item-inst-fu-kerang",
    "slug": "fu-kerang",
    "title": "Alat Musik Fu",
    "summary": "Kerang Triton tiup pesisir tradisional khas suku Ternate & Tidore dari Maluku Utara, dimainkan dengan cara blow.",
    "description": "Kerang Triton tiup pesisir tradisional khas suku Ternate & Tidore dari Maluku Utara, dimainkan dengan cara blow.\n\nFalsafah & Resonansi Budaya:\n“Tiupan sangkakala bahari empat kesultanan” — Suara megah tahuri yang membelah ombak laut Maluku Utara adalah panggilan persatuan Moloku Kie Raha.",
    "philosophy": "“Tiupan sangkakala bahari empat kesultanan” — Suara megah tahuri yang membelah ombak laut Maluku Utara adalah panggilan persatuan Moloku Kie Raha.",
    "featured": false,
    "viewCount": 2921,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-mu",
      "code": "ID-MU",
      "name": "Maluku Utara",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-fu-kerang",
      "name": "Foto Alat Musik Fu",
      "url": "/images/catalog/fu-kerang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-fu-kerang",
      "name": "Model 3D Alat Musik Fu",
      "url": "/api/models/instruments/fu-kerang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=fu-kerang"
  },
  {
    "id": "item-inst-gambus-selodang",
    "slug": "gambus-selodang",
    "title": "Alat Musik Gambus Selodang",
    "summary": "Lute berdawai perahu Melayu tradisional khas suku Melayu Riau dari Riau, dimainkan dengan cara pluck.",
    "description": "Lute berdawai perahu Melayu tradisional khas suku Melayu Riau dari Riau, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Petikan syair penyejuk kalbu” — Alunan dawai gambus yang lembut menjadi jembatan petuah adat, pantun, dan kesantunan budaya Melayu.",
    "philosophy": "“Petikan syair penyejuk kalbu” — Alunan dawai gambus yang lembut menjadi jembatan petuah adat, pantun, dan kesantunan budaya Melayu.",
    "featured": false,
    "viewCount": 3073,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ri",
      "code": "ID-RI",
      "name": "Riau",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-gambus-selodang",
      "name": "Foto Alat Musik Gambus Selodang",
      "url": "/images/catalog/gambus-selodang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gambus-selodang",
      "name": "Model 3D Alat Musik Gambus Selodang",
      "url": "/api/models/instruments/gambus-selodang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gambus-selodang"
  },
  {
    "id": "item-inst-gamolan-pekhing",
    "slug": "gamolan-pekhing",
    "title": "Alat Musik Gamolan Pekhing",
    "summary": "7 Bilah bambu cetik Lampung tradisional khas suku Lampung Pepadun & Saibatin dari Lampung, dimainkan dengan cara strike.",
    "description": "7 Bilah bambu cetik Lampung tradisional khas suku Lampung Pepadun & Saibatin dari Lampung, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Piil Pesenggiri dalam denting bambu” — Kejernihan suara bilah bambu purba yang mencerminkan kehormatan diri dan keterbukaan masyarakat Lampung.",
    "philosophy": "“Piil Pesenggiri dalam denting bambu” — Kejernihan suara bilah bambu purba yang mencerminkan kehormatan diri dan keterbukaan masyarakat Lampung.",
    "featured": false,
    "viewCount": 3619,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-la",
      "code": "ID-LA",
      "name": "Lampung",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-gamolan-pekhing",
      "name": "Foto Alat Musik Gamolan Pekhing",
      "url": "/images/catalog/gamolan-pekhing.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gamolan-pekhing",
      "name": "Model 3D Alat Musik Gamolan Pekhing",
      "url": "/api/models/instruments/gamolan-pekhing.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gamolan-pekhing"
  },
  {
    "id": "item-inst-gendang-beleq",
    "slug": "gendang-beleq",
    "title": "Alat Musik Gendang Beleq",
    "summary": "Gendang tabung besar suku Sasak tradisional khas suku Sasak dari Nusa Tenggara Barat, dimainkan dengan cara strike.",
    "description": "Gendang tabung besar suku Sasak tradisional khas suku Sasak dari Nusa Tenggara Barat, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Semangat ksatria dan kehormatan tanah Sasak” — Tabuhan megah dan membahana Gendang Beleq mengobarkan ketangkasan prajurit kerajaan Lombok dan memeriahkan upacara adat Begawe.",
    "philosophy": "“Semangat ksatria dan kehormatan tanah Sasak” — Tabuhan megah dan membahana Gendang Beleq mengobarkan ketangkasan prajurit kerajaan Lombok dan memeriahkan upacara adat Begawe.",
    "featured": false,
    "viewCount": 4347,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-nb",
      "code": "ID-NB",
      "name": "Nusa Tenggara Barat",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-gendang-beleq",
      "name": "Foto Alat Musik Gendang Beleq",
      "url": "/images/catalog/gendang-beleq.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gendang-beleq",
      "name": "Model 3D Alat Musik Gendang Beleq",
      "url": "/api/models/instruments/gendang-beleq.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gendang-beleq"
  },
  {
    "id": "item-inst-gendang-panjang",
    "slug": "gendang-panjang",
    "title": "Alat Musik Gendang Panjang",
    "summary": "Gendang silinder dua sisi tradisional khas suku Melayu Kepulauan dari Kepulauan Riau, dimainkan dengan cara strike.",
    "description": "Gendang silinder dua sisi tradisional khas suku Melayu Kepulauan dari Kepulauan Riau, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Rentak samudra pengikat pulau” — Ketukan dinamis gendang panjang mengobarkan ketangkasan silat dan persatuan masyarakat bahari.",
    "philosophy": "“Rentak samudra pengikat pulau” — Ketukan dinamis gendang panjang mengobarkan ketangkasan silat dan persatuan masyarakat bahari.",
    "featured": false,
    "viewCount": 3164,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-kr",
      "code": "ID-KR",
      "name": "Kepulauan Riau",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-gendang-panjang",
      "name": "Foto Alat Musik Gendang Panjang",
      "url": "/images/catalog/gendang-panjang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gendang-panjang",
      "name": "Model 3D Alat Musik Gendang Panjang",
      "url": "/api/models/instruments/gendang-panjang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gendang-panjang"
  },
  {
    "id": "item-inst-gimba-kaili",
    "slug": "gimba-kaili",
    "title": "Alat Musik Gimba",
    "summary": "Drum berkaki upacara Kaili tradisional khas suku Kaili & Kulawi dari Sulawesi Tengah, dimainkan dengan cara strike.",
    "description": "Drum berkaki upacara Kaili tradisional khas suku Kaili & Kulawi dari Sulawesi Tengah, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Detak sakral lembah Palu” — Tabuhan ganda memanggil sanubari warga untuk menjaga keharmonisan alam, tanah pusaka, dan kekerabatan adat Kaili.",
    "philosophy": "“Detak sakral lembah Palu” — Tabuhan ganda memanggil sanubari warga untuk menjaga keharmonisan alam, tanah pusaka, dan kekerabatan adat Kaili.",
    "featured": false,
    "viewCount": 5166,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-st",
      "code": "ID-ST",
      "name": "Sulawesi Tengah",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-gimba-kaili",
      "name": "Foto Alat Musik Gimba",
      "url": "/images/catalog/gimba-kaili.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gimba-kaili",
      "name": "Model 3D Alat Musik Gimba",
      "url": "/api/models/instruments/gimba-kaili.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gimba-kaili"
  },
  {
    "id": "item-inst-guoto-arfak",
    "slug": "guoto-arfak",
    "title": "Alat Musik Guoto",
    "summary": "Senar kulit di atas kayu bulat tradisional khas suku Arfak (Meyah & Hatam) dari Papua Barat, dimainkan dengan cara pluck.",
    "description": "Senar kulit di atas kayu bulat tradisional khas suku Arfak (Meyah & Hatam) dari Papua Barat, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Bisikan damai pegunungan Arfak” — Petikan guoto yang lembut menirukan gemericik air sungai dan kicauan burung pintar di kaki bukit Papua Barat.",
    "philosophy": "“Bisikan damai pegunungan Arfak” — Petikan guoto yang lembut menirukan gemericik air sungai dan kicauan burung pintar di kaki bukit Papua Barat.",
    "featured": false,
    "viewCount": 3103,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-pb",
      "code": "ID-PB",
      "name": "Papua Barat",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-guoto-arfak",
      "name": "Foto Alat Musik Guoto",
      "url": "/images/catalog/guoto-arfak.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-guoto-arfak",
      "name": "Model 3D Alat Musik Guoto",
      "url": "/api/models/instruments/guoto-arfak.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=guoto-arfak"
  },
  {
    "id": "item-inst-hasapi-batak",
    "slug": "hasapi-batak",
    "title": "Alat Musik Hasapi",
    "summary": "Lute berdawai 2 Batak Toba tradisional khas suku Batak Toba dari Sumatera Utara, dimainkan dengan cara pluck.",
    "description": "Lute berdawai 2 Batak Toba tradisional khas suku Batak Toba dari Sumatera Utara, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Dua dawai pengikat rasa dalihan na tolu” — Petikan hasapi yang hening dan meditatif mengiringi syair tonggo-tonggo dan ratap batin suku Batak.",
    "philosophy": "“Dua dawai pengikat rasa dalihan na tolu” — Petikan hasapi yang hening dan meditatif mengiringi syair tonggo-tonggo dan ratap batin suku Batak.",
    "featured": false,
    "viewCount": 2891,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-hasapi-batak",
      "name": "Foto Alat Musik Hasapi",
      "url": "/images/catalog/hasapi-batak.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-hasapi-batak",
      "name": "Model 3D Alat Musik Hasapi",
      "url": "/api/models/instruments/hasapi-batak.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=hasapi-batak"
  },
  {
    "id": "item-inst-japen-kalteng",
    "slug": "japen-kalteng",
    "title": "Alat Musik Japen",
    "summary": "Kecapi perahu ukir Dayak Ngaju tradisional khas suku Dayak Ngaju & Ot Danum dari Kalimantan Tengah, dimainkan dengan cara pluck.",
    "description": "Kecapi perahu ukir Dayak Ngaju tradisional khas suku Dayak Ngaju & Ot Danum dari Kalimantan Tengah, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Bunyi yang meloloskan duka, menyapa leluhur” — Melodi sape' yang tenang mengalir seperti riam sungai pedalaman hutan, menenangkan jiwa dan memanggil roh kebaikan.",
    "philosophy": "“Bunyi yang meloloskan duka, menyapa leluhur” — Melodi sape' yang tenang mengalir seperti riam sungai pedalaman hutan, menenangkan jiwa dan memanggil roh kebaikan.",
    "featured": false,
    "viewCount": 4620,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-kt",
      "code": "ID-KT",
      "name": "Kalimantan Tengah",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-japen-kalteng",
      "name": "Foto Alat Musik Japen",
      "url": "/images/catalog/japen-kalteng.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-japen-kalteng",
      "name": "Model 3D Alat Musik Japen",
      "url": "/api/models/instruments/japen-kalteng.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=japen-kalteng"
  },
  {
    "id": "item-inst-jatung-utang",
    "slug": "jatung-utang",
    "title": "Alat Musik Jatung Utang",
    "summary": "Bilah kayu gantung terikat tradisional khas suku Dayak Kenyah Kayan dari Kalimantan Utara, dimainkan dengan cara strike.",
    "description": "Bilah kayu gantung terikat tradisional khas suku Dayak Kenyah Kayan dari Kalimantan Utara, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Denting kayu rimba perbatasan negeri” — Ketukan bilah kayu jatung utang merajut keakraban di ladang huma dan pengingat kelestarian hutan adat Kayan.",
    "philosophy": "“Denting kayu rimba perbatasan negeri” — Ketukan bilah kayu jatung utang merajut keakraban di ladang huma dan pengingat kelestarian hutan adat Kayan.",
    "featured": false,
    "viewCount": 4893,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ku",
      "code": "ID-KU",
      "name": "Kalimantan Utara",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-jatung-utang",
      "name": "Foto Alat Musik Jatung Utang",
      "url": "/images/catalog/jatung-utang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-jatung-utang",
      "name": "Model 3D Alat Musik Jatung Utang",
      "url": "/api/models/instruments/jatung-utang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=jatung-utang"
  },
  {
    "id": "item-inst-kecapi-mandar",
    "slug": "kecapi-mandar",
    "title": "Alat Musik Kecapi Mandar",
    "summary": "Kecapi perahu ramping pesisir tradisional khas suku Mandar dari Sulawesi Barat, dimainkan dengan cara strike.",
    "description": "Kecapi perahu ramping pesisir tradisional khas suku Mandar dari Sulawesi Barat, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Nyanyian bahari pelaut Mandar” — Suara calong yang renyah dan syahdu melantunkan kenangan laut lepas perahu Sandeq dan ketabahan hati para penjelajah samudra.",
    "philosophy": "“Nyanyian bahari pelaut Mandar” — Suara calong yang renyah dan syahdu melantunkan kenangan laut lepas perahu Sandeq dan ketabahan hati para penjelajah samudra.",
    "featured": false,
    "viewCount": 5257,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-sr",
      "code": "ID-SR",
      "name": "Sulawesi Barat",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-kecapi-mandar",
      "name": "Foto Alat Musik Kecapi Mandar",
      "url": "/images/catalog/kecapi-mandar.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kecapi-mandar",
      "name": "Model 3D Alat Musik Kecapi Mandar",
      "url": "/api/models/instruments/kecapi-mandar.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=kecapi-mandar"
  },
  {
    "id": "item-inst-kelintang-kayu",
    "slug": "kelintang-kayu",
    "title": "Alat Musik Kelintang Kayu",
    "summary": "Bilah kayu berjejer Jambi tradisional khas suku Melayu Jambi dari Jambi, dimainkan dengan cara strike.",
    "description": "Bilah kayu berjejer Jambi tradisional khas suku Melayu Jambi dari Jambi, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Titian harmoni Batanghari” — Denting bilah kelintang mengalir jernih laksana sungai Batanghari yang menghidupi peradaban Melayu Jambi.",
    "philosophy": "“Titian harmoni Batanghari” — Denting bilah kelintang mengalir jernih laksana sungai Batanghari yang menghidupi peradaban Melayu Jambi.",
    "featured": false,
    "viewCount": 3255,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ja",
      "code": "ID-JA",
      "name": "Jambi",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-kelintang-kayu",
      "name": "Foto Alat Musik Kelintang Kayu",
      "url": "/images/catalog/kelintang-kayu.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kelintang-kayu",
      "name": "Model 3D Alat Musik Kelintang Kayu",
      "url": "/api/models/instruments/kelintang-kayu.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=kelintang-kayu"
  },
  {
    "id": "item-inst-kendang-reog",
    "slug": "kendang-reog",
    "title": "Alat Musik Kendang Reog",
    "summary": "Kendang tabung merah Ponorogo tradisional khas suku Jawa Ponorogo & Arekan dari Jawa Timur, dimainkan dengan cara strike.",
    "description": "Kendang tabung merah Ponorogo tradisional khas suku Jawa Ponorogo & Arekan dari Jawa Timur, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Detak keprajuritan Singo Barong” — Hentakan ritmis kendang reog mengalirkan daya magis dan kegagahan atraksi tari topeng terbesar nusantara.",
    "philosophy": "“Detak keprajuritan Singo Barong” — Hentakan ritmis kendang reog mengalirkan daya magis dan kegagahan atraksi tari topeng terbesar nusantara.",
    "featured": false,
    "viewCount": 4165,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ji",
      "code": "ID-JI",
      "name": "Jawa Timur",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-kendang-reog",
      "name": "Foto Alat Musik Kendang Reog",
      "url": "/images/catalog/kendang-reog.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kendang-reog",
      "name": "Model 3D Alat Musik Kendang Reog",
      "url": "/api/models/instruments/kendang-reog.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=kendang-reog"
  },
  {
    "id": "item-inst-keso-keso",
    "slug": "keso-keso",
    "title": "Alat Musik Keso-Keso",
    "summary": "Rebab 2 senar tempurung labu tradisional khas suku Toraja, Bugis & Makassar dari Sulawesi Selatan, dimainkan dengan cara bow.",
    "description": "Rebab 2 senar tempurung labu tradisional khas suku Toraja, Bugis & Makassar dari Sulawesi Selatan, dimainkan dengan cara bow.\n\nFalsafah & Resonansi Budaya:\n“Ratapan syahdu lembah Toraja” — Gesekan pilu keso-keso menyuarakan doa pengantaran arwah menuju Puya dan penghormatan luhur kepada para leluhur.",
    "philosophy": "“Ratapan syahdu lembah Toraja” — Gesekan pilu keso-keso menyuarakan doa pengantaran arwah menuju Puya dan penghormatan luhur kepada para leluhur.",
    "featured": false,
    "viewCount": 5348,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-sn",
      "code": "ID-SN",
      "name": "Sulawesi Selatan",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-keso-keso",
      "name": "Foto Alat Musik Keso-Keso",
      "url": "/images/catalog/keso-keso.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-keso-keso",
      "name": "Model 3D Alat Musik Keso-Keso",
      "url": "/api/models/instruments/keso-keso.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=keso-keso"
  },
  {
    "id": "item-inst-kolintang-minahasa",
    "slug": "kolintang-minahasa",
    "title": "Alat Musik Kolintang",
    "summary": "Xylophone kayu peti Minahasa tradisional khas suku Minahasa dari Sulawesi Utara, dimainkan dengan cara strike.",
    "description": "Xylophone kayu peti Minahasa tradisional khas suku Minahasa dari Sulawesi Utara, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Harmoni nada persaudaraan Mapalus” — Bunyi merdu 'tong-ting-tang' kolintang mencerminkan semangat gotong royong dan keselarasan sosial Minahasa yang mendunia.",
    "philosophy": "“Harmoni nada persaudaraan Mapalus” — Bunyi merdu 'tong-ting-tang' kolintang mencerminkan semangat gotong royong dan keselarasan sosial Minahasa yang mendunia.",
    "featured": false,
    "viewCount": 4984,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-sa",
      "code": "ID-SA",
      "name": "Sulawesi Utara",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-kolintang-minahasa",
      "name": "Foto Alat Musik Kolintang",
      "url": "/images/catalog/kolintang-minahasa.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kolintang-minahasa",
      "name": "Model 3D Alat Musik Kolintang",
      "url": "/api/models/instruments/kolintang-minahasa.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=kolintang-minahasa"
  },
  {
    "id": "item-inst-lado-lado",
    "slug": "lado-lado",
    "title": "Alat Musik Ladolado",
    "summary": "Bilah kayu berpembuluh Buton tradisional khas suku Buton & Muna dari Sulawesi Tenggara, dimainkan dengan cara bow.",
    "description": "Bilah kayu berpembuluh Buton tradisional khas suku Buton & Muna dari Sulawesi Tenggara, dimainkan dengan cara bow.\n\nFalsafah & Resonansi Budaya:\n“Hikmah kesultanan benteng Buton” — Dawai gesek lado-lado melagukan petuah moral kesantunan Bula Malino dan sejarah peradaban bahari Buton.",
    "philosophy": "“Hikmah kesultanan benteng Buton” — Dawai gesek lado-lado melagukan petuah moral kesantunan Bula Malino dan sejarah peradaban bahari Buton.",
    "featured": false,
    "viewCount": 5439,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-sg",
      "code": "ID-SG",
      "name": "Sulawesi Tenggara",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-lado-lado",
      "name": "Foto Alat Musik Ladolado",
      "url": "/images/catalog/lado-lado.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-lado-lado",
      "name": "Model 3D Alat Musik Ladolado",
      "url": "/api/models/instruments/lado-lado.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=lado-lado"
  },
  {
    "id": "item-inst-musik-panting",
    "slug": "musik-panting",
    "title": "Alat Musik Panting",
    "summary": "Gambus mini 4 senar suku Banjar tradisional khas suku Banjar dari Kalimantan Selatan, dimainkan dengan cara pluck.",
    "description": "Gambus mini 4 senar suku Banjar tradisional khas suku Banjar dari Kalimantan Selatan, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Alunan riang tepian Sungai Martapura” — Petikan cepat dan lincah panting mencerminkan kegembiraan, keterbukaan, dan keramahan masyarakat Banjar.",
    "philosophy": "“Alunan riang tepian Sungai Martapura” — Petikan cepat dan lincah panting mencerminkan kegembiraan, keterbukaan, dan keramahan masyarakat Banjar.",
    "featured": false,
    "viewCount": 4711,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ks",
      "code": "ID-KS",
      "name": "Kalimantan Selatan",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-musik-panting",
      "name": "Foto Alat Musik Panting",
      "url": "/images/catalog/musik-panting.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-musik-panting",
      "name": "Model 3D Alat Musik Panting",
      "url": "/api/models/instruments/musik-panting.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=musik-panting"
  },
  {
    "id": "item-inst-pikon-dani",
    "slug": "pikon-dani",
    "title": "Alat Musik Pikon",
    "summary": "Harpa mulut bambu suku Dani tradisional khas suku Dani & Hubula dari Papua Pegunungan, dimainkan dengan cara blow.",
    "description": "Harpa mulut bambu suku Dani tradisional khas suku Dani & Hubula dari Papua Pegunungan, dimainkan dengan cara blow.\n\nFalsafah & Resonansi Budaya:\n“Suara hening kabut Lembah Baliem” — Getaran lidi bambu pikon di rongga mulut menyalurkan perasaan cinta, kerinduan, dan ketenangan jiwa di dalam rumah honai.",
    "philosophy": "“Suara hening kabut Lembah Baliem” — Getaran lidi bambu pikon di rongga mulut menyalurkan perasaan cinta, kerinduan, dan ketenangan jiwa di dalam rumah honai.",
    "featured": false,
    "viewCount": 3376,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-pe",
      "code": "ID-PE",
      "name": "Papua Pegunungan",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-pikon-dani",
      "name": "Foto Alat Musik Pikon",
      "url": "/images/catalog/pikon-dani.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-pikon-dani",
      "name": "Model 3D Alat Musik Pikon",
      "url": "/api/models/instruments/pikon-dani.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=pikon-dani"
  },
  {
    "id": "item-inst-polopalo-gorontalo",
    "slug": "polopalo-gorontalo",
    "title": "Alat Musik Polopalo",
    "summary": "Garpu bambu rongga pukul tradisional khas suku Gorontalo dari Gorontalo, dimainkan dengan cara strike.",
    "description": "Garpu bambu rongga pukul tradisional khas suku Gorontalo dari Gorontalo, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Denting kelembutan Serambi Madinah Gorontalo” — Benturan bilah bambu polopalo melambangkan kejujuran bertutur dan ketenangan batin dalam bermusyawarah.",
    "philosophy": "“Denting kelembutan Serambi Madinah Gorontalo” — Benturan bilah bambu polopalo melambangkan kejujuran bertutur dan ketenangan batin dalam bermusyawarah.",
    "featured": false,
    "viewCount": 5075,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-go",
      "code": "ID-GO",
      "name": "Gorontalo",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-polopalo-gorontalo",
      "name": "Foto Alat Musik Polopalo",
      "url": "/images/catalog/polopalo-gorontalo.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-polopalo-gorontalo",
      "name": "Model 3D Alat Musik Polopalo",
      "url": "/api/models/instruments/polopalo-gorontalo.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=polopalo-gorontalo"
  },
  {
    "id": "item-inst-rapai-aceh",
    "slug": "rapai-aceh",
    "title": "Alat Musik Rapai",
    "summary": "Rebana bingkai kayu & kulit tradisional khas suku Aceh dari Aceh, dimainkan dengan cara strike.",
    "description": "Rebana bingkai kayu & kulit tradisional khas suku Aceh dari Aceh, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Gema zikir dan keteguhan hati serambi Mekkah” — Tabuhan serempak rapai menyatukan detak batin masyarakat dalam syiar dan persaudaraan.",
    "philosophy": "“Gema zikir dan keteguhan hati serambi Mekkah” — Tabuhan serempak rapai menyatukan detak batin masyarakat dalam syiar dan persaudaraan.",
    "featured": false,
    "viewCount": 2800,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ac",
      "code": "ID-AC",
      "name": "Aceh",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-rapai-aceh",
      "name": "Foto Alat Musik Rapai",
      "url": "/images/catalog/rapai-aceh.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-rapai-aceh",
      "name": "Model 3D Alat Musik Rapai",
      "url": "/api/models/instruments/rapai-aceh.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=rapai-aceh"
  },
  {
    "id": "item-inst-rindik-bali",
    "slug": "rindik-bali",
    "title": "Alat Musik Rindik",
    "summary": "Bilah bambu pelupuh Bali tradisional khas suku Bali dari Bali, dimainkan dengan cara strike.",
    "description": "Bilah bambu pelupuh Bali tradisional khas suku Bali dari Bali, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Ketenangan alam Pulau Dewata” — Getaran lembut bilah bambu rindik menghadirkan kedamaian pedesaan Bali dan rasa syukur ke hadapan Sang Hyang Semara Ratih.",
    "philosophy": "“Ketenangan alam Pulau Dewata” — Getaran lembut bilah bambu rindik menghadirkan kedamaian pedesaan Bali dan rasa syukur ke hadapan Sang Hyang Semara Ratih.",
    "featured": false,
    "viewCount": 4256,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-rindik-bali",
      "name": "Foto Alat Musik Rindik",
      "url": "/images/catalog/rindik-bali.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-rindik-bali",
      "name": "Model 3D Alat Musik Rindik",
      "url": "/api/models/instruments/rindik-bali.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=rindik-bali"
  },
  {
    "id": "item-inst-sampe-dayak-kaltim",
    "slug": "sampe-dayak-kaltim",
    "title": "Alat Musik Sape",
    "summary": "Lute kayu perahu ukir Dayak Kenyah tradisional khas suku Dayak Kenyah dari Kalimantan Timur, dimainkan dengan cara pluck.",
    "description": "Lute kayu perahu ukir Dayak Kenyah tradisional khas suku Dayak Kenyah dari Kalimantan Timur, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Dawai yang memeluk batin hutan raya” — Setiap petikan sampe' Dayak dipercaya mampu menyatukan hati manusia dengan alam rimba raya dan restu para leluhur Apo Kayan.",
    "philosophy": "“Dawai yang memeluk batin hutan raya” — Setiap petikan sampe' Dayak dipercaya mampu menyatukan hati manusia dengan alam rimba raya dan restu para leluhur Apo Kayan.",
    "featured": false,
    "viewCount": 4802,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ki",
      "code": "ID-KI",
      "name": "Kalimantan Timur",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-sampe-dayak-kaltim",
      "name": "Foto Alat Musik Sape",
      "url": "/images/catalog/sampe-dayak-kaltim.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-sampe-dayak-kaltim",
      "name": "Model 3D Alat Musik Sape",
      "url": "/api/models/instruments/sampe-dayak-kaltim.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=sampe-dayak-kaltim"
  },
  {
    "id": "item-inst-gamelan-jawa",
    "slug": "gamelan-jawa",
    "title": "Alat Musik Saron Demung",
    "summary": "Bilah perunggu gamelan Jawa tradisional khas suku Jawa dari Jawa Tengah, dimainkan dengan cara strike.",
    "description": "Bilah perunggu gamelan Jawa tradisional khas suku Jawa dari Jawa Tengah, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Memayu hayuning bawana” — Denting bening bilah gangsa yang menuntun ketenangan batin dan keselarasan hidup manusia dengan semesta.",
    "philosophy": "“Memayu hayuning bawana” — Denting bening bilah gangsa yang menuntun ketenangan batin dan keselarasan hidup manusia dengan semesta.",
    "featured": false,
    "viewCount": 3983,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-jt",
      "code": "ID-JT",
      "name": "Jawa Tengah",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-gamelan-jawa",
      "name": "Foto Alat Musik Saron Demung",
      "url": "/images/catalog/gamelan-jawa.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gamelan-jawa",
      "name": "Model 3D Alat Musik Saron Demung",
      "url": "/api/models/instruments/gamelan-jawa.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=gamelan-jawa"
  },
  {
    "id": "item-inst-sasando-rote",
    "slug": "sasando-rote",
    "title": "Alat Musik Sasando",
    "summary": "Tabung bambu & wadah daun lontar tradisional khas suku Rote dari Nusa Tenggara Timur, dimainkan dengan cara pluck.",
    "description": "Tabung bambu & wadah daun lontar tradisional khas suku Rote dari Nusa Tenggara Timur, dimainkan dengan cara pluck.\n\nFalsafah & Resonansi Budaya:\n“Petikan harpa lontar dari selatan nusantara” — Getaran dawai sasando di dalam wadah daun haik memancarkan kelembutan jiwa, romantisme lisan, dan kearifan masyarakat pulau Rote.",
    "philosophy": "“Petikan harpa lontar dari selatan nusantara” — Getaran dawai sasando di dalam wadah daun haik memancarkan kelembutan jiwa, romantisme lisan, dan kearifan masyarakat pulau Rote.",
    "featured": false,
    "viewCount": 4438,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-nt",
      "code": "ID-NT",
      "name": "Nusa Tenggara Timur",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-sasando-rote",
      "name": "Foto Alat Musik Sasando",
      "url": "/images/catalog/sasando-rote.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-sasando-rote",
      "name": "Model 3D Alat Musik Sasando",
      "url": "/api/models/instruments/sasando-rote.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=sasando-rote"
  },
  {
    "id": "item-inst-talempong-minang",
    "slug": "talempong-minang",
    "title": "Alat Musik Talempong",
    "summary": "Gong pencon perunggu Minang tradisional khas suku Minangkabau dari Sumatera Barat, dimainkan dengan cara strike.",
    "description": "Gong pencon perunggu Minang tradisional khas suku Minangkabau dari Sumatera Barat, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Basamo mangko manjadi” — Jalinan nada talempong yang saling bersahutan melambangkan musyawarah mufakat dan kegotongroyongan nagari.",
    "philosophy": "“Basamo mangko manjadi” — Jalinan nada talempong yang saling bersahutan melambangkan musyawarah mufakat dan kegotongroyongan nagari.",
    "featured": false,
    "viewCount": 2982,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-talempong-minang",
      "name": "Foto Alat Musik Talempong",
      "url": "/images/catalog/talempong-minang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-talempong-minang",
      "name": "Model 3D Alat Musik Talempong",
      "url": "/api/models/instruments/talempong-minang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=talempong-minang"
  },
  {
    "id": "item-inst-tehyan-jakarta",
    "slug": "tehyan-jakarta",
    "title": "Alat Musik Tehyan",
    "summary": "Rebab 2 senar tempurung kelapa tradisional khas suku Betawi dari DKI Jakarta, dimainkan dengan cara bow.",
    "description": "Rebab 2 senar tempurung kelapa tradisional khas suku Betawi dari DKI Jakarta, dimainkan dengan cara bow.\n\nFalsafah & Resonansi Budaya:\n“Akulturasi harmonis kota pelabuhan” — Perpaduan budaya Betawi dan Tionghoa yang melahirkan melodi lincah, jenaka, dan penuh keakraban.",
    "philosophy": "“Akulturasi harmonis kota pelabuhan” — Perpaduan budaya Betawi dan Tionghoa yang melahirkan melodi lincah, jenaka, dan penuh keakraban.",
    "featured": false,
    "viewCount": 3801,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-jk",
      "code": "ID-JK",
      "name": "D.K.I. Jakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-tehyan-jakarta",
      "name": "Foto Alat Musik Tehyan",
      "url": "/images/catalog/tehyan-jakarta.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tehyan-jakarta",
      "name": "Model 3D Alat Musik Tehyan",
      "url": "/api/models/instruments/tehyan-jakarta.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tehyan-jakarta"
  },
  {
    "id": "item-inst-tifa-asmat",
    "slug": "tifa-asmat",
    "title": "Alat Musik Tifa Asmat",
    "summary": "Tifa kepala bertatah motif ukir leluhur tradisional khas suku Marind-Anim dari Papua Selatan, dimainkan dengan cara strike.",
    "description": "Tifa kepala bertatah motif ukir leluhur tradisional khas suku Marind-Anim dari Papua Selatan, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Gema rawa dan sabana Merauke” — Tabuhan ritmis tifa kandara mengiringi langkah para kesatria Marind menjaga tanah adat di ufuk timur nusantara.",
    "philosophy": "“Gema rawa dan sabana Merauke” — Tabuhan ritmis tifa kandara mengiringi langkah para kesatria Marind menjaga tanah adat di ufuk timur nusantara.",
    "featured": false,
    "viewCount": 3467,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ps",
      "code": "ID-PS",
      "name": "Papua Selatan",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-tifa-asmat",
      "name": "Foto Alat Musik Tifa Asmat",
      "url": "/images/catalog/tifa-asmat.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tifa-asmat",
      "name": "Model 3D Alat Musik Tifa Asmat",
      "url": "/api/models/instruments/tifa-asmat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tifa-asmat"
  },
  {
    "id": "item-inst-tifa-kamoro",
    "slug": "tifa-kamoro",
    "title": "Alat Musik Tifa Kamoro",
    "summary": "Tifa ramping ukir pesisir Mimika tradisional khas suku Mee & Damal dari Papua Tengah, dimainkan dengan cara strike.",
    "description": "Tifa ramping ukir pesisir Mimika tradisional khas suku Mee & Damal dari Papua Tengah, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Nyanyian persaudaraan danau Paniai” — Tabuhan tifa mee menjaga keseimbangan relasi antara manusia suku Mee dengan alam pegunungan tengah Papua.",
    "philosophy": "“Nyanyian persaudaraan danau Paniai” — Tabuhan tifa mee menjaga keseimbangan relasi antara manusia suku Mee dengan alam pegunungan tengah Papua.",
    "featured": false,
    "viewCount": 3194,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-pt",
      "code": "ID-PT",
      "name": "Papua Tengah",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-tifa-kamoro",
      "name": "Foto Alat Musik Tifa Kamoro",
      "url": "/images/catalog/tifa-kamoro.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tifa-kamoro",
      "name": "Model 3D Alat Musik Tifa Kamoro",
      "url": "/api/models/instruments/tifa-kamoro.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tifa-kamoro"
  },
  {
    "id": "item-inst-tifa-sentani",
    "slug": "tifa-sentani",
    "title": "Alat Musik Tifa Sentani",
    "summary": "Tifa berpegangan lengkung Sentani tradisional khas suku Asmat & Sentani dari Papua, dimainkan dengan cara strike.",
    "description": "Tifa berpegangan lengkung Sentani tradisional khas suku Asmat & Sentani dari Papua, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Detak jantung bumi Cenderawasih” — Tifa bukan sekadar alat musik melainkan simbol penghormatan tinggi kepada roh nenek moyang dan keberanian manusia Papua.",
    "philosophy": "“Detak jantung bumi Cenderawasih” — Tifa bukan sekadar alat musik melainkan simbol penghormatan tinggi kepada roh nenek moyang dan keberanian manusia Papua.",
    "featured": false,
    "viewCount": 3285,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-pa",
      "code": "ID-PA",
      "name": "Papua",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-tifa-sentani",
      "name": "Foto Alat Musik Tifa Sentani",
      "url": "/images/catalog/tifa-sentani.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tifa-sentani",
      "name": "Model 3D Alat Musik Tifa Sentani",
      "url": "/api/models/instruments/tifa-sentani.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tifa-sentani"
  },
  {
    "id": "item-inst-tifa-totobuang",
    "slug": "tifa-totobuang",
    "title": "Alat Musik Totobuang",
    "summary": "Gong logam pencon Maluku tradisional khas suku Ambon & Maluku Tengah dari Maluku, dimainkan dengan cara strike.",
    "description": "Gong logam pencon Maluku tradisional khas suku Ambon & Maluku Tengah dari Maluku, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Pela Gandong dalam rentak tifa” — Gema tabuhan tifa menyatukan tali persaudaraan antar negeri di kepulauan rempah tanpa memandang perbedaan.",
    "philosophy": "“Pela Gandong dalam rentak tifa” — Gema tabuhan tifa menyatukan tali persaudaraan antar negeri di kepulauan rempah tanpa memandang perbedaan.",
    "featured": false,
    "viewCount": 2830,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-ma",
      "code": "ID-MA",
      "name": "Maluku",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-tifa-totobuang",
      "name": "Foto Alat Musik Totobuang",
      "url": "/images/catalog/tifa-totobuang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tifa-totobuang",
      "name": "Model 3D Alat Musik Totobuang",
      "url": "/api/models/instruments/tifa-totobuang.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tifa-totobuang"
  },
  {
    "id": "item-inst-triton-raja-ampat",
    "slug": "triton-raja-ampat",
    "title": "Alat Musik Triton",
    "summary": "Terompet kulit kerang laut Raja Ampat tradisional khas suku Moi & Maya Raja Ampat dari Papua Barat Daya, dimainkan dengan cara blow.",
    "description": "Terompet kulit kerang laut Raja Ampat tradisional khas suku Moi & Maya Raja Ampat dari Papua Barat Daya, dimainkan dengan cara blow.\n\nFalsafah & Resonansi Budaya:\n“Gema samudra surga bahari karang dunia” — Gemuruh tiupan kerang triton mengingatkan masyarakat adat untuk senantiasa menjaga kelestarian terumbu karang laut warisan leluhur.",
    "philosophy": "“Gema samudra surga bahari karang dunia” — Gemuruh tiupan kerang triton mengingatkan masyarakat adat untuk senantiasa menjaga kelestarian terumbu karang laut warisan leluhur.",
    "featured": false,
    "viewCount": 3012,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-pd",
      "code": "ID-PD",
      "name": "Papua Barat Daya",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-triton-raja-ampat",
      "name": "Foto Alat Musik Triton",
      "url": "/images/catalog/triton-raja-ampat.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-triton-raja-ampat",
      "name": "Model 3D Alat Musik Triton",
      "url": "/api/models/instruments/triton-raja-ampat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=triton-raja-ampat"
  },
  {
    "id": "item-inst-tuma-dayak",
    "slug": "tuma-dayak",
    "title": "Alat Musik Tuma",
    "summary": "Gendang silinder ramping Dayak tradisional khas suku Dayak Kanayatn dari Kalimantan Barat, dimainkan dengan cara strike.",
    "description": "Gendang silinder ramping Dayak tradisional khas suku Dayak Kanayatn dari Kalimantan Barat, dimainkan dengan cara strike.\n\nFalsafah & Resonansi Budaya:\n“Gendang persatuan hutan Borneo” — Irama tegap tabuhan tuma menghidupkan tarian adat Naik Dango sebagai ungkapan syukur panen padi kepada Jubata (Sang Pencipta).",
    "philosophy": "“Gendang persatuan hutan Borneo” — Irama tegap tabuhan tuma menghidupkan tarian adat Naik Dango sebagai ungkapan syukur panen padi kepada Jubata (Sang Pencipta).",
    "featured": false,
    "viewCount": 4529,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-alat-musik",
      "slug": "alat-musik",
      "name": "Alat Musik Tradisional",
      "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
      "icon": "music",
      "sortOrder": 2
    },
    "region": {
      "id": "reg-id-kb",
      "code": "ID-KB",
      "name": "Kalimantan Barat",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-tuma-dayak",
      "name": "Foto Alat Musik Tuma",
      "url": "/images/catalog/tuma-dayak.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tuma-dayak",
      "name": "Model 3D Alat Musik Tuma",
      "url": "/api/models/instruments/tuma-dayak.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Mainkan Nada",
    "actionUrl": "#/instrumen?alat=tuma-dayak"
  },
  {
    "id": "item-ayam-betutu-bali",
    "slug": "ayam-betutu-bali",
    "title": "Ayam Betutu Gilimanuk",
    "summary": "Unggas utuh berlumur bumbu genep kaya kunyit, jahe, dan serai yang dipanggang dalam sekam api perlahan.",
    "description": "Ayam Betutu adalah sajian istiadat dan pesta pura di Bali. Daging ayam utuh dipijat bumbu wangen dan dibungkus pelepah pinang atau daun pisang, lalu dimatangkan di bawah bara sekam hingga bumbu meresap sampai ke tulang.",
    "philosophy": "Unggas utuh berlumur bumbu genep kaya kunyit, jahe, dan serai yang dipanggang dalam sekam api perlahan.",
    "featured": false,
    "viewCount": 2980,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-ayam-betutu-bali",
      "name": "Foto Ayam Betutu Gilimanuk",
      "url": "/images/catalog/ayam-betutu-bali.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/ayam-betutu-bali"
  },
  {
    "id": "item-baju-bodo",
    "slug": "baju-bodo",
    "title": "Baju Bodo",
    "summary": "Busana tradisional wanita suku Bugis-Makassar berbentuk segi empat berlengan pendek, salah satu busana tertua di dunia.",
    "description": "Baju Bodo adalah pakaian tradisional perempuan suku Bugis dan Makassar di Sulawesi Selatan. Berbentuk segi empat longgar dari kain kasa atau sutra tipis, warna busana ini secara adat mencerminkan usia dan status sosial pemakainya.",
    "philosophy": "Busana tradisional wanita suku Bugis-Makassar berbentuk segi empat berlengan pendek, salah satu busana tertua di dunia.",
    "featured": false,
    "viewCount": 1820,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-sn",
      "code": "ID-SN",
      "name": "Sulawesi Selatan",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-baju-bodo",
      "name": "Foto Baju Bodo",
      "url": "/images/catalog/baju-bodo.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/baju-bodo"
  },
  {
    "id": "item-baju-cele-maluku",
    "slug": "baju-cele-maluku",
    "title": "Baju Cele Maluku",
    "summary": "Busana adat Maluku bermotif kotak-kotak merah bergaris geometris dipadukan dengan kain sarung tenun khas.",
    "description": "Baju Cele adalah pakaian adat Maluku yang sering dikenakan pada upacara pelantikan raja, cuci negeri, dan pesta pernikahan. Warna merah cerah menyimbolkan keberanian dan kehangatan persaudaraan pela gandong.",
    "philosophy": "Busana adat Maluku bermotif kotak-kotak merah bergaris geometris dipadukan dengan kain sarung tenun khas.",
    "featured": false,
    "viewCount": 1110,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-ma",
      "code": "ID-MA",
      "name": "Maluku",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-baju-cele-maluku",
      "name": "Foto Baju Cele Maluku",
      "url": "/images/catalog/baju-cele-maluku.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/baju-cele-maluku"
  },
  {
    "id": "item-batik-mega-mendung",
    "slug": "batik-mega-mendung",
    "title": "Batik Mega Mendung",
    "summary": "Motif batik khas Cirebon bergambar awan berlapis melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa.",
    "description": "Batik Mega Mendung merupakan mahakarya batik pesisir Cirebon dengan motif garis awan horizontal bergradasi tujuh warna, memadukan pengaruh seni Tiongkok dengan kearifan tasawuf Islam Sunan Gunung Jati.",
    "philosophy": "Motif batik khas Cirebon bergambar awan berlapis melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa.",
    "featured": true,
    "viewCount": 4200,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-jb",
      "code": "ID-JB",
      "name": "Jawa Barat",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-batik-mega-mendung",
      "name": "Foto Batik Mega Mendung",
      "url": "/images/catalog/batik-mega-mendung.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/batik-mega-mendung"
  },
  {
    "id": "item-batik-parang-yogyakarta",
    "slug": "batik-parang-yogyakarta",
    "title": "Batik Parang Rusak",
    "summary": "Motif batik larangan keraton bermotif ombak karang laut selatan yang melambangkan semangat pantang menyerah.",
    "description": "Batik Parang Rusak diciptakan oleh Sultan Agung Hanyakrakusuma saat bertapa di Pantai Selatan Jawa. Garis diagonal huruf 'S' tak terputus menggambarkan gelombang samudra dan perjuangan batin tanpa henti.",
    "philosophy": "Motif batik larangan keraton bermotif ombak karang laut selatan yang melambangkan semangat pantang menyerah.",
    "featured": true,
    "viewCount": 3890,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-yo",
      "code": "ID-YO",
      "name": "D.I. Yogyakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-batik-parang-yogyakarta",
      "name": "Foto Batik Parang Rusak",
      "url": "/images/catalog/batik-parang-yogyakarta.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/batik-parang-yogyakarta"
  },
  {
    "id": "item-bika-ambon-medan",
    "slug": "bika-ambon-medan",
    "title": "Bika Ambon Medan",
    "summary": "Kue berongga sarang semut berwarna kuning keemasan beraroma daun jeruk, santan, dan serai yang kenyal legit.",
    "description": "Meskipun bernama Ambon, kue ini merupakan penganan khas Kota Medan dari Jalan Ambon. Fermentasi tuak nira alami menciptakan rongga-rongga sarang lebah khas yang kenyal, harum, dan legit di lidah.",
    "philosophy": "Kue berongga sarang semut berwarna kuning keemasan beraroma daun jeruk, santan, dan serai yang kenyal legit.",
    "featured": false,
    "viewCount": 2420,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-bika-ambon-medan",
      "name": "Foto Bika Ambon Medan",
      "url": "/images/catalog/bika-ambon-medan.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/bika-ambon-medan"
  },
  {
    "id": "item-baju-aesan-gede",
    "slug": "baju-aesan-gede",
    "title": "Busana Aesan Gede",
    "summary": "Pakaian adat kebesaran pengantin Palembang bernuansa Swarnadwipa dengan mahkota karsuhun bertatahkan permata.",
    "description": "Aesan Gede adalah busana adat Palembang yang melambangkan keagungan Sriwijaya (Pulau Emas). Dilengkapi perhiasan tebeng maluku, kalung tapak jajo, dan teratai penutup dada yang memancarkan pesona ningrat.",
    "philosophy": "Pakaian adat kebesaran pengantin Palembang bernuansa Swarnadwipa dengan mahkota karsuhun bertatahkan permata.",
    "featured": false,
    "viewCount": 1250,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-ss",
      "code": "ID-SS",
      "name": "Sumatera Selatan",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-baju-aesan-gede",
      "name": "Foto Busana Aesan Gede",
      "url": "/images/catalog/baju-aesan-gede.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/baju-aesan-gede"
  },
  {
    "id": "item-coto-makassar",
    "slug": "coto-makassar",
    "title": "Coto Makassar",
    "summary": "Sup daging dan jeroan sapi legendaris berkuah kental dari rebusan air tajin beras dan gilingan kacang tanah sangrai.",
    "description": "Coto Makassar diramu dengan 40 jenis rempah (rampah patangpulo) dan kuah kacang gurih pekat. Dimasak dalam kuali tanah tanah (korong butta) dan dinikmati bersama ketupat daun kelapa serta perasan jeruk nipis.",
    "philosophy": "Sup daging dan jeroan sapi legendaris berkuah kental dari rebusan air tajin beras dan gilingan kacang tanah sangrai.",
    "featured": false,
    "viewCount": 3200,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-sn",
      "code": "ID-SN",
      "name": "Sulawesi Selatan",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-coto-makassar",
      "name": "Foto Coto Makassar",
      "url": "/images/catalog/coto-makassar.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/coto-makassar"
  },
  {
    "id": "item-lompat-batu-nias",
    "slug": "lompat-batu-nias",
    "title": "Fahombo (Lompat Batu Nias)",
    "summary": "Tradisi pemuda Nias melompati susunan tumpukan batu setinggi 2 meter sebagai lambang kedewasaan dan keberanian ksatria.",
    "description": "Fahombo lahir di Nias Selatan sebagai uji kesiapan pemuda desa menjadi prajurit pembela banua. Melompati piramida batu tanpa menyentuh puncaknya menuntut ketangkasan fisik, mental baja, dan restu roh leluhur.",
    "philosophy": "Tradisi pemuda Nias melompati susunan tumpukan batu setinggi 2 meter sebagai lambang kedewasaan dan keberanian ksatria.",
    "featured": true,
    "viewCount": 4120,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-lompat-batu-nias",
      "name": "Foto Fahombo (Lompat Batu Nias)",
      "url": "/images/catalog/lompat-batu-nias.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/lompat-batu-nias"
  },
  {
    "id": "item-gudeg-jogja",
    "slug": "gudeg-jogja",
    "title": "Gudeg Nangka Yogyakarta",
    "summary": "Sayur nangka muda manis gurih yang dimasak berjam-jam dengan santan, gula aren, dan daun jati dalam kuali tanah liat.",
    "description": "Gudeg adalah ikon kuliner Yogyakarta warisan Kerajaan Mataram Islam. Disajikan dengan nasi pulen, sambal krecek pedas, telur bacem, dan ayam kampung areh kental gurih, melambangkan kelembutan dan kesabaran orang Jawa.",
    "philosophy": "Sayur nangka muda manis gurih yang dimasak berjam-jam dengan santan, gula aren, dan daun jati dalam kuali tanah liat.",
    "featured": true,
    "viewCount": 4500,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-yo",
      "code": "ID-YO",
      "name": "D.I. Yogyakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-gudeg-jogja",
      "name": "Foto Gudeg Nangka Yogyakarta",
      "url": "/images/catalog/gudeg-jogja.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/gudeg-jogja"
  },
  {
    "id": "item-kain-tapis-lampung",
    "slug": "kain-tapis-lampung",
    "title": "Kain Tapis Lampung",
    "summary": "Kain tenun wanita suku Lampung bersulam benang emas dengan teknik cucuk bermotif flora dan perahu kehidupan.",
    "description": "Kain Tapis adalah pakaian wanita suku Lampung berbentuk sarung dari tenun kapas dengan sulaman benang emas motif perahu, pucuk rebung, dan pohon hayat untuk upacara perkawinan dan adat begawi.",
    "philosophy": "Kain tenun wanita suku Lampung bersulam benang emas dengan teknik cucuk bermotif flora dan perahu kehidupan.",
    "featured": false,
    "viewCount": 1420,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-la",
      "code": "ID-LA",
      "name": "Lampung",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-kain-tapis-lampung",
      "name": "Foto Kain Tapis Lampung",
      "url": "/images/catalog/kain-tapis-lampung.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/kain-tapis-lampung"
  },
  {
    "id": "item-ulos-batak",
    "slug": "ulos-batak",
    "title": "Kain Ulos Batak",
    "summary": "Kain tenun sakral khas masyarakat Batak yang melambangkan kehangatan, restu leluhur, dan ikatan kasih persaudaraan.",
    "description": "Ulos adalah kain tenun khas suku Batak di Sumatera Utara. Dibuat dengan alat tenun bukan mesin, ulos memiliki ragam motif seperti Ulos Ragi Hotang, Mangiring, dan Sibolang yang diserahkan dalam ritus kehidupan (kelahiran, pernikahan, duka).",
    "philosophy": "Kain tenun sakral khas masyarakat Batak yang melambangkan kehangatan, restu leluhur, dan ikatan kasih persaudaraan.",
    "featured": true,
    "viewCount": 2450,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-ulos-batak",
      "name": "Foto Kain Ulos Batak",
      "url": "/images/catalog/ulos-batak.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/ulos-batak"
  },
  {
    "id": "item-kerak-telor-betawi",
    "slug": "kerak-telor-betawi",
    "title": "Kerak Telor Betawi",
    "summary": "Omelet beras ketan putih dan telur bebek gurih ditaburi serundeng kelapa sangrai dan ebi kering khas tanah Betawi.",
    "description": "Kerak Telor adalah jajanan legendaris Batavia sejak era kolonial. Dimasak di atas wajan cekung tanpa minyak dan dibalik langsung di atas bara api arang hingga bagian bawahnya membentuk kerak renyah aromatik.",
    "philosophy": "Omelet beras ketan putih dan telur bebek gurih ditaburi serundeng kelapa sangrai dan ebi kering khas tanah Betawi.",
    "featured": false,
    "viewCount": 2860,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-jk",
      "code": "ID-JK",
      "name": "D.K.I. Jakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-kerak-telor-betawi",
      "name": "Foto Kerak Telor Betawi",
      "url": "/images/catalog/kerak-telor-betawi.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/kerak-telor-betawi"
  },
  {
    "id": "item-mie-aceh",
    "slug": "mie-aceh",
    "title": "Mie Aceh Kepiting",
    "summary": "Mie kuning kenyal tebal disiram kuah kari pedas gurih kaya kapulaga, jintan, dan potongan daging kepiting laut.",
    "description": "Mie Aceh mencerminkan posisi Aceh di jalur sutra rempah dunia, memadukan pengaruh mie Tionghoa, rempah kari India, dan daging olahan Timur Tengah. Disajikan goreng, basah, atau kuah dengan emping dan acar bawang merah.",
    "philosophy": "Mie kuning kenyal tebal disiram kuah kari pedas gurih kaya kapulaga, jintan, dan potongan daging kepiting laut.",
    "featured": false,
    "viewCount": 3120,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-ac",
      "code": "ID-AC",
      "name": "Aceh",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-mie-aceh",
      "name": "Foto Mie Aceh Kepiting",
      "url": "/images/catalog/mie-aceh.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/mie-aceh"
  },
  {
    "id": "item-papeda-kuah-kuning",
    "slug": "papeda-kuah-kuning",
    "title": "Papeda Kuah Kuning",
    "summary": "Makanan pokok sagu bertekstur kenyal lembut yang disantap bersama kuah ikan kuning kaya kunyit dan cabai.",
    "description": "Papeda dibuat dari tepung sagu pohon rumbia yang diaduk dengan air mendidih hingga bening dan kenyal. Disantap menggunakan sumpit gata-gata bersama sup ikan tongkol atau mubara berkuah kuning asam segar.",
    "philosophy": "Makanan pokok sagu bertekstur kenyal lembut yang disantap bersama kuah ikan kuning kaya kunyit dan cabai.",
    "featured": true,
    "viewCount": 3670,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-pa",
      "code": "ID-PA",
      "name": "Papua",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-papeda-kuah-kuning",
      "name": "Foto Papeda Kuah Kuning",
      "url": "/images/catalog/papeda-kuah-kuning.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/papeda-kuah-kuning"
  },
  {
    "id": "item-tradisi-pasola-sumba",
    "slug": "tradisi-pasola-sumba",
    "title": "Pasola Sumba",
    "summary": "Pertarungan menunggang kuda saling melempar lembing kayu di padang sabana luas menyambut datangnya cacing nyale.",
    "description": "Pasola adalah ritus perang adat berkuda masyarakat Marapu di Sumba Barat. Tetesan darah yang jatuh ke bumi dipercaya menyuburkan tanah pertanian dan mendatangkan panen berlimpah bagi segenap warga kampung adat.",
    "philosophy": "Pertarungan menunggang kuda saling melempar lembing kayu di padang sabana luas menyambut datangnya cacing nyale.",
    "featured": false,
    "viewCount": 2430,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-nt",
      "code": "ID-NT",
      "name": "Nusa Tenggara Timur",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-tradisi-pasola-sumba",
      "name": "Foto Pasola Sumba",
      "url": "/images/catalog/tradisi-pasola-sumba.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tradisi-pasola-sumba"
  },
  {
    "id": "item-pempek-palembang",
    "slug": "pempek-palembang",
    "title": "Pempek Kapal Selam",
    "summary": "Olahan daging ikan tenggiri dan sagu kenyal berisi telur utuh yang disantap bersama kuah cuko asam pedas manis.",
    "description": "Pempek lahir di Palembang sejak abad ke-16 dari perpaduan kearifan lokal Melayu dan perantau Tionghoa. Kelezatannya ditentukan oleh kualitas ikan tenggiri segar dan cuko kental dari gula batok Linggau asli.",
    "philosophy": "Olahan daging ikan tenggiri dan sagu kenyal berisi telur utuh yang disantap bersama kuah cuko asam pedas manis.",
    "featured": true,
    "viewCount": 4950,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-ss",
      "code": "ID-SS",
      "name": "Sumatera Selatan",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-pempek-palembang",
      "name": "Foto Pempek Kapal Selam",
      "url": "/images/catalog/pempek-palembang.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/pempek-palembang"
  },
  {
    "id": "item-perahu-sandeq-mandar",
    "slug": "perahu-sandeq-mandar",
    "title": "Perahu Sandeq Mandar",
    "summary": "Perahu layar bercadik tertipis dan tercepat di dunia hasil kearifan bahari suku Mandar mengarungi Selat Makassar.",
    "description": "Sandeq adalah mahakarya perkapalan tradisional suku Mandar. Mengandalkan tiang layar segitiga sombal tanjaq dan cadik ganda, perahu ramping ini mampu melaju hingga kecepatan 30 knot menembus gelombang samudra.",
    "philosophy": "Perahu layar bercadik tertipis dan tercepat di dunia hasil kearifan bahari suku Mandar mengarungi Selat Makassar.",
    "featured": false,
    "viewCount": 1690,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-sr",
      "code": "ID-SR",
      "name": "Sulawesi Barat",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-perahu-sandeq-mandar",
      "name": "Foto Perahu Sandeq Mandar",
      "url": "/images/catalog/perahu-sandeq-mandar.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/perahu-sandeq-mandar"
  },
  {
    "id": "item-rendang-minang",
    "slug": "rendang-minang",
    "title": "Rendang Daging Sapi",
    "summary": "Kuliner terlezat dunia olahan daging sapi dengan rempah melimpah dan santan kelapa yang dimasak perlahan berjam-jam.",
    "description": "Rendang adalah mahakarya kuliner Minangkabau yang dimasak hingga santan mengering dan bumbu meresap hitam pekat. Mengandung filosofi empat pilar adat: dagiang (niniak mamak), karambia (cadiak pandai), lado (alim ulama), dan pemasak (masyarakat).",
    "philosophy": "Kuliner terlezat dunia olahan daging sapi dengan rempah melimpah dan santan kelapa yang dimasak perlahan berjam-jam.",
    "featured": true,
    "viewCount": 7800,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-rendang-minang",
      "name": "Foto Rendang Daging Sapi",
      "url": "/images/catalog/rendang-minang.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/rendang-minang"
  },
  {
    "id": "item-reog-ponorogo",
    "slug": "reog-ponorogo",
    "title": "Reog Ponorogo",
    "summary": "Seni panggung kolosal dengan topeng Singa Barong berbobot 50 kg berhias bulu merak yang diangkat dengan gigi.",
    "description": "Reog Ponorogo adalah tarian rakyat legendaris Jawa Timur yang menampilkan sosok Prabu Klono Sewandono, Bujang Ganong, penari jathil berkuda kepang, dan Singa Barong megah yang mencerminkan ketahanan fisik dan spiritual.",
    "philosophy": "Seni panggung kolosal dengan topeng Singa Barong berbobot 50 kg berhias bulu merak yang diangkat dengan gigi.",
    "featured": true,
    "viewCount": 4900,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-ji",
      "code": "ID-JI",
      "name": "Jawa Timur",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-reog-ponorogo",
      "name": "Foto Reog Ponorogo",
      "url": "/images/catalog/reog-ponorogo.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/reog-ponorogo"
  },
  {
    "id": "item-house-anjir",
    "slug": "anjir",
    "title": "Rumah Adat Anjir",
    "summary": "Rumah adat Anjir (Rumah Anjir Asmat / Marind) khas suku Asmat / Marind-Anim di provinsi Papua Selatan.",
    "description": "Rumah adat Anjir (Rumah Anjir Asmat / Marind) khas suku Asmat / Marind-Anim di provinsi Papua Selatan. Diwariskan turun-temurun oleh masyarakat suku Asmat / Marind-Anim di provinsi Papua Selatan.\n\nFalsafah Ruang & Adat:\nHarmoni adaptasi di muara sungai dan rawa pesisir selatan Papua, simbol kesiapsiagaan kaum bahari menghadapi pasang surut air laut.",
    "philosophy": "Harmoni adaptasi di muara sungai dan rawa pesisir selatan Papua, simbol kesiapsiagaan kaum bahari menghadapi pasang surut air laut.",
    "featured": false,
    "viewCount": 3201,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ps",
      "code": "ID-PS",
      "name": "Papua Selatan",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-anjir",
      "name": "Foto Rumah Adat Anjir",
      "url": "/images/catalog/anjir.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-anjir",
      "name": "Model 3D Rumah Adat Anjir",
      "url": "/api/models/houses/papua-selatan.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=anjir"
  },
  {
    "id": "item-house-baileo",
    "slug": "baileo",
    "title": "Rumah Adat Baileo",
    "summary": "Rumah adat Baileo (Baileo Alifuru) khas suku Maluku di provinsi Maluku.",
    "description": "Rumah adat Baileo (Baileo Alifuru) khas suku Maluku di provinsi Maluku. Diwariskan turun-temurun oleh masyarakat suku Maluku di provinsi Maluku.\n\nFalsafah Ruang & Adat:\n“Pela Gandong” — Ikatan persaudaraan abadi lintas negeri dan keyakinan, balai tanpa dinding melambangkan keterbukaan musyawarah warga.",
    "philosophy": "“Pela Gandong” — Ikatan persaudaraan abadi lintas negeri dan keyakinan, balai tanpa dinding melambangkan keterbukaan musyawarah warga.",
    "featured": false,
    "viewCount": 5190,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ma",
      "code": "ID-MA",
      "name": "Maluku",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-baileo",
      "name": "Foto Rumah Adat Baileo",
      "url": "/images/catalog/baileo.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-baileo",
      "name": "Model 3D Rumah Adat Baileo",
      "url": "/api/models/houses/maluku.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=baileo"
  },
  {
    "id": "item-house-baloy-mayo",
    "slug": "baloy-mayo",
    "title": "Rumah Adat Baloy Mayo",
    "summary": "Rumah adat Baloy Mayo (Baloy Mayo Tidung) khas suku Tidung di provinsi Kalimantan Utara.",
    "description": "Rumah adat Baloy Mayo (Baloy Mayo Tidung) khas suku Tidung di provinsi Kalimantan Utara. Diwariskan turun-temurun oleh masyarakat suku Tidung di provinsi Kalimantan Utara.\n\nFalsafah Ruang & Adat:\nMenghadap ke arah utara laut sebagai perlambang kesiapan menyambut rezeki dan para pelaut dari penjuru mata angin samudra.",
    "philosophy": "Menghadap ke arah utara laut sebagai perlambang kesiapan menyambut rezeki dan para pelaut dari penjuru mata angin samudra.",
    "featured": false,
    "viewCount": 4679,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ku",
      "code": "ID-KU",
      "name": "Kalimantan Utara",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-baloy-mayo",
      "name": "Foto Rumah Adat Baloy Mayo",
      "url": "/images/catalog/baloy-mayo.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-baloy-mayo",
      "name": "Model 3D Rumah Adat Baloy Mayo",
      "url": "/api/models/houses/baloy-mayo.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=baloy-mayo"
  },
  {
    "id": "item-house-bangsal-kencono",
    "slug": "bangsal-kencono",
    "title": "Rumah Adat Bangsal Kencono",
    "summary": "Rumah adat Bangsal Kencono (Joglo Mangkurat Kraton) khas suku Jawa di provinsi DI Yogyakarta.",
    "description": "Rumah adat Bangsal Kencono (Joglo Mangkurat Kraton) khas suku Jawa di provinsi DI Yogyakarta. Diwariskan turun-temurun oleh masyarakat suku Jawa di provinsi DI Yogyakarta.\n\nFalsafah Ruang & Adat:\n“Hamemayu Hayuning Bawana” — Memperindah keindahan dunia, memadukan poros filosofis Tugu Pal Putih, Kraton, hingga Panggung Krapyak.",
    "philosophy": "“Hamemayu Hayuning Bawana” — Memperindah keindahan dunia, memadukan poros filosofis Tugu Pal Putih, Kraton, hingga Panggung Krapyak.",
    "featured": false,
    "viewCount": 4022,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-yo",
      "code": "ID-YO",
      "name": "D.I. Yogyakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-bangsal-kencono",
      "name": "Foto Rumah Adat Bangsal Kencono",
      "url": "/images/catalog/bangsal-kencono.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-bangsal-kencono",
      "name": "Model 3D Rumah Adat Bangsal Kencono",
      "url": "/api/models/houses/daerah-istimewa-yogyakarta.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=bangsal-kencono"
  },
  {
    "id": "item-house-banua-tada",
    "slug": "banua-tada",
    "title": "Rumah Adat Banua Tada",
    "summary": "Rumah adat Banua Tada (Kamali Sultan Buton) khas suku Buton / Muna di provinsi Sulawesi Tenggara.",
    "description": "Rumah adat Banua Tada (Kamali Sultan Buton) khas suku Buton / Muna di provinsi Sulawesi Tenggara. Diwariskan turun-temurun oleh masyarakat suku Buton / Muna di provinsi Sulawesi Tenggara.\n\nFalsafah Ruang & Adat:\n“Yinda-yindamo sara poma-masiaka” — Mengutamakan cinta kasih sesama dalam naungan hukum syariat Kesultanan Buton.",
    "philosophy": "“Yinda-yindamo sara poma-masiaka” — Mengutamakan cinta kasih sesama dalam naungan hukum syariat Kesultanan Buton.",
    "featured": false,
    "viewCount": 5117,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-sg",
      "code": "ID-SG",
      "name": "Sulawesi Tenggara",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-banua-tada",
      "name": "Foto Rumah Adat Banua Tada",
      "url": "/images/catalog/banua-tada.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-banua-tada",
      "name": "Model 3D Rumah Adat Banua Tada",
      "url": "/api/models/houses/sulawesi-tenggara.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=banua-tada"
  },
  {
    "id": "item-house-belah-bubung",
    "slug": "belah-bubung",
    "title": "Rumah Adat Belah Bubung",
    "summary": "Rumah adat Belah Bubung (Rumah Rabung) khas suku Melayu Kepulauan di provinsi Kepulauan Riau.",
    "description": "Rumah adat Belah Bubung (Rumah Rabung) khas suku Melayu Kepulauan di provinsi Kepulauan Riau. Diwariskan turun-temurun oleh masyarakat suku Melayu Kepulauan di provinsi Kepulauan Riau.\n\nFalsafah Ruang & Adat:\n“Laksamana di laut, raja di darat” — Adaptasi kemaritiman kepulauan yang dirancang ramah tiupan angin kencang samudra pesisir Selat Malaka.",
    "philosophy": "“Laksamana di laut, raja di darat” — Adaptasi kemaritiman kepulauan yang dirancang ramah tiupan angin kencang samudra pesisir Selat Malaka.",
    "featured": false,
    "viewCount": 3292,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-kr",
      "code": "ID-KR",
      "name": "Kepulauan Riau",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-belah-bubung",
      "name": "Foto Rumah Adat Belah Bubung",
      "url": "/images/catalog/belah-bubung.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-belah-bubung",
      "name": "Model 3D Rumah Adat Belah Bubung",
      "url": "/api/models/houses/kepulauan-riau.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=belah-bubung"
  },
  {
    "id": "item-house-betang",
    "slug": "betang",
    "title": "Rumah Adat Betang",
    "summary": "Rumah adat Betang (Huma Betang) khas suku Dayak Ngaju di provinsi Kalimantan Tengah.",
    "description": "Rumah adat Betang (Huma Betang) khas suku Dayak Ngaju di provinsi Kalimantan Tengah. Diwariskan turun-temurun oleh masyarakat suku Dayak Ngaju di provinsi Kalimantan Tengah.\n\nFalsafah Ruang & Adat:\n“Belom Bahadat” — Tata hidup beradab dalam naungan komunal tanpa sekat, merawat kesetaraan dan toleransi lintas suku dan keyakinan.",
    "philosophy": "“Belom Bahadat” — Tata hidup beradab dalam naungan komunal tanpa sekat, merawat kesetaraan dan toleransi lintas suku dan keyakinan.",
    "featured": true,
    "viewCount": 4460,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-kt",
      "code": "ID-KT",
      "name": "Kalimantan Tengah",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-betang",
      "name": "Foto Rumah Adat Betang",
      "url": "/images/catalog/betang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-betang",
      "name": "Model 3D Rumah Adat Betang",
      "url": "/api/models/houses/kalimantan-tengah.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=betang"
  },
  {
    "id": "item-house-bolon",
    "slug": "bolon",
    "title": "Rumah Adat Bolon",
    "summary": "Rumah adat Bolon (Ruma Batak / Jabu Bolon) khas suku Batak Toba di provinsi Sumatera Utara.",
    "description": "Rumah adat Bolon (Ruma Batak / Jabu Bolon) khas suku Batak Toba di provinsi Sumatera Utara. Diwariskan turun-temurun oleh masyarakat suku Batak Toba di provinsi Sumatera Utara.\n\nFalsafah Ruang & Adat:\n“Dalihan Na Tolu” — Tiga tiang tungku kekerabatan penyeimbang semesta: Somba Marhula-hula, Manat Mardongan Tubu, Elek Marboru.",
    "philosophy": "“Dalihan Na Tolu” — Tiga tiang tungku kekerabatan penyeimbang semesta: Somba Marhula-hula, Manat Mardongan Tubu, Elek Marboru.",
    "featured": false,
    "viewCount": 3073,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-bolon",
      "name": "Foto Rumah Adat Bolon",
      "url": "/images/catalog/bolon.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-bolon",
      "name": "Model 3D Rumah Adat Bolon",
      "url": "/api/models/houses/sumatera-utara.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=bolon"
  },
  {
    "id": "item-house-boyang",
    "slug": "boyang",
    "title": "Rumah Adat Boyang",
    "summary": "Rumah adat Boyang (Boyang Adaq Mandar) khas suku Mandar di provinsi Sulawesi Barat.",
    "description": "Rumah adat Boyang (Boyang Adaq Mandar) khas suku Mandar di provinsi Sulawesi Barat. Diwariskan turun-temurun oleh masyarakat suku Mandar di provinsi Sulawesi Barat.\n\nFalsafah Ruang & Adat:\n“Mellamun dio la’na, mattette dio pambuanganna” — Berpegang teguh pada asal mula, menjaga kehormatan pelaut Mandar mengarungi samudra.",
    "philosophy": "“Mellamun dio la’na, mattette dio pambuanganna” — Berpegang teguh pada asal mula, menjaga kehormatan pelaut Mandar mengarungi samudra.",
    "featured": false,
    "viewCount": 4971,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-sr",
      "code": "ID-SR",
      "name": "Sulawesi Barat",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-boyang",
      "name": "Foto Rumah Adat Boyang",
      "url": "/images/catalog/boyang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-boyang",
      "name": "Model 3D Rumah Adat Boyang",
      "url": "/api/models/houses/sulawesi-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=boyang"
  },
  {
    "id": "item-house-bubungan-lima",
    "slug": "bubungan-lima",
    "title": "Rumah Adat Bubungan Lima",
    "summary": "Rumah adat Bubungan Lima (Rumah Penghulu Bengkulu) khas suku Melayu Bengkulu / Rejang di provinsi Bengkulu.",
    "description": "Rumah adat Bubungan Lima (Rumah Penghulu Bengkulu) khas suku Melayu Bengkulu / Rejang di provinsi Bengkulu. Diwariskan turun-temurun oleh masyarakat suku Melayu Bengkulu / Rejang di provinsi Bengkulu.\n\nFalsafah Ruang & Adat:\n“Bulat air oleh pembuluh, bulat kata oleh mufakat” — Lima tingkat bubungan melambangkan lima rukun Islam dan lima asas kesepakatan adat.",
    "philosophy": "“Bulat air oleh pembuluh, bulat kata oleh mufakat” — Lima tingkat bubungan melambangkan lima rukun Islam dan lima asas kesepakatan adat.",
    "featured": false,
    "viewCount": 3584,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-be",
      "code": "ID-BE",
      "name": "Bengkulu",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-bubungan-lima",
      "name": "Foto Rumah Adat Bubungan Lima",
      "url": "/images/catalog/bubungan-lima.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-bubungan-lima",
      "name": "Model 3D Rumah Adat Bubungan Lima",
      "url": "/api/models/houses/bengkulu.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=bubungan-lima"
  },
  {
    "id": "item-house-bubungan-tinggi",
    "slug": "bubungan-tinggi",
    "title": "Rumah Adat Bubungan Tinggi",
    "summary": "Rumah adat Bubungan Tinggi (Rumah Ba’anjung Banjar) khas suku Banjar di provinsi Kalimantan Selatan.",
    "description": "Rumah adat Bubungan Tinggi (Rumah Ba’anjung Banjar) khas suku Banjar di provinsi Kalimantan Selatan. Diwariskan turun-temurun oleh masyarakat suku Banjar di provinsi Kalimantan Selatan.\n\nFalsafah Ruang & Adat:\n“Kayuh baimbai, bujur-bujur maniti buih” — Atap lancip menjulang ke angkasa sebagai perlambang pohon hayat kosmis penyatu dunia fana dan keabadian.",
    "philosophy": "“Kayuh baimbai, bujur-bujur maniti buih” — Atap lancip menjulang ke angkasa sebagai perlambang pohon hayat kosmis penyatu dunia fana dan keabadian.",
    "featured": false,
    "viewCount": 4533,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ks",
      "code": "ID-KS",
      "name": "Kalimantan Selatan",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-bubungan-tinggi",
      "name": "Foto Rumah Adat Bubungan Tinggi",
      "url": "/images/catalog/bubungan-tinggi.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-bubungan-tinggi",
      "name": "Model 3D Rumah Adat Bubungan Tinggi",
      "url": "/api/models/houses/kalimantan-selatan.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=bubungan-tinggi"
  },
  {
    "id": "item-house-dalam-loka",
    "slug": "dalam-loka",
    "title": "Rumah Adat Dalam Loka",
    "summary": "Rumah adat Dalam Loka (Istana Dalam Loka Sumbawa) khas suku Sumbawa / Sasak di provinsi Nusa Tenggara Barat.",
    "description": "Rumah adat Dalam Loka (Istana Dalam Loka Sumbawa) khas suku Sumbawa / Sasak di provinsi Nusa Tenggara Barat. Diwariskan turun-temurun oleh masyarakat suku Sumbawa / Sasak di provinsi Nusa Tenggara Barat.\n\nFalsafah Ruang & Adat:\n“Adat Barenti Ko Syara, Syara Barenti Ko Kitabullah” — Istana kayu panggung kembar raksasa penegak syariat dan musyawarah kesultanan Sumbawa.",
    "philosophy": "“Adat Barenti Ko Syara, Syara Barenti Ko Kitabullah” — Istana kayu panggung kembar raksasa penegak syariat dan musyawarah kesultanan Sumbawa.",
    "featured": false,
    "viewCount": 4241,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-nb",
      "code": "ID-NB",
      "name": "Nusa Tenggara Barat",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-dalam-loka",
      "name": "Foto Rumah Adat Dalam Loka",
      "url": "/images/catalog/dalam-loka.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-dalam-loka",
      "name": "Model 3D Rumah Adat Dalam Loka",
      "url": "/api/models/houses/nusa-tenggara-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=dalam-loka"
  },
  {
    "id": "item-house-dulohupa",
    "slug": "dulohupa",
    "title": "Rumah Adat Dulohupa",
    "summary": "Rumah adat Dulohupa (Yiladia Dulohupa) khas suku Gorontalo di provinsi Gorontalo.",
    "description": "Rumah adat Dulohupa (Yiladia Dulohupa) khas suku Gorontalo di provinsi Gorontalo. Diwariskan turun-temurun oleh masyarakat suku Gorontalo di provinsi Gorontalo.\n\nFalsafah Ruang & Adat:\n“Aadate hula-hulaa to saraa, saraa hula-hulaa to Kuru’ani” — Adat bersendikan syariat, syariat bersendikan Al-Qur’an.",
    "philosophy": "“Aadate hula-hulaa to saraa, saraa hula-hulaa to Kuru’ani” — Adat bersendikan syariat, syariat bersendikan Al-Qur’an.",
    "featured": false,
    "viewCount": 4825,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-go",
      "code": "ID-GO",
      "name": "Gorontalo",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-dulohupa",
      "name": "Foto Rumah Adat Dulohupa",
      "url": "/images/catalog/dulohupa.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-dulohupa",
      "name": "Model 3D Rumah Adat Dulohupa",
      "url": "/api/models/houses/gorontalo.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=dulohupa"
  },
  {
    "id": "item-house-gapura-candi-bentar",
    "slug": "gapura-candi-bentar",
    "title": "Rumah Adat Gapura Candi Bentar",
    "summary": "Rumah adat Gapura Candi Bentar (Kori Agung & Bale Daja) khas suku Bali di provinsi Bali.",
    "description": "Rumah adat Gapura Candi Bentar (Kori Agung & Bale Daja) khas suku Bali di provinsi Bali. Diwariskan turun-temurun oleh masyarakat suku Bali di provinsi Bali.\n\nFalsafah Ruang & Adat:\n“Tri Hita Karana & Candi Bentar” — Gerbang belah dua lambang terbukanya gunung suci Kailasa penyeimbang daya positif dan negatif kosmis.",
    "philosophy": "“Tri Hita Karana & Candi Bentar” — Gerbang belah dua lambang terbukanya gunung suci Kailasa penyeimbang daya positif dan negatif kosmis.",
    "featured": false,
    "viewCount": 4168,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-gapura-candi-bentar",
      "name": "Foto Rumah Adat Gapura Candi Bentar",
      "url": "/images/catalog/gapura-candi-bentar.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-gapura-candi-bentar",
      "name": "Model 3D Rumah Adat Gapura Candi Bentar",
      "url": "/api/models/houses/bali.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=gapura-candi-bentar"
  },
  {
    "id": "item-house-honai",
    "slug": "honai",
    "title": "Rumah Adat Honai",
    "summary": "Rumah adat Honai (Pilamo / Honai Sentani) khas suku Dani / Tobati di provinsi Papua.",
    "description": "Rumah adat Honai (Pilamo / Honai Sentani) khas suku Dani / Tobati di provinsi Papua. Diwariskan turun-temurun oleh masyarakat suku Dani / Tobati di provinsi Papua.\n\nFalsafah Ruang & Adat:\n“Satu tungku kehangatan” — Mempertautkan persaudaraan tanpa sekat pembeda dalam lingkaran pelindung dari dinginnya alam raya Papua.",
    "philosophy": "“Satu tungku kehangatan” — Mempertautkan persaudaraan tanpa sekat pembeda dalam lingkaran pelindung dari dinginnya alam raya Papua.",
    "featured": true,
    "viewCount": 3055,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-pa",
      "code": "ID-PA",
      "name": "Papua",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-honai",
      "name": "Foto Rumah Adat Honai",
      "url": "/images/catalog/honai.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-honai",
      "name": "Model 3D Rumah Adat Honai",
      "url": "/api/models/houses/papua.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=honai"
  },
  {
    "id": "item-house-jew",
    "slug": "jew",
    "title": "Rumah Adat Jew",
    "summary": "Rumah adat Jew (Jew Rumah Bujang Pegunungan) khas suku Dani / Nduga di provinsi Papua Pegunungan.",
    "description": "Rumah adat Jew (Jew Rumah Bujang Pegunungan) khas suku Dani / Nduga di provinsi Papua Pegunungan. Diwariskan turun-temurun oleh masyarakat suku Dani / Nduga di provinsi Papua Pegunungan.\n\nFalsafah Ruang & Adat:\nPusat ketahanan adat pegunungan tinggi, perapian tungku di dalam rumah melambangkan ikatan kekerabatan klan pejuang tangguh.",
    "philosophy": "Pusat ketahanan adat pegunungan tinggi, perapian tungku di dalam rumah melambangkan ikatan kekerabatan klan pejuang tangguh.",
    "featured": false,
    "viewCount": 3128,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-pe",
      "code": "ID-PE",
      "name": "Papua Pegunungan",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-jew",
      "name": "Foto Rumah Adat Jew",
      "url": "/images/catalog/jew.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-jew",
      "name": "Model 3D Rumah Adat Jew",
      "url": "/api/models/houses/papua-pegunungan.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=jew"
  },
  {
    "id": "item-house-joglo",
    "slug": "joglo",
    "title": "Rumah Adat Joglo",
    "summary": "Rumah adat Joglo (Joglo Sinom / Trajumas) khas suku Jawa di provinsi Jawa Tengah.",
    "description": "Rumah adat Joglo (Joglo Sinom / Trajumas) khas suku Jawa di provinsi Jawa Tengah. Diwariskan turun-temurun oleh masyarakat suku Jawa di provinsi Jawa Tengah.\n\nFalsafah Ruang & Adat:\n“Manunggaling kawula gusti” — Keseimbangan batin manusia dengan alam makrokosmos yang dinaungi oleh empat pilar saka guru kokoh.",
    "philosophy": "“Manunggaling kawula gusti” — Keseimbangan batin manusia dengan alam makrokosmos yang dinaungi oleh empat pilar saka guru kokoh.",
    "featured": true,
    "viewCount": 3949,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-jt",
      "code": "ID-JT",
      "name": "Jawa Tengah",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-joglo",
      "name": "Foto Rumah Adat Joglo",
      "url": "/images/catalog/joglo.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-joglo",
      "name": "Model 3D Rumah Adat Joglo",
      "url": "/api/models/houses/jawa-tengah.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=joglo"
  },
  {
    "id": "item-house-joglo-situbondo",
    "slug": "joglo-situbondo",
    "title": "Rumah Adat Joglo Situbondo",
    "summary": "Rumah adat Joglo Situbondo (Joglo Situbondo Jawa Timur) khas suku Jawa / Madura di provinsi Jawa Timur.",
    "description": "Rumah adat Joglo Situbondo (Joglo Situbondo Jawa Timur) khas suku Jawa / Madura di provinsi Jawa Timur. Diwariskan turun-temurun oleh masyarakat suku Jawa / Madura di provinsi Jawa Timur.\n\nFalsafah Ruang & Adat:\n“Rampak Naong, Baringin Korong” — Keteduhan batin yang mengayomi seluruh keluarga dalam ketulusan kerja keras dan persaudaraan.",
    "philosophy": "“Rampak Naong, Baringin Korong” — Keteduhan batin yang mengayomi seluruh keluarga dalam ketulusan kerja keras dan persaudaraan.",
    "featured": false,
    "viewCount": 4095,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ji",
      "code": "ID-JI",
      "name": "Jawa Timur",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-joglo-situbondo",
      "name": "Foto Rumah Adat Joglo Situbondo",
      "url": "/images/catalog/joglo-situbondo.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-joglo-situbondo",
      "name": "Model 3D Rumah Adat Joglo Situbondo",
      "url": "/api/models/houses/jawa-timur.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=joglo-situbondo"
  },
  {
    "id": "item-house-julang-ngapak",
    "slug": "julang-ngapak",
    "title": "Rumah Adat Julang Ngapak",
    "summary": "Rumah adat Julang Ngapak (Imah Julang Ngapak) khas suku Sunda di provinsi Jawa Barat.",
    "description": "Rumah adat Julang Ngapak (Imah Julang Ngapak) khas suku Sunda di provinsi Jawa Barat. Diwariskan turun-temurun oleh masyarakat suku Sunda di provinsi Jawa Barat.\n\nFalsafah Ruang & Adat:\n“Silih asih, silih asah, silih asuh” — Bentuk atap mirip burung yang sedang mengepakkan sayap menaungi keturunan dalam kedamaian dan keteduhan.",
    "philosophy": "“Silih asih, silih asah, silih asuh” — Bentuk atap mirip burung yang sedang mengepakkan sayap menaungi keturunan dalam kedamaian dan keteduhan.",
    "featured": false,
    "viewCount": 3876,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-jb",
      "code": "ID-JB",
      "name": "Jawa Barat",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-julang-ngapak",
      "name": "Foto Rumah Adat Julang Ngapak",
      "url": "/images/catalog/julang-ngapak.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-julang-ngapak",
      "name": "Model 3D Rumah Adat Julang Ngapak",
      "url": "/api/models/houses/jawa-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=julang-ngapak"
  },
  {
    "id": "item-house-kambik",
    "slug": "kambik",
    "title": "Rumah Adat Kambik",
    "summary": "Rumah adat Kambik (Rumah Adat Kambik Moi / Kalitabu) khas suku Moi / Maybrat di provinsi Papua Barat Daya.",
    "description": "Rumah adat Kambik (Rumah Adat Kambik Moi / Kalitabu) khas suku Moi / Maybrat di provinsi Papua Barat Daya. Diwariskan turun-temurun oleh masyarakat suku Moi / Maybrat di provinsi Papua Barat Daya.\n\nFalsafah Ruang & Adat:\nInstitusi pendidikan luhur suku Moi, tempat inisiasi pemuda mempelajari hukum adat, astronomi, pengobatan herbal, dan kepemimpinan.",
    "philosophy": "Institusi pendidikan luhur suku Moi, tempat inisiasi pemuda mempelajari hukum adat, astronomi, pengobatan herbal, dan kepemimpinan.",
    "featured": false,
    "viewCount": 5336,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-pd",
      "code": "ID-PD",
      "name": "Papua Barat Daya",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-kambik",
      "name": "Foto Rumah Adat Kambik",
      "url": "/images/catalog/kambik.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kambik",
      "name": "Model 3D Rumah Adat Kambik",
      "url": "/api/models/houses/papua-barat-daya.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=kambik"
  },
  {
    "id": "item-house-karapao",
    "slug": "karapao",
    "title": "Rumah Adat Karapao",
    "summary": "Rumah adat Karapao (Karapao Kamoro / Emai) khas suku Kamoro / Mee di provinsi Papua Tengah.",
    "description": "Rumah adat Karapao (Karapao Kamoro / Emai) khas suku Kamoro / Mee di provinsi Papua Tengah. Diwariskan turun-temurun oleh masyarakat suku Kamoro / Mee di provinsi Papua Tengah.\n\nFalsafah Ruang & Adat:\nSimbol rahim ibu pertiwi yang melahirkan kembali kedewasaan dan keberanian anak-anak suku Kamoro dalam upacara suci Karapao.",
    "philosophy": "Simbol rahim ibu pertiwi yang melahirkan kembali kedewasaan dan keberanian anak-anak suku Kamoro dalam upacara suci Karapao.",
    "featured": false,
    "viewCount": 5482,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-pt",
      "code": "ID-PT",
      "name": "Papua Tengah",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-karapao",
      "name": "Foto Rumah Adat Karapao",
      "url": "/images/catalog/karapao.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-karapao",
      "name": "Model 3D Rumah Adat Karapao",
      "url": "/api/models/houses/papua-tengah.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=karapao"
  },
  {
    "id": "item-house-kebaya-bapang",
    "slug": "kebaya-bapang",
    "title": "Rumah Adat Kebaya (Bapang)",
    "summary": "Rumah adat Kebaya (Bapang) (Rumah Bapang Betawi) khas suku Betawi di provinsi DKI Jakarta.",
    "description": "Rumah adat Kebaya (Bapang) (Rumah Bapang Betawi) khas suku Betawi di provinsi DKI Jakarta. Diwariskan turun-temurun oleh masyarakat suku Betawi di provinsi DKI Jakarta.\n\nFalsafah Ruang & Adat:\n“Kagak ade pager, lapang dada nerime sape aje” — Teras serambi depan yang sangat luas tanpa sekat menggambarkan sifat egaliter dan ramah warga Betawi.",
    "philosophy": "“Kagak ade pager, lapang dada nerime sape aje” — Teras serambi depan yang sangat luas tanpa sekat menggambarkan sifat egaliter dan ramah warga Betawi.",
    "featured": false,
    "viewCount": 3803,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-jk",
      "code": "ID-JK",
      "name": "D.K.I. Jakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-kebaya-bapang",
      "name": "Foto Rumah Adat Kebaya (Bapang)",
      "url": "/images/catalog/kebaya-bapang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-kebaya-bapang",
      "name": "Model 3D Rumah Adat Kebaya (Bapang)",
      "url": "/api/models/houses/dki-jakarta.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=kebaya-bapang"
  },
  {
    "id": "item-house-lamin",
    "slug": "lamin",
    "title": "Rumah Adat Lamin",
    "summary": "Rumah adat Lamin (Lamin Dayak Kenyah) khas suku Dayak Kenyah di provinsi Kalimantan Timur.",
    "description": "Rumah adat Lamin (Lamin Dayak Kenyah) khas suku Dayak Kenyah di provinsi Kalimantan Timur. Diwariskan turun-temurun oleh masyarakat suku Dayak Kenyah di provinsi Kalimantan Timur.\n\nFalsafah Ruang & Adat:\n“Ahe gina, hete gina” — Di mana bumi dipijak di situ saling menolong, dihiasi motif taring aso penolak energi buruk rimba.",
    "philosophy": "“Ahe gina, hete gina” — Di mana bumi dipijak di situ saling menolong, dihiasi motif taring aso penolak energi buruk rimba.",
    "featured": false,
    "viewCount": 4606,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ki",
      "code": "ID-KI",
      "name": "Kalimantan Timur",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-lamin",
      "name": "Foto Rumah Adat Lamin",
      "url": "/images/catalog/lamin.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-lamin",
      "name": "Model 3D Rumah Adat Lamin",
      "url": "/api/models/houses/kalimantan-timur.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=lamin"
  },
  {
    "id": "item-house-limas",
    "slug": "limas",
    "title": "Rumah Adat Limas",
    "summary": "Rumah adat Limas (Rumah Bari Limas) khas suku Palembang di provinsi Sumatera Selatan.",
    "description": "Rumah adat Limas (Rumah Bari Limas) khas suku Palembang di provinsi Sumatera Selatan. Diwariskan turun-temurun oleh masyarakat suku Palembang di provinsi Sumatera Selatan.\n\nFalsafah Ruang & Adat:\n“Kekijing Kekerabatan” — Lantai bertingkat lima (kekijing) yang merefleksikan jenjang usia, garis keturunan, dan kedudukan sosial dalam tatakrama adat.",
    "philosophy": "“Kekijing Kekerabatan” — Lantai bertingkat lima (kekijing) yang merefleksikan jenjang usia, garis keturunan, dan kedudukan sosial dalam tatakrama adat.",
    "featured": false,
    "viewCount": 3438,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ss",
      "code": "ID-SS",
      "name": "Sumatera Selatan",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-limas",
      "name": "Foto Rumah Adat Limas",
      "url": "/images/catalog/limas.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-limas",
      "name": "Model 3D Rumah Adat Limas",
      "url": "/api/models/houses/sumatera-selatan.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=limas"
  },
  {
    "id": "item-house-mod-aki-aksa",
    "slug": "mod-aki-aksa",
    "title": "Rumah Adat Mod Aki Aksa",
    "summary": "Rumah adat Mod Aki Aksa (Rumah Kaki Seribu Arfak) khas suku Arfak di provinsi Papua Barat.",
    "description": "Rumah adat Mod Aki Aksa (Rumah Kaki Seribu Arfak) khas suku Arfak di provinsi Papua Barat. Diwariskan turun-temurun oleh masyarakat suku Arfak di provinsi Papua Barat.\n\nFalsafah Ruang & Adat:\n“Menopang bersama di lereng terjal” — Ratusan tiang penopang melambangkan gotong royong dan ketahanan menghadapi ancaman musuh serta hewan buas.",
    "philosophy": "“Menopang bersama di lereng terjal” — Ratusan tiang penopang melambangkan gotong royong dan ketahanan menghadapi ancaman musuh serta hewan buas.",
    "featured": false,
    "viewCount": 5409,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-pb",
      "code": "ID-PB",
      "name": "Papua Barat",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-mod-aki-aksa",
      "name": "Foto Rumah Adat Mod Aki Aksa",
      "url": "/images/catalog/mod-aki-aksa.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-mod-aki-aksa",
      "name": "Model 3D Rumah Adat Mod Aki Aksa",
      "url": "/api/models/houses/papua-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=mod-aki-aksa"
  },
  {
    "id": "item-house-musalaki",
    "slug": "musalaki",
    "title": "Rumah Adat Musalaki",
    "summary": "Rumah adat Musalaki (Sao Ria Musalaki & Mbaru Niang) khas suku Ende Lio / Manggarai di provinsi Nusa Tenggara Timur.",
    "description": "Rumah adat Musalaki (Sao Ria Musalaki & Mbaru Niang) khas suku Ende Lio / Manggarai di provinsi Nusa Tenggara Timur. Diwariskan turun-temurun oleh masyarakat suku Ende Lio / Manggarai di provinsi Nusa Tenggara Timur.\n\nFalsafah Ruang & Adat:\n“Du’a Ngga’e” — Rumah kediaman mosalaki (ketua adat) sebagai jembatan perantara warga dengan sang pencipta alam semesta.",
    "philosophy": "“Du’a Ngga’e” — Rumah kediaman mosalaki (ketua adat) sebagai jembatan perantara warga dengan sang pencipta alam semesta.",
    "featured": false,
    "viewCount": 4314,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-nt",
      "code": "ID-NT",
      "name": "Nusa Tenggara Timur",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-musalaki",
      "name": "Foto Rumah Adat Musalaki",
      "url": "/images/catalog/musalaki.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-musalaki",
      "name": "Model 3D Rumah Adat Musalaki",
      "url": "/api/models/houses/nusa-tenggara-timur.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=musalaki"
  },
  {
    "id": "item-house-nuwo-sesat",
    "slug": "nuwo-sesat",
    "title": "Rumah Adat Nuwo Sesat",
    "summary": "Rumah adat Nuwo Sesat (Sesat Balai Agung) khas suku Lampung di provinsi Lampung.",
    "description": "Rumah adat Nuwo Sesat (Sesat Balai Agung) khas suku Lampung di provinsi Lampung. Diwariskan turun-temurun oleh masyarakat suku Lampung di provinsi Lampung.\n\nFalsafah Ruang & Adat:\n“Piil Pesenggiri” — Menjaga kehormatan, harga diri, dan keteguhan martabat keluarga besar melalui musyawarah adat di balai agung.",
    "philosophy": "“Piil Pesenggiri” — Menjaga kehormatan, harga diri, dan keteguhan martabat keluarga besar melalui musyawarah adat di balai agung.",
    "featured": false,
    "viewCount": 3657,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-la",
      "code": "ID-LA",
      "name": "Lampung",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-nuwo-sesat",
      "name": "Foto Rumah Adat Nuwo Sesat",
      "url": "/images/catalog/nuwo-sesat.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-nuwo-sesat",
      "name": "Model 3D Rumah Adat Nuwo Sesat",
      "url": "/api/models/houses/lampung.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=nuwo-sesat"
  },
  {
    "id": "item-house-panggung-kajang-lako",
    "slug": "panggung-kajang-lako",
    "title": "Rumah Adat Panggung Kajang Lako",
    "summary": "Rumah adat Panggung Kajang Lako (Rumah Panggung Lako) khas suku Melayu Jambi di provinsi Jambi.",
    "description": "Rumah adat Panggung Kajang Lako (Rumah Panggung Lako) khas suku Melayu Jambi di provinsi Jambi. Diwariskan turun-temurun oleh masyarakat suku Melayu Jambi di provinsi Jambi.\n\nFalsafah Ruang & Adat:\n“Sepucuk Jambi Sembilan Lurah” — Bumbungan mirip perahu terbalik sebagai pengingat asal-usul pelaut dan penjelajah Sungai Batanghari.",
    "philosophy": "“Sepucuk Jambi Sembilan Lurah” — Bumbungan mirip perahu terbalik sebagai pengingat asal-usul pelaut dan penjelajah Sungai Batanghari.",
    "featured": false,
    "viewCount": 3365,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ja",
      "code": "ID-JA",
      "name": "Jambi",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-panggung-kajang-lako",
      "name": "Foto Rumah Adat Panggung Kajang Lako",
      "url": "/images/catalog/panggung-kajang-lako.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-panggung-kajang-lako",
      "name": "Model 3D Rumah Adat Panggung Kajang Lako",
      "url": "/api/models/houses/jambi.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=panggung-kajang-lako"
  },
  {
    "id": "item-house-radakng",
    "slug": "radakng",
    "title": "Rumah Adat Radakng",
    "summary": "Rumah adat Radakng (Rumah Panjang Radakng) khas suku Dayak Kanayatn di provinsi Kalimantan Barat.",
    "description": "Rumah adat Radakng (Rumah Panjang Radakng) khas suku Dayak Kanayatn di provinsi Kalimantan Barat. Diwariskan turun-temurun oleh masyarakat suku Dayak Kanayatn di provinsi Kalimantan Barat.\n\nFalsafah Ruang & Adat:\n“Adat ka’ talino, bertobat ka’ saruga” — Kebersamaan puluhan kepala keluarga dalam satu atap melatih solidaritas gotong royong dan kedamaian.",
    "philosophy": "“Adat ka’ talino, bertobat ka’ saruga” — Kebersamaan puluhan kepala keluarga dalam satu atap melatih solidaritas gotong royong dan kedamaian.",
    "featured": false,
    "viewCount": 4387,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-kb",
      "code": "ID-KB",
      "name": "Kalimantan Barat",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-radakng",
      "name": "Foto Rumah Adat Radakng",
      "url": "/images/catalog/radakng.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-radakng",
      "name": "Model 3D Rumah Adat Radakng",
      "url": "/api/models/houses/kalimantan-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=radakng"
  },
  {
    "id": "item-house-rakit",
    "slug": "rakit",
    "title": "Rumah Adat Rakit",
    "summary": "Rumah adat Rakit (Rumah Rakit Panggung) khas suku Melayu Bangka di provinsi Kep. Bangka Belitung.",
    "description": "Rumah adat Rakit (Rumah Rakit Panggung) khas suku Melayu Bangka di provinsi Kep. Bangka Belitung. Diwariskan turun-temurun oleh masyarakat suku Melayu Bangka di provinsi Kep. Bangka Belitung.\n\nFalsafah Ruang & Adat:\n“Mengalir bersama riak air” — Harmoni hidup terapung di sungai dan muara laut, melatih kelenturan menghadapi pasang surut zaman.",
    "philosophy": "“Mengalir bersama riak air” — Harmoni hidup terapung di sungai dan muara laut, melatih kelenturan menghadapi pasang surut zaman.",
    "featured": false,
    "viewCount": 3511,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-bb",
      "code": "ID-BB",
      "name": "Kepulauan Bangka Belitung",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-rakit",
      "name": "Foto Rumah Adat Rakit",
      "url": "/images/catalog/rakit.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-rakit",
      "name": "Model 3D Rumah Adat Rakit",
      "url": "/api/models/houses/kepulauan-bangka-belitung.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=rakit"
  },
  {
    "id": "item-house-rumah-gadang",
    "slug": "rumah-gadang",
    "title": "Rumah Adat Rumah Gadang",
    "summary": "Rumah adat Rumah Gadang (Rumah Bagonjong / Godang) khas suku Minangkabau di provinsi Sumatera Barat.",
    "description": "Rumah adat Rumah Gadang (Rumah Bagonjong / Godang) khas suku Minangkabau di provinsi Sumatera Barat. Diwariskan turun-temurun oleh masyarakat suku Minangkabau di provinsi Sumatera Barat.\n\nFalsafah Ruang & Adat:\n“Gadang jan maampok, tinggi jan malanjuang” — Menjulang megah tanpa menindas sesama, berakar pada musyawarah mufakat, syarak, dan ketahanan kaum matrilineal.",
    "philosophy": "“Gadang jan maampok, tinggi jan malanjuang” — Menjulang megah tanpa menindas sesama, berakar pada musyawarah mufakat, syarak, dan ketahanan kaum matrilineal.",
    "featured": true,
    "viewCount": 3146,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-rumah-gadang",
      "name": "Foto Rumah Adat Rumah Gadang",
      "url": "/images/catalog/rumah-gadang.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-rumah-gadang",
      "name": "Model 3D Rumah Adat Rumah Gadang",
      "url": "/api/models/houses/sumatera-barat.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=rumah-gadang"
  },
  {
    "id": "item-house-rumoh-aceh",
    "slug": "rumoh-aceh",
    "title": "Rumah Adat Rumoh Aceh (Krong Bade)",
    "summary": "Rumah adat Rumoh Aceh (Krong Bade) (Krong Bade) khas suku Aceh di provinsi Aceh.",
    "description": "Rumah adat Rumoh Aceh (Krong Bade) (Krong Bade) khas suku Aceh di provinsi Aceh. Diwariskan turun-temurun oleh masyarakat suku Aceh di provinsi Aceh.\n\nFalsafah Ruang & Adat:\n“Peue nyang na bak rumoh nyoe, nakeuh tanda haba bak Tuhan” — Menghadap ke barat ke arah kiblat, pintu masuk sengaja dibuat rendah (120-150 cm) agar setiap tamu menundukkan kepala tanda tawadhu dan hormat kepada empunya rumah.",
    "philosophy": "“Peue nyang na bak rumoh nyoe, nakeuh tanda haba bak Tuhan” — Menghadap ke barat ke arah kiblat, pintu masuk sengaja dibuat rendah (120-150 cm) agar setiap tamu menundukkan kepala tanda tawadhu dan hormat kepada empunya rumah.",
    "featured": true,
    "viewCount": 3000,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ac",
      "code": "ID-AC",
      "name": "Aceh",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-rumoh-aceh",
      "name": "Foto Rumah Adat Rumoh Aceh (Krong Bade)",
      "url": "/images/catalog/rumoh-aceh.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-rumoh-aceh",
      "name": "Model 3D Rumah Adat Rumoh Aceh (Krong Bade)",
      "url": "/api/models/houses/aceh.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=rumoh-aceh"
  },
  {
    "id": "item-house-sasadu",
    "slug": "sasadu",
    "title": "Rumah Adat Sasadu",
    "summary": "Rumah adat Sasadu (Sasadu Halmahera) khas suku Sahu (Halmahera) di provinsi Maluku Utara.",
    "description": "Rumah adat Sasadu (Sasadu Halmahera) khas suku Sahu (Halmahera) di provinsi Maluku Utara. Diwariskan turun-temurun oleh masyarakat suku Sahu (Halmahera) di provinsi Maluku Utara.\n\nFalsafah Ruang & Adat:\nKeterbukaan enam pintu masuk melambangkan kebersamaan masyarakat menyambut tamu dari berbagai latar tanpa diskriminasi.",
    "philosophy": "Keterbukaan enam pintu masuk melambangkan kebersamaan masyarakat menyambut tamu dari berbagai latar tanpa diskriminasi.",
    "featured": false,
    "viewCount": 5263,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-mu",
      "code": "ID-MU",
      "name": "Maluku Utara",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-sasadu",
      "name": "Foto Rumah Adat Sasadu",
      "url": "/images/catalog/sasadu.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-sasadu",
      "name": "Model 3D Rumah Adat Sasadu",
      "url": "/api/models/houses/maluku-utara.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=sasadu"
  },
  {
    "id": "item-house-selaso-jatuh-kembar",
    "slug": "selaso-jatuh-kembar",
    "title": "Rumah Adat Selaso Jatuh Kembar",
    "summary": "Rumah adat Selaso Jatuh Kembar (Balai Selaso Jatuh) khas suku Melayu Riau di provinsi Riau.",
    "description": "Rumah adat Selaso Jatuh Kembar (Balai Selaso Jatuh) khas suku Melayu Riau di provinsi Riau. Diwariskan turun-temurun oleh masyarakat suku Melayu Riau di provinsi Riau.\n\nFalsafah Ruang & Adat:\n“Adat bersendi syarak, syarak bersendi Kitabullah” — Selasar bertingkat turun menyimbolkan kerendahan hati dan kepatuhan pada adab bermusyawarah.",
    "philosophy": "“Adat bersendi syarak, syarak bersendi Kitabullah” — Selasar bertingkat turun menyimbolkan kerendahan hati dan kepatuhan pada adab bermusyawarah.",
    "featured": false,
    "viewCount": 3219,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-ri",
      "code": "ID-RI",
      "name": "Riau",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-selaso-jatuh-kembar",
      "name": "Foto Rumah Adat Selaso Jatuh Kembar",
      "url": "/images/catalog/selaso-jatuh-kembar.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-selaso-jatuh-kembar",
      "name": "Model 3D Rumah Adat Selaso Jatuh Kembar",
      "url": "/api/models/houses/riau.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=selaso-jatuh-kembar"
  },
  {
    "id": "item-house-souraja",
    "slug": "souraja",
    "title": "Rumah Adat Souraja",
    "summary": "Rumah adat Souraja (Banua Mbaso Kaili) khas suku Kaili di provinsi Sulawesi Tengah.",
    "description": "Rumah adat Souraja (Banua Mbaso Kaili) khas suku Kaili di provinsi Sulawesi Tengah. Diwariskan turun-temurun oleh masyarakat suku Kaili di provinsi Sulawesi Tengah.\n\nFalsafah Ruang & Adat:\n“Nggau sangata, tesa sanga” — Satu kata satu perbuatan, keterbukaan hati bangsawan dalam melayani kesejahteraan rakyat jelata.",
    "philosophy": "“Nggau sangata, tesa sanga” — Satu kata satu perbuatan, keterbukaan hati bangsawan dalam melayani kesejahteraan rakyat jelata.",
    "featured": false,
    "viewCount": 4898,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-st",
      "code": "ID-ST",
      "name": "Sulawesi Tengah",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-souraja",
      "name": "Foto Rumah Adat Souraja",
      "url": "/images/catalog/souraja.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-souraja",
      "name": "Model 3D Rumah Adat Souraja",
      "url": "/api/models/houses/sulawesi-tengah.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=souraja"
  },
  {
    "id": "item-house-sulah-nyanda",
    "slug": "sulah-nyanda",
    "title": "Rumah Adat Sulah Nyanda",
    "summary": "Rumah adat Sulah Nyanda (Imah Kanekes Baduy) khas suku Baduy (Kanekes) di provinsi Banten.",
    "description": "Rumah adat Sulah Nyanda (Imah Kanekes Baduy) khas suku Baduy (Kanekes) di provinsi Banten. Diwariskan turun-temurun oleh masyarakat suku Baduy (Kanekes) di provinsi Banten.\n\nFalsafah Ruang & Adat:\n“Lojor teu meunang dipotong, pondok teu meunang disambung” — Membangun tanpa mengubah kontur bumi, tiang kayu mengikuti lekuk tanah pertiwi.",
    "philosophy": "“Lojor teu meunang dipotong, pondok teu meunang disambung” — Membangun tanpa mengubah kontur bumi, tiang kayu mengikuti lekuk tanah pertiwi.",
    "featured": false,
    "viewCount": 3730,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-bt",
      "code": "ID-BT",
      "name": "Banten",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-sulah-nyanda",
      "name": "Foto Rumah Adat Sulah Nyanda",
      "url": "/images/catalog/sulah-nyanda.jpg",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-sulah-nyanda",
      "name": "Model 3D Rumah Adat Sulah Nyanda",
      "url": "/api/models/houses/banten.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=sulah-nyanda"
  },
  {
    "id": "item-house-tongkonan",
    "slug": "tongkonan",
    "title": "Rumah Adat Tongkonan",
    "summary": "Rumah adat Tongkonan (Banua Pa’rapuan) khas suku Toraja di provinsi Sulawesi Selatan.",
    "description": "Rumah adat Tongkonan (Banua Pa’rapuan) khas suku Toraja di provinsi Sulawesi Selatan. Diwariskan turun-temurun oleh masyarakat suku Toraja di provinsi Sulawesi Selatan.\n\nFalsafah Ruang & Adat:\n“Misa’ kada dipotuo, pantan kada dipomate” — Ikatan sehati penegak rumpun leluhur yang berorientasi vertikal ke arah utara Puang Matua.",
    "philosophy": "“Misa’ kada dipotuo, pantan kada dipomate” — Ikatan sehati penegak rumpun leluhur yang berorientasi vertikal ke arah utara Puang Matua.",
    "featured": true,
    "viewCount": 5044,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-sn",
      "code": "ID-SN",
      "name": "Sulawesi Selatan",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-tongkonan",
      "name": "Foto Rumah Adat Tongkonan",
      "url": "/images/catalog/tongkonan.jpg",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-tongkonan",
      "name": "Model 3D Rumah Adat Tongkonan",
      "url": "/api/models/houses/sulawesi-selatan.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=tongkonan"
  },
  {
    "id": "item-house-walewangko",
    "slug": "walewangko",
    "title": "Rumah Adat Walewangko",
    "summary": "Rumah adat Walewangko (Rumah Pewaris Minahasa) khas suku Minahasa di provinsi Sulawesi Utara.",
    "description": "Rumah adat Walewangko (Rumah Pewaris Minahasa) khas suku Minahasa di provinsi Sulawesi Utara. Diwariskan turun-temurun oleh masyarakat suku Minahasa di provinsi Sulawesi Utara.\n\nFalsafah Ruang & Adat:\n“Si Tou Timou Tumou Tou” — Manusia baru bermakna jika hidupnya mampu memanusiakan dan menolong sesama insan.",
    "philosophy": "“Si Tou Timou Tumou Tou” — Manusia baru bermakna jika hidupnya mampu memanusiakan dan menolong sesama insan.",
    "featured": false,
    "viewCount": 4752,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-rumah-adat",
      "slug": "rumah-adat",
      "name": "Rumah Adat & Arsitektur",
      "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
      "icon": "landmark",
      "sortOrder": 1
    },
    "region": {
      "id": "reg-id-sa",
      "code": "ID-SA",
      "name": "Sulawesi Utara",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-walewangko",
      "name": "Foto Rumah Adat Walewangko",
      "url": "/images/catalog/walewangko.png",
      "type": "IMAGE"
    },
    "modelMedia": {
      "id": "model-walewangko",
      "name": "Model 3D Rumah Adat Walewangko",
      "url": "/api/models/houses/sulawesi-utara.glb",
      "type": "MODEL_3D"
    },
    "actionBadge": "Buka Model 3D",
    "actionUrl": "#/eksplorasi-3d?house=walewangko"
  },
  {
    "id": "item-subak-bali",
    "slug": "subak-bali",
    "title": "Sistem Irigasi Subak",
    "summary": "Organisasi irigasi sawah tradisional Bali berlandaskan filosofi Tri Hita Karana yang diakui sebagai warisan dunia UNESCO.",
    "description": "Subak adalah pranata manajemen air sawah komunal masyarakat Bali sejak abad ke-11. Mengalirkan air dari danau pegunungan melalui pura air, sistem ini menjaga keadilan pembagian air dan keharmonisan manusia, alam, dan Tuhan.",
    "philosophy": "Organisasi irigasi sawah tradisional Bali berlandaskan filosofi Tri Hita Karana yang diakui sebagai warisan dunia UNESCO.",
    "featured": true,
    "viewCount": 3890,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-subak-bali",
      "name": "Foto Sistem Irigasi Subak",
      "url": "/images/catalog/subak-bali.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/subak-bali"
  },
  {
    "id": "item-songket-palembang",
    "slug": "songket-palembang",
    "title": "Songket Palembang",
    "summary": "Ratu segala kain tenun Nusantara yang ditenun dengan benang emas murni peninggalan kemegahan Sriwijaya.",
    "description": "Songket Palembang adalah kain tenun mewah dari Sumatera Selatan yang ditenun menggunakan benang emas atau perak pada benang sutra. Memiliki ragam motif bersejarah seperti Lepus Bintang Berantai dan Limar.",
    "philosophy": "Ratu segala kain tenun Nusantara yang ditenun dengan benang emas murni peninggalan kemegahan Sriwijaya.",
    "featured": true,
    "viewCount": 3100,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-ss",
      "code": "ID-SS",
      "name": "Sumatera Selatan",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-songket-palembang",
      "name": "Foto Songket Palembang",
      "url": "/images/catalog/songket-palembang.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/songket-palembang"
  },
  {
    "id": "item-songket-pandai-sikek",
    "slug": "songket-pandai-sikek",
    "title": "Songket Pandai Sikek",
    "summary": "Kain tenun songket Minangkabau legendaris berbenang emas dari kaki Gunung Marapi bermotif pucuak rabuang.",
    "description": "Songket Pandai Sikek ditenun secara teliti di Tanah Datar dengan motif pucuak rabuang (pucuk rebung) dan saik kalamai yang menyimbolkan tekad generasi muda untuk terus bertumbuh memberi manfaat bagi nagari.",
    "philosophy": "Kain tenun songket Minangkabau legendaris berbenang emas dari kaki Gunung Marapi bermotif pucuak rabuang.",
    "featured": false,
    "viewCount": 1980,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-songket-pandai-sikek",
      "name": "Foto Songket Pandai Sikek",
      "url": "/images/catalog/songket-pandai-sikek.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/songket-pandai-sikek"
  },
  {
    "id": "item-soto-banjar",
    "slug": "soto-banjar",
    "title": "Soto Banjar Limau Kuit",
    "summary": "Soto ayam berkuah bening harum kayu manis, cengkeh, dan kapulaga yang disantap bersama ketupat dan perkedel singkong.",
    "description": "Soto Banjar adalah hidangan kebanggaan suku Banjar Kalimantan Selatan. Kuahnya diracik dengan susu evaporasi atau telur kocok serta rempah hangat, disajikan bersama suwiran ayam kampung, telur bebek rebus, dan perasan jeruk limau kuit.",
    "philosophy": "Soto ayam berkuah bening harum kayu manis, cengkeh, dan kapulaga yang disantap bersama ketupat dan perkedel singkong.",
    "featured": false,
    "viewCount": 2210,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-kuliner",
      "slug": "kuliner",
      "name": "Makanan Khas",
      "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
      "icon": "utensils-crossed",
      "sortOrder": 5
    },
    "region": {
      "id": "reg-id-ks",
      "code": "ID-KS",
      "name": "Kalimantan Selatan",
      "islandGroup": "KALIMANTAN"
    },
    "coverMedia": {
      "id": "media-soto-banjar",
      "name": "Foto Soto Banjar Limau Kuit",
      "url": "/images/catalog/soto-banjar.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/soto-banjar"
  },
  {
    "id": "item-tari-caci-manggarai",
    "slug": "tari-caci-manggarai",
    "title": "Tari Caci Manggarai",
    "summary": "Tari perang uji ketangkasan bela diri suku Manggarai bersenjatakan pecut kulit kerbau dan perisai kulit bundar.",
    "description": "Tari Caci adalah seni ketangkasan bertarung satu lawan satu antara pemukul (pasa) dan penangkis (ta'ang) yang diiringi tabuhan gong dan nyanyian naring, menyimbolkan rasa syukur dan pendewasaan ksatria Manggarai.",
    "philosophy": "Tari perang uji ketangkasan bela diri suku Manggarai bersenjatakan pecut kulit kerbau dan perisai kulit bundar.",
    "featured": false,
    "viewCount": 1940,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-nt",
      "code": "ID-NT",
      "name": "Nusa Tenggara Timur",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-tari-caci-manggarai",
      "name": "Foto Tari Caci Manggarai",
      "url": "/images/catalog/tari-caci-manggarai.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-caci-manggarai"
  },
  {
    "id": "item-tari-jaipong",
    "slug": "tari-jaipong",
    "title": "Tari Jaipong",
    "summary": "Tarian pergaulan Sunda yang dinamis, energik, dan lincah ciptaan Gugum Gumbira berakar pada ketuk tilu.",
    "description": "Tari Jaipong memadukan pencak silat, ketuk tilu, dan wayang golek dengan pukulan kendang rampak yang cepat dan ritmis, mencerminkan sifat masyarakat Sunda yang ceria, luwes, dan berani berekspresi.",
    "philosophy": "Tarian pergaulan Sunda yang dinamis, energik, dan lincah ciptaan Gugum Gumbira berakar pada ketuk tilu.",
    "featured": true,
    "viewCount": 3410,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-jb",
      "code": "ID-JB",
      "name": "Jawa Barat",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-tari-jaipong",
      "name": "Foto Tari Jaipong",
      "url": "/images/catalog/tari-jaipong.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-jaipong"
  },
  {
    "id": "item-tari-kecak",
    "slug": "tari-kecak",
    "title": "Tari Kecak Uluwatu",
    "summary": "Seni pertunjukan paduan suara puluhan pria duduk melingkar menyerukan 'cak-cak' mengisahkan epos Ramayana.",
    "description": "Tari Kecak memadukan ritus sakral Sanghyang dengan sendratari kisah Ramayana. Diiringi gemuruh paduan suara polyrhythmic puluhan penari tanpa alat musik konvensional, tarian ini dipentaskan saat mentari terbenam.",
    "philosophy": "Seni pertunjukan paduan suara puluhan pria duduk melingkar menyerukan 'cak-cak' mengisahkan epos Ramayana.",
    "featured": true,
    "viewCount": 6200,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-tari-kecak",
      "name": "Foto Tari Kecak Uluwatu",
      "url": "/images/catalog/tari-kecak.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-kecak"
  },
  {
    "id": "item-tari-pendet",
    "slug": "tari-pendet",
    "title": "Tari Pendet",
    "summary": "Tarian penyambutan suci para dewa dengan taburan kelopak bunga kamboja harum dari bokor perak.",
    "description": "Tari Pendet awalnya merupakan tarian pemujaan di pura-pura Hindu Bali sebagai ungkapan rasa syukur atas turunnya dewata ke alam marcapada, kini juga dibawakan sebagai tarian selamat datang penuh keramahan.",
    "philosophy": "Tarian penyambutan suci para dewa dengan taburan kelopak bunga kamboja harum dari bokor perak.",
    "featured": false,
    "viewCount": 2340,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-ba",
      "code": "ID-BA",
      "name": "Bali",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-tari-pendet",
      "name": "Foto Tari Pendet",
      "url": "/images/catalog/tari-pendet.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-pendet"
  },
  {
    "id": "item-tari-piring",
    "slug": "tari-piring",
    "title": "Tari Piring Minangkabau",
    "summary": "Tarian akrobatik mengayunkan piring porselen di kedua telapak tangan dengan denting cincin tanpa pernah jatuh.",
    "description": "Tari Piring berasal dari Solok, Minangkabau. Dahulu ditarikan sebagai rasa syukur panen raya kepada dewata. Puncak tarian memperlihatkan para penari menari lincah di atas pecahan piring kaca tanpa terluka.",
    "philosophy": "Tarian akrobatik mengayunkan piring porselen di kedua telapak tangan dengan denting cincin tanpa pernah jatuh.",
    "featured": false,
    "viewCount": 2890,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-tari-piring",
      "name": "Foto Tari Piring Minangkabau",
      "url": "/images/catalog/tari-piring.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-piring"
  },
  {
    "id": "item-tari-poco-poco",
    "slug": "tari-poco-poco",
    "title": "Tari Poco-Poco",
    "summary": "Tarian senam komunal Nusantara berirama ceria asal Maluku yang memecahkan rekor dunia ribuan penari.",
    "description": "Tari Poco-Poco diciptakan oleh Arie Sapulette pada tahun 1993 berakar pada irama musik tifa dan melodi Maluku, kini menjadi tarian pergaulan nasional yang menyatukan masyarakat dalam gerak sehat dan persahabatan.",
    "philosophy": "Tarian senam komunal Nusantara berirama ceria asal Maluku yang memecahkan rekor dunia ribuan penari.",
    "featured": false,
    "viewCount": 1820,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-ma",
      "code": "ID-MA",
      "name": "Maluku",
      "islandGroup": "MALUKU"
    },
    "coverMedia": {
      "id": "media-tari-poco-poco",
      "name": "Foto Tari Poco-Poco",
      "url": "/images/catalog/tari-poco-poco.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-poco-poco"
  },
  {
    "id": "item-tari-saman",
    "slug": "tari-saman",
    "title": "Tari Saman Gayo",
    "summary": "Tarian tepuk tangan serempak berkecepatan tinggi warisan dunia UNESCO yang memancarkan kekompakan spiritual.",
    "description": "Tari Saman dikembangkan oleh Syekh Saman pada abad ke-14 di Dataran Tinggi Gayo. Tanpa instrumen musik, tarian ini murni mengandalkan paduan suara syair puji-pujian dan sinkronisasi gerakan tubuh puluhan penari.",
    "philosophy": "Tarian tepuk tangan serempak berkecepatan tinggi warisan dunia UNESCO yang memancarkan kekompakan spiritual.",
    "featured": true,
    "viewCount": 5600,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-ac",
      "code": "ID-AC",
      "name": "Aceh",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-tari-saman",
      "name": "Foto Tari Saman Gayo",
      "url": "/images/catalog/tari-saman.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-saman"
  },
  {
    "id": "item-tari-tor-tor",
    "slug": "tari-tor-tor",
    "title": "Tari Tor-Tor",
    "summary": "Tarian sakral suku Batak yang diiringi dentuman gordang sambilan dan ogung untuk menghormati leluhur.",
    "description": "Tari Tor-Tor digerakkan dengan hentakan kaki dan gerakan tangan membuka-menutup (manerser) diiringi ansambel gondang sabangunan. Tarian ini media komunikasi spiritual dan penyampaian berkat antara hula-hula dan boru.",
    "philosophy": "Tarian sakral suku Batak yang diiringi dentuman gordang sambilan dan ogung untuk menghormati leluhur.",
    "featured": false,
    "viewCount": 2750,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-su",
      "code": "ID-SU",
      "name": "Sumatera Utara",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-tari-tor-tor",
      "name": "Foto Tari Tor-Tor",
      "url": "/images/catalog/tari-tor-tor.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tari-tor-tor"
  },
  {
    "id": "item-tenun-ikat-sumba",
    "slug": "tenun-ikat-sumba",
    "title": "Tenun Ikat Sumba",
    "summary": "Tenun ikat pewarna alami bernilai sakral tinggi dengan motif kuda, buaya, dan pohon tengkorak pelindung suku Marapu.",
    "description": "Tenun Ikat Sumba (Hinggi dan Lau) ditenun dengan proses memakan waktu berbulan-bulan menggunakan pewarna akar mengkudu dan daun nila. Setiap figur binatang menyimpan kosmologi penghubung dunia manusia dan arwah leluhur.",
    "philosophy": "Tenun ikat pewarna alami bernilai sakral tinggi dengan motif kuda, buaya, dan pohon tengkorak pelindung suku Marapu.",
    "featured": false,
    "viewCount": 1640,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tekstil",
      "slug": "tekstil",
      "name": "Pakaian Adat & Tekstil",
      "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
      "icon": "shirt",
      "sortOrder": 3
    },
    "region": {
      "id": "reg-id-nt",
      "code": "ID-NT",
      "name": "Nusa Tenggara Timur",
      "islandGroup": "BALI_NUSA"
    },
    "coverMedia": {
      "id": "media-tenun-ikat-sumba",
      "name": "Foto Tenun Ikat Sumba",
      "url": "/images/catalog/tenun-ikat-sumba.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/tenun-ikat-sumba"
  },
  {
    "id": "item-bakar-batu-papua",
    "slug": "bakar-batu-papua",
    "title": "Tradisi Bakar Batu",
    "summary": "Ritus memasak komunal beralaskan batu membara di dalam lubang tanah sebagai simbol perdamaian dan persaudaraan.",
    "description": "Bakar Batu (Barapen) adalah tradisi sakral suku-suku pegunungan tengah Papua seperti Dani dan Lani. Batu dipanaskan dengan kayu api lalu ditumpuk bersama ubi, sayur hipere, dan daging, dinikmati bersama seluruh warga kampung.",
    "philosophy": "Ritus memasak komunal beralaskan batu membara di dalam lubang tanah sebagai simbol perdamaian dan persaudaraan.",
    "featured": true,
    "viewCount": 3540,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-pe",
      "code": "ID-PE",
      "name": "Papua Pegunungan",
      "islandGroup": "PAPUA"
    },
    "coverMedia": {
      "id": "media-bakar-batu-papua",
      "name": "Foto Tradisi Bakar Batu",
      "url": "/images/catalog/bakar-batu-papua.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/bakar-batu-papua"
  },
  {
    "id": "item-sekaten-keraton",
    "slug": "sekaten-keraton",
    "title": "Tradisi Sekaten",
    "summary": "Peringatan Maulid Nabi dengan pembunyian gamelan sekati pusaka Kyai Gunturmadu dan arak-arakan gunungan keraton.",
    "description": "Sekaten telah berlangsung sejak era Kasultanan Demak sebagai media syiar Islam lewat seni budaya Jawa (syahadatain). Puncak acara dimeriahkan dengan tradisi Grebeg Maulud di mana rakyat berebut hasil bumi dari gunungan keraton.",
    "philosophy": "Peringatan Maulid Nabi dengan pembunyian gamelan sekati pusaka Kyai Gunturmadu dan arak-arakan gunungan keraton.",
    "featured": false,
    "viewCount": 3340,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-yo",
      "code": "ID-YO",
      "name": "D.I. Yogyakarta",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-sekaten-keraton",
      "name": "Foto Tradisi Sekaten",
      "url": "/images/catalog/sekaten-keraton.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/sekaten-keraton"
  },
  {
    "id": "item-rambu-solo-toraja",
    "slug": "rambu-solo-toraja",
    "title": "Upacara Rambu Solo",
    "summary": "Upacara pemakaman adat suku Toraja untuk menyempurnakan arwah menuju alam peristirahatan Puya.",
    "description": "Rambu Solo adalah upacara kematian akbar di Tana Toraja yang berlangsung berhari-hari dengan melibatkan pemotongan kerbau belang (tedong bonga), tari ma'badong, dan pengantaran jenazah ke tebing batu kubur londa.",
    "philosophy": "Upacara pemakaman adat suku Toraja untuk menyempurnakan arwah menuju alam peristirahatan Puya.",
    "featured": true,
    "viewCount": 4650,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-sn",
      "code": "ID-SN",
      "name": "Sulawesi Selatan",
      "islandGroup": "SULAWESI"
    },
    "coverMedia": {
      "id": "media-rambu-solo-toraja",
      "name": "Foto Upacara Rambu Solo",
      "url": "/images/catalog/rambu-solo-toraja.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/rambu-solo-toraja"
  },
  {
    "id": "item-seren-taun-sunda",
    "slug": "seren-taun-sunda",
    "title": "Upacara Seren Taun",
    "summary": "Upacara panen padi tahunan masyarakat adat Sunda Wiwitan dengan memasukkan ikatan padi ke lumbung leuit.",
    "description": "Seren Taun dirayakan di Cigugur Kuningan dan Kasepuhan Banten Kidul sebagai ungkapan syukur kepada Nyi Pohaci Sanghyang Asri atas panen melimpah. Rangkaian acara diisi dengan ngajayak padi dan tumbuk lesung serempak.",
    "philosophy": "Upacara panen padi tahunan masyarakat adat Sunda Wiwitan dengan memasukkan ikatan padi ke lumbung leuit.",
    "featured": false,
    "viewCount": 1780,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-jb",
      "code": "ID-JB",
      "name": "Jawa Barat",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-seren-taun-sunda",
      "name": "Foto Upacara Seren Taun",
      "url": "/images/catalog/seren-taun-sunda.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/seren-taun-sunda"
  },
  {
    "id": "item-upacara-tabuik-pariaman",
    "slug": "upacara-tabuik-pariaman",
    "title": "Upacara Tabuik Pariaman",
    "summary": "Prosesi arak-arakan menara Tabuik megah bertingkat setinggi 12 meter yang dilarung ke Samudra Hindia saat senja.",
    "description": "Tabuik adalah perayaan kultural masyarakat pesisir Pariaman memperingati hari Asyura. Menara berkepala buraq diarak ribuan warga diiringi dentuman tambua tasa bergemuruh sebelum dilepas berlayar ke laut lepas.",
    "philosophy": "Prosesi arak-arakan menara Tabuik megah bertingkat setinggi 12 meter yang dilarung ke Samudra Hindia saat senja.",
    "featured": false,
    "viewCount": 2190,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-sb",
      "code": "ID-SB",
      "name": "Sumatera Barat",
      "islandGroup": "SUMATERA"
    },
    "coverMedia": {
      "id": "media-upacara-tabuik-pariaman",
      "name": "Foto Upacara Tabuik Pariaman",
      "url": "/images/catalog/upacara-tabuik-pariaman.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/upacara-tabuik-pariaman"
  },
  {
    "id": "item-yadnya-kasada-bromo",
    "slug": "yadnya-kasada-bromo",
    "title": "Upacara Yadnya Kasada",
    "summary": "Ritus larung sesaji hasil bumi ke kawah Gunung Bromo oleh masyarakat Tengger keturunan Roro Anteng dan Joko Seger.",
    "description": "Yadnya Kasada diselenggarakan setiap bulan purnama kasada di lautan pasir Bromo. Masyarakat Tengger berjalan kaki di tengah dinginnya malam membawa ongkek berisi sayuran, buah, dan ternak untuk dipersembahkan kepada Sang Hyang Widhi.",
    "philosophy": "Ritus larung sesaji hasil bumi ke kawah Gunung Bromo oleh masyarakat Tengger keturunan Roro Anteng dan Joko Seger.",
    "featured": false,
    "viewCount": 2780,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tradisi",
      "slug": "tradisi",
      "name": "Tradisi & Pengetahuan Lokal",
      "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
      "icon": "book-open",
      "sortOrder": 6
    },
    "region": {
      "id": "reg-id-ji",
      "code": "ID-JI",
      "name": "Jawa Timur",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-yadnya-kasada-bromo",
      "name": "Foto Upacara Yadnya Kasada",
      "url": "/images/catalog/yadnya-kasada-bromo.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/yadnya-kasada-bromo"
  },
  {
    "id": "item-wayang-kulit-purwa",
    "slug": "wayang-kulit-purwa",
    "title": "Wayang Kulit Purwa",
    "summary": "Teater boneka bayangan kulit kerbau warisan dunia UNESCO yang dimainkan semalam suntuk oleh seorang dalang.",
    "description": "Wayang Kulit Purwa membawakan kisah Mahabharata dan Ramayana dengan nilai-nilai filosofis adiluhung Jawa. Pertunjukan diiringi gamelan komunal dan tembang pesinden, menyajikan cermin kehidupan manusia menuju sangkan paraning dumadi.",
    "philosophy": "Teater boneka bayangan kulit kerbau warisan dunia UNESCO yang dimainkan semalam suntuk oleh seorang dalang.",
    "featured": true,
    "viewCount": 5100,
    "status": "PUBLISHED",
    "category": {
      "id": "cat-tarian",
      "slug": "tarian",
      "name": "Tarian & Seni Pertunjukan",
      "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
      "icon": "drama",
      "sortOrder": 4
    },
    "region": {
      "id": "reg-id-jt",
      "code": "ID-JT",
      "name": "Jawa Tengah",
      "islandGroup": "JAWA"
    },
    "coverMedia": {
      "id": "media-wayang-kulit-purwa",
      "name": "Foto Wayang Kulit Purwa",
      "url": "/images/catalog/wayang-kulit-purwa.jpg",
      "type": "IMAGE"
    },
    "actionBadge": "Lihat",
    "actionUrl": "#/budaya/wayang-kulit-purwa"
  }
];
