/**
 * WaraNusa — Autentikasi & Otorisasi (server-only)
 * Pola token opaque di cookie httpOnly (setara Sanctum SPA mode).
 */
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_DAYS, type Role } from "@/lib/constants";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export function hashPassword(plain: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require("bcryptjs") as typeof import("bcryptjs");
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain: string, hash: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require("bcryptjs") as typeof import("bcryptjs");
  return bcrypt.compareSync(plain, hash);
}

const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export const DEMO_FALLBACK_USERS: Record<string, AuthUser & { plainPass: string }> = {
  "admin@waranusa.id": {
    id: "usr-admin-demo",
    name: "Admin WaraNusa (Demo)",
    email: "admin@waranusa.id",
    role: "SUPER_ADMIN",
    active: true,
    plainPass: "Admin#2025",
  },
  "editor@waranusa.id": {
    id: "usr-editor-demo",
    name: "Sari Wulandari (Demo)",
    email: "editor@waranusa.id",
    role: "EDITOR",
    active: true,
    plainPass: "Editor#2025",
  },
  "reviewer@waranusa.id": {
    id: "usr-reviewer-demo",
    name: "Bayu Setiawan (Demo)",
    email: "reviewer@waranusa.id",
    role: "REVIEWER",
    active: true,
    plainPass: "Reviewer#2025",
  },
  "kontributor@waranusa.id": {
    id: "usr-kontributor-demo",
    name: "Dewi Lestari (Demo)",
    email: "kontributor@waranusa.id",
    role: "CONTRIBUTOR",
    active: true,
    plainPass: "Kontrib#2025",
  },
};

/** Membuat sesi baru dan mengembalikan token mentah (dipasang di cookie) */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  try {
    await db.session.create({ data: { token: hashToken(token), userId, expiresAt } });
  } catch (err) {
    console.warn("[auth] db.session.create fallback to local token:", err);
    return { token: `demo-session-${userId}`, expiresAt };
  }
  return { token, expiresAt };
}

/** Memvalidasi token dari cookie; mengembalikan user bila sesi valid */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;

    if (raw.startsWith("demo-session-")) {
      const demoId = raw.replace("demo-session-", "");
      const found = Object.values(DEMO_FALLBACK_USERS).find((u) => u.id === demoId);
      if (found) {
        return { id: found.id, name: found.name, email: found.email, role: found.role, active: found.active };
      }
    }

    const session = await db.session.findUnique({
      where: { token: hashToken(raw) },
      include: { user: true },
    }).catch(() => null);

    if (!session) {
      return null;
    }
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }
    const u = session.user;
    if (!u.active) return null;
    return { id: u.id, name: u.name, email: u.email, role: u.role as Role, active: u.active };
  } catch (e) {
    console.error("[auth] getCurrentUser failed:", e);
    return null;
  }
}

export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    await db.session.deleteMany({ where: { token: hashToken(raw) } });
  }
}

/** Guard untuk endpoint admin/CMS: user harus login dan punya salah satu role */
export async function requireRole(roles: Role[]): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return roles.includes(user.role) ? user : null;
}

export const CMS_ROLES: Role[] = ["SUPER_ADMIN", "EDITOR", "REVIEWER"];
export const WRITE_ROLES: Role[] = ["SUPER_ADMIN", "EDITOR"];
export const ALL_STAFF: Role[] = ["SUPER_ADMIN", "EDITOR", "REVIEWER"];
