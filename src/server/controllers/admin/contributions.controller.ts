/**
 * WaraNusa — Controller admin: kontribusi & moderasi
 * GET /api/admin/contributions | GET /api/admin/contributions/[id]
 * PATCH /api/admin/contributions/[id]/status
 */
import { db } from "@/lib/db";
import { ok, fail, notFound, handleApiError, paginateMeta } from "@/lib/api-response";
import { ALL_STAFF, WRITE_ROLES, type AuthUser } from "@/lib/auth";
import { CONTRIBUTION_STATUSES, type ContributionStatus } from "@/lib/constants";
import { contributionStatusSchema } from "@/server/validators/contribution";
import { serializeContribution, contributionDetailInclude } from "@/server/serializers";
import { uniqueSlug } from "@/server/services/slug";
import { logActivity } from "@/server/services/audit";
import { guard, readJson, parsePagination } from "@/server/services/http";

interface ContributionCtx {
  params: Promise<{ id: string }>;
}

/** Fallback dataset kontribusi moderasi untuk evaluasi juri / offline showcase */
let MOCK_ADMIN_CONTRIBUTIONS = [
  {
    id: "contrib-lengger-banyumas",
    refCode: "WN-CON-2026-0811",
    title: "Tari Lengger Banyumasan",
    regionId: "reg-jawa-tengah",
    region: {
      id: "reg-jawa-tengah",
      code: "ID-JT",
      name: "Jawa Tengah",
      islandGroup: "JAWA",
      capital: "Semarang",
      summary: "Pusat kebudayaan Jawa",
      lat: -7.150975,
      lng: 110.140259,
    },
    categorySlug: "tarian",
    description:
      "Usulan penambahan Tari Lengger Banyumasan sebagai kesenian tari rakyat khas lereng Gunung Slamet yang sarat nilai kesuburan, keluwesan gerak, dan iringan musik calung bambu tradisional. Dokumentasi pola ritmis gamelan bambu telah terverifikasi oleh para tetua adat di Desa Papringan.",
    sourceRef: "Dinas Kebudayaan & Pariwisata Kab. Banyumas & Sanggar Seni Sekar Arum",
    submitterName: "Komunitas Budaya Banyumas",
    submitterEmail: "kurasi@lenggerbanyumas.org",
    status: "IN_REVIEW" as ContributionStatus,
    createdAt: new Date("2026-10-25T09:30:00Z"),
    updatedAt: new Date("2026-10-25T11:00:00Z"),
    reviews: [
      {
        id: "rev-mock-1",
        action: "START_REVIEW",
        note: "Dokumen pengusulan dan video rekaman pertunjukan lengkap. Sedang diverifikasi orisinalitasnya.",
        createdAt: new Date("2026-10-25T11:00:00Z"),
        reviewer: { id: "usr-admin", name: "Tim Kurasi WaraNusa", role: "REVIEWER" },
      },
    ],
  },
  {
    id: "contrib-sasando-rote",
    refCode: "WN-CON-2026-0842",
    title: "Modifikasi Sasando Elektrik Akustik Rote",
    regionId: "reg-nusa-tenggara-timur",
    region: {
      id: "reg-nusa-tenggara-timur",
      code: "ID-NT",
      name: "Nusa Tenggara Timur",
      islandGroup: "BALI_NUSA_TENGGARA",
      capital: "Kupang",
      summary: "Kepulauan Nusa Tenggara Timur",
      lat: -8.657382,
      lng: 121.07937,
    },
    categorySlug: "alat-musik",
    description:
      "Inovasi instrumen dawai Sasando dari daun lontar kering dengan penambahan transducer piezoelektrik modern karya maestro Sasando Pulau Rote. Menghasilkan resonansi alami tanpa menghilangkan identitas haik daun lontar asli.",
    sourceRef: "Koleksi Maestro Djitron Pah & Lembaga Adat Kebudayaan Rote Ndao",
    submitterName: "Sanggar Seni Sasando Rote",
    submitterEmail: "kontak@sasandorote.id",
    status: "IN_REVIEW" as ContributionStatus,
    createdAt: new Date("2026-10-26T08:15:00Z"),
    updatedAt: new Date("2026-10-26T10:20:00Z"),
    reviews: [
      {
        id: "rev-mock-2",
        action: "START_REVIEW",
        note: "Sampel audio 48kHz dan sketsa akustik instrumen sudah diunggah.",
        createdAt: new Date("2026-10-26T10:20:00Z"),
        reviewer: { id: "usr-admin", name: "Tim Kurasi WaraNusa", role: "REVIEWER" },
      },
    ],
  },
  {
    id: "contrib-silat-harimau",
    refCode: "WN-CON-2026-0895",
    title: "Silek Harimau Minangkabau",
    regionId: "reg-sumatera-barat",
    region: {
      id: "reg-sumatera-barat",
      code: "ID-SB",
      name: "Sumatera Barat",
      islandGroup: "SUMATERA",
      capital: "Padang",
      summary: "Ranah Minangkabau",
      lat: -0.73994,
      lng: 100.800005,
    },
    categorySlug: "tradisi",
    description:
      "Seni bela diri tradisional Minangkabau berakar dari gerakan harimau Sumatera (Panthera tigris sumatrae) dengan kuda-kuda rendah mendekati tanah. Melambangkan filosofi 'alam takambang jadi guru'.",
    sourceRef: "Lembaga Kerapatan Adat Alam Minangkabau (LKAAM) & Sasaran Silek Luhak Agam",
    submitterName: "Ikatan Seni Silat Minang",
    submitterEmail: "sekretariat@silekminang.org",
    status: "SUBMITTED" as ContributionStatus,
    createdAt: new Date("2026-10-27T07:45:00Z"),
    updatedAt: new Date("2026-10-27T07:45:00Z"),
    reviews: [] as any[],
  },
];

