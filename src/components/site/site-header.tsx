"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HashLink as Link } from "@/components/shared/hash-link";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-store";
import { navigate, type Route } from "@/lib/router";
import { labelRole } from "@/lib/constants";
import {
  Search,
  Menu,
  LogIn,
  UserCircle2,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Check,
  Home,
  Compass,
  LayoutGrid,
  Box,
  Music4,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation, type TranslationKey } from "@/lib/i18n-store";

interface NavItemDef {
  href: string;
  labelKey: TranslationKey;
  fallback: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { href: "#/", labelKey: "nav.home", fallback: "Beranda", icon: Home },
  { href: "#/jelajah", labelKey: "nav.explore", fallback: "Jelajahi Nusantara", icon: Compass },
  { href: "#/katalog", labelKey: "nav.catalog", fallback: "Katalog Budaya", icon: LayoutGrid },
  { href: "#/eksplorasi-3d", labelKey: "nav.3d", fallback: "Eksplorasi 3D", icon: Box },
  { href: "#/instrumen", labelKey: "nav.instruments", fallback: "Instrumen Virtual", icon: Music4 },
];

export function SiteHeader({ route, introRevealed = true }: { route: Route; introRevealed?: boolean }) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    try {
      setHasRegistered(localStorage.getItem("waranusa_has_registered") === "true");
    } catch {}
  }, [user]);

  const isLanding = !route.segments[0] || route.segments[0] === "";
  const isActive = (href: string) => {
    const targetPath = href.replace(/^#\/?/, "");
    if (!targetPath) {
      return isLanding;
    }
    return route.path === targetPath || route.raw.startsWith(targetPath);
  };

  const cmsUser = user && ["SUPER_ADMIN", "EDITOR", "REVIEWER"].includes(user.role);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      {/* Aksesibilitas: Tautan Lewati ke Konten Utama (WCAG 2.1 Level A) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999999] focus:rounded-full focus:bg-[#8C5E3C] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Lewati ke konten utama
      </a>

      <motion.header
        initial={isLanding ? { y: -30, opacity: 0 } : false}
        animate={isLanding ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "transition-colors duration-300",
          isLanding
            ? "fixed top-2.5 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-2.5 sm:px-6 py-1.5 sm:py-3 rounded-full bg-white/80 backdrop-blur-md border border-white/70 shadow-md flex items-center justify-between"
            : "sticky top-0 z-50 border-b border-stone-200/70 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0",
            !isLanding && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16"
          )}
        >
          {/* ================= SISI KIRI: LOGO WARANUSA DENGAN GUNUNGAN ================= */}
          <div className="flex items-center shrink-0 min-w-0">
            <BrandLogo variant="earthy" />
          </div>

          {/* ================= TENGAH: MENU NAVIGASI ================= */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Navigasi utama"
          >
            {NAV_ITEMS.map((item) => {
              const label = t(item.labelKey, item.fallback);
              const active = isActive(item.href);
              if (item.href === "#/") {
                return (
                  <Link
                    key={item.href}
                    href="#/"
                    onClick={() => {
                      if (isLanding) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 select-none",
                      active
                        ? "text-[#3C2213] font-bold"
                        : "text-stone-700 hover:text-[#3C2213] hover:bg-white/50 font-medium"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-white/95 border border-stone-200/90 shadow-xs"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 select-none",
                    active
                      ? "text-[#3C2213] font-bold"
                      : "text-stone-700 hover:text-[#3C2213] hover:bg-white/50 font-medium"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-white/95 border border-stone-200/90 shadow-xs"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= SISI KANAN: PENCARIAN, DAFTAR, MASUK, BAHASA ================= */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Tombol Pencarian */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-stone-700 hover:text-stone-900 hover:bg-white/60 shrink-0"
              aria-label="Pencarian Budaya"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Desktop Auth Buttons (Daftar & Masuk) */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 rounded-full pl-1.5 pr-3 bg-stone-100/70 border border-stone-200 text-stone-800 hover:bg-stone-200/60"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8A5B38] text-xs font-bold text-white shadow-sm">
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="max-w-24 truncate text-xs font-semibold">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-stone-200 bg-white shadow-xl">
                    <DropdownMenuLabel>
                      <div className="text-sm font-bold text-stone-900">{user.name}</div>
                      <div className="text-xs font-normal text-stone-500">{user.email}</div>
                      <div className="mt-1 text-[11px] font-semibold text-[#8A5B38]">
                        {labelRole(user.role)}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {cmsUser && (
                      <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4 text-[#8A5B38]" /> Panel Pengelolaan
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/kontribusi-saya")}>
                      <UserCircle2 className="mr-2 h-4 w-4 text-[#8A5B38]" /> Kontribusi Saya
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                        navigate("/");
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Satu Tombol Akun Pintar: 'Daftar' untuk pengunjung baru, 'Masuk' jika pernah login */
                <Button
                  asChild
                  size="sm"
                  className="btn-waranusa rounded-full text-xs sm:text-sm font-semibold px-5 py-1.5 h-9 shadow-sm"
                >
                  <Link href="#/masuk">
                    {hasRegistered ? t("nav.login", "Masuk") : t("nav.register", "Daftar")}
                  </Link>
                </Button>
              )}
            </div>

            {/* Pemilih Bahasa (Language Selector Minimalis Globe + ID/EN) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-100/70 border border-stone-200/80 shadow-2xs flex items-center gap-1 sm:gap-1.5 text-xs font-semibold shrink-0 transition-all cursor-pointer"
                  aria-label="Pilih Bahasa / Select Language"
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#8C5E3C]" />
                  <span className="text-[11px] sm:text-xs font-bold text-[#442816] tracking-tight">{language}</span>
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

            {/* Mobile Menu Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-200/50 shrink-0"
                  aria-label="Buka menu navigasi"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-xs sm:w-80 bg-[#FAF7F2] border-stone-200 p-5 sm:p-6 overflow-y-auto">
                <SheetTitle className="sr-only">Navigasi WaraNusa</SheetTitle>
                <div className="mt-1">
                  <BrandLogo variant="earthy" />
                </div>

                {/* Pencarian di dalam menu seluler */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="mt-5 w-full flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-white/90 px-3.5 py-3 text-xs font-medium text-stone-600 hover:border-[#8C5E3C] transition-colors text-left cursor-pointer shadow-xs min-h-[44px]"
                  aria-label="Cari objek budaya"
                >
                  <Search className="h-4 w-4 text-stone-400 shrink-0" />
                  <span className="truncate">{t("nav.search_placeholder", "Cari objek budaya, tradisi...")}</span>
                </button>
                <nav className="mt-6 flex flex-col gap-1.5" aria-label="Navigasi seluler">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileOpen(false);
                          if (item.href === "#/" && isLanding) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 min-h-[44px] text-sm transition-all active:scale-[0.98]",
                          active
                            ? "bg-white/95 border border-stone-200/90 text-[#3C2213] shadow-xs font-bold"
                            : "text-stone-700 hover:bg-white/60 font-medium"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-[#8C5E3C]" : "text-stone-500")} />
                        <span>{t(item.labelKey, item.fallback)}</span>
                      </Link>
                    );
                  })}

                  {/* Pintasan Kontribusi Budaya untuk Pelestarian */}
                  <Link
                    href="#/kontribusi"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 min-h-[44px] text-sm font-semibold text-[#6E472D] bg-[#6E472D]/8 hover:bg-[#6E472D]/15 border border-[#6E472D]/20 transition-all"
                  >
                    <Compass className="h-4 w-4 text-[#6E472D] shrink-0" />
                    <span>Kirim Kontribusi Budaya</span>
                  </Link>

                  <div className="my-2 border-t border-stone-200" />

                  {user ? (
                    <>
                      {cmsUser && (
                        <Link
                          href="#/admin/dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-200/50"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#8A5B38]" /> Panel Pengelolaan
                        </Link>
                      )}
                      <Link
                        href="#/kontribusi-saya"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-200/50"
                      >
                        <UserCircle2 className="h-4 w-4 text-[#8A5B38]" /> Kontribusi Saya
                      </Link>
                      <button
                        onClick={async () => {
                          setMobileOpen(false);
                          await logout();
                          navigate("/");
                        }}
                        className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 text-left mt-2"
                      >
                        <LogOut className="h-4 w-4" /> Keluar ({user.name})
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        asChild
                        className="btn-waranusa rounded-full text-white"
                      >
                        <Link href="#/masuk" onClick={() => setMobileOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          {hasRegistered ? t("nav.login", "Masuk") : t("nav.register", "Daftar")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* ================= MODAL DIALOG PENCARIAN BUDAYA ================= */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-stone-200 bg-[#FCFAF6] p-6 text-stone-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-[#2D1E12]">
              Pencarian Katalog Budaya
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Cari rumah adat, tarian, instrumen, tekstil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-10 h-11 rounded-full border-stone-300 bg-white text-sm focus-visible:ring-stone-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSearchOpen(false)}
                className="rounded-full text-stone-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-[#8A5B38] hover:bg-[#744B2D] text-white"
              >
                Cari Sekarang
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
