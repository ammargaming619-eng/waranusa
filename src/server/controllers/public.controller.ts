/**
 * WaraNusa — Controller endpoint publik
 * regions, categories, cultural-items, sources, settings
 */
import type { Prisma, MediaAsset } from "@prisma/client";
import { db } from "@/lib/db";
import { ok, notFound, handleApiError, paginateMeta } from "@/lib/api-response";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, SOURCE_TYPES, type SourceType } from "@/lib/constants";
import {
  serializeCategory,
  serializeRegion,
  serializeItem,
  serializeSource,
  serializeMediaAsset,
  itemLiteInclude,
  itemFullInclude,
} from "@/server/serializers";
import { parsePagination } from "@/server/services/http";
import { buildItemWhere, itemOrderBy, parseItemSort } from "@/server/services/item-query";
import { mediaUsageMap } from "@/server/services/media-usage";
import {
  CULTURAL_CATEGORIES_DATASET,
  PROVINCES_38_ALPHABETICAL,
  MASTER_CULTURAL_CATALOGUE,
  queryCatalogue,
} from "@/data/cultural-catalogue";

const SETTING_PUBLIC_KEYS = ["siteName", "tagline", "aboutShort", "contactEmail", "footerNote", "contributionNotice"];

/** Cari item PUBLISHED berdasarkan slug ATAU id */
function findPublishedItem(idOrSlug: string) {
  return db.culturalItem.findFirst({
    where: { OR: [{ slug: idOrSlug }, { id: idOrSlug }], status: "PUBLISHED" },
  });
}

/** GET /api/regions — memastikan seluruh 38 provinsi terdaftar lengkap */
export async function listRegions(): Promise<Response> {
  try {
    const regions = await db.region.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { culturalItems: { where: { status: "PUBLISHED" } } } } },
    });
    if (regions.length >= 38) {
      return ok(regions.map((r) => serializeRegion(r, r._count.culturalItems)));
    }
  } catch (e) {
    console.error("[listRegions error]", e);
  }

  // Fallback ke dataset master 38 provinsi dengan perhitungan jumlah item akurat
  const fallbackRegions = PROVINCES_38_ALPHABETICAL.map((r) => {
    const count = MASTER_CULTURAL_CATALOGUE.filter((it) => it.region?.code === r.code).length;
    return {
      id: r.id,
      code: r.code,
      name: r.name,
      islandGroup: r.islandGroup,
      capital: r.capital ?? null,
      summary: r.summary,
      description: r.description ?? null,
      lat: r.lat ?? 0,
      lng: r.lng ?? 0,
      culturalItemCount: count,
    };
  });
  return ok(fallbackRegions);
}

/** GET /api/categories — memastikan 6 kategori budaya lengkap */
export async function listCategories(): Promise<Response> {
  try {
    const categories = await db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { culturalItems: { where: { status: "PUBLISHED" } } } } },
    });
    if (categories.length >= 6) {
      return ok(categories.map((c) => serializeCategory(c, c._count.culturalItems)));
    }
  } catch (e) {
    console.error("[listCategories error]", e);
  }

  const fallbackCategories = CULTURAL_CATEGORIES_DATASET.map((c) => {
    const count = MASTER_CULTURAL_CATALOGUE.filter((it) => it.category?.slug === c.slug).length;
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? null,
      icon: c.icon ?? null,
      sortOrder: c.sortOrder ?? 0,
      culturalItemCount: count,
    };
  });
  return ok(fallbackCategories);
}