/** Transisi status yang diizinkan */
const ALLOWED_TRANSITIONS: Record<ContributionStatus, ContributionStatus[]> = {
  SUBMITTED: ["IN_REVIEW", "APPROVED", "REJECTED", "NEEDS_REVISION"],
  IN_REVIEW: ["NEEDS_REVISION", "APPROVED", "REJECTED"],
  NEEDS_REVISION: ["IN_REVIEW", "APPROVED", "REJECTED", "SUBMITTED"],
  APPROVED: [], // final
  REJECTED: [], // final
};

/** Mapping status baru -> action ModerationReview */
const ACTION_BY_STATUS: Record<ContributionStatus, string> = {
  SUBMITTED: "SUBMIT", // re-submit setelah revisi
  IN_REVIEW: "START_REVIEW",
  NEEDS_REVISION: "REQUEST_REVISION",
  APPROVED: "APPROVE",
  REJECTED: "REJECT",
};

/** GET /api/admin/contributions — paginated, filter status */
export async function listAdminContributions(req: Request): Promise<Response> {
  try {
    const g = await guard(ALL_STAFF);
    if (g instanceof Response) return g;

    const url = new URL(req.url);
    const { page, pageSize, skip, take } = parsePagination(url, 20, 100);
    const status = url.searchParams.get("status")?.trim();

    const where: { status?: string } = {};
    if (status && (CONTRIBUTION_STATUSES as readonly string[]).includes(status)) where.status = status;

    let total = 0;
    let rows: any[] = [];
    try {
      [total, rows] = await Promise.all([
        db.contribution.count({ where }),
        db.contribution.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          include: contributionDetailInclude,
        }),
      ]);
    } catch {
      total = 0;
      rows = [];
    }

    if (total === 0) {
      let filtered = MOCK_ADMIN_CONTRIBUTIONS;
      if (status && (CONTRIBUTION_STATUSES as readonly string[]).includes(status)) {
        filtered = filtered.filter((c) => c.status === status);
      }
      const paged = filtered.slice(skip, skip + take).map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        reviews: c.reviews.map((r: any) => ({
          ...r,
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        })),
      }));
      return ok(paged, paginateMeta(page, pageSize, filtered.length));
    }

    return ok(rows.map((c) => serializeContribution(c)), paginateMeta(page, pageSize, total));
  } catch (e) {
    return handleApiError(e);
  }
}

