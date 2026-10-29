"use client";

/**
 * WaraNusa CMS — Bento Grid Dashboard
 * Desain Bento Grid modern:
 * - Header: Sapaan personal + subteks ringkas + quick search & avatar juri.
 * - Baris 1: 3 Card Metrik Putih + 1 Hero Card Kayu Gelap (#2A1D15) Status Verifikasi.
 * - Baris 2: Sebaran Kategori Budaya (65%) & Antrean Moderasi Cepat (35%).
 * - Baris 3: Log Riwayat Aktivitas & Audit Kurasi (Tabel Mini Bersih & Compact).
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navigate } from "@/lib/router";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { useCmsStore } from "@/lib/cms-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/states";
import { fmtDateID } from "./media-picker";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n-store";
import {
  Activity,
  Archive,
  ArrowRight,
  AudioLines,
  Boxes,
  CheckCircle2,
  History,
  ImagePlus,
  LayoutGrid,
  LogIn,
  MapPin,
  PencilLine,
  PlusCircle,
  Search,
  Shapes,
  ShieldCheck,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";

void Activity;
void Archive;
void CheckCircle2;
void ImagePlus;
void LogIn;
void PencilLine;
void PlusCircle;
void Trash2;
void Upload;

function relTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru saja";
    if (m < 60) return `${m} m lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} j lalu`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} h lalu`;
    return fmtDateID(iso);
  } catch {
    return "-";
  }
}

interface QuickModerationItem {
  id: string;
  title: string;
  sender: string;
  province: string;
  type: string;
}

const SAMPLE_MODERATION: QuickModerationItem[] = [
  {
    id: "mod-1",
    title: "Tari Seblang Bakungan",
    sender: "Banyuwangi Heritage",
    province: "Jawa Timur",
    type: "Tarian",
  },
  {
    id: "mod-2",
    title: "Rumah Sasadu Suku Sahu",
    sender: "Komunitas Halmahera",
    province: "Maluku Utara",
    type: "Arsitektur",
  },
  {
    id: "mod-3",
    title: "Gendang Beleq Sasak",
    sender: "Sanggar Lombok Asri",
    province: "Nusa Tenggara Barat",
    type: "Alat Musik",
  },
];

export function DashboardView() {
  const { language, t } = useTranslation();
  const isEn = language === "EN";
  const user = useAuth((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    pendingContributions,
    approveContribution,
    rejectContribution,
    totalItems,
    publishedItems,
    draftItems,
    curatedPercentage,
  } = useCmsStore();

  const statsQ = useAsyncData(() => api.admin.stats(), []);
  const activityQ = useAsyncData(() => api.admin.activity({ page: 1, pageSize: 6 }), []);

  useEffect(() => {
    if (statsQ.error) toast.error(statsQ.error);
  }, [statsQ.error]);

  const stats = statsQ.data;
  const loading = statsQ.loading;

  const displayItemsTotal = stats ? Math.max(stats.itemsTotal, totalItems) : totalItems;
  const displayItemsPublished = stats ? Math.max(stats.itemsPublished, publishedItems) : publishedItems;
  const displayPending = pendingContributions.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ========================================================================= */}
      {/* HEADER DASBOR: Sapaan Personal + Quick Search & Avatar Juri                */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-100/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
              <ShieldCheck className="h-3 w-3 text-[#8C5E3C]" />
              CMS Curator Console • UINIC 8.0
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2D1E12]">
            {isEn ? `Welcome, ${user?.name ?? "Dewan Juri UINIC 8.0"} 👋` : `Selamat Datang, ${user?.name ?? "Dewan Juri UINIC 8.0"} 👋`}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-600">
            {isEn
              ? "Archival overview of living cultural assets, 3D media, and moderation queue."
              : "Ringkasan kurasi warisan budaya hidup, aset 3D & media, dan antrean moderasi penjurian."}
          </p>
        </div>

        {/* Quick Search Bar & Profil Juri */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/admin/cultural-items?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search archive or province..." : "Cari artefak / provinsi…"}
              className="h-9 w-48 sm:w-60 pl-8 pr-3 text-xs bg-white border-stone-200/90 rounded-full focus:ring-1 focus:ring-[#8C5E3C]"
            />
          </form>

          <div className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-3 py-1.5 shadow-2xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#6E472D] to-[#8C5E3C] text-[10px] font-bold text-white">
              {user?.name ? user.name.slice(0, 1).toUpperCase() : "J"}
            </span>
            <span className="text-xs font-bold text-[#2D1E12] hidden sm:inline max-w-28 truncate">
              {user?.name ?? "Dewan Juri"}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARIS 1: METRIK BENTO GRID (3 CARD PUTIH + 1 HERO CARD GELAP VERIFIKASI)  */}
      {/* ========================================================================= */}
      {statsQ.error ? (
        <ErrorState message={statsQ.error} onRetry={statsQ.refetch} />
      ) : loading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-stone-200/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Objek Budaya */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#8C5E3C]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {t("admin.cultural_items", "Objek Budaya")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#8C5E3C] group-hover:scale-105 transition-transform">
                <LayoutGrid className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-serif text-3xl font-extrabold text-[#2D1E12] tracking-tight">
                {displayItemsTotal}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-stone-600 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  {displayItemsPublished} {isEn ? "Published" : "Terpublikasi"}
                </span>
                <span className="text-stone-300">•</span>
                <span>{draftItems} Draft</span>
              </div>
            </div>
          </div>

          {/* Card 2: Kategori & Wilayah */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#8C5E3C]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isEn ? "Categories & Regions" : "Kategori & Wilayah"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#8C5E3C] group-hover:scale-105 transition-transform">
                <Shapes className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-serif text-3xl font-extrabold text-[#2D1E12] tracking-tight">
                {stats.categoriesTotal}{" "}
                <span className="text-xl font-normal text-stone-400">&amp;</span>{" "}
                {stats.regionsTotal}
              </p>
              <p className="mt-1.5 text-xs text-stone-600 font-medium">
                {isEn ? "6 Cultural Domains • 38 Provinces" : "6 Rumpun • 38 Provinsi Terpetakan"}
              </p>
            </div>
          </div>

          {/* Card 3: Total Media Aset */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#8C5E3C]/40 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isEn ? "Total Media Assets" : "Total Media Aset"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#8C5E3C] group-hover:scale-105 transition-transform">
                <Boxes className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-serif text-3xl font-extrabold text-[#2D1E12] tracking-tight">
                {stats.mediaTotal}
              </p>
              <div className="mt-1.5 flex items-center gap-2.5 text-xs text-stone-600 font-medium">
                <span className="inline-flex items-center gap-1 font-semibold text-[#8C5E3C]">
                  <Boxes className="h-3.5 w-3.5" /> {stats.models3dTotal} 3D
                </span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#6E472D]">
                  <AudioLines className="h-3.5 w-3.5" /> {stats.audioTotal} Audio
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: HERO CARD GELAP (#2A1D15) STATUS VERIFIKASI BUDAYA */}
          <div className="bg-[#2A1D15] text-white rounded-2xl p-5 shadow-sm border border-[#3E2C22] flex flex-col justify-between relative overflow-hidden group">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-xl"
            />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  {isEn ? "Verification Status" : "Status Verifikasi Budaya"}
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="mt-2.5 font-serif text-xl font-bold text-[#FCF8EC] leading-tight">
                {curatedPercentage}% {isEn ? "Verified Archive" : "Data Terkurasi"}
              </p>
              {/* Progress Bar */}
              <div className="mt-2.5 h-2 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500"
                  style={{ width: `${curatedPercentage}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-stone-300">
                {displayPending}{" "}
                {isEn ? "pending community submissions" : "kontribusi siap ditinjau"}
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/contributions")}
              className="mt-4 w-full rounded-xl bg-[#FAF5EC] hover:bg-white text-[#2A1D15] text-xs font-bold h-9 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isEn ? "Review Submissions" : "Tinjau Kontribusi"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BARIS 2: SEBARAN KATEGORI (65%) & ANTREAN MODERASI CEPAT (35%)             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri: Sebaran Kategori Budaya (65% / col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2D1E12]">
                {isEn ? "Cultural Category Distribution" : "Sebaran Objek Budaya Per Kategori"}
              </h2>
              <p className="text-xs text-stone-500">
                {isEn
                  ? "Balance of living traditions across 6 cultural domains"
                  : "Proporsi pelestarian 6 rumpun warisan budaya Nusantara"}
              </p>
            </div>
            <span className="text-xs font-bold text-[#8C5E3C] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              116 Objek
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              {
                name: isEn ? "Traditional Architecture & Houses" : "Arsitektur & Rumah Adat",
                count: 38,
                pct: 33,
                color: "bg-[#8C5E3C]",
              },
              {
                name: isEn ? "Traditional Musical Instruments" : "Alat Musik Tradisional",
                count: 38,
                pct: 33,
                color: "bg-[#7A4B29]",
              },
              {
                name: isEn ? "Traditional Attire & Textiles" : "Pakaian Adat & Tekstil Wastra",
                count: 12,
                pct: 10,
                color: "bg-[#A67551]",
              },
              {
                name: isEn ? "Traditional Dances & Performing Arts" : "Seni Tari & Pertunjukan",
                count: 10,
                pct: 9,
                color: "bg-[#B88764]",
              },
              {
                name: isEn ? "Traditional Culinary Heritage" : "Kuliner Khas Nusantara",
                count: 10,
                pct: 9,
                color: "bg-[#C99C79]",
              },
              {
                name: isEn ? "Local Customs & Knowledge" : "Tradisi & Pengetahuan Lokal",
                count: 8,
                pct: 7,
                color: "bg-[#D8B498]",
              },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{cat.name}</span>
                  <span className="font-mono text-stone-600 font-bold">
                    {cat.count}{" "}
                    <span className="text-[10px] text-stone-400 font-normal">({cat.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct * 3}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Antrean Moderasi Cepat (35% / col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2D1E12]">
                {isEn ? "Quick Moderation" : "Antrean Moderasi Cepat"}
              </h2>
              <p className="text-xs text-stone-500">
                {isEn ? "Community submissions awaiting review" : "Pengajuan kurasi masyarakat terkini"}
              </p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
          </div>

          <div className="mt-3.5 space-y-3">
            {pendingContributions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-200 bg-[#FAF8F5] p-6 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600 mb-1.5" />
                <p className="text-xs font-bold text-[#2D1E12]">Semua Kontribusi Terkurasi!</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Tidak ada antrean kurasi baru yang menunggu peninjauan.
                </p>
              </div>
            ) : (
              pendingContributions.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-100 bg-[#FAF8F5] p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8C5E3C]/15 text-[#8C5E3C] font-bold text-xs shrink-0">
                        {item.submitterName ? item.submitterName[0].toUpperCase() : "K"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2D1E12] truncate">{item.title}</p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {item.submitterName} • {item.province}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                      {item.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-200/50">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const reason = window.prompt(
                          `Alasan penolakan kontribusi "${item.title}":`,
                          "Perlu perbaikan kelengkapan sumber referensi & atribusi adat."
                        );
                        if (reason !== null) {
                          rejectContribution(item.id, reason);
                          try {
                            api.admin.contributions.updateStatus(item.id, {
                              status: "REJECTED",
                              note: reason,
                            });
                          } catch {}
                          toast.success(`Kontribusi "${item.title}" berhasil ditolak.`);
                        }
                      }}
                      className="h-6.5 px-2 text-[10px] font-semibold text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        approveContribution(item.id);
                        try {
                          api.admin.contributions.updateStatus(item.id, {
                            status: "APPROVED",
                            publishItemId: true,
                          });
                        } catch {}
                        toast.success(`Kontribusi "${item.title}" berhasil disetujui dan dipublikasikan ke katalog!`);
                      }}
                      className="h-6.5 px-2.5 text-[10px] font-bold text-white bg-[#8C5E3C] hover:bg-[#6E472D] rounded-lg shadow-2xs cursor-pointer"
                    >
                      Setujui
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/admin/contributions")}
            className="mt-4 w-full rounded-xl border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 h-8.5 cursor-pointer"
          >
            {isEn ? "View All Moderation Queue" : "Lihat Seluruh Antrean"}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARIS 3: RIWAYAT AKTIVITAS & AUDIT KURASI (TABEL MINI BERSIH & COMPACT)    */}
      {/* ========================================================================= */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#8C5E3C]" />
            <h2 className="text-sm sm:text-base font-bold text-[#2D1E12]">
              {isEn ? "System Audit & Activity Logs" : "Riwayat Aktivitas & Audit Kurasi"}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {activityQ.data?.length ?? 0} {isEn ? "recent entries" : "aktivitas tercatat"}
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                <th className="pb-2 pl-1">{isEn ? "Time" : "Waktu"}</th>
                <th className="pb-2">{isEn ? "Initiator" : "Pengguna / Inisiator"}</th>
                <th className="pb-2">{isEn ? "Action" : "Aksi"}</th>
                <th className="pb-2">{isEn ? "Target" : "Entitas"}</th>
                <th className="pb-2 pr-1">{isEn ? "Detail" : "Deskripsi"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {activityQ.data && activityQ.data.length > 0 ? (
                activityQ.data.slice(0, 5).map((a) => (
                  <tr key={a.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-2.5 pl-1 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {relTime(a.createdAt)}
                    </td>
                    <td className="py-2.5 font-semibold text-[#2D1E12] whitespace-nowrap">
                      {a.user?.name ?? (isEn ? "System" : "Sistem")}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800">
                        {a.action}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-stone-600 whitespace-nowrap">
                      {a.entityType ?? "CulturalItem"}
                    </td>
                    <td className="py-2.5 pr-1 text-stone-600 max-w-xs truncate">
                      {a.detail ?? a.action}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-stone-400">
                    {isEn ? "No recent activities recorded." : "Belum ada aktivitas tercatat."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
