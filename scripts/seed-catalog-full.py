#!/usr/bin/env python3
"""
WaraNusa — Master Cultural Catalogue Generator & Image Fetcher
Consolidates 38 Traditional Houses, 38 Traditional Instruments,
and 40 complementary cultural heritage items across 6 categories.
Fetches descriptions and images via Wikipedia API to public/images/catalog/.
Generates src/data/cultural-catalogue.ts and src/data/cultural-items.json.
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
import shutil

PROVINCES_38 = [
    {"code": "ID-AC", "name": "Aceh", "islandGroup": "SUMATERA"},
    {"code": "ID-BA", "name": "Bali", "islandGroup": "BALI_NUSA"},
    {"code": "ID-BT", "name": "Banten", "islandGroup": "JAWA"},
    {"code": "ID-BE", "name": "Bengkulu", "islandGroup": "SUMATERA"},
    {"code": "ID-YO", "name": "D.I. Yogyakarta", "islandGroup": "JAWA"},
    {"code": "ID-JK", "name": "D.K.I. Jakarta", "islandGroup": "JAWA"},
    {"code": "ID-GO", "name": "Gorontalo", "islandGroup": "SULAWESI"},
    {"code": "ID-JA", "name": "Jambi", "islandGroup": "SUMATERA"},
    {"code": "ID-JB", "name": "Jawa Barat", "islandGroup": "JAWA"},
    {"code": "ID-JT", "name": "Jawa Tengah", "islandGroup": "JAWA"},
    {"code": "ID-JI", "name": "Jawa Timur", "islandGroup": "JAWA"},
    {"code": "ID-KB", "name": "Kalimantan Barat", "islandGroup": "KALIMANTAN"},
    {"code": "ID-KS", "name": "Kalimantan Selatan", "islandGroup": "KALIMANTAN"},
    {"code": "ID-KT", "name": "Kalimantan Tengah", "islandGroup": "KALIMANTAN"},
    {"code": "ID-KI", "name": "Kalimantan Timur", "islandGroup": "KALIMANTAN"},
    {"code": "ID-KU", "name": "Kalimantan Utara", "islandGroup": "KALIMANTAN"},
    {"code": "ID-BB", "name": "Kepulauan Bangka Belitung", "islandGroup": "SUMATERA"},
    {"code": "ID-KR", "name": "Kepulauan Riau", "islandGroup": "SUMATERA"},
    {"code": "ID-LA", "name": "Lampung", "islandGroup": "SUMATERA"},
    {"code": "ID-MA", "name": "Maluku", "islandGroup": "MALUKU"},
    {"code": "ID-MU", "name": "Maluku Utara", "islandGroup": "MALUKU"},
    {"code": "ID-NB", "name": "Nusa Tenggara Barat", "islandGroup": "BALI_NUSA"},
    {"code": "ID-NT", "name": "Nusa Tenggara Timur", "islandGroup": "BALI_NUSA"},
    {"code": "ID-PA", "name": "Papua", "islandGroup": "PAPUA"},
    {"code": "ID-PB", "name": "Papua Barat", "islandGroup": "PAPUA"},
    {"code": "ID-PD", "name": "Papua Barat Daya", "islandGroup": "PAPUA"},
    {"code": "ID-PE", "name": "Papua Pegunungan", "islandGroup": "PAPUA"},
    {"code": "ID-PS", "name": "Papua Selatan", "islandGroup": "PAPUA"},
    {"code": "ID-PT", "name": "Papua Tengah", "islandGroup": "PAPUA"},
    {"code": "ID-RI", "name": "Riau", "islandGroup": "SUMATERA"},
    {"code": "ID-SR", "name": "Sulawesi Barat", "islandGroup": "SULAWESI"},
    {"code": "ID-SN", "name": "Sulawesi Selatan", "islandGroup": "SULAWESI"},
    {"code": "ID-ST", "name": "Sulawesi Tengah", "islandGroup": "SULAWESI"},
    {"code": "ID-SG", "name": "Sulawesi Tenggara", "islandGroup": "SULAWESI"},
    {"code": "ID-SA", "name": "Sulawesi Utara", "islandGroup": "SULAWESI"},
    {"code": "ID-SB", "name": "Sumatera Barat", "islandGroup": "SUMATERA"},
    {"code": "ID-SS", "name": "Sumatera Selatan", "islandGroup": "SUMATERA"},
    {"code": "ID-SU", "name": "Sumatera Utara", "islandGroup": "SUMATERA"},
]

PROV_MAP = {p["name"].lower(): p for p in PROVINCES_38}
PROV_MAP["dki jakarta"] = PROV_MAP["d.k.i. jakarta"]
PROV_MAP["daerah khusus ibukota jakarta"] = PROV_MAP["d.k.i. jakarta"]
PROV_MAP["di yogyakarta"] = PROV_MAP["d.i. yogyakarta"]
PROV_MAP["daerah istimewa yogyakarta"] = PROV_MAP["d.i. yogyakarta"]
PROV_MAP["kep. bangka belitung"] = PROV_MAP["kepulauan bangka belitung"]
PROV_MAP["kep. riau"] = PROV_MAP["kepulauan riau"]

CATEGORIES = [
    {
        "id": "cat-rumah-adat",
        "slug": "rumah-adat",
        "name": "Rumah Adat & Arsitektur",
        "description": "Arsitektur vernakular dan rumah adat tradisional dari 38 provinsi di Indonesia.",
        "icon": "landmark",
        "sortOrder": 1,
    },
    {
        "id": "cat-alat-musik",
        "slug": "alat-musik",
        "name": "Alat Musik Tradisional",
        "description": "Instrumen musik tradisional bernada khas dari Sabang sampai Merauke.",
        "icon": "music",
        "sortOrder": 2,
    },
    {
        "id": "cat-tekstil",
        "slug": "tekstil",
        "name": "Pakaian Adat & Tekstil",
        "description": "Batik, tenun ikat, songket benang emas, dan busana adat warisan leluhur.",
        "icon": "shirt",
        "sortOrder": 3,
    },
    {
        "id": "cat-tarian",
        "slug": "tarian",
        "name": "Tarian & Seni Pertunjukan",
        "description": "Tari tradisional, wayang, dan seni panggung sakral berakar nilai filosofis.",
        "icon": "drama",
        "sortOrder": 4,
    },
    {
        "id": "cat-kuliner",
        "slug": "kuliner",
        "name": "Makanan Khas",
        "description": "Kuliner khas Nusantara kaya rempah dengan tradisi pembuatan turun-temurun.",
        "icon": "utensils-crossed",
        "sortOrder": 5,
    },
    {
        "id": "cat-tradisi",
        "slug": "tradisi",
        "name": "Tradisi & Pengetahuan Lokal",
        "description": "Upacara adat, kearifan lokal, dan sistem pengetahuan komunal Nusantara.",
        "icon": "book-open",
        "sortOrder": 6,
    },
]

SUPPLEMENTARY_ITEMS = [
    # ---- 10 Pakaian Adat & Tekstil ----
    {
        "slug": "ulos-batak",
        "title": "Kain Ulos Batak",
        "categorySlug": "tekstil",
        "provinceName": "Sumatera Utara",
        "wikiTitle": "Ulos",
        "summary": "Kain tenun sakral khas masyarakat Batak yang melambangkan kehangatan, restu leluhur, dan ikatan kasih persaudaraan.",
        "description": "Ulos adalah kain tenun khas suku Batak di Sumatera Utara. Dibuat dengan alat tenun bukan mesin, ulos memiliki ragam motif seperti Ulos Ragi Hotang, Mangiring, dan Sibolang yang diserahkan dalam ritus kehidupan (kelahiran, pernikahan, duka).",
        "featured": True,
        "viewCount": 2450,
    },
    {
        "slug": "baju-bodo",
        "title": "Baju Bodo",
        "categorySlug": "tekstil",
        "provinceName": "Sulawesi Selatan",
        "wikiTitle": "Baju_bodo",
        "summary": "Busana tradisional wanita suku Bugis-Makassar berbentuk segi empat berlengan pendek, salah satu busana tertua di dunia.",
        "description": "Baju Bodo adalah pakaian tradisional perempuan suku Bugis dan Makassar di Sulawesi Selatan. Berbentuk segi empat longgar dari kain kasa atau sutra tipis, warna busana ini secara adat mencerminkan usia dan status sosial pemakainya.",
        "featured": False,
        "viewCount": 1820,
    },
    {
        "slug": "songket-palembang",
        "title": "Songket Palembang",
        "categorySlug": "tekstil",
        "provinceName": "Sumatera Selatan",
        "wikiTitle": "Songket_Palembang",
        "summary": "Ratu segala kain tenun Nusantara yang ditenun dengan benang emas murni peninggalan kemegahan Sriwijaya.",
        "description": "Songket Palembang adalah kain tenun mewah dari Sumatera Selatan yang ditenun menggunakan benang emas atau perak pada benang sutra. Memiliki ragam motif bersejarah seperti Lepus Bintang Berantai dan Limar.",
        "featured": True,
        "viewCount": 3100,
    },
    {
        "slug": "batik-mega-mendung",
        "title": "Batik Mega Mendung",
        "categorySlug": "tekstil",
        "provinceName": "Jawa Barat",
        "wikiTitle": "Megamendung_(batik)",
        "summary": "Motif batik khas Cirebon bergambar awan berlapis melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa.",
        "description": "Batik Mega Mendung merupakan mahakarya batik pesisir Cirebon dengan motif garis awan horizontal bergradasi tujuh warna, memadukan pengaruh seni Tiongkok dengan kearifan tasawuf Islam Sunan Gunung Jati.",
        "featured": True,
        "viewCount": 4200,
    },
    {
        "slug": "tenun-ikat-sumba",
        "title": "Tenun Ikat Sumba",
        "categorySlug": "tekstil",
        "provinceName": "Nusa Tenggara Timur",
        "wikiTitle": "Tenun_Ikat_Sumba",
        "summary": "Tenun ikat pewarna alami bernilai sakral tinggi dengan motif kuda, buaya, dan pohon tengkorak pelindung suku Marapu.",
        "description": "Tenun Ikat Sumba (Hinggi dan Lau) ditenun dengan proses memakan waktu berbulan-bulan menggunakan pewarna akar mengkudu dan daun nila. Setiap figur binatang menyimpan kosmologi penghubung dunia manusia dan arwah leluhur.",
        "featured": False,
        "viewCount": 1640,
    },
    {
        "slug": "kain-tapis-lampung",
        "title": "Kain Tapis Lampung",
        "categorySlug": "tekstil",
        "provinceName": "Lampung",
        "wikiTitle": "Tapis_Lampung",
        "summary": "Kain tenun wanita suku Lampung bersulam benang emas dengan teknik cucuk bermotif flora dan perahu kehidupan.",
        "description": "Kain Tapis adalah pakaian wanita suku Lampung berbentuk sarung dari tenun kapas dengan sulaman benang emas motif perahu, pucuk rebung, dan pohon hayat untuk upacara perkawinan dan adat begawi.",
        "featured": False,
        "viewCount": 1420,
    },
    {
        "slug": "songket-pandai-sikek",
        "title": "Songket Pandai Sikek",
        "categorySlug": "tekstil",
        "provinceName": "Sumatera Barat",
        "wikiTitle": "Songket_Pandai_Sikek",
        "summary": "Kain tenun songket Minangkabau legendaris berbenang emas dari kaki Gunung Marapi bermotif pucuak rabuang.",
        "description": "Songket Pandai Sikek ditenun secara teliti di Tanah Datar dengan motif pucuak rabuang (pucuk rebung) dan saik kalamai yang menyimbolkan tekad generasi muda untuk terus bertumbuh memberi manfaat bagi nagari.",
        "featured": False,
        "viewCount": 1980,
    },
    {
        "slug": "batik-parang-yogyakarta",
        "title": "Batik Parang Rusak",
        "categorySlug": "tekstil",
        "provinceName": "D.I. Yogyakarta",
        "wikiTitle": "Parang_(batik)",
        "summary": "Motif batik larangan keraton bermotif ombak karang laut selatan yang melambangkan semangat pantang menyerah.",
        "description": "Batik Parang Rusak diciptakan oleh Sultan Agung Hanyakrakusuma saat bertapa di Pantai Selatan Jawa. Garis diagonal huruf 'S' tak terputus menggambarkan gelombang samudra dan perjuangan batin tanpa henti.",
        "featured": True,
        "viewCount": 3890,
    },
    {
        "slug": "baju-aesan-gede",
        "title": "Busana Aesan Gede",
        "categorySlug": "tekstil",
        "provinceName": "Sumatera Selatan",
        "wikiTitle": "Aesan_Gede",
        "summary": "Pakaian adat kebesaran pengantin Palembang bernuansa Swarnadwipa dengan mahkota karsuhun bertatahkan permata.",
        "description": "Aesan Gede adalah busana adat Palembang yang melambangkan keagungan Sriwijaya (Pulau Emas). Dilengkapi perhiasan tebeng maluku, kalung tapak jajo, dan teratai penutup dada yang memancarkan pesona ningrat.",
        "featured": False,
        "viewCount": 1250,
    },
    {
        "slug": "baju-cele-maluku",
        "title": "Baju Cele Maluku",
        "categorySlug": "tekstil",
        "provinceName": "Maluku",
        "wikiTitle": "Baju_cele",
        "summary": "Busana adat Maluku bermotif kotak-kotak merah bergaris geometris dipadukan dengan kain sarung tenun khas.",
        "description": "Baju Cele adalah pakaian adat Maluku yang sering dikenakan pada upacara pelantikan raja, cuci negeri, dan pesta pernikahan. Warna merah cerah menyimbolkan keberanian dan kehangatan persaudaraan pela gandong.",
        "featured": False,
        "viewCount": 1110,
    },

    # ---- 10 Tarian & Seni Pertunjukan ----
    {
        "slug": "tari-saman",
        "title": "Tari Saman Gayo",
        "categorySlug": "tarian",
        "provinceName": "Aceh",
        "wikiTitle": "Tari_Saman",
        "summary": "Tarian tepuk tangan serempak berkecepatan tinggi warisan dunia UNESCO yang memancarkan kekompakan spiritual.",
        "description": "Tari Saman dikembangkan oleh Syekh Saman pada abad ke-14 di Dataran Tinggi Gayo. Tanpa instrumen musik, tarian ini murni mengandalkan paduan suara syair puji-pujian dan sinkronisasi gerakan tubuh puluhan penari.",
        "featured": True,
        "viewCount": 5600,
    },
    {
        "slug": "tari-kecak",
        "title": "Tari Kecak Uluwatu",
        "categorySlug": "tarian",
        "provinceName": "Bali",
        "wikiTitle": "Kecak",
        "summary": "Seni pertunjukan paduan suara puluhan pria duduk melingkar menyerukan 'cak-cak' mengisahkan epos Ramayana.",
        "description": "Tari Kecak memadukan ritus sakral Sanghyang dengan sendratari kisah Ramayana. Diiringi gemuruh paduan suara polyrhythmic puluhan penari tanpa alat musik konvensional, tarian ini dipentaskan saat mentari terbenam.",
        "featured": True,
        "viewCount": 6200,
    },
    {
        "slug": "tari-piring",
        "title": "Tari Piring Minangkabau",
        "categorySlug": "tarian",
        "provinceName": "Sumatera Barat",
        "wikiTitle": "Tari_Piring",
        "summary": "Tarian akrobatik mengayunkan piring porselen di kedua telapak tangan dengan denting cincin tanpa pernah jatuh.",
        "description": "Tari Piring berasal dari Solok, Minangkabau. Dahulu ditarikan sebagai rasa syukur panen raya kepada dewata. Puncak tarian memperlihatkan para penari menari lincah di atas pecahan piring kaca tanpa terluka.",
        "featured": False,
        "viewCount": 2890,
    },
    {
        "slug": "tari-pendet",
        "title": "Tari Pendet",
        "categorySlug": "tarian",
        "provinceName": "Bali",
        "wikiTitle": "Tari_Pendet",
        "summary": "Tarian penyambutan suci para dewa dengan taburan kelopak bunga kamboja harum dari bokor perak.",
        "description": "Tari Pendet awalnya merupakan tarian pemujaan di pura-pura Hindu Bali sebagai ungkapan rasa syukur atas turunnya dewata ke alam marcapada, kini juga dibawakan sebagai tarian selamat datang penuh keramahan.",
        "featured": False,
        "viewCount": 2340,
    },
    {
        "slug": "tari-jaipong",
        "title": "Tari Jaipong",
        "categorySlug": "tarian",
        "provinceName": "Jawa Barat",
        "wikiTitle": "Jaipongan",
        "summary": "Tarian pergaulan Sunda yang dinamis, energik, dan lincah ciptaan Gugum Gumbira berakar pada ketuk tilu.",
        "description": "Tari Jaipong memadukan pencak silat, ketuk tilu, dan wayang golek dengan pukulan kendang rampak yang cepat dan ritmis, mencerminkan sifat masyarakat Sunda yang ceria, luwes, dan berani berekspresi.",
        "featured": True,
        "viewCount": 3410,
    },
    {
        "slug": "reog-ponorogo",
        "title": "Reog Ponorogo",
        "categorySlug": "tarian",
        "provinceName": "Jawa Timur",
        "wikiTitle": "Reog_(Ponorogo)",
        "summary": "Seni panggung kolosal dengan topeng Singa Barong berbobot 50 kg berhias bulu merak yang diangkat dengan gigi.",
        "description": "Reog Ponorogo adalah tarian rakyat legendaris Jawa Timur yang menampilkan sosok Prabu Klono Sewandono, Bujang Ganong, penari jathil berkuda kepang, dan Singa Barong megah yang mencerminkan ketahanan fisik dan spiritual.",
        "featured": True,
        "viewCount": 4900,
    },
    {
        "slug": "tari-poco-poco",
        "title": "Tari Poco-Poco",
        "categorySlug": "tarian",
        "provinceName": "Maluku",
        "wikiTitle": "Poco-poco",
        "summary": "Tarian senam komunal Nusantara berirama ceria asal Maluku yang memecahkan rekor dunia ribuan penari.",
        "description": "Tari Poco-Poco diciptakan oleh Arie Sapulette pada tahun 1993 berakar pada irama musik tifa dan melodi Maluku, kini menjadi tarian pergaulan nasional yang menyatukan masyarakat dalam gerak sehat dan persahabatan.",
        "featured": False,
        "viewCount": 1820,
    },
    {
        "slug": "tari-tor-tor",
        "title": "Tari Tor-Tor",
        "categorySlug": "tarian",
        "provinceName": "Sumatera Utara",
        "wikiTitle": "Tor-tor",
        "summary": "Tarian sakral suku Batak yang diiringi dentuman gordang sambilan dan ogung untuk menghormati leluhur.",
        "description": "Tari Tor-Tor digerakkan dengan hentakan kaki dan gerakan tangan membuka-menutup (manerser) diiringi ansambel gondang sabangunan. Tarian ini media komunikasi spiritual dan penyampaian berkat antara hula-hula dan boru.",
        "featured": False,
        "viewCount": 2750,
    },
    {
        "slug": "tari-caci-manggarai",
        "title": "Tari Caci Manggarai",
        "categorySlug": "tarian",
        "provinceName": "Nusa Tenggara Timur",
        "wikiTitle": "Caci",
        "summary": "Tari perang uji ketangkasan bela diri suku Manggarai bersenjatakan pecut kulit kerbau dan perisai kulit bundar.",
        "description": "Tari Caci adalah seni ketangkasan bertarung satu lawan satu antara pemukul (pasa) dan penangkis (ta'ang) yang diiringi tabuhan gong dan nyanyian naring, menyimbolkan rasa syukur dan pendewasaan ksatria Manggarai.",
        "featured": False,
        "viewCount": 1940,
    },
    {
        "slug": "wayang-kulit-purwa",
        "title": "Wayang Kulit Purwa",
        "categorySlug": "tarian",
        "provinceName": "Jawa Tengah",
        "wikiTitle": "Wayang_kulit",
        "summary": "Teater boneka bayangan kulit kerbau warisan dunia UNESCO yang dimainkan semalam suntuk oleh seorang dalang.",
        "description": "Wayang Kulit Purwa membawakan kisah Mahabharata dan Ramayana dengan nilai-nilai filosofis adiluhung Jawa. Pertunjukan diiringi gamelan komunal dan tembang pesinden, menyajikan cermin kehidupan manusia menuju sangkan paraning dumadi.",
        "featured": True,
        "viewCount": 5100,
    },

    # ---- 10 Makanan Khas ----
    {
        "slug": "rendang-minang",
        "title": "Rendang Daging Sapi",
        "categorySlug": "kuliner",
        "provinceName": "Sumatera Barat",
        "wikiTitle": "Rendang",
        "summary": "Kuliner terlezat dunia olahan daging sapi dengan rempah melimpah dan santan kelapa yang dimasak perlahan berjam-jam.",
        "description": "Rendang adalah mahakarya kuliner Minangkabau yang dimasak hingga santan mengering dan bumbu meresap hitam pekat. Mengandung filosofi empat pilar adat: dagiang (niniak mamak), karambia (cadiak pandai), lado (alim ulama), dan pemasak (masyarakat).",
        "featured": True,
        "viewCount": 7800,
    },
    {
        "slug": "papeda-kuah-kuning",
        "title": "Papeda Kuah Kuning",
        "categorySlug": "kuliner",
        "provinceName": "Papua",
        "wikiTitle": "Papeda",
        "summary": "Makanan pokok sagu bertekstur kenyal lembut yang disantap bersama kuah ikan kuning kaya kunyit dan cabai.",
        "description": "Papeda dibuat dari tepung sagu pohon rumbia yang diaduk dengan air mendidih hingga bening dan kenyal. Disantap menggunakan sumpit gata-gata bersama sup ikan tongkol atau mubara berkuah kuning asam segar.",
        "featured": True,
        "viewCount": 3670,
    },
    {
        "slug": "gudeg-jogja",
        "title": "Gudeg Nangka Yogyakarta",
        "categorySlug": "kuliner",
        "provinceName": "D.I. Yogyakarta",
        "wikiTitle": "Gudeg",
        "summary": "Sayur nangka muda manis gurih yang dimasak berjam-jam dengan santan, gula aren, dan daun jati dalam kuali tanah liat.",
        "description": "Gudeg adalah ikon kuliner Yogyakarta warisan Kerajaan Mataram Islam. Disajikan dengan nasi pulen, sambal krecek pedas, telur bacem, dan ayam kampung areh kental gurih, melambangkan kelembutan dan kesabaran orang Jawa.",
        "featured": True,
        "viewCount": 4500,
    },
    {
        "slug": "coto-makassar",
        "title": "Coto Makassar",
        "categorySlug": "kuliner",
        "provinceName": "Sulawesi Selatan",
        "wikiTitle": "Coto_Makassar",
        "summary": "Sup daging dan jeroan sapi legendaris berkuah kental dari rebusan air tajin beras dan gilingan kacang tanah sangrai.",
        "description": "Coto Makassar diramu dengan 40 jenis rempah (rampah patangpulo) dan kuah kacang gurih pekat. Dimasak dalam kuali tanah tanah (korong butta) dan dinikmati bersama ketupat daun kelapa serta perasan jeruk nipis.",
        "featured": False,
        "viewCount": 3200,
    },
    {
        "slug": "pempek-palembang",
        "title": "Pempek Kapal Selam",
        "categorySlug": "kuliner",
        "provinceName": "Sumatera Selatan",
        "wikiTitle": "Pempek",
        "summary": "Olahan daging ikan tenggiri dan sagu kenyal berisi telur utuh yang disantap bersama kuah cuko asam pedas manis.",
        "description": "Pempek lahir di Palembang sejak abad ke-16 dari perpaduan kearifan lokal Melayu dan perantau Tionghoa. Kelezatannya ditentukan oleh kualitas ikan tenggiri segar dan cuko kental dari gula batok Linggau asli.",
        "featured": True,
        "viewCount": 4950,
    },
    {
        "slug": "ayam-betutu-bali",
        "title": "Ayam Betutu Gilimanuk",
        "categorySlug": "kuliner",
        "provinceName": "Bali",
        "wikiTitle": "Ayam_betutu",
        "summary": "Unggas utuh berlumur bumbu genep kaya kunyit, jahe, dan serai yang dipanggang dalam sekam api perlahan.",
        "description": "Ayam Betutu adalah sajian istiadat dan pesta pura di Bali. Daging ayam utuh dipijat bumbu wangen dan dibungkus pelepah pinang atau daun pisang, lalu dimatangkan di bawah bara sekam hingga bumbu meresap sampai ke tulang.",
        "featured": False,
        "viewCount": 2980,
    },
    {
        "slug": "bika-ambon-medan",
        "title": "Bika Ambon Medan",
        "categorySlug": "kuliner",
        "provinceName": "Sumatera Utara",
        "wikiTitle": "Bika_Ambon",
        "summary": "Kue berongga sarang semut berwarna kuning keemasan beraroma daun jeruk, santan, dan serai yang kenyal legit.",
        "description": "Meskipun bernama Ambon, kue ini merupakan penganan khas Kota Medan dari Jalan Ambon. Fermentasi tuak nira alami menciptakan rongga-rongga sarang lebah khas yang kenyal, harum, dan legit di lidah.",
        "featured": False,
        "viewCount": 2420,
    },
    {
        "slug": "kerak-telor-betawi",
        "title": "Kerak Telor Betawi",
        "categorySlug": "kuliner",
        "provinceName": "D.K.I. Jakarta",
        "wikiTitle": "Kerak_telor",
        "summary": "Omelet beras ketan putih dan telur bebek gurih ditaburi serundeng kelapa sangrai dan ebi kering khas tanah Betawi.",
        "description": "Kerak Telor adalah jajanan legendaris Batavia sejak era kolonial. Dimasak di atas wajan cekung tanpa minyak dan dibalik langsung di atas bara api arang hingga bagian bawahnya membentuk kerak renyah aromatik.",
        "featured": False,
        "viewCount": 2860,
    },
    {
        "slug": "mie-aceh",
        "title": "Mie Aceh Kepiting",
        "categorySlug": "kuliner",
        "provinceName": "Aceh",
        "wikiTitle": "Mie_Aceh",
        "summary": "Mie kuning kenyal tebal disiram kuah kari pedas gurih kaya kapulaga, jintan, dan potongan daging kepiting laut.",
        "description": "Mie Aceh mencerminkan posisi Aceh di jalur sutra rempah dunia, memadukan pengaruh mie Tionghoa, rempah kari India, dan daging olahan Timur Tengah. Disajikan goreng, basah, atau kuah dengan emping dan acar bawang merah.",
        "featured": False,
        "viewCount": 3120,
    },
    {
        "slug": "soto-banjar",
        "title": "Soto Banjar Limau Kuit",
        "categorySlug": "kuliner",
        "provinceName": "Kalimantan Selatan",
        "wikiTitle": "Soto_Banjar",
        "summary": "Soto ayam berkuah bening harum kayu manis, cengkeh, dan kapulaga yang disantap bersama ketupat dan perkedel singkong.",
        "description": "Soto Banjar adalah hidangan kebanggaan suku Banjar Kalimantan Selatan. Kuahnya diracik dengan susu evaporasi atau telur kocok serta rempah hangat, disajikan bersama suwiran ayam kampung, telur bebek rebus, dan perasan jeruk limau kuit.",
        "featured": False,
        "viewCount": 2210,
    },

    # ---- 10 Tradisi & Pengetahuan Lokal ----
    {
        "slug": "rambu-solo-toraja",
        "title": "Upacara Rambu Solo",
        "categorySlug": "tradisi",
        "provinceName": "Sulawesi Selatan",
        "wikiTitle": "Rambu_Solo",
        "summary": "Upacara pemakaman adat suku Toraja untuk menyempurnakan arwah menuju alam peristirahatan Puya.",
        "description": "Rambu Solo adalah upacara kematian akbar di Tana Toraja yang berlangsung berhari-hari dengan melibatkan pemotongan kerbau belang (tedong bonga), tari ma'badong, dan pengantaran jenazah ke tebing batu kubur londa.",
        "featured": True,
        "viewCount": 4650,
    },
    {
        "slug": "subak-bali",
        "title": "Sistem Irigasi Subak",
        "categorySlug": "tradisi",
        "provinceName": "Bali",
        "wikiTitle": "Subak_(Bali)",
        "summary": "Organisasi irigasi sawah tradisional Bali berlandaskan filosofi Tri Hita Karana yang diakui sebagai warisan dunia UNESCO.",
        "description": "Subak adalah pranata manajemen air sawah komunal masyarakat Bali sejak abad ke-11. Mengalirkan air dari danau pegunungan melalui pura air, sistem ini menjaga keadilan pembagian air dan keharmonisan manusia, alam, dan Tuhan.",
        "featured": True,
        "viewCount": 3890,
    },
    {
        "slug": "yadnya-kasada-bromo",
        "title": "Upacara Yadnya Kasada",
        "categorySlug": "tradisi",
        "provinceName": "Jawa Timur",
        "wikiTitle": "Yadnya_Kasada",
        "summary": "Ritus larung sesaji hasil bumi ke kawah Gunung Bromo oleh masyarakat Tengger keturunan Roro Anteng dan Joko Seger.",
        "description": "Yadnya Kasada diselenggarakan setiap bulan purnama kasada di lautan pasir Bromo. Masyarakat Tengger berjalan kaki di tengah dinginnya malam membawa ongkek berisi sayuran, buah, dan ternak untuk dipersembahkan kepada Sang Hyang Widhi.",
        "featured": False,
        "viewCount": 2780,
    },
    {
        "slug": "lompat-batu-nias",
        "title": "Fahombo (Lompat Batu Nias)",
        "categorySlug": "tradisi",
        "provinceName": "Sumatera Utara",
        "wikiTitle": "Fahombo",
        "summary": "Tradisi pemuda Nias melompati susunan tumpukan batu setinggi 2 meter sebagai lambang kedewasaan dan keberanian ksatria.",
        "description": "Fahombo lahir di Nias Selatan sebagai uji kesiapan pemuda desa menjadi prajurit pembela banua. Melompati piramida batu tanpa menyentuh puncaknya menuntut ketangkasan fisik, mental baja, dan restu roh leluhur.",
        "featured": True,
        "viewCount": 4120,
    },
    {
        "slug": "tradisi-pasola-sumba",
        "title": "Pasola Sumba",
        "categorySlug": "tradisi",
        "provinceName": "Nusa Tenggara Timur",
        "wikiTitle": "Pasola",
        "summary": "Pertarungan menunggang kuda saling melempar lembing kayu di padang sabana luas menyambut datangnya cacing nyale.",
        "description": "Pasola adalah ritus perang adat berkuda masyarakat Marapu di Sumba Barat. Tetesan darah yang jatuh ke bumi dipercaya menyuburkan tanah pertanian dan mendatangkan panen berlimpah bagi segenap warga kampung adat.",
        "featured": False,
        "viewCount": 2430,
    },
    {
        "slug": "upacara-tabuik-pariaman",
        "title": "Upacara Tabuik Pariaman",
        "categorySlug": "tradisi",
        "provinceName": "Sumatera Barat",
        "wikiTitle": "Tabuik",
        "summary": "Prosesi arak-arakan menara Tabuik megah bertingkat setinggi 12 meter yang dilarung ke Samudra Hindia saat senja.",
        "description": "Tabuik adalah perayaan kultural masyarakat pesisir Pariaman memperingati hari Asyura. Menara berkepala buraq diarak ribuan warga diiringi dentuman tambua tasa bergemuruh sebelum dilepas berlayar ke laut lepas.",
        "featured": False,
        "viewCount": 2190,
    },
    {
        "slug": "seren-taun-sunda",
        "title": "Upacara Seren Taun",
        "categorySlug": "tradisi",
        "provinceName": "Jawa Barat",
        "wikiTitle": "Seren_Taun",
        "summary": "Upacara panen padi tahunan masyarakat adat Sunda Wiwitan dengan memasukkan ikatan padi ke lumbung leuit.",
        "description": "Seren Taun dirayakan di Cigugur Kuningan dan Kasepuhan Banten Kidul sebagai ungkapan syukur kepada Nyi Pohaci Sanghyang Asri atas panen melimpah. Rangkaian acara diisi dengan ngajayak padi dan tumbuk lesung serempak.",
        "featured": False,
        "viewCount": 1780,
    },
    {
        "slug": "sekaten-keraton",
        "title": "Tradisi Sekaten",
        "categorySlug": "tradisi",
        "provinceName": "D.I. Yogyakarta",
        "wikiTitle": "Sekaten",
        "summary": "Peringatan Maulid Nabi dengan pembunyian gamelan sekati pusaka Kyai Gunturmadu dan arak-arakan gunungan keraton.",
        "description": "Sekaten telah berlangsung sejak era Kasultanan Demak sebagai media syiar Islam lewat seni budaya Jawa (syahadatain). Puncak acara dimeriahkan dengan tradisi Grebeg Maulud di mana rakyat berebut hasil bumi dari gunungan keraton.",
        "featured": False,
        "viewCount": 3340,
    },
    {
        "slug": "perahu-sandeq-mandar",
        "title": "Perahu Sandeq Mandar",
        "categorySlug": "tradisi",
        "provinceName": "Sulawesi Barat",
        "wikiTitle": "Sandeq",
        "summary": "Perahu layar bercadik tertipis dan tercepat di dunia hasil kearifan bahari suku Mandar mengarungi Selat Makassar.",
        "description": "Sandeq adalah mahakarya perkapalan tradisional suku Mandar. Mengandalkan tiang layar segitiga sombal tanjaq dan cadik ganda, perahu ramping ini mampu melaju hingga kecepatan 30 knot menembus gelombang samudra.",
        "featured": False,
        "viewCount": 1690,
    },
    {
        "slug": "bakar-batu-papua",
        "title": "Tradisi Bakar Batu",
        "categorySlug": "tradisi",
        "provinceName": "Papua Pegunungan",
        "wikiTitle": "Bakar_batu",
        "summary": "Ritus memasak komunal beralaskan batu membara di dalam lubang tanah sebagai simbol perdamaian dan persaudaraan.",
        "description": "Bakar Batu (Barapen) adalah tradisi sakral suku-suku pegunungan tengah Papua seperti Dani dan Lani. Batu dipanaskan dengan kayu api lalu ditumpuk bersama ubi, sayur hipere, dan daging, dinikmati bersama seluruh warga kampung.",
        "featured": True,
        "viewCount": 3540,
    },
]

def load_traditional_houses():
    """Extract 38 houses from src/data/traditional-houses.ts cleanly"""
    with open("src/data/traditional-houses.ts", "r", encoding="utf-8") as f:
        text = f.read()

    start = text.find("export const HOUSES_38_CATALOGUE: TraditionalHouse[] = [")
    block = text[start:]

    entries = re.split(r'\{\s*id:\s*"([^"]+)",', block)
    houses = []
    for i in range(1, len(entries), 2):
        hid = entries[i]
        chunk = entries[i+1]
        
        def get_val(key):
            m = re.search(r'' + key + r':\s*"([^"]+)"', chunk)
            return m.group(1) if m else ""

        indName = get_val("indigenousName")
        province = get_val("province")
        if not indName or not province:
            continue

        slug = get_val("slug")
        title = get_val("title")
        ethnic = get_val("ethnicGroup")
        modelUrl = get_val("modelUrl")
        phil = get_val("philosophy")

        summary = f"Rumah adat {title} ({indName}) khas suku {ethnic} di provinsi {province}."
        houses.append({
            "slug": slug,
            "title": f"Rumah Adat {title}",
            "originalTitle": title,
            "indigenousName": indName,
            "categorySlug": "rumah-adat",
            "provinceName": province,
            "ethnicGroup": ethnic,
            "modelUrl": modelUrl,
            "philosophy": phil,
            "summary": summary,
            "featured": (slug in ["rumoh-aceh", "rumah-gadang", "joglo", "tongkonan", "honai", "betang"]),
            "viewCount": 3000 + (len(houses) * 73) % 2500,
        })
    return houses

def load_traditional_instruments():
    """Extract 38 instruments from src/data/instruments-data.ts cleanly"""
    with open("src/data/instruments-data.ts", "r", encoding="utf-8") as f:
        text = f.read()

    start = text.find("const RAW_INSTRUMENTS_38: RawInstrumentSeed[] = [")
    end = text.find("export const INSTRUMENTS_38_CATALOGUE")
    block = text[start:end]

    entries = re.split(r'\{\s*provinceNumber:\s*(\d+),', block)
    instruments = []
    for i in range(1, len(entries), 2):
        num = int(entries[i])
        chunk = entries[i+1]
        
        def get_val(key):
            m = re.search(r'' + key + r':\s*"([^"]+)"', chunk)
            return m.group(1) if m else ""

        slug = get_val("slug")
        title = get_val("title")
        prov = get_val("province")
        ethnic = get_val("ethnicGroup")
        interact = get_val("interactionType")
        organology = get_val("organologyLabel")
        phil = get_val("philosophy")
        modelUrl = f"/api/models/instruments/{slug}.glb"

        summary = f"{organology} tradisional khas suku {ethnic} dari {prov}, dimainkan dengan cara {interact}."
        instruments.append({
            "number": num,
            "slug": slug,
            "title": f"Alat Musik {title}",
            "originalTitle": title,
            "categorySlug": "alat-musik",
            "provinceName": prov,
            "ethnicGroup": ethnic,
            "interactionType": interact,
            "organologyLabel": organology,
            "modelUrl": modelUrl,
            "philosophy": phil,
            "summary": summary,
            "featured": (slug in ["angklung", "saron", "kolintang", "sasando", "tifa", "saluang"]),
            "viewCount": 2800 + (len(instruments) * 91) % 2700,
        })
    return instruments

def fetch_wiki_data(query_title):
    """Fetch extract and thumbnail from Wikipedia Indonesia API"""
    encoded_title = urllib.parse.quote(query_title.replace(" ", "_"))
    url = f"https://id.wikipedia.org/api/rest_v1/page/summary/{encoded_title}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "WaraNusaBot/1.0 (https://waranusa.id; contact@waranusa.id)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                extract = data.get("extract", "")
                thumb_url = data.get("thumbnail", {}).get("source", "")
                return extract, thumb_url
    except Exception:
        pass
    return "", ""

def download_image(url, dest_path):
    """Download image to local path"""
    if not url:
        return False
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "WaraNusaBot/1.0 (https://waranusa.id; contact@waranusa.id)"}
        )
        with urllib.request.urlopen(req, timeout=5) as response, open(dest_path, "wb") as out_file:
            shutil.copyfileobj(response, out_file)
        return True
    except Exception:
        return False

def ensure_fallback_image(slug, category_slug, dest_path):
    """Ensure a valid local image exists in dest_path"""
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        return True

    seed_map = {
        "rumah-gadang": "public/uploads/seed/rumah-gadang.png",
        "joglo": "public/uploads/seed/joglo.png",
        "tongkonan": "public/uploads/seed/rumah-tongkonan.png",
        "rumah-betang": "public/uploads/seed/rumah-betang.png",
        "honai": "public/uploads/seed/honai-noken.png",
        "batik-parang-yogyakarta": "public/uploads/seed/batik.png",
        "songket-palembang": "public/uploads/seed/songket.png",
        "songket-pandai-sikek": "public/uploads/seed/songket.png",
        "saron": "public/uploads/seed/gamelan.png",
        "angklung": "public/uploads/seed/angklung.png",
        "tari-kecak": "public/uploads/seed/kecak.png",
        "tari-piring": "public/uploads/seed/tari-piring.png",
        "wayang-kulit-purwa": "public/uploads/seed/wayang-kulit.png",
        "tari-pendet": "public/uploads/seed/tari-bali.png",
        "perahu-sandeq-mandar": "public/uploads/seed/kapal-pinisi.png",
    }

    if slug in seed_map and os.path.exists(seed_map[slug]):
        shutil.copyfile(seed_map[slug], dest_path)
        return True

    cat_fallbacks = {
        "rumah-adat": "public/uploads/seed/rumah-gadang.png",
        "alat-musik": "public/uploads/seed/angklung.png",
        "tekstil": "public/uploads/seed/batik.png",
        "tarian": "public/uploads/seed/kecak.png",
        "kuliner": "public/uploads/seed/hero-archipelago.png",
        "tradisi": "public/uploads/seed/wayang-kulit.png",
    }
    fb = cat_fallbacks.get(category_slug, "public/uploads/seed/hero-archipelago.png")
    if os.path.exists(fb):
        shutil.copyfile(fb, dest_path)
        return True

    return False

def main():
    print("=" * 60)
    print("WARANUSA — MASTER CULTURAL CATALOGUE GENERATOR")
    print("=" * 60)

    catalog_dir = "public/images/catalog"
    os.makedirs(catalog_dir, exist_ok=True)

    houses = load_traditional_houses()
    print(f"✓ Loaded {len(houses)} Traditional Houses from traditional-houses.ts")

    instruments = load_traditional_instruments()
    print(f"✓ Loaded {len(instruments)} Traditional Instruments from instruments-data.ts")

    print(f"✓ Loaded {len(SUPPLEMENTARY_ITEMS)} Supplementary Items across 4 categories")

    all_items = []

    # 1. Process Houses
    for h in houses:
        prov_info = PROV_MAP.get(h["provinceName"].lower(), {
            "code": "ID-XX", "name": h["provinceName"], "islandGroup": "SUMATERA"
        })
        img_filename = f"{h['slug']}.jpg"
        img_path = os.path.join(catalog_dir, img_filename)
        ensure_fallback_image(h["slug"], "rumah-adat", img_path)

        all_items.append({
            "id": f"item-house-{h['slug']}",
            "slug": h["slug"],
            "title": h["title"],
            "summary": h["summary"],
            "description": f"{h['summary']} Diwariskan turun-temurun oleh masyarakat suku {h['ethnicGroup']} di provinsi {h['provinceName']}.\n\nFalsafah Ruang & Adat:\n{h['philosophy']}",
            "philosophy": h["philosophy"],
            "featured": h["featured"],
            "viewCount": h["viewCount"],
            "status": "PUBLISHED",
            "category": next(c for c in CATEGORIES if c["slug"] == "rumah-adat"),
            "region": {
                "id": f"reg-{prov_info['code'].lower()}",
                "code": prov_info["code"],
                "name": prov_info["name"],
                "islandGroup": prov_info["islandGroup"],
            },
            "coverMedia": {
                "id": f"media-{h['slug']}",
                "name": f"Foto {h['title']}",
                "url": f"/images/catalog/{img_filename}",
                "type": "IMAGE",
            },
            "modelMedia": {
                "id": f"model-{h['slug']}",
                "name": f"Model 3D {h['title']}",
                "url": h["modelUrl"],
                "type": "MODEL_3D",
            },
            "actionBadge": "Buka Model 3D",
            "actionUrl": f"#/eksplorasi-3d?house={h['slug']}",
        })

    # 2. Process Instruments
    for inst in instruments:
        prov_info = PROV_MAP.get(inst["provinceName"].lower(), {
            "code": "ID-XX", "name": inst["provinceName"], "islandGroup": "SUMATERA"
        })
        img_filename = f"{inst['slug']}.jpg"
        img_path = os.path.join(catalog_dir, img_filename)
        ensure_fallback_image(inst["slug"], "alat-musik", img_path)

        all_items.append({
            "id": f"item-inst-{inst['slug']}",
            "slug": inst["slug"],
            "title": inst["title"],
            "summary": inst["summary"],
            "description": f"{inst['summary']}\n\nFalsafah & Resonansi Budaya:\n{inst['philosophy']}",
            "philosophy": inst["philosophy"],
            "featured": inst["featured"],
            "viewCount": inst["viewCount"],
            "status": "PUBLISHED",
            "category": next(c for c in CATEGORIES if c["slug"] == "alat-musik"),
            "region": {
                "id": f"reg-{prov_info['code'].lower()}",
                "code": prov_info["code"],
                "name": prov_info["name"],
                "islandGroup": prov_info["islandGroup"],
            },
            "coverMedia": {
                "id": f"media-{inst['slug']}",
                "name": f"Foto {inst['title']}",
                "url": f"/images/catalog/{img_filename}",
                "type": "IMAGE",
            },
            "modelMedia": {
                "id": f"model-{inst['slug']}",
                "name": f"Model 3D {inst['title']}",
                "url": inst["modelUrl"],
                "type": "MODEL_3D",
            },
            "actionBadge": "Mainkan Nada",
            "actionUrl": f"#/instrumen?alat={inst['slug']}",
        })

    # 3. Process Supplementary Items
    print("\nProcessing supplementary items (Tekstil, Tarian, Kuliner, Tradisi)...")
    for sup in SUPPLEMENTARY_ITEMS:
        prov_info = PROV_MAP.get(sup["provinceName"].lower(), {
            "code": "ID-XX", "name": sup["provinceName"], "islandGroup": "SUMATERA"
        })
        img_filename = f"{sup['slug']}.jpg"
        img_path = os.path.join(catalog_dir, img_filename)

        # Attempt Wikipedia fetch if network is available
        wiki_title = sup.get("wikiTitle", sup["title"])
        extract, thumb_url = fetch_wiki_data(wiki_title)
        downloaded = False
        if thumb_url:
            downloaded = download_image(thumb_url, img_path)
            if downloaded:
                print(f"  ✓ Downloaded Wikipedia image for {sup['title']}")
        if not downloaded:
            ensure_fallback_image(sup["slug"], sup["categorySlug"], img_path)

        all_items.append({
            "id": f"item-{sup['slug']}",
            "slug": sup["slug"],
            "title": sup["title"],
            "summary": sup["summary"],
            "description": sup["description"],
            "philosophy": sup.get("summary", ""),
            "featured": sup.get("featured", False),
            "viewCount": sup.get("viewCount", 1500),
            "status": "PUBLISHED",
            "category": next(c for c in CATEGORIES if c["slug"] == sup["categorySlug"]),
            "region": {
                "id": f"reg-{prov_info['code'].lower()}",
                "code": prov_info["code"],
                "name": prov_info["name"],
                "islandGroup": prov_info["islandGroup"],
            },
            "coverMedia": {
                "id": f"media-{sup['slug']}",
                "name": f"Foto {sup['title']}",
                "url": f"/images/catalog/{img_filename}",
                "type": "IMAGE",
            },
            "actionBadge": "Lihat",
            "actionUrl": f"#/budaya/{sup['slug']}",
        })

    print(f"\n✓ Total Consolidated Cultural Items: {len(all_items)}")

    # Sort alphabetical by title
    all_items.sort(key=lambda x: x["title"])

    # Output JSON
    json_path = "src/data/cultural-items.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved master JSON to {json_path}")

    # Output TypeScript
    ts_path = "src/data/cultural-catalogue.ts"
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write('import type { CulturalItem, Category, Region } from "@/lib/types";\n\n')
        
        # Categories
        f.write("export const CULTURAL_CATEGORIES_DATASET: Category[] = " + json.dumps(CATEGORIES, indent=2, ensure_ascii=False) + ";\n\n")

        # Provinces
        f.write("export const PROVINCES_38_ALPHABETICAL: Region[] = [\n")
        sorted_provs = sorted(PROVINCES_38, key=lambda p: p["name"])
        for p in sorted_provs:
            f.write(f'  {{\n    id: "reg-{p["code"].lower()}",\n    code: "{p["code"]}",\n    name: "{p["name"]}",\n    islandGroup: "{p["islandGroup"]}",\n    summary: "{p["name"]}",\n  }},\n')
        f.write("];\n\n")

        # Master Items
        f.write("export const MASTER_CULTURAL_CATALOGUE: CulturalItem[] = " + json.dumps(all_items, indent=2, ensure_ascii=False) + " as unknown as CulturalItem[];\n\n")

        # Helper Query Function
        f.write("""export interface CatalogueQueryParams {
  search?: string;
  categorySlug?: string;
  regionCode?: string;
  sort?: "newest" | "oldest" | "popular" | "title";
  page?: number;
  pageSize?: number;
}

export function queryCatalogue(params: CatalogueQueryParams = {}) {
  const {
    search = "",
    categorySlug = "",
    regionCode = "",
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = params;

  let filtered = [...MASTER_CULTURAL_CATALOGUE];

  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter((it) => it.category?.slug === categorySlug);
  }

  if (regionCode && regionCode !== "all") {
    filtered = filtered.filter((it) => it.region?.code === regionCode);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q) ||
        it.region?.name.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === "popular") {
    filtered.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
  } else if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title, "id"));
  } else if (sort === "oldest") {
    filtered.reverse();
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const skip = (currentPage - 1) * pageSize;
  const items = filtered.slice(skip, skip + pageSize);

  return {
    items,
    meta: {
      page: currentPage,
      pageSize,
      total,
      totalPages,
    },
  };
}
""")
    print(f"✓ Saved TypeScript master catalogue to {ts_path}")
    print("=" * 60)
    print("CATALOGUE DATASET GENERATION COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    main()