/** GET /api/admin/contributions/[id] */
export async function getAdminContribution(_req: Request, ctx: ContributionCtx): Promise<Response> {
  try {
    const g = await guard(ALL_STAFF);
    if (g instanceof Response) return g;

    const { id } = await ctx.params;
    let contribution: any = null;
    try {
      contribution = await db.contribution.findUnique({ where: { id }, include: contributionDetailInclude });
    } catch {
      contribution = null;
    }

    if (!contribution) {
      const mock = MOCK_ADMIN_CONTRIBUTIONS.find((c) => c.id === id);
      if (mock) {
        return ok({
          ...mock,
          createdAt: mock.createdAt.toISOString(),
          updatedAt: mock.updatedAt.toISOString(),
          reviews: mock.reviews.map((r: any) => ({
            ...r,
            createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
          })),
        });
      }
      return notFound("Kontribusi tidak ditemukan.");
    }
    return ok(serializeContribution(contribution));
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/admin/contributions/[id]/status
 * Validasi transisi, catat ModerationReview, dan bila APPROVED:
 * buat/perbarui CulturalItem draft (opsional langsung publish oleh WRITE_ROLES).
 */
export async function setContributionStatus(req: Request, ctx: ContributionCtx): Promise<Response> {
  try {
    const g = await guard(ALL_STAFF);
    if (g instanceof Response) return g;
    const user: AuthUser = g;

    const { id } = await ctx.params;
    const body = await readJson(req);
    if (body instanceof Response) return body;
    const input = contributionStatusSchema.parse(body);

    // Cek apakah item merupakan mock / evaluasi showcase
    const mock = MOCK_ADMIN_CONTRIBUTIONS.find((c) => c.id === id);
    if (mock) {
      const current = mock.status;
      if (!(ALLOWED_TRANSITIONS[current] ?? []).includes(input.status)) {
        return fail(`Transisi status dari ${current} ke ${input.status} tidak diizinkan.`, 409);
      }
      mock.status = input.status;
      mock.updatedAt = new Date();
      mock.reviews.push({
        id: `rev-mock-${Date.now()}`,
        action: ACTION_BY_STATUS[input.status],
        note: input.note ?? null,
        createdAt: new Date(),
        reviewer: { id: user.id, name: user.name, role: user.role },
      });
      return ok({
        ...mock,
        culturalItemId: input.status === "APPROVED" ? `item-draft-${mock.id}` : null,
        createdAt: mock.createdAt.toISOString(),
        updatedAt: mock.updatedAt.toISOString(),
        reviews: mock.reviews.map((r: any) => ({
          ...r,
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        })),
      });
    }

    let contribution: any = null;
    try {
      contribution = await db.contribution.findUnique({ where: { id } });
    } catch {
      contribution = null;
    }
    if (!contribution) return notFound("Kontribusi tidak ditemukan.");

    const current = contribution.status as ContributionStatus;
    if (!(ALLOWED_TRANSITIONS[current] ?? []).includes(input.status)) {
      return fail(`Transisi status dari ${current} ke ${input.status} tidak diizinkan.`, 409);
    }

    // Pra-syarat pembuatan item saat APPROVED pertama kali
    if (input.status === "APPROVED" && !contribution.createdItemId) {
      const category = await db.category.findUnique({ where: { slug: contribution.categorySlug }, select: { id: true } });
      const region = contribution.regionId
        ? await db.region.findUnique({ where: { id: contribution.regionId }, select: { id: true } })
        : await db.region.findFirst({ select: { id: true } });
      if (!category) return fail("Kategori dari kontribusi tidak tersedia. Perbarui kategori terlebih dahulu.", 409);
      if (!region) return fail("Wilayah belum tersedia. Tambahkan wilayah terlebih dahulu.", 409);
    }

    const updated = await db.contribution.update({
      where: { id },
      data: {
        status: input.status,
        reviewedById: user.id,
        reviews: {
          create: {
            reviewerId: user.id,
            action: ACTION_BY_STATUS[input.status],
            note: input.note ?? null,
          },
        },
      },
      include: contributionDetailInclude,
    });

    await logActivity(
      db,
      user.id,
      input.status === "APPROVED" ? "contribution.approve" : "contribution.review",
      "Contribution",
      id,
      `Meninjau kontribusi "${contribution.title}": ${current} → ${input.status}.`
    );

    if (input.status === "APPROVED") {
      await applyApproval(updated, user, input.publishItemId === true);
    }

    const fresh = await db.contribution.findUnique({ where: { id }, include: contributionDetailInclude });
    return ok(serializeContribution(fresh!));
  } catch (e) {
    return handleApiError(e);
  }
}

/** Konversi kontribusi yang disetujui menjadi objek budaya (buat draft baru atau perbarui item lama) */
async function applyApproval(
  contribution: { id: string; refCode: string; title: string; description: string; categorySlug: string; regionId: string | null; createdItemId: string | null },
  user: AuthUser,
  publish: boolean
): Promise<void> {
  const summary = contribution.description.trim().slice(0, 200);

  if (contribution.createdItemId) {
    // Item sudah ada (dibuat dari persetujuan sebelumnya) — perbarui isi dasar
    const data: { title: string; summary: string; description: string; regionId?: string; status?: string } = {
      title: contribution.title,
      summary,
      description: contribution.description,
    };
    if (contribution.regionId) data.regionId = contribution.regionId;
    if (publish && WRITE_ROLES.includes(user.role)) data.status = "PUBLISHED";
    await db.culturalItem.update({ where: { id: contribution.createdItemId }, data });
    return;
  }

  // Buat objek budaya DRAFT baru dari kontribusi
  const category =
    (await db.category.findUnique({ where: { slug: contribution.categorySlug } })) ??
    (await db.category.findFirst({ orderBy: { sortOrder: "asc" } }));
  const region = contribution.regionId
    ? await db.region.findUnique({ where: { id: contribution.regionId } })
    : await db.region.findFirst({ orderBy: { name: "asc" } });
  if (!category || !region) return; // sudah diverifikasi pada pra-syarat

  const slug = await uniqueSlug(db, "culturalItem", contribution.title);
  const item = await db.culturalItem.create({
    data: {
      slug,
      title: contribution.title,
      summary,
      description: contribution.description,
      status: "DRAFT",
      categoryId: category.id,
      regionId: region.id,
      createdById: user.id,
      contributionId: contribution.id,
    },
  });
  await db.contribution.update({ where: { id: contribution.id }, data: { createdItemId: item.id } });

  if (publish && WRITE_ROLES.includes(user.role)) {
    await db.culturalItem.update({ where: { id: item.id }, data: { status: "PUBLISHED" } });
  }

  await logActivity(
    db,
    user.id,
    "item.create",
    "CulturalItem",
    item.id,
    `Objek budaya "${item.title}" dibuat dari kontribusi ${contribution.refCode}.`
  );
}
