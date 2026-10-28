"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/shared/brand-logo";
import { useAuth } from "@/lib/auth-store";
import { navigate, type Route } from "@/lib/router";
import { labelRole } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Shapes,
  Images,
  BookMarked,
  HandHeart,
  Users2,
  Settings2,
  Menu,
  LogOut,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Globe,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n-store";
import { toast } from "sonner";

const EVALUATOR_ROLES = [
  {
    name: "Dewan Juri UINIC 8.0",
    email: "evaluator@waranusa.id",
    pass: "JuriUINIC#2026",
    role: "SUPER_ADMIN",
    label: "Super Admin",
  },
  {
    name: "Tim Pengembang WaraNusa",
    email: "dev@waranusa.id",
    pass: "DevWaraNusa*2026",
    role: "EDITOR",
    label: "Editor",
  },
  {
    name: "Kurator Ahli Budaya",
    email: "kurator@waranusa.id",
    pass: "KurasiWaraNusa&26",
    role: "REVIEWER",
    label: "Reviewer",
  },
  {
    name: "Komunitas Budaya Daerah",
    email: "kontributor@waranusa.id",
    pass: "MitraWaraNusa^26",
    role: "CONTRIBUTOR",
    label: "Kontributor",
  },
];

const SIDEBAR = [
  { href: "/admin/dashboard", labelId: "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cultural-items", labelId: "Objek Budaya", labelEn: "Cultural Items", icon: LayoutGrid },
  { href: "/admin/regions", labelId: "Wilayah", labelEn: "Regions", icon: MapPin },
  { href: "/admin/categories", labelId: "Kategori", labelEn: "Categories", icon: Shapes },
  { href: "/admin/media", labelId: "Media Manager", labelEn: "Media Manager", icon: Images },
  { href: "/admin/sources", labelId: "Sumber & Atribusi", labelEn: "Sources & Attribution", icon: BookMarked },
  { href: "/admin/contributions", labelId: "Kontribusi", labelEn: "Contributions", icon: HandHeart },
  { href: "/admin/users", labelId: "Pengguna", labelEn: "Users", icon: Users2, superAdminOnly: true },
  { href: "/admin/settings", labelId: "Pengaturan", labelEn: "Settings", icon: Settings2, superAdminOnly: true },
];

export function breadcrumbsFor(path: string, isEn = false): { label: string; href?: string }[] {
  const segs = path.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [{ label: isEn ? "Home" : "Beranda", href: "/admin/dashboard" }];
  if (segs[0] !== "admin") return crumbs;
  const knownId: Record<string, string> = {
    dashboard: "Dashboard",
    "cultural-items": "Objek Budaya",
    regions: "Wilayah",
    categories: "Kategori",
    media: "Media Manager",
    sources: "Sumber & Atribusi",
    contributions: "Kontribusi",
    users: "Pengguna",
    settings: "Pengaturan",
  };
  const knownEn: Record<string, string> = {
    dashboard: "Dashboard",
    "cultural-items": "Cultural Items",
    regions: "Regions",
    categories: "Categories",
    media: "Media Manager",
    sources: "Sources & Attribution",
    contributions: "Contributions",
    users: "Users",
    settings: "Settings",
  };
  const known = isEn ? knownEn : knownId;
  for (let i = 1; i < segs.length; i++) {
    const s = segs[i];
    const label = known[s] ?? (s === "create" ? (isEn ? "Create New" : "Tambah Baru") : s.length === 24 ? "Detail" : s);
    const href = i < segs.length - 1 ? `/${segs.slice(0, i + 1).join("/")}` : undefined;
    crumbs.push({ label, href });
  }
  return crumbs;
}

