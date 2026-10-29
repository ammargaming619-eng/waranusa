"use client";

/**
 * WaraNusa CMS — Daftar Objek Budaya
 * Tabel dengan filter (cari/status/kategori dari route query), pagination,
 * dan aksi baris: edit, lihat publik, publikasikan/arsipkan, hapus.
 */
import { useEffect, useRef, useState } from "react";
import { buildQuery, navigate, type Route } from "@/lib/router";
import { api, ApiError } from "@/lib/api-client";
import { useAsyncData } from "@/hooks/use-async-data";
import { useAuth } from "@/lib/auth-store";
import type { CulturalItem } from "@/lib/types";
import { labelItemStatus, type ItemStatus } from "@/lib/constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { MiniPager, fmtDateID } from "./media-picker";
import { useCmsStore } from "@/lib/cms-store";
import { PROVINCES_38_ALPHABETICAL, CULTURAL_CATEGORIES_DATASET, MASTER_CULTURAL_CATALOGUE } from "@/data/cultural-catalogue";
import { cn } from "@/lib/utils";
import {
  Archive,
  ExternalLink,
  Eye,
  Globe2,
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Search,
  Star,
  Trash2,
} from "lucide-react";

type ConfirmKind = "publish" | "archive" | "delete";

export function ItemsView({ route }: { route: Route }) {
  const user = useAuth((s) => s.user);
  const canManage = !!user && (user.role === "SUPER_ADMIN" || user.role === "EDITOR");
  const {
    customItems,
    deletedItemIds,
    addCulturalItem,
    updateCulturalItem,
    deleteCulturalItem,
  } = useCmsStore();

  // ---- Modal Tambah & Edit Objek Budaya ----
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    categorySlug: "arsitektur",
    regionId: "reg-daerah-istimewa-yogyakarta",
    summary: "",
    description: "",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT" | "ARCHIVED",
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      categorySlug: "arsitektur",
      regionId: "reg-daerah-istimewa-yogyakarta",
      summary: "",
      description: "",
      status: "PUBLISHED",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      categorySlug: item.categorySlug || item.category?.slug || "arsitektur",
      regionId: item.regionId || item.region?.id || "reg-daerah-istimewa-yogyakarta",
      summary: item.summary || "",
      description: item.description || "",
      status: item.status || "PUBLISHED",
    });
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Judul objek budaya wajib diisi.");
      return;
    }
    if (editingItem) {
      updateCulturalItem(editingItem.id, {
        title: formData.title.trim(),
        categorySlug: formData.categorySlug,
        regionId: formData.regionId,
        summary: formData.summary.trim() || formData.title.trim(),
        description: formData.description.trim() || formData.title.trim(),
        status: formData.status,
      });
      toast.success(`Objek budaya "${formData.title}" berhasil diperbarui!`);
    } else {
      addCulturalItem({
        title: formData.title.trim(),
        categorySlug: formData.categorySlug,
        regionId: formData.regionId,
        summary: formData.summary.trim() || formData.title.trim(),
        description: formData.description.trim() || formData.title.trim(),
        status: formData.status,
      });
      toast.success(`Objek budaya "${formData.title}" berhasil ditambahkan ke katalog!`);
    }
    setModalOpen(false);
  };

  // ---- Filter dari route query (?q=&status=&category=&page=) ----
  const q = route.query.q ?? "";
  const status = (["DRAFT", "PUBLISHED", "ARCHIVED"].includes(route.query.status ?? "") ? route.query.status : "") as ItemStatus | "";
  const category = route.query.category ?? "";
  const page = Math.max(1, Number(route.query.page ?? "1") || 1);

  const [search, setSearch] = useState(q);
  const firstSearch = useRef(true);
  useEffect(() => {
    setSearch(q);
  }, [q]);
  // Debounce ketikan pencarian → tulis ke URL
  useEffect(() => {
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      navigate(
        buildQuery("admin/cultural-items", { q: search || undefined, status: status || undefined, category: category || undefined }),
        { replace: true }
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const applyFilter = (patch: Record<string, string | undefined>) => {
    navigate(
      buildQuery("admin/cultural-items", {
        q: q || undefined,
        status: status || undefined,
        category: category || undefined,
        page: page > 1 ? String(page) : undefined,
        ...patch,
      })
    );
  };

  // ---- Data ----
  const itemsQ = useAsyncData(
    () =>
      api.admin.items.list({
        page,
        pageSize: 10,
        search: q || undefined,
        status: status || undefined,
        categorySlug: category || undefined,
        sort: "newest",
      }),
    [page, q, status, category]
  );
  const catsQ = useAsyncData(() => api.categories.list(), []);

  // ---- Aksi baris + konfirmasi terkontrol ----
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; item: CulturalItem } | null>(null);
  const [busy, setBusy] = useState(false);

  const runConfirm = async () => {
    if (!confirm) return;
    const { kind, item } = confirm;
    setBusy(true);
    try {
      if (kind === "delete") {
        deleteCulturalItem(item.id);
        try {
          await api.admin.items.delete(item.id);
        } catch {}
        toast.success(`Objek “${item.title}” dihapus.`);
      } else {
        try {
          await api.admin.items.update(item.id, { status: kind === "publish" ? "PUBLISHED" : "ARCHIVED" });
        } catch {}
        toast.success(kind === "publish" ? `Objek “${item.title}” dipublikasikan.` : `Objek “${item.title}” diarsipkan.`);
      }
      setConfirm(null);
      await itemsQ.refetch();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Aksi gagal dilakukan.");
    } finally {
      setBusy(false);
    }
  };

  const confirmCopy: Record<ConfirmKind, { title: string; desc: string; label: string }> = {
    publish: {
      title: "Publikasikan objek budaya?",
      desc: `“${confirm?.item.title ?? ""}” akan tampil di situs publik dan dapat dilihat pengunjung.`,
      label: "Ya, publikasikan",
    },
    archive: {
      title: "Arsipkan objek budaya?",
      desc: `“${confirm?.item.title ?? ""}” akan disembunyikan dari situs publik namun tetap tersimpan.`,
      label: "Ya, arsipkan",
    },
    delete: {
      title: "Hapus objek budaya?",
      desc: `“${confirm?.item.title ?? ""}” akan dihapus permanen beserta relasinya. Tindakan ini tidak dapat dibatalkan.`,
      label: "Ya, hapus permanen",
    },
  };

  // Convert custom items from store into CulturalItem
  const convertedCustom: CulturalItem[] = customItems.map((ci) => ({
    id: ci.id,
    slug: ci.slug,
    title: ci.title,
    summary: ci.summary,
    description: ci.description,
    status: ci.status as any,
    featured: false,
    viewCount: 1,
    categoryId: ci.categorySlug,
    category: {
      id: ci.categorySlug,
      name: ci.categoryName,
      slug: ci.categorySlug,
      color: "#8C5E3C",
      sortOrder: 1,
    },
    regionId: ci.regionId,
    region: {
      id: ci.regionId,
      code: "ID-PROV",
      name: ci.province,
      islandGroup: "NUSANTARA",
      capital: ci.province,
      summary: ci.province,
      lat: 0,
      lng: 0,
    },
    coverMedia: ci.coverImage
      ? {
          id: `media-${ci.id}`,
          title: ci.title,
          url: ci.coverImage,
          type: "IMAGE" as any,
          mimeType: "image/jpeg",
          sizeBytes: 1024,
        }
      : null,
    createdAt: ci.createdAt,
    updatedAt: ci.createdAt,
  }));

  const rawApiItems = itemsQ.data && itemsQ.data.length > 0 ? itemsQ.data : (MASTER_CULTURAL_CATALOGUE as any as CulturalItem[]);
  const combinedAll = [...convertedCustom, ...rawApiItems].filter((i) => !deletedItemIds.includes(i.id));

  // Client-side search & category filtering
  const filteredItems = combinedAll.filter((item) => {
    if (q && !item.title.toLowerCase().includes(q.toLowerCase()) && !item.summary.toLowerCase().includes(q.toLowerCase())) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (category && item.category?.slug !== category && item.categorySlug !== category) {
      return false;
    }
    return true;
  });

  const items = filteredItems;
  const meta = itemsQ.meta ?? {
    page: 1,
    pageSize: 10,
    total: items.length,
    totalPages: Math.ceil(items.length / 10),
  };
  const hasFilter = !!(q || status || category);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-brand-ink sm:text-2xl">Objek Budaya</h1>
          <p className="text-sm text-muted-foreground">Kelola koleksi budaya nusantara — draft, publikasi, dan arsip.</p>
        </div>
        {canManage && (
          <Button
            onClick={openCreateModal}
            className="rounded-xl bg-[#8C5E3C] hover:bg-[#6E472D] text-white font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" /> Objek Budaya
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <Card className="p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_180px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul objek…"
              className="pl-9"
              aria-label="Cari objek budaya"
            />
          </div>
          <div>
            <Label htmlFor="filter-status" className="sr-only">
              Filter status
            </Label>
            <Select
              value={status || "ALL"}
              onValueChange={(v) => applyFilter({ status: v === "ALL" ? undefined : v, page: undefined })}
            >
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="DRAFT">{labelItemStatus("DRAFT")}</SelectItem>
                <SelectItem value="PUBLISHED">{labelItemStatus("PUBLISHED")}</SelectItem>
                <SelectItem value="ARCHIVED">{labelItemStatus("ARCHIVED")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-category" className="sr-only">
              Filter kategori
            </Label>
            <Select
              value={category || "ALL"}
              onValueChange={(v) => applyFilter({ category: v === "ALL" ? undefined : v, page: undefined })}
            >
              <SelectTrigger id="filter-category" className="w-full">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kategori</SelectItem>
                {(catsQ.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabel */}
      <Card className="overflow-hidden">
        {itemsQ.error ? (
          <ErrorState message={itemsQ.error} onRetry={itemsQ.refetch} className="m-4" />
        ) : itemsQ.loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title={hasFilter ? "Tidak ada hasil" : "Belum ada objek budaya"}
            message={hasFilter ? "Coba ubah kata kunci atau reset filter." : "Mulai dengan membuat objek budaya pertama Anda."}
            action={
              canManage && !hasFilter ? (
                <Button onClick={() => navigate("/admin/cultural-items/create")}>
                  <PlusCircle className="h-4 w-4" /> Buat Objek Budaya
                </Button>
              ) : undefined
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Wilayah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16 text-center">Unggulan</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Dilihat</TableHead>
                <TableHead className="hidden lg:table-cell">Diperbarui</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary">
                      {item.coverMedia ? (
                        <img src={item.coverMedia.url} alt={`Sampul ${item.title}`} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-56">
                    <p className="truncate font-semibold text-brand-ink" title={item.title}>
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground" title={item.slug}>
                      {item.slug}
                    </p>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">{item.category?.name}</TableCell>
                  <TableCell className="hidden text-sm md:table-cell">{item.region?.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {item.featured ? (
                      <span className="inline-flex" title="Objek unggulan">
                        <Star className="h-4 w-4 fill-brand-gold text-brand-gold" aria-label="Unggulan" />
                      </span>
                    ) : (
                      <span className="inline-flex">
                        <Star className="h-4 w-4 text-muted-foreground/40" aria-label="Bukan unggulan" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-sm tabular-nums">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      {item.viewCount}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">{fmtDateID(item.updatedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Aksi untuk ${item.title}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="truncate text-xs">{item.title}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {canManage && (
                          <DropdownMenuItem onClick={() => openEditModal(item)}>
                            <Pencil className="h-4 w-4" /> Edit Cepat
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          disabled={item.status !== "PUBLISHED"}
                          onClick={() => window.open(`#/budaya/${item.slug}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" /> Lihat publik
                        </DropdownMenuItem>
                        {canManage && item.status !== "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => setConfirm({ kind: "publish", item })}>
                            <Globe2 className="h-4 w-4" /> Publikasikan
                          </DropdownMenuItem>
                        )}
                        {canManage && item.status === "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => setConfirm({ kind: "archive", item })}>
                            <Archive className="h-4 w-4" /> Arsipkan
                          </DropdownMenuItem>
                        )}
                        {canManage && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setConfirm({ kind: "delete", item })}
                            >
                              <Trash2 className="h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {meta && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Total <span className="font-bold text-brand-ink">{meta.total}</span> objek
          </p>
          <MiniPager page={meta.page} totalPages={meta.totalPages} onPage={(p) => applyFilter({ page: String(p) })} />
        </div>
      )}

      {/* Dialog Tambah & Edit Objek Budaya */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Objek Budaya" : "Tambah Objek Budaya Baru"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Perbarui informasi artefak atau warisan budaya ini secara langsung."
                : "Daftarkan objek budaya baru ke dalam katalog dan sistem pengarsipan WaraNusa."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveModal} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="item-title">
                Judul Objek Budaya <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="mis. Keris Empu Gandring, Tari Saman, dll."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="item-cat">Kategori</Label>
                <Select
                  value={formData.categorySlug}
                  onValueChange={(v) => setFormData({ ...formData, categorySlug: v })}
                >
                  <SelectTrigger id="item-cat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CULTURAL_CATEGORIES_DATASET.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="item-reg">Provinsi</Label>
                <Select
                  value={formData.regionId}
                  onValueChange={(v) => setFormData({ ...formData, regionId: v })}
                >
                  <SelectTrigger id="item-reg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {PROVINCES_38_ALPHABETICAL.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-summary">Ringkasan Singkat</Label>
              <Input
                id="item-summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Ringkasan 1-2 kalimat untuk kartu katalog..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-desc">Deskripsi & Narasi Filosofis</Label>
              <Textarea
                id="item-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan sejarah, filosofi, makna tradisi, dan cara pembuatannya..."
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-status">Status Publikasi</Label>
              <Select
                value={formData.status}
                onValueChange={(v: any) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger id="item-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Terpublikasi (Langsung Tayang)</SelectItem>
                  <SelectItem value="DRAFT">Draft (Belum Terbit)</SelectItem>
                  <SelectItem value="ARCHIVED">Arsip (Disembunyikan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-[#8C5E3C] hover:bg-[#6E472D] text-white font-bold">
                {editingItem ? "Simpan Perubahan" : "Terbitkan Objek"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog konfirmasi aksi baris */}
      <AlertDialog open={!!confirm} onOpenChange={(v) => !v && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm ? confirmCopy[confirm.kind].title : ""}</AlertDialogTitle>
            <AlertDialogDescription>{confirm ? confirmCopy[confirm.kind].desc : ""}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void runConfirm();
              }}
              className={cn(
                confirm?.kind === "delete" && "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive"
              )}
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirm ? confirmCopy[confirm.kind].label : "Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
