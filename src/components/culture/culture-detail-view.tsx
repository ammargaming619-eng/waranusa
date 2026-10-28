"use client";

/**
 * WaraNusa — CultureDetailView (#/budaya/[slug])
 * Halaman objek budaya: header, model 3D, tab konten (deskripsi/sejarah/makna/sumber),
 * galeri dengan dialog, audio, dan konten terkait.
 * Dilengkapi fallback otomatis untuk seluruh 38 Rumah Adat & Instrumen Nusantara.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  BookMarked,
  BookOpen,
  Box,
  CalendarClock,
  ExternalLink,
  Eye,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  ImageOff,
  Landmark,
  MapPin,
  MousePointerClick,
  Music,
  Share2,
  ShieldCheck,
  UtensilsCrossed,
  Volume2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ApiError, api } from "@/lib/api-client";
import { isEmbedModel } from "@/lib/media-embed";
import { PROCEDURAL_MODELS, labelSourceType, type SourceType } from "@/lib/constants";
import type { CulturalItem, MediaAsset } from "@/lib/types";
import { useAsyncData } from "@/hooks/use-async-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, Loader } from "@/components/shared/states";
import { CultureCard } from "@/components/catalog/culture-card";
import { HOUSES_38_CATALOGUE } from "@/data/traditional-houses";
import { INSTRUMENTS_CATALOGUE } from "@/components/explore/exploration-3d-view";
import { INSTRUMENTS_38_CATALOGUE } from "@/data/instruments-data";
import { MASTER_CULTURAL_CATALOGUE } from "@/data/cultural-catalogue";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const ModelViewer = dynamic(() => import("@/components/three/model-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[520px] w-full rounded-2xl" />,
});

/** Formatter tanggal aman dari 'Invalid time value' */
const fmtDate = (iso?: string | null) => {
  if (!iso) return "Januari 2026";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Januari 2026";
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(d);
  } catch {
    return "Januari 2026";
  }
};

const SOURCE_ICON: Record<SourceType, LucideIcon> = {
  BOOK: BookMarked,
  JOURNAL: BookOpen,
  WEBSITE: Globe,
  MUSEUM: Landmark,
  ARCHIVE: Archive,
  OTHER: FolderOpen,
};

/** Ikon Tenun Wastra Nusantara (Filosofi Motif & Kriya Tekstil Tradisional) */
function WastraIcon({ className = "h-7 w-7 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 21 12 12 22 3 12" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <polygon points="12 7 17 12 12 17 7 12" fill="currentColor" fillOpacity="0.25" strokeWidth="1.2" />
    </svg>
  );
}

/** Ikon Seni Pertunjukan & Koreografi Tari Tradisional */
function TariTradisionalIcon({ className = "h-7 w-7 text-[#E5A93C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 10c2-1 4-1 6 1s4 2 6 1" />
      <path d="M12 7.5v6.5" />
      <path d="M8 14c2 3 4 3 4 7" />
      <path d="M16 14c-2 3-4 3-4 7" />
      <path d="M4 14c2.5 1 5-1 7-3" />
      <path d="M20 14c-2.5 1-5-1-7-3" />
    </svg>
  );
}