export function AdminShell({ route, children }: { route?: Route; children: React.ReactNode }) {
  const router = useRouter();
  const currentPathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const initialized = useAuth((s) => s.initialized);
  const [open, setOpen] = useState(false);

  const activePath = (currentPathname ? currentPathname.replace(/^\//, "") : "") || route?.path || "admin/dashboard";

  useEffect(() => {
    // Guard sisi klien hanyalah UX; otorisasi sebenarnya di server (API).
    if (initialized && !useAuth.getState().canAccessCMS()) {
      router.push("/login");
    }
  }, [activePath, initialized, router]);

  const isEn = language === "EN";
  const crumbs = breadcrumbsFor(activePath, isEn);
  const items = SIDEBAR.filter((s) => !s.superAdminOnly || user?.role === "SUPER_ADMIN");

  const navList = (
    <nav className="flex flex-col gap-1 px-3" aria-label="Navigasi CMS">
      {items.map((s) => {
        const itemPath = s.href.slice(1);
        const active = activePath === itemPath || (s.href !== "/admin/dashboard" && activePath.startsWith(itemPath));
        const label = isEn ? s.labelEn : s.labelId;
        return (
          <Link
            key={s.href}
            href={s.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-gradient-to-r from-[#6E472D] to-[#8C5E3C] text-white shadow-sm"
                : "text-foreground/70 hover:bg-[#FAF6F0] hover:text-[#6E472D]"
            )}
          >
            <s.icon className="h-4 w-4 shrink-0" />
            {label}
            {s.href === "/admin/contributions" && <span className="ml-auto rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-bold text-[#8C5E3C]">review</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#FBF8F1]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Kembali ke situs publik">
            <img
              src="/images/brand/waranusa-logo.png?v=3"
              alt="Logo WaraNusa"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="leading-none">
              <div className="font-serif text-base font-bold tracking-tight text-[#2D1E12]">
                WaraNusa
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#8C5E3C] mt-0.5">{isEn ? "Curator Portal" : "CMS Pengelolaan"}</div>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto nice-scroll py-4">
          {navList}
        </div>
        <div className="border-t border-border p-3 bg-secondary/30 mt-auto">
          <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6E472D]/10 text-[#6E472D]">
                <Globe className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-foreground truncate">Portal WaraNusa</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-emerald-700 font-semibold truncate">{isEn ? "System Online" : "Sistem Online"}</span>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/70 hover:bg-secondary text-muted-foreground hover:text-[#6E472D] transition-colors"
              title={isEn ? "Open Public Homepage" : "Buka Beranda Situs Publik"}
              aria-label={isEn ? "Open Public Homepage" : "Buka Beranda Situs Publik"}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Banner Evaluator Lomba */}
        <div className="bg-gradient-to-r from-[#3D2513] via-[#5C381E] to-[#3D2513] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-amber-900/40">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide">{isEn ? "Evaluator / Judge Active Session" : "Sesi Evaluator Lomba Aktif"}</span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200 border border-amber-300/30">
              Super Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-[11px] font-semibold text-white transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> {isEn ? "Back to Public Home" : "Kembali ke Beranda Publik"}
            </Link>
          </div>
        </div>

        {/* Header CMS */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          {/* Sidebar mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label={isEn ? "Open CMS menu" : "Buka menu CMS"}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menu CMS</SheetTitle>
              <div className="flex h-16 items-center px-4 border-b border-border">
                <img
                  src="/images/brand/waranusa-logo.png?v=3"
                  alt="Logo WaraNusa"
                  className="h-8 w-auto object-contain"
                />
                <span className="ml-2 font-serif text-base font-bold text-[#2D1E12]">WaraNusa CMS</span>
              </div>
              <div className="py-3">
                {navList}
              </div>
            </SheetContent>
          </Sheet>

          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((c, i) => (
                <div key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && <BreadcrumbSeparator><ChevronRight className="h-3 w-3" /></BreadcrumbSeparator>}
                  <BreadcrumbItem>
                    {c.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={c.href} className="font-medium">{c.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-semibold">{c.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link href="/" className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-[#6E472D] items-center gap-1">
              {isEn ? "Public Site" : "Situs Publik"} <ExternalLink className="h-3 w-3" />
            </Link>

            {/* Language Switcher Dropdown in CMS Header */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-full text-foreground hover:bg-secondary border border-border shadow-2xs flex items-center gap-1 text-xs font-semibold shrink-0 transition-all cursor-pointer"
                  aria-label="Pilih Bahasa / Select Language"
                >
                  <Globe className="h-3.5 w-3.5 text-[#8C5E3C]" />
                  <span className="text-[11px] font-bold text-[#442816] tracking-tight">{language}</span>
                  <ChevronDown className="h-3 w-3 opacity-60 text-stone-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-2xl border-stone-200 bg-white p-1.5 shadow-lg">
                <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {language === "ID" ? "Pilih Bahasa" : "Select Language"}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setLanguage("ID")}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors",
                    language === "ID" ? "bg-amber-50 text-[#8C5E3C]" : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇮🇩</span>
                    <span>Bahasa Indonesia</span>
                  </span>
                  {language === "ID" && <Check className="h-3.5 w-3.5 text-[#8C5E3C]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("EN")}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold cursor-pointer transition-colors",
                    language === "EN" ? "bg-amber-50 text-[#8C5E3C]" : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🇬🇧</span>
                    <span>English (EN)</span>
                  </span>
                  {language === "EN" && <Check className="h-3.5 w-3.5 text-[#8C5E3C]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 hover:bg-secondary transition-colors" aria-label="Menu akun">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6E472D] to-[#8C5E3C] text-[11px] font-bold text-white">
                    {user?.name.slice(0, 1).toUpperCase() ?? "?"}
                  </span>
                  <span className="hidden max-w-44 truncate text-xs font-bold sm:block text-[#2D1E12]">{user?.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-60 text-stone-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl border-stone-200 bg-white p-1.5 shadow-xl">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="text-sm font-bold text-[#2D1E12]">{user?.name}</div>
                  <div className="text-xs font-normal text-muted-foreground truncate">{user?.email}</div>
                  <div className="mt-1 inline-flex items-center rounded-md bg-[#8C5E3C]/10 px-2 py-0.5 text-[10px] font-bold text-[#8C5E3C]">
                    {user ? labelRole(user.role) : ""}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-stone-100" />

                {/* ROLE SWITCHER UNTUK EVALUASI PENJURIAN UINIC 8.0 */}
                <DropdownMenuLabel className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {isEn ? "Role Switcher (UINIC 8.0)" : "Ganti Peran Juri (UINIC 8.0)"}
                </DropdownMenuLabel>

                {EVALUATOR_ROLES.map((r) => {
                  const isCurrent = user?.email === r.email;
                  return (
                    <DropdownMenuItem
                      key={r.email}
                      onClick={async () => {
                        if (isCurrent) return;
                        try {
                          const u = await login(r.email, r.pass);
                          toast.success(
                            isEn
                              ? `Switched role to: ${u.name} (${r.label})`
                              : `Beralih peran: ${u.name} (${r.label})`
                          );
                          if (r.role === "CONTRIBUTOR") {
                            navigate("/kontribusi-saya");
                          } else {
                            navigate("/admin/dashboard");
                          }
                        } catch {
                          toast.error(isEn ? "Failed to switch role" : "Gagal beralih peran");
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-colors",
                        isCurrent
                          ? "bg-amber-50 text-[#8C5E3C]"
                          : "text-stone-700 hover:bg-stone-50"
                      )}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold truncate text-[11px]">{r.name}</p>
                        <p className="text-[10px] opacity-70 font-normal">{r.label}</p>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-[#8C5E3C] shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator className="my-1 border-stone-100" />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-destructive focus:text-destructive cursor-pointer hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> {isEn ? "Log Out" : "Keluar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-[#FBF8F1]">{children}</main>
      </div>
    </div>
  );
}
