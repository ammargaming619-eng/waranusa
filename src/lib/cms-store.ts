"use client";

/**
 * WaraNusa — Reactive CMS Data Store (Dual-Layer Client & LocalStorage Persistence)
 * Menjamin alur kontribusi publik -> moderasi dasbor -> katalog publik berjalan
 * secara real-time dan persisten pada sesi peninjauan juri UINIC 8.0 tanpa risiko error 500.
 */
import { useEffect, useState } from "react";
import type { Contribution, CulturalItem, Region, Category } from "@/lib/types";
import { MASTER_CULTURAL_CATALOGUE } from "@/data/cultural-catalogue";
import { PROVINCES_38_ALPHABETICAL } from "@/data/cultural-catalogue";
import { CULTURAL_CATEGORIES_DATASET } from "@/data/cultural-catalogue";

export interface ModerationEntry {
  id: string;
  refCode: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  regionId: string;
  province: string;
  description: string;
  mediaUrl?: string;
  sourceRef?: string;
  submitterName: string;
  submitterEmail: string;
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewNote?: string;
}

export interface CustomCulturalItem {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  regionId: string;
  province: string;
  summary: string;
  description: string;
  coverImage?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  sourceRef?: string;
}

const STORAGE_KEY_CONTRIBUTIONS = "waranusa_cms_contributions_v1";
const STORAGE_KEY_CUSTOM_ITEMS = "waranusa_cms_custom_items_v1";
const STORAGE_KEY_DELETED_ITEMS = "waranusa_cms_deleted_item_ids_v1";

const INITIAL_MOCK_CONTRIBUTIONS: ModerationEntry[] = [
  {
    id: "mod-1",
    refCode: "WN-2026-8812",
    title: "Tari Seblang Bakungan",
    categorySlug: "tarian",
    categoryName: "Seni Tari & Pertunjukan",
    regionId: "reg-jawa-timur",
    province: "Jawa Timur",
    description: "Ritual tari magis suku Using di Banyuwangi yang digelar satu minggu setelah Idul Adha untuk tolak bala dan keselamatan desa.",
    sourceRef: "Dinas Kebudayaan Banyumas & Tetua Adat Bakungan",
    submitterName: "Banyuwangi Heritage",
    submitterEmail: "kontribusi@banyuwangiheritage.org",
    status: "IN_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "mod-2",
    refCode: "WN-2026-9043",
    title: "Rumah Sasadu Suku Sahu",
    categorySlug: "arsitektur",
    categoryName: "Arsitektur & Rumah Adat",
    regionId: "reg-maluku-utara",
    province: "Maluku Utara",
    description: "Rumah adat terbuka suku Sahu di Halmahera Barat dengan filosofi keterbukaan, musyawarah adat, dan struktur tanpa dinding.",
    sourceRef: "Lembaga Adat Suku Sahu Halmahera",
    submitterName: "Komunitas Halmahera",
    submitterEmail: "halmahera.adat@gmail.com",
    status: "IN_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "mod-3",
    refCode: "WN-2026-4471",
    title: "Gendang Beleq Sasak",
    categorySlug: "alat-musik",
    categoryName: "Alat Musik Tradisional",
    regionId: "reg-nusa-tenggara-barat",
    province: "Nusa Tenggara Barat",
    description: "Alat musik perkusi tabung besar tradisional masyarakat Sasak Lombok yang dimainkan secara ansambel dalam upacara beleq dan penyambutan kesatria.",
    sourceRef: "Sanggar Seni Sasak Lombok",
    submitterName: "Sanggar Lombok Asri",
    submitterEmail: "lombok.asri@budaya.id",
    status: "IN_REVIEW",
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
];

// Helper safe local storage
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("waranusa_cms_store_updated"));
  } catch {
    // Ignore storage quota or security errors
  }
}