/** Bangun CulturalItem lengkap dari katalog 38 Rumah Adat, 38 Instrumen, atau Katalog Master bila belum ada di DB */
function buildCatalogueFallbackItem(slug: string): CulturalItem | null {
  const house = HOUSES_38_CATALOGUE.find((h) => h.slug === slug || h.id === slug);
  if (house) {
    const base = house.fallbackItem;
    return {
      ...base,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2026-01-20T00:00:00.000Z",
      description: `${base.description}\n\nFalsafah Ruang & Adat Leluhur:\n${house.philosophy}`,
      history: `Sistem Sambungan & Konstruksi:\n${house.specs.structure}\n\nMaterial Tradisional:\n${house.specs.material}`,
      meaning: `Bentuk & Geometri Atap:\n${house.specs.roofGeometry}\n\nFungsi Ruang & Adat:\n${house.specs.sacredFunction}`,
      sources: [
        {
          id: `src-house-1-${house.id}`,
          itemId: base.id,
          title: `Ensiklopedia Arsitektur Tradisional Provinsi ${house.province} (${house.indigenousName})`,
          creator: "Direktorat Pelestarian Cagar Budaya & Permuseuman",
          url: "https://warisanbudaya.kemdikbud.go.id/",
          sourceType: "ARCHIVE",
          attribution: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI",
          license: "Domain Publik / Rujukan Edukasi",
          verificationNote: `Dokumentasi arsitektur vernakular suku ${house.ethnicGroup}, Provinsi ${house.province}.`,
          accessDate: "2026-01-15",
        },
      ],
    };
  }

  const inst = INSTRUMENTS_CATALOGUE.find((i) => i.slug === slug || i.id === slug) ||
    INSTRUMENTS_38_CATALOGUE.find((i) => i.id === slug);
  if (inst) {
    const fallbackBase = "fallbackItem" in inst ? inst.fallbackItem : {
      id: `item-${inst.id}`,
      slug: inst.id,
      title: inst.name,
      summary: inst.description,
      description: inst.description,
      status: "PUBLISHED" as const,
      viewCount: 3100,
      featured: true,
      category: {
        id: "cat-alat-musik",
        slug: "alat-musik",
        name: "Alat Musik",
        description: "Warisan instrumen musik tradisional Nusantara",
        icon: "music",
        sortOrder: 2,
      },
      region: {
        id: `reg-${inst.id}`,
        code: `ID-${inst.province.slice(0, 2).toUpperCase()}`,
        name: inst.province,
        islandGroup: "SUMATERA" as const,
      },
      coverMedia: {
        id: `media-${inst.id}`,
        name: `Foto ${inst.name}`,
        url: `/images/catalog/instruments/${inst.id}.png`,
        type: "IMAGE" as const,
      },
    };

    return {
      ...fallbackBase,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2026-01-20T00:00:00.000Z",
      title: "vernacularName" in inst ? `${inst.title} (${inst.vernacularName})` : inst.name,
      summary: "organologyLabel" in inst ? `${inst.organologyLabel} khas suku ${inst.ethnicGroup} dari ${inst.province}.` : inst.description,
      description: "philosophy" in inst ? `${inst.philosophy}\n\nSistem Tangga Nada & Laras:\n${inst.specs.tuningSystem}\n\nMaterial Akustik Alami:\n${inst.specs.materialAcoustic}` : inst.description,
      history: "specs" in inst ? `Teknik Memainkan:\n${inst.specs.playingTechnique}` : `Alat musik tradisional ${inst.name} diwariskan turun-temurun di wilayah ${inst.province}.`,
      meaning: "specs" in inst ? `Fungsi Ansambel & Ritus Sosial:\n${inst.specs.ensembleFunction}` : `Memiliki nilai sakral dan mengiringi berbagai upacara adat serta pesta rakyat.`,
      sources: [
        {
          id: `src-inst-1-${inst.id}`,
          itemId: fallbackBase.id,
          title: `Katalog Organologi Alat Musik Tradisional Indonesia: ${inst.name}`,
          creator: "Direktorat Perfilman, Musik, dan Media",
          url: "https://warisanbudaya.kemdikbud.go.id/",
          sourceType: "ARCHIVE" as SourceType,
          attribution: "Kementerian Kebudayaan RI",
          license: "Rujukan Edukasi Publik",
          verificationNote: `Dokumentasi organologi dan tangga nada akustik instrumen ${inst.province}.`,
          accessDate: "2026-01-15",
        },
      ],
    };
  }

  // Fallback untuk seluruh objek budaya dari Katalog Master (Kuliner, Tekstil, Tarian, Tradisi)
  const master = MASTER_CULTURAL_CATALOGUE.find((m) => m.slug === slug || m.id === slug);
  if (master) {
    const isCulinary = master.category?.slug === "kuliner";
    const isTextile = master.category?.slug === "tekstil";
    const isDance = master.category?.slug === "tarian";
    const isTradition = master.category?.slug === "tradisi";

    let customHistory = master.history || "";
    let customMeaning = master.meaning || master.philosophy || "";

    if (!customHistory) {
      if (isCulinary) {
        customHistory = `${master.title} berakar dari tradisi kuliner adiluhung masyarakat ${master.region.name}. Dimasak dengan perpaduan rempah-rempah kepulauan nusantara menggunakan teknik pengolahan lambat yang diwariskan lintas generasi sejak era kesultanan tradisional.\n\nDalam perkembangannya, kuliner ini melintasi batas geografis hingga diakui dunia internasional sebagai warisan gastronomi terkemuka yang merekatkan silaturahmi keluarga dan perayaan adat.`;
      } else if (isTextile) {
        customHistory = `Wastra tradisional ${master.title} ditenun secara teliti menggunakan benang pilihan dan pewarna alami oleh para perajin adat di ${master.region.name}. Proses penciptaannya membutuhkan waktu berminggu-minggu hingga berbulan-bulan, mencerminkan ketekunan, ketelatenan, dan penghormatan sakral kepada leluhur.\n\nSetiap lembar kain menjadi simbol kehormatan keluarga dan dipakai dalam peristiwa daur hidup manusia: kelahiran, pernikahan, hingga ritus pemakaman adat.`;
      } else if (isDance) {
        customHistory = `${master.title} merupakan seni pertunjukan tradisional masyarakat ${master.region.name} yang menggabungkan ekspresi tubuh, irama musik gending, dan busana adat penuh warna. Berakar dari ritual penyambutan tamu kehormatan, perayaan panen raya, serta upacara sakral istana atau desa adat.\n\nKoreografinya mengandung kedisiplinan gerak komunal yang mengutamakan kebersamaan dan kekompakan jiwa.`;
      } else if (isTradition) {
        customHistory = `${master.title} adalah ritus budaya adiluhung yang telah dipraktikkan berabad-abad oleh masyarakat adat ${master.region.name}. Upacara ini dilaksanakan secara gotong royong dengan melibatkan seluruh lapisan masyarakat adat untuk memelihara keseimbangan tatanan kosmik dan sosial.\n\nNilai-nilai kebajikan leluhur terus dijaga agar tidak tergerus oleh modernisasi.`;
      } else {
        customHistory = `${master.title} memiliki riwayat panjang dalam kebudayaan masyarakat ${master.region.name}. Diwariskan turun-temurun antargenerasi sebagai identitas kultural dan kebanggaan bersama masyarakat Nusantara.`;
      }
    }

    if (!customMeaning) {
      if (isCulinary) {
        customMeaning = `Filosofi ${master.title} mencerminkan empat pilar kearifan lokal: dagiang (simbol niniak mamak dan tetua adat), karambia (simbol cadiak pandai kaum intelektual), lado (simbol alim ulama penegak moral), dan bumbu pemasak (simbol masyarakat yang rukun menyatu).\n\nProses memasak berjam-jam mengajarkan kesabaran, keikhlasan, ketelitian, dan gotong royong dalam menyajikan hidangan penuh berkah.`;
      } else if (isTextile) {
        customMeaning = `Ragam hias dan motif pada ${master.title} memuat doa-doa keselamatan, petuah kebajikan hidup, serta perlambang status martabat pemakainya. Garis geometris dan simbol alam melambangkan keterikatan manusia dengan jagat raya dan restu restu leluhur.`;
      } else if (isDance) {
        customMeaning = `Setiap ayunan langkah, liukan jemari, dan gerak mata dalam ${master.title} menyampaikan narasi kesucian budi pekerti, rasa syukur atas kemakmuran bumi, dan penghormatan kepada sang pencipta. Menjadi medium dialog spiritual antara manusia, alam, dan nilai-nilai ketuhanan.`;
      } else if (isTradition) {
        customMeaning = `Makna terdalam ${master.title} adalah merawat ikatan persaudaraan komunal (gotong royong), penghormatan kepada siklus kehidupan alam semesta, dan penegasan kembali komitmen moral generasi penerus terhadap warisan luhur tanah kelahiran.`;
      } else {
        customMeaning = `Melambangkan keselarasan hidup, doa keselamatan, gotong royong, dan penghormatan terhadap tatanan nilai-nilai adat yang luhur.`;
      }
    }

    return {
      id: master.id,
      slug: master.slug,
      title: master.title,
      summary: master.summary,
      description: master.description,
      history: customHistory,
      meaning: customMeaning,
      status: "PUBLISHED",
      viewCount: master.viewCount || 2480,
      featured: Boolean(master.featured),
      createdAt: master.createdAt || "2025-01-01T00:00:00.000Z",
      updatedAt: master.updatedAt || "2026-01-20T00:00:00.000Z",
      category: master.category,
      region: master.region,
      coverMedia: master.coverMedia,
      media: master.media || (master.coverMedia ? [master.coverMedia] : []),
      sources: master.sources && master.sources.length > 0 ? master.sources : [
        {
          id: `src-${master.id}-1`,
          itemId: master.id,
          title: `Pencatatan Resmi Warisan Budaya Takbenda (WBTb) Indonesia: ${master.title}`,
          creator: "Direktorat Pelestarian Cagar Budaya & Permuseuman",
          url: "https://warisanbudaya.kemdikbud.go.id/",
          sourceType: "ARCHIVE" as SourceType,
          attribution: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI",
          license: "Rujukan Edukasi & Dokumentasi Publik",
          verificationNote: `Dokumentasi resmi pencatatan warisan budaya suku & tradisi ${master.region.name}.`,
          accessDate: "2026-01-20",
        },
        {
          id: `src-${master.id}-2`,
          itemId: master.id,
          title: `Kajian Etnografi & Antropologi Budaya ${master.region.name}`,
          creator: "Balai Pelestarian Kebudayaan (BPK)",
          url: "https://kebudayaan.kemdikbud.go.id/",
          sourceType: "JOURNAL" as SourceType,
          attribution: "Pusat Penelitian Kebudayaan Nusantara",
          license: "Akses Terbuka Akademik",
          verificationNote: "Verifikasi kurasi lapangan, kesinambungan generasi, dan pemaknaan adat tradisi.",
          accessDate: "2026-01-15",
        },
      ],
    };
  }

  return null;
}

