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
} from "lucide-react";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { href: "#/", label: "Beranda", icon: Home },
  { href: "#/jelajah", label: "Jelajahi Nusantara", icon: Compass },
  { href: "#/katalog", label: "Katalog Budaya", icon: LayoutGrid },
  { href: "#/eksplorasi-3d", label: "Eksplorasi 3D", icon: Box },
];

export function SiteHeader({ route, introRevealed = true }: { route: Route; introRevealed?: boolean }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    try {
      setHasRegistered(localStorage.getItem("waranusa_has_registered") === "true");
    } catch {}
  }, [user]);

  const isLanding = !route.segments[0] || route.segments[0] === "";
  const isActive = (href: string) => {
    if (href === "#/" || href === "#") {
      return isLanding;
    }
    if (href.startsWith("#/")) {
      return route.raw.startsWith(href.slice(1));
    }
    return false;
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
      <motion.header
        initial={isLanding ? { y: -80, opacity: 0 } : false}
        animate={isLanding ? (introRevealed ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }) : undefined}
        transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "transition-colors duration-300",
          isLanding
            ? "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-md flex items-center justify-between"
            : "sticky top-0 z-50 border-b border-stone-200/80 bg-[#FCF8EC]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#FCF8EC]/80"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 w-full",
            !isLanding && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16"
          )}
        >
          {/* ================= SISI KIRI: LOGO WARANUSA DENGAN GUNUNGAN ================= */}
          <div className="flex items-center">
            <BrandLogo variant="earthy" />
          </div>

          {/* ================= TENGAH: MENU NAVIGASI ================= */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Navigasi utama"
          >
            {NAV_ITEMS.map((item) => {
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
                      "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-stone-900 bg-stone-200/60 font-semibold"
                        : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-stone-900 bg-stone-200/60 font-semibold"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/40"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ================= SISI KANAN: PENCARIAN, DAFTAR, MASUK, BAHASA ================= */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Tombol Pencarian */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-200/50"
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
                  className="rounded-full bg-[#A38771] hover:bg-[#8F745E] text-white text-xs sm:text-sm font-medium px-5 py-1.5 h-9 shadow-sm transition-colors"
                >
                  <Link href="#/masuk">
                    {hasRegistered ? "Masuk" : "Daftar"}
                  </Link>
                </Button>
              )}
            </div>

            {/* Pemilih Bahasa (Language Selector 文A ˅) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2 sm:px-2.5 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-200/50 flex items-center gap-1 text-xs font-medium"
                  aria-label="Pilih Bahasa"
                >
                  <span className="font-serif font-bold text-sm tracking-tighter">文A</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-2xl border-stone-200 bg-white p-1 shadow-lg">
                <DropdownMenuItem
                  onClick={() => setLanguage("ID")}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer",
                    language === "ID" ? "bg-stone-100 text-stone-900" : "text-stone-600"
                  )}
                >
                  <span>Bahasa Indonesia</span>
                  {language === "ID" && <Check className="h-3.5 w-3.5 text-[#8A5B38]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("EN")}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer",
                    language === "EN" ? "bg-stone-100 text-stone-900" : "text-stone-600"
                  )}
                >
                  <span>English (EN)</span>
                  {language === "EN" && <Check className="h-3.5 w-3.5 text-[#8A5B38]" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-200/50"
                  aria-label="Buka menu navigasi"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#FAF7F2] border-stone-200 p-6">
                <SheetTitle className="sr-only">Navigasi WaraNusa</SheetTitle>
                <div className="mt-2">
                  <BrandLogo variant="earthy" />
                </div>
                <nav className="mt-8 flex flex-col gap-2" aria-label="Navigasi seluler">
                  {NAV_ITEMS.map((item) => (
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
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold",
                        isActive(item.href)
                          ? "bg-stone-200 text-stone-900"
                          : "text-stone-700 hover:bg-stone-200/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 text-[#8A5B38]" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="my-3 border-t border-stone-200" />

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
                        className="rounded-full bg-[#A38771] hover:bg-[#8F745E] text-white"
                      >
                        <Link href="#/masuk" onClick={() => setMobileOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          {hasRegistered ? "Masuk" : "Daftar"}
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
