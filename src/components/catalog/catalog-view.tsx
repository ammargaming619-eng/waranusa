"use client";

/**
 * WaraNusa — CatalogView (#/katalog)
 * Toolbar filter (search debounce 350ms, kategori, wilayah, urutan) dengan state
 * yang sepenuhnya disinkronkan ke query URL: ?q=&kategori=&wilayah=&sort=&page=
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FilterX, SearchX, SlidersHorizontal } from "lucide-react";
import type { Route } from "@/lib/router";
import { buildQuery, navigate } from "@/lib/router";
import { api } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, SectionHeading } from "@/components/shared/states";
import { CultureCard } from "@/components/catalog/culture-card";
import { useTranslation } from "@/lib/i18n-store";
import { useCmsStore } from "@/lib/cms-store";
import {
  CULTURAL_CATEGORIES_DATASET,
  PROVINCES_38_ALPHABETICAL,
  queryCatalogue,
} from "@/data/cultural-catalogue";

const PAGE_SIZE = 12;
const SORTS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "popular", label: "Terpopuler" },
  { value: "title", label: "Judul A–Z" },
] as const;
type SortKey = (typeof SORTS)[number]["value"];

interface CatalogState {
  q: string;
  kategori: string;
  wilayah: string;
  sort: SortKey;
  page: number;
}

function readRoute(route: Route): CatalogState {
  const sort = SORTS.some((s) => s.value === route.query.sort)
    ? (route.query.sort as SortKey)
    : "newest";
  return {
    q: route.query.q ?? "",
    kategori: route.query.kategori ?? "",
    wilayah: route.query.wilayah ?? "",
    sort,
    page: Math.max(1, Number(route.query.page) || 1),
  };
}

function readQueryParams(): CatalogState {
  if (typeof window === "undefined") {
    return { q: "", kategori: "", wilayah: "", sort: "newest", page: 1 };
  }
  try {
    const sp = new URLSearchParams(window.location.search);
    const sortParam = sp.get("sort");
    const sort = SORTS.some((s) => s.value === sortParam) ? (sortParam as SortKey) : "newest";
    return {
      q: sp.get("q") ?? sp.get("search") ?? "",
      kategori: sp.get("kategori") ?? sp.get("category") ?? "",
      wilayah: sp.get("wilayah") ?? sp.get("region") ?? "",
      sort,
      page: Math.max(1, Number(sp.get("page")) || 1),
    };
  } catch {
    return { q: "", kategori: "", wilayah: "", sort: "newest", page: 1 };
  }
}

export default function CatalogView({ route }: { route?: Route } = {}) {
  const router = useRouter();
  const { language, t } = useTranslation();
  const { customItems, deletedItemIds } = useCmsStore();
  const [clientParams, setClientParams] = useState<CatalogState>(() =>
    route ? readRoute(route) : readQueryParams()
  );

  useEffect(() => {
    if (!route) {
      setClientParams(readQueryParams());
    }
  }, [route]);

  const state = route ? readRoute(route) : clientParams;

  // ---- Filter data referensi ----
  const categoriesQ = useAsyncData(() => api.categories.list(), []);
  const regionsQ = useAsyncData(() => api.regions.list(), []);

  // Data kategori: prioritaskan dari API bila lengkap, fallback ke 6 kategori master
  const categories = useMemo(() => {
    if (categoriesQ.data && categoriesQ.data.length >= 6) {
      return categoriesQ.data;
    }
    return CULTURAL_CATEGORIES_DATASET;
  }, [categoriesQ.data]);

  // Data wilayah: pastikan seluruh 38 provinsi terdaftar urut alfabetis
  const regions = useMemo(() => {
    const list =
      regionsQ.data && regionsQ.data.length >= 38
        ? regionsQ.data
        : PROVINCES_38_ALPHABETICAL;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "id"));
  }, [regionsQ.data]);

  // ---- Daftar objek ----
  const itemsQ = useAsyncData(
    () =>
      api.items.list({
        search: state.q || undefined,
        categorySlug: state.kategori || undefined,
        regionCode: state.wilayah || undefined,
        sort: state.sort,
        page: state.page,
        pageSize: PAGE_SIZE,
      }),
    [state.q, state.kategori, state.wilayah, state.sort, state.page]
  );

  // Fallback data mandiri dari katalog master 116 objek budaya
  const fallbackData = useMemo(() => {
    return queryCatalogue({
      search: state.q,
      categorySlug: state.kategori,
      regionCode: state.wilayah,
      sort: state.sort,
      page: state.page,
      pageSize: PAGE_SIZE,
    });
  }, [state.q, state.kategori, state.wilayah, state.sort, state.page]);

  // Objek budaya kustom dari CMS yang berstatus PUBLISHED dan cocok dengan filter
  const publishedCustomItems = useMemo(() => {
    return customItems
      .filter((c) => c.status === "PUBLISHED" && !deletedItemIds.includes(c.id))
      .filter((c) => {
        if (state.q) {
          const qLower = state.q.toLowerCase();
          const matchTitle = c.title.toLowerCase().includes(qLower);
          const matchSum = c.summary.toLowerCase().includes(qLower);
          const matchProv = c.province.toLowerCase().includes(qLower);
          if (!matchTitle && !matchSum && !matchProv) return false;
        }
        if (state.kategori && c.categorySlug !== state.kategori) return false;
        if (state.wilayah && c.regionId !== state.wilayah) return false;
        return true;
      })
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        description: c.description,
        status: "PUBLISHED" as const,
        featured: false,
        viewCount: 1,
        categoryId: c.categorySlug,
        category: {
          id: c.categorySlug,
          name: c.categoryName,
          slug: c.categorySlug,
          color: "#8C5E3C",
          sortOrder: 1,
        },
        regionId: c.regionId,
        region: {
          id: c.regionId,
          code: "ID-PROV",
          name: c.province,
          islandGroup: "NUSANTARA",
          capital: c.province,
          summary: c.province,
          lat: 0,
          lng: 0,
        },
        coverMedia: c.coverImage
          ? {
              id: `media-${c.id}`,
              title: c.title,
              url: c.coverImage,
              type: "IMAGE" as any,
              mimeType: "image/jpeg",
              sizeBytes: 1024,
            }
          : null,
        createdAt: c.createdAt,
        updatedAt: c.createdAt,
      }));
  }, [customItems, deletedItemIds, state.q, state.kategori, state.wilayah]);

  // Objek budaya yang aktif ditampilkan (kustom diprioritaskan di atas)
  const currentItems = useMemo(() => {
    const base = itemsQ.data && itemsQ.data.length > 0 ? itemsQ.data : fallbackData.items;
    const filteredBase = base.filter((i) => !deletedItemIds.includes(i.id));
    return [...publishedCustomItems, ...filteredBase];
  }, [itemsQ.data, fallbackData.items, deletedItemIds, publishedCustomItems]);

  const activeMeta = useMemo(() => {
    const baseMeta = itemsQ.meta?.total ? itemsQ.meta : fallbackData.meta;
    return {
      ...baseMeta,
      total: baseMeta.total + publishedCustomItems.length,
    };
  }, [itemsQ.meta, fallbackData.meta, publishedCustomItems.length]);

  // ---- Pembaruan URL (replace agar riwayat tidak menumpuk) ----
  const updateQuery = useCallback(
    (patch: Partial<CatalogState>) => {
      const next = { ...state, ...patch };
      const sp = new URLSearchParams();
      if (next.q) sp.set("q", next.q);
      if (next.kategori) sp.set("kategori", next.kategori);
      if (next.wilayah) sp.set("wilayah", next.wilayah);
      if (next.sort !== "newest") sp.set("sort", next.sort);
      if (next.page > 1) sp.set("page", String(next.page));
      const qs = sp.toString();
      const targetUrl = qs ? `/catalog?${qs}` : "/catalog";
      if (route) {
        navigate(buildQuery("katalog", {
          q: next.q || undefined,
          kategori: next.kategori || undefined,
          wilayah: next.wilayah || undefined,
          sort: next.sort !== "newest" ? next.sort : undefined,
          page: next.page > 1 ? String(next.page) : undefined,
        }), { replace: true });
      } else {
        setClientParams(next);
        router.replace(targetUrl);
      }
    },
    [state, route, router]
  );

  // ---- Search input dengan debounce 350ms ----
  const [searchInput, setSearchInput] = useState(state.q);
  useEffect(() => {
    const t = setTimeout(() => setSearchInput(state.q), 0);
    return () => clearTimeout(t);
  }, [state.q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.trim() !== state.q) {
        updateQuery({ q: searchInput.trim() || "", page: 1 });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, state.q, updateQuery]);

  const hasActiveFilter =
    !!state.q || !!state.kategori || !!state.wilayah || state.sort !== "newest";

  const resetFilter = () => {
    setSearchInput("");
    if (route) {
      navigate(buildQuery("katalog", {}), { replace: true });
    } else {
      setClientParams({ q: "", kategori: "", wilayah: "", sort: "newest", page: 1 });
      router.replace("/catalog");
    }
  };

  // ---- Info rentang tampil ----
  const rangeInfo = useMemo(() => {
    if (!activeMeta || activeMeta.total === 0) return null;
    const start = (activeMeta.page - 1) * activeMeta.pageSize + 1;
    const end = Math.min(activeMeta.page * activeMeta.pageSize, activeMeta.total);
    return language === "EN"
      ? `Showing ${start}–${end} of ${activeMeta.total} cultural records`
      : `Menampilkan ${start}–${end} dari ${activeMeta.total} objek budaya`;
  }, [activeMeta, language]);

  const totalPages = activeMeta?.totalPages ?? 1;
  const currentPage = activeMeta?.page ?? state.page;

  const goToPage = (p: number) => {
    updateQuery({ page: Math.min(Math.max(1, p), totalPages) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Nomor halaman ringkas dengan elipsis */
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const push = (p: number | "ellipsis") => {
      if (!pages.includes(p)) pages.push(p);
    };
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
      return pages;
    }
    push(1);
    if (currentPage > 3) push("ellipsis");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) push(i);
    if (currentPage < totalPages - 2) push("ellipsis");
    push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const sortOptions = useMemo(() => [
    { value: "newest", label: language === "EN" ? "Newest" : "Terbaru" },
    { value: "oldest", label: language === "EN" ? "Oldest" : "Terlama" },
    { value: "popular", label: language === "EN" ? "Most Popular" : "Terpopuler" },
    { value: "title", label: language === "EN" ? "Title A–Z" : "Judul A–Z" },
  ], [language]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeading
          eyebrow={language === "EN" ? "Catalog" : "Katalog"}
          title={t("catalog.header_title", "Objek Budaya Nusantara")}
          description={t("catalog.header_sub", "Telusuri dokumentasi budaya berdasarkan kata kunci, kategori, dan wilayah asal.")}
        />
      </motion.div>

      {/* ============ TOOLBAR ============ */}
      <div className="sticky top-16 z-30 mt-6 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 lg:col-start-1">
            <Label htmlFor="katalog-search" className="sr-only">
              {language === "EN" ? "Search cultural objects" : "Cari objek budaya"}
            </Label>
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="katalog-search"
                type="search"
                placeholder={t("catalog.search_placeholder", "Cari objek budaya, tradisi, arsitektur...")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="min-h-[44px] pl-9"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-kategori" className="sr-only">
              {language === "EN" ? "Filter category" : "Filter kategori"}
            </Label>
            <Select
              value={state.kategori || "all"}
              onValueChange={(v) => updateQuery({ kategori: v === "all" ? "" : v, page: 1 })}
            >
              <SelectTrigger id="filter-kategori" className="min-h-[44px] w-full" aria-label="Filter kategori">
                <SelectValue placeholder={t("catalog.all_categories", "Semua Kategori")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("catalog.all_categories", "Semua Kategori")}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wilayah */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-wilayah" className="sr-only">
              {language === "EN" ? "Filter region" : "Filter wilayah"}
            </Label>
            <Select
              value={state.wilayah || "all"}
              onValueChange={(v) => updateQuery({ wilayah: v === "all" ? "" : v, page: 1 })}
            >
              <SelectTrigger id="filter-wilayah" className="min-h-[44px] w-full" aria-label="Filter wilayah">
                <SelectValue placeholder={t("catalog.all_regions", "Semua Wilayah (38)")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("catalog.all_regions", "Semua Wilayah (38)")}</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.id} value={r.code}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urutan */}
          <div className="space-y-1.5">
            <Label htmlFor="filter-sort" className="sr-only">
              {t("catalog.sort_label", "Urutkan")}
            </Label>
            <Select value={state.sort} onValueChange={(v) => updateQuery({ sort: v as SortKey, page: 1 })}>
              <SelectTrigger id="filter-sort" className="min-h-[44px] w-full" aria-label="Urutkan hasil">
                <SelectValue placeholder={t("catalog.sort_label", "Urutan")} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Info rentang + reset */}
      {(rangeInfo || hasActiveFilter) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p aria-live="polite">{rangeInfo ?? (language === "EN" ? "Filtering records…" : "Memfilter hasil…")}</p>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilter}
              className="min-h-[44px] rounded-full text-[#7A4B29] hover:bg-[#7A4B29]/10 hover:text-[#52331C]"
            >
              <FilterX className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {t("catalog.reset_filters", "Reset Filter")}
            </Button>
          )}
        </div>
      )}

      {/* ============ GRID HASIL ============ */}
      <div className="mt-6" aria-live="polite">
        {itemsQ.loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white shadow-sm">
                <Skeleton className="aspect-[16/10] rounded-none bg-stone-100" />
                <div className="space-y-2.5 p-4 sm:p-5">
                  <Skeleton className="h-5 w-3/4 bg-stone-200" />
                  <Skeleton className="h-4 w-full bg-stone-100" />
                  <Skeleton className="h-4 w-1/2 bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : itemsQ.error && currentItems.length === 0 ? (
          <ErrorState title="Katalog tidak dapat dimuat" message={itemsQ.error} onRetry={itemsQ.reload} />
        ) : currentItems.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t("catalog.empty_title", "Tidak ada objek budaya yang cocok")}
            message={t("catalog.empty_sub", "Coba ubah kata kunci atau longgarkan filter kategori/wilayah.")}
            action={
              hasActiveFilter && (
                <Button onClick={resetFilter} className="min-h-[44px] rounded-full btn-waranusa font-bold text-white">
                  <FilterX className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {t("catalog.reset_filters", "Reset semua filter")}
                </Button>
              )
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <CultureCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* ============ PAGINATION ============ */}
      {!itemsQ.loading && !itemsQ.error && totalPages > 1 && (
        <div className="mt-10 space-y-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-label={language === "EN" ? "Previous page" : "Halaman sebelumnya"}
                  className={cnPaginationDisabled(currentPage <= 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`e-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      aria-label={language === "EN" ? `Go to page ${p}` : `Ke halaman ${p}`}
                      className={
                        p === currentPage
                          ? "min-h-[40px] min-w-[40px] rounded-full border-[#482B18] bg-[#482B18] font-bold text-white hover:bg-[#382112] hover:text-white shadow-xs"
                          : "min-h-[40px] min-w-[40px] rounded-full text-stone-700 hover:bg-stone-100"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        if (p !== currentPage) goToPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-label={language === "EN" ? "Next page" : "Halaman berikutnya"}
                  className={cnPaginationDisabled(currentPage >= totalPages)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-center text-xs text-muted-foreground">
            {language === "EN" ? `Page ${currentPage} of ${totalPages}` : `Halaman ${currentPage} dari ${totalPages}`}
          </p>
        </div>
      )}
    </div>
  );
}

function cnPaginationDisabled(disabled: boolean): string {
  return disabled ? "pointer-events-none opacity-40" : "";
}