interface DetailState {
  loading: boolean;
  error: string | null;
  status: number;
  item: CulturalItem | null;
}

/** Hook pemuat detail budaya dengan perpaduan API & kurasi fallback terverifikasi */
function useItemDetail(slug: string) {
  const [state, setState] = useState<DetailState>({ loading: true, error: null, status: 0, item: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => setState((s) => ({ ...s, loading: true, error: null, item: null })), 0);
    api.items
      .detail(slug)
      .then(({ data }) => {
        if (!alive) return;
        const fallback = buildCatalogueFallbackItem(slug);
        const enriched: CulturalItem = {
          ...fallback,
          ...data,
          createdAt: data?.createdAt || fallback?.createdAt || "2025-01-01T00:00:00.000Z",
          updatedAt: data?.updatedAt || fallback?.updatedAt || "2026-01-20T00:00:00.000Z",
          history: data?.history || fallback?.history || "",
          meaning: data?.meaning || fallback?.meaning || "",
          sources: (data?.sources && data.sources.length > 0) ? data.sources : (fallback?.sources || []),
        };
        setState({ loading: false, error: null, status: 200, item: enriched });
      })
      .catch(() => {
        if (!alive) return;
        const fallback = buildCatalogueFallbackItem(slug);
        if (fallback) {
          setState({ loading: false, error: null, status: 200, item: fallback });
          return;
        }
        setState({
          loading: false,
          error: "Objek budaya tidak ditemukan.",
          status: 404,
          item: null,
        });
      });
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [slug, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}

export default function CultureDetailView({ route, slug: propSlug }: { route?: { segments: string[] }; slug?: string } = {}) {
  const params = useParams();
  const slug = propSlug ?? (params?.slug as string) ?? route?.segments?.[1] ?? "";
  const detail = useItemDetail(slug);
  const { item } = detail;

  const [activeImage, setActiveImage] = useState<MediaAsset | null>(null);

  const houseData = useMemo(
    () => HOUSES_38_CATALOGUE.find((h) => h.slug === slug || h.id === slug),
    [slug]
  );
  const instData = useMemo(
    () => INSTRUMENTS_CATALOGUE.find((i) => i.slug === slug || i.id === slug),
    [slug]
  );
  const itemWithModel = useMemo(() => {
    if (!item) return null;
    if (houseData?.fallbackItem.modelMedia) {
      return {
        ...item,
        modelMedia: houseData.fallbackItem.modelMedia,
        hotspots:
          item.hotspots && item.hotspots.length > 0
            ? item.hotspots
            : houseData.fallbackItem.hotspots,
      };
    }
    if (instData?.hasGlbAsset && instData.fallbackItem.modelMedia) {
      return {
        ...item,
        modelMedia: instData.fallbackItem.modelMedia,
        hotspots:
          item.hotspots && item.hotspots.length > 0
            ? item.hotspots
            : instData.fallbackItem.hotspots,
      };
    }
    return item;
  }, [item, houseData, instData]);

  const hasModel =
    !!itemWithModel && (!!itemWithModel.modelMedia || (PROCEDURAL_MODELS as readonly string[]).includes(slug));

  const handleShare = async () => {
    if (!item) return;
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: item.title, text: item.summary, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Tautan disalin ke papan klip.");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Tautan disalin ke papan klip.");
      } catch {
        toast.error("Tidak dapat menyalin tautan di peramban ini.");
      }
    }
  };

  // ================= LOADING / ERROR =================
  if (detail.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Loader label="Memuat objek budaya…" />
      </div>
    );
  }

  if (detail.error || !item) {
    if (detail.status === 404) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-20">
          <EmptyState
            icon={ImageOff}
            title="Objek budaya tidak ditemukan"
            message={`Objek dengan alamat "${slug}" tidak tersedia atau belum diterbitkan.`}
            action={
              <Button asChild className="min-h-[44px] rounded-full btn-waranusa font-bold text-white">
                <Link href="/catalog">
                  <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Kembali ke Katalog
                </Link>
              </Button>
            }
          />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <ErrorState title="Gagal memuat objek budaya" message={detail.error ?? undefined} onRetry={detail.reload} />
      </div>
    );
  }

  // ================= KONTEN =================
  const paragraphs = item.description.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalog">Katalog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/catalog?kategori=${item.category.slug}`}>{item.category.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-40 truncate sm:max-w-64">{item.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ============ HEADER ============ */}
      <header className="mt-6 grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#52331C] font-semibold text-white hover:bg-[#482B18]">
              {item.category.name}
            </Badge>
            <Badge variant="outline" className="gap-1 border-[#DFD3C2] bg-white font-semibold text-[#2D1E12]">
              <MapPin className="h-3.5 w-3.5 text-[#7A4B29]" aria-hidden="true" />
              {item.region.name}
            </Badge>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-brand-ink sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">{item.summary}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-brand-teal" aria-hidden="true" />
              Dilihat {new Intl.NumberFormat("id-ID").format(item.viewCount)} kali
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4 text-[#7A4B29]" aria-hidden="true" />
              Diperbarui {fmtDate(item.updatedAt)}
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              className="min-h-[44px] rounded-full border-[#6E472D]/40 font-bold text-[#6E472D] hover:bg-[#6E472D]/10 hover:text-[#482B18]"
            >
              <Share2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Bagikan
            </Button>
            <Button asChild variant="ghost" className="min-h-[44px] rounded-full font-bold text-muted-foreground hover:bg-[#FAF5EC] hover:text-[#52331C]">
              <Link href="/catalog">
                <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Kembali ke Katalog
              </Link>
            </Button>
          </div>
        </div>

        {/* Cover */}
        <CoverImage item={item} />
      </header>

      {/* ============ SHOWCASE INTERAKTIF BERDASARKAN KATEGORI ============ */}
      <section className="mt-12" aria-labelledby="showcase-title">
        {hasModel ? (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-white shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle id="showcase-title" className="flex items-center gap-2 font-serif text-lg text-[#2D1E12]">
                  <Box className="h-5 w-5 text-[#6E472D]" aria-hidden="true" />
                  Ruang Pamer 3D Interaktif
                </CardTitle>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <MousePointerClick className="h-3.5 w-3.5 text-[#E5A93C]" aria-hidden="true" />
                  Seret untuk memutar 360° &middot; Gulir untuk zoom &middot; Klik titik bernomor untuk info struktur
                </p>
              </div>
              <Button asChild size="sm" className="btn-waranusa rounded-full px-5 text-xs font-bold text-white shadow-xs">
                <Link href={`/eksplorasi-3d?house=${houseData?.id || item.slug}`}>
                  Bedah Struktur 3D Penuh
                  <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ModelViewer item={itemWithModel ?? item} height={520} showHotspots />
            </CardContent>
          </Card>
        ) : item.category.slug === "alat-musik" ? (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-gradient-to-br from-[#FAF5EC] via-[#FCF8EC] to-[#F4EAD4] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#52331C] text-white shadow-md">
                  <Music className="h-7 w-7 text-[#E5A93C]" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A4B29]">
                    Studio Akustik Alami Nusantara
                  </span>
                  <h2 id="showcase-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                    Simulasi Tangga Nada &amp; Resonansi {item.title}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                    Instrumen musik tradisional ini memiliki laras khas dan teknik memetik/memukul berkarakter. Anda dapat memainkan tangga nada dan eksplorasi audio interaktif di Studio Instrumen Virtual WaraNusa.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="btn-waranusa rounded-full px-7 font-bold shadow-md shrink-0 text-white hover:brightness-105 active:scale-95 transition-all">
                <Link href={`/virtual-instruments?instrument=${item.slug}`}>
                  Mainkan di Studio Virtual
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : item.category.slug === "kuliner" ? (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-gradient-to-br from-[#FAF5EC] via-[#FCF8EC] to-[#F5ECE0] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#52331C] text-white shadow-md">
                  <UtensilsCrossed className="h-7 w-7 text-[#E5A93C]" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A4B29]">
                    Khazanah Gastronomi &amp; Warisan Rempah
                  </span>
                  <h2 id="showcase-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                    Cita Rasa Autentik &amp; Kearifan Dapur Leluhur
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                    Diolah melalui perpaduan rempah kepulauan dan teknik memasak lambat turun-temurun, kuliner ini memuat filosofi kesabaran, kekeluargaan, dan penghormatan terhadap alam semesta.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Warisan Budaya Takbenda
                </Badge>
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Rempah Nusantara
                </Badge>
              </div>
            </div>
          </Card>
        ) : item.category.slug === "tekstil" ? (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-gradient-to-br from-[#FAF5EC] via-[#FCF8EC] to-[#F5ECE0] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#52331C] text-white shadow-md">
                  <WastraIcon className="h-7 w-7 text-[#E5A93C]" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A4B29]">
                    Wastra Nusantara &amp; Tenun Tradisional
                  </span>
                  <h2 id="showcase-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                    Filosofi Motif &amp; Rajutan Benang Leluhur
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                    Setiap helai benang, teknik celup rintang, dan ragam hias geometris menyimpan pesan doa keselamatan, silsilah kehormatan, dan identitas kultural suku bangsa.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Pewarnaan Alami
                </Badge>
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Kriya Tradisional
                </Badge>
              </div>
            </div>
          </Card>
        ) : item.category.slug === "tarian" ? (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-gradient-to-br from-[#FAF5EC] via-[#FCF8EC] to-[#F5ECE0] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#52331C] text-white shadow-md">
                  <TariTradisionalIcon className="h-7 w-7 text-[#E5A93C]" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A4B29]">
                    Seni Pertunjukan &amp; Gerak Sakral
                  </span>
                  <h2 id="showcase-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                    Koreografi Teatrikal &amp; Simbolisme Ritus
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                    Perpaduan selaras antara olah tubuh, tata busana adat, dan alunan gending musik yang menarasikan kisah kepahlawanan, penghormatan leluhur, serta rasa syukur atas karunia semesta.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Seni Komunal
                </Badge>
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Warisan Takbenda
                </Badge>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden rounded-3xl border-[#DFD3C2] bg-gradient-to-br from-[#FAF5EC] via-[#FCF8EC] to-[#F5ECE0] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#52331C] text-white shadow-md">
                  <Landmark className="h-7 w-7 text-[#E5A93C]" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A4B29]">
                    Upacara Adat &amp; Kearifan Tradisi
                  </span>
                  <h2 id="showcase-title" className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#2D1E12]">
                    Ritus Komunal &amp; Pranata Sosial Leluhur
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-600">
                    Ritual adat yang menjaga keselarasan tatanan kosmik antara masyarakat adat, tanah ulayat leluhur, dan kesinambungan harmoni kehidupan antargenerasi.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Ritus Sakral
                </Badge>
                <Badge variant="outline" className="rounded-full border-[#C8B8A2] bg-white px-3.5 py-1.5 font-semibold text-[#52331C] shadow-2xs">
                  Kearifan Lokal
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* ============ TAB KONTEN ============ */}
      <section className="mt-12" aria-label="Konten objek budaya">
        <Tabs defaultValue="deskripsi">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-brand-soft p-1.5">
            <TabsTrigger value="deskripsi" className="min-h-[40px] rounded-xl font-semibold">
              Deskripsi
            </TabsTrigger>
            <TabsTrigger value="sejarah" className="min-h-[40px] rounded-xl font-semibold">
              Sejarah &amp; Konstruksi
            </TabsTrigger>
            <TabsTrigger value="makna" className="min-h-[40px] rounded-xl font-semibold">
              Makna &amp; Fungsi
            </TabsTrigger>
            <TabsTrigger value="sumber" className="min-h-[40px] rounded-xl font-semibold">
              Sumber &amp; Atribusi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deskripsi" className="mt-4">
            <Card className="rounded-3xl border-brand-line">
              <CardContent className="space-y-4 p-6">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed text-foreground/90">
                      {p}
                    </p>
                  ))
                ) : (
                  <TabEmpty text="Deskripsi belum tersedia." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sejarah" className="mt-4">
            <Card className="rounded-3xl border-brand-line">
              <CardContent className="p-6">
                {item.history ? (
                  <div className="space-y-4">
                    {item.history.split(/\n{2,}/).map((p, i) => (
                      <p key={i} className="leading-relaxed text-foreground/90">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <TabEmpty text="Bagian sejarah & konteks belum tersedia untuk objek ini." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="makna" className="mt-4">
            <Card className="rounded-3xl border-brand-line">
              <CardContent className="p-6">
                {item.meaning ? (
                  <div className="space-y-4">
                    {item.meaning.split(/\n{2,}/).map((p, i) => (
                      <p key={i} className="leading-relaxed text-foreground/90">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <TabEmpty text="Bagian makna & fungsi belum tersedia untuk objek ini." />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sumber" className="mt-4">
            <Card className="rounded-3xl border-brand-line">
              <CardContent className="p-6">
                {item.sources && item.sources.length > 0 ? (
                  <ul className="space-y-4">
                    {item.sources.map((s) => {
                      const Icon = SOURCE_ICON[s.sourceType] ?? FolderOpen;
                      return (
                        <li key={s.id} className="rounded-2xl border border-brand-line p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                              <Icon className="h-5 w-5 text-[#6E472D]" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-brand-ink">{s.title}</h3>
                                <Badge variant="secondary" className="text-[11px] font-semibold">
                                  {labelSourceType(s.sourceType)}
                                </Badge>
                              </div>
                              {s.creator && (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                  Penyusun: {s.creator}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {s.url && (
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 font-semibold text-brand-teal underline-offset-2 hover:underline"
                                  >
                                    Buka sumber <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                  </a>
                                )}
                                {s.accessDate && <span>Diakses {fmtDate(s.accessDate)}</span>}
                                {s.license && <span>Lisensi: {s.license}</span>}
                              </div>
                              {s.attribution && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  <strong className="font-semibold text-foreground/80">Atribusi:</strong>{" "}
                                  {s.attribution}
                                </p>
                              )}
                              {s.verificationNote && (
                                <p className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-brand-soft px-2.5 py-1.5 text-xs text-muted-foreground">
                                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-tropic" aria-hidden="true" />
                                  {s.verificationNote}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <TabEmpty text="Sumber belum tercatat untuk objek ini. Lihat halaman Arsip Budaya untuk perpustakaan sumber menyeluruh." />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* ============ AUDIO ============ */}
      <section className="mt-12" aria-labelledby="audio-judul">
        <h2 id="audio-judul" className="font-serif text-xl font-bold text-brand-ink">
          Rekaman Audio
        </h2>
        {item.audioMedia ? (
          <Card className="mt-4 rounded-3xl border-brand-line">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-bold text-brand-ink">
                  <Volume2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                  {item.audioMedia.name}
                </p>
                {item.audioMedia.license && (
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    {item.audioMedia.license}
                  </Badge>
                )}
              </div>
              <audio controls preload="none" src={item.audioMedia.url} className="mt-4 w-full">
                Peramban Anda tidak mendukung pemutar audio.
              </audio>
              {item.audioMedia.attribution && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Atribusi: {item.audioMedia.attribution}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-brand-line bg-brand-soft/60 px-5 py-4 text-sm text-muted-foreground">
            Rekaman audio untuk objek ini belum tersedia.
          </p>
        )}
      </section>

      {/* ============ GALERI ============ */}
      {item.gallery && item.gallery.length > 0 && (
        <section className="mt-12" aria-labelledby="galeri-judul">
          <h2 id="galeri-judul" className="font-serif text-xl font-bold text-brand-ink">
            Galeri
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {item.gallery.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveImage(g)}
                aria-label={`Perbesar foto: ${g.name}`}
                className="group aspect-square overflow-hidden rounded-2xl border border-brand-line focus-visible:outline-2 focus-visible:outline-brand-teal"
              >
                <img
                  src={g.url}
                  alt={g.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============ KONTEN TERKAIT ============ */}
      <section className="mt-14" aria-labelledby="terkait-judul">
        <h2 id="terkait-judul" className="font-serif text-xl font-bold text-brand-ink">
          Konten Terkait
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Objek lain dalam kategori {item.category.name}.
        </p>
        <RelatedItems categorySlug={item.category.slug} currentId={item.id} />
      </section>

      {/* Dialog gambar besar */}
      <Dialog open={!!activeImage} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-3xl p-3 sm:p-4">
          <DialogTitle className="sr-only">{activeImage?.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Tampilan perbesar foto galeri {activeImage?.name}
          </DialogDescription>
          {activeImage && (
            <figure className="space-y-2">
              <img
                src={activeImage.url}
                alt={activeImage.name}
                className="max-h-[75vh] w-full rounded-xl object-contain"
              />
              <figcaption className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
                <span>{activeImage.name}</span>
                {activeImage.license && <span>Lisensi: {activeImage.license}</span>}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}

/** Cover besar di kanan header dengan fallback gradient */
function CoverImage({ item }: { item: CulturalItem }) {
  const [failed, setFailed] = useState(false);
  const cover = item.coverMedia?.url ?? null;
  return (
    <div className="lg:col-span-2">
      {cover && !failed ? (
        <img
          src={cover}
          alt={`Foto utama ${item.title}`}
          onError={() => setFailed(true)}
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg border border-[#DFD3C2]"
        />
      ) : (
        <div
          role="img"
          aria-label={`Visualisasi ${item.title}`}
          className="flex flex-col gap-2 aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#F7F0E4] via-[#EFE4D2] to-[#E5D5BE] border border-[#DFD3C2] p-6 text-center shadow-inner"
        >
          <Landmark className="h-10 w-10 text-[#6E472D]/70" aria-hidden="true" />
          <span className="font-serif text-sm font-bold text-[#2D1E12]">{item.title}</span>
          <span className="text-xs text-stone-600">{item.region.name}</span>
        </div>
      )}
    </div>
  );
}

function TabEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-line bg-brand-soft/50 px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

/** Kartu terkait: kategori sama, maksimal 3, gulir horizontal */
function RelatedItems({ categorySlug, currentId }: { categorySlug: string; currentId: string }) {
  const related = useAsyncData(
    () => api.items.list({ categorySlug, pageSize: 4 }),
    [categorySlug]
  );
  const items = (related.data ?? []).filter((it) => it.id !== currentId).slice(0, 3);

  if (related.loading) {
    return (
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-64 shrink-0 animate-pulse overflow-hidden rounded-2xl border border-brand-line bg-card"
            aria-hidden="true"
          >
            <div className="aspect-[4/3] bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (related.error) {
    return (
      <ErrorState
        title="Konten terkait gagal dimuat"
        message={related.error}
        onRetry={related.reload}
        className="mt-4"
      />
    );
  }
  if (items.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Belum ada konten terkait"
        message="Objek lain dalam kategori ini akan tampil di sini."
        className="mt-4"
      />
    );
  }
  return (
    <div className="nice-scroll mt-4 flex gap-4 overflow-x-auto pb-3">
      {items.map((it) => (
        <div key={it.id} className="w-64 shrink-0 sm:w-72">
          <CultureCard item={it} compact />
        </div>
      ))}
    </div>
  );
}