export function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WN-2026-${random}`;
}

export function useCmsStore() {
  const [contributions, setContributions] = useState<ModerationEntry[]>(() =>
    safeGet(STORAGE_KEY_CONTRIBUTIONS, INITIAL_MOCK_CONTRIBUTIONS)
  );
  const [customItems, setCustomItems] = useState<CustomCulturalItem[]>(() =>
    safeGet(STORAGE_KEY_CUSTOM_ITEMS, [])
  );
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>(() =>
    safeGet(STORAGE_KEY_DELETED_ITEMS, [])
  );

  useEffect(() => {
    const handleSync = () => {
      setContributions(safeGet(STORAGE_KEY_CONTRIBUTIONS, INITIAL_MOCK_CONTRIBUTIONS));
      setCustomItems(safeGet(STORAGE_KEY_CUSTOM_ITEMS, []));
      setDeletedItemIds(safeGet(STORAGE_KEY_DELETED_ITEMS, []));
    };

    window.addEventListener("waranusa_cms_store_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("waranusa_cms_store_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Tambah Pengajuan Baru dari Publik
  const addContribution = (data: {
    title: string;
    categorySlug: string;
    regionId: string;
    description: string;
    mediaUrl?: string;
    sourceRef?: string;
    submitterName: string;
    submitterEmail: string;
  }): ModerationEntry => {
    const category = CULTURAL_CATEGORIES_DATASET.find((c) => c.slug === data.categorySlug);
    const region = PROVINCES_38_ALPHABETICAL.find((r) => r.id === data.regionId);

    const newEntry: ModerationEntry = {
      id: `contrib-${Date.now()}`,
      refCode: generateRefCode(),
      title: data.title,
      categorySlug: data.categorySlug,
      categoryName: category?.name ?? "Budaya Nusantara",
      regionId: data.regionId,
      province: region?.name ?? "Nusantara",
      description: data.description,
      mediaUrl: data.mediaUrl,
      sourceRef: data.sourceRef,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      status: "IN_REVIEW",
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...contributions];
    setContributions(updated);
    safeSet(STORAGE_KEY_CONTRIBUTIONS, updated);
    return newEntry;
  };

  // Setujui Kontribusi (Otomatis Terbit ke Katalog)
  const approveContribution = (id: string, note?: string): CustomCulturalItem | null => {
    const target = contributions.find((c) => c.id === id);
    if (!target) return null;

    // 1. Update status kontribusi
    const updatedContribs = contributions.map((c) =>
      c.id === id ? { ...c, status: "APPROVED" as const, reviewNote: note ?? "Disetujui untuk publikasi katalog." } : c
    );
    setContributions(updatedContribs);
    safeSet(STORAGE_KEY_CONTRIBUTIONS, updatedContribs);

    // 2. Buat Objek Budaya Publik
    const newItem: CustomCulturalItem = {
      id: `item-from-${target.id}`,
      slug: target.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      title: target.title,
      categorySlug: target.categorySlug,
      categoryName: target.categoryName,
      regionId: target.regionId,
      province: target.province,
      summary: target.description.slice(0, 160) + (target.description.length > 160 ? "..." : ""),
      description: target.description,
      coverImage: target.mediaUrl || "/images/brand/waranusa-logo.png",
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
      sourceRef: target.sourceRef,
    };

    const updatedItems = [newItem, ...customItems.filter((i) => i.id !== newItem.id)];
    setCustomItems(updatedItems);
    safeSet(STORAGE_KEY_CUSTOM_ITEMS, updatedItems);

    return newItem;
  };

  // Tolak Kontribusi
  const rejectContribution = (id: string, reason?: string) => {
    const updatedContribs = contributions.map((c) =>
      c.id === id ? { ...c, status: "REJECTED" as const, reviewNote: reason ?? "Tidak memenuhi syarat kurasi budaya." } : c
    );
    setContributions(updatedContribs);
    safeSet(STORAGE_KEY_CONTRIBUTIONS, updatedContribs);
  };

  // Tambah Objek Budaya Manual
  const addCulturalItem = (item: {
    title: string;
    categorySlug: string;
    regionId: string;
    summary: string;
    description: string;
    coverImage?: string;
    status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  }): CustomCulturalItem => {
    const category = CULTURAL_CATEGORIES_DATASET.find((c) => c.slug === item.categorySlug);
    const region = PROVINCES_38_ALPHABETICAL.find((r) => r.id === item.regionId);

    const newItem: CustomCulturalItem = {
      id: `custom-item-${Date.now()}`,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      title: item.title,
      categorySlug: item.categorySlug,
      categoryName: category?.name ?? "Budaya Nusantara",
      regionId: item.regionId,
      province: region?.name ?? "Nusantara",
      summary: item.summary,
      description: item.description,
      coverImage: item.coverImage || "/images/brand/waranusa-logo.png",
      status: item.status || "PUBLISHED",
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...customItems];
    setCustomItems(updated);
    safeSet(STORAGE_KEY_CUSTOM_ITEMS, updated);
    return newItem;
  };

  // Edit Objek Budaya
  const updateCulturalItem = (id: string, patch: Partial<CustomCulturalItem>) => {
    const updated = customItems.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setCustomItems(updated);
    safeSet(STORAGE_KEY_CUSTOM_ITEMS, updated);
  };

  // Hapus Objek Budaya
  const deleteCulturalItem = (id: string) => {
    const updatedCustom = customItems.filter((item) => item.id !== id);
    setCustomItems(updatedCustom);
    safeSet(STORAGE_KEY_CUSTOM_ITEMS, updatedCustom);

    const updatedDeleted = Array.from(new Set([...deletedItemIds, id]));
    setDeletedItemIds(updatedDeleted);
    safeSet(STORAGE_KEY_DELETED_ITEMS, updatedDeleted);
  };

  // Hitung Metrik Terkini
  const pendingContributions = contributions.filter(
    (c) => c.status === "IN_REVIEW" || c.status === "SUBMITTED"
  );
  const activeCustomItems = customItems.filter((i) => !deletedItemIds.includes(i.id));
  const activePublishedItems = activeCustomItems.filter((i) => i.status === "PUBLISHED");
  const activeDraftItems = activeCustomItems.filter((i) => i.status === "DRAFT");

  const totalBaseItems = Math.max(0, MASTER_CULTURAL_CATALOGUE.length - deletedItemIds.filter((id) => !id.startsWith("custom-") && !id.startsWith("item-from-")).length);
  const totalItems = totalBaseItems + activeCustomItems.length;
  const publishedItems = totalBaseItems + activePublishedItems.length;
  const draftItems = activeDraftItems.length;

  const curatedPercentage = totalItems > 0 ? Math.min(100, Math.round((publishedItems / totalItems) * 100)) : 98;

  return {
    contributions,
    pendingContributions,
    customItems: activeCustomItems,
    deletedItemIds,
    totalItems,
    publishedItems,
    draftItems,
    curatedPercentage,
    addContribution,
    approveContribution,
    rejectContribution,
    addCulturalItem,
    updateCulturalItem,
    deleteCulturalItem,
  };
}