/** GET /api/cultural-items — paginated & filterable dari 116 item */
export async function listItems(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = parsePagination(url, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const sort = parseItemSort(url.searchParams.get("sort"));
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const region = url.searchParams.get("region") || "";

  try {
    const where = buildItemWhere({
      search: search || undefined,
      category: category || undefined,
      region: region || undefined,
      forcePublished: true,
    });
    const total = await db.culturalItem.count({ where });
    if (total > 8) {
      const rows = await db.culturalItem.findMany({
        where,
        orderBy: itemOrderBy(sort),
        skip,
        take,
        include: itemLiteInclude,
      });
      return ok(rows.map(serializeItem), paginateMeta(page, pageSize, total));
    }
  } catch (e) {
    console.error("[listItems error]", e);
  }

  // Fallback ke query dataset katalog konsolidasi 116 objek budaya
  const res = queryCatalogue({
    search,
    categorySlug: category,
    regionCode: region,
    sort,
    page,
    pageSize,
  });
  return ok(res.items, res.meta);
}

/** GET /api/cultural-items/[id] — detail lengkap (hotspot hanya yang published), viewCount++ */
export async function itemDetail(_req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await ctx.params;
  try {
    const item = await db.culturalItem.findFirst({
      where: { OR: [{ slug: id }, { id }], status: "PUBLISHED" },
      include: itemFullInclude,
    });
    if (item) {
      try {
        await db.culturalItem.update({ where: { id: item.id }, data: { viewCount: { increment: 1 } } });
      } catch {
        /* abaikan kegagalan counter */
      }
      return ok(serializeItem({ ...item, hotspots: item.hotspots.filter((h) => h.published) }));
    }
  } catch (e) {
    console.error("[itemDetail error]", e);
  }

  const fallback = MASTER_CULTURAL_CATALOGUE.find((it) => it.slug === id || it.id === id);
  if (fallback) {
    return ok(fallback);
  }

  return notFound("Objek budaya tidak ditemukan.");
}

/** GET /api/cultural-items/[id]/sources */
export async function itemSources(_req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const item = await findPublishedItem(id);
    if (!item) return notFound("Objek budaya tidak ditemukan.");
    const sources = await db.culturalSource.findMany({
      where: { itemId: item.id },
      orderBy: { createdAt: "asc" },
    });
    return ok(sources.map((s) => serializeSource(s)));
  } catch (e) {
    console.error("[itemSources error]", e);
    return ok([]);
  }
}

/** GET /api/cultural-items/[id]/media — cover+model+audio+gallery (dedupe) dengan usageCount */
export async function itemMedia(_req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const item = await db.culturalItem.findFirst({
      where: { OR: [{ slug: id }, { id }], status: "PUBLISHED" },
      include: {
        coverMedia: true,
        modelMedia: true,
        audioMedia: true,
        gallery: { orderBy: { order: "asc" }, include: { media: true } },
      },
    });
    if (!item) return notFound("Objek budaya tidak ditemukan.");
    const unique = new Map<string, MediaAsset>();
    for (const m of [item.coverMedia, item.modelMedia, item.audioMedia]) {
      if (m) unique.set(m.id, m);
    }
    for (const g of item.gallery) unique.set(g.media.id, g.media);
    const usage = await mediaUsageMap([...unique.keys()]);
    return ok([...unique.values()].map((m) => serializeMediaAsset(m, usage.get(m.id) ?? [])));
  } catch (e) {
    console.error("[itemMedia error]", e);
    return ok([]);
  }
}

/** GET /api/sources — arsip sumber publik (dari item PUBLISHED atau tanpa item) */
export async function listPublicSources(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim();
    const type = url.searchParams.get("type")?.trim();

    const conds: Prisma.CulturalSourceWhereInput[] = [
      { OR: [{ item: { status: "PUBLISHED" } }, { itemId: null }] },
    ];
    if (type && (SOURCE_TYPES as readonly string[]).includes(type)) conds.push({ sourceType: type as SourceType });
    if (search) {
      conds.push({ OR: [{ title: { contains: search } }, { creator: { contains: search } }] });
    }

    const rows = await db.culturalSource.findMany({
      where: { AND: conds },
      orderBy: { createdAt: "desc" },
      include: { item: { select: { id: true, slug: true, title: true } } },
    });
    return ok(rows.map((s) => serializeSource(s)));
  } catch (e) {
    console.error("[listPublicSources error]", e);
    return ok([]);
  }
}

/** GET /api/settings — pengaturan publik (whitelist key) */
export async function getSettings(): Promise<Response> {
  try {
    const rows = await db.setting.findMany({ where: { key: { in: SETTING_PUBLIC_KEYS } } });
    const data: Record<string, string> = {};
    for (const r of rows) data[r.key] = r.value;
    return ok(data);
  } catch (e) {
    console.error("[getSettings error]", e);
    return ok({});
  }
}
