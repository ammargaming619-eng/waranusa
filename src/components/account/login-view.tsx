"use client";

/**
 * WaraNusa — LoginView (#/masuk / #/login)
 * Desain Elegan & Responsif: Split-screen desktop 50:50, floating card mobile,
 * form input terpoles dengan ikon Lucide, serta panel khusus Evaluator UINIC 8.0.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Route } from "@/lib/router";

const DEMO_ACCOUNTS = [
  {
    name: "Dewan Juri UINIC 8.0",
    email: "evaluator@waranusa.id",
    password: "JuriUINIC#2026",
    role: "Super Admin",
    roleKey: "super_admin",
    accessLabel: "Akses Penuh",
    badgeClass: "border-purple-300 bg-purple-50 text-purple-900",
  },
  {
    name: "Tim Pengembang WaraNusa",
    email: "dev@waranusa.id",
    password: "DevWaraNusa*2026",
    role: "Editor",
    roleKey: "editor",
    accessLabel: "Manajemen Konten & 3D",
    badgeClass: "border-sky-300 bg-sky-50 text-sky-900",
  },
  {
    name: "Kurator Ahli Budaya",
    email: "kurator@waranusa.id",
    password: "KurasiWaraNusa&26",
    role: "Reviewer",
    roleKey: "reviewer",
    accessLabel: "Kurasi Kontribusi",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-900",
  },
  {
    name: "Komunitas Budaya Daerah",
    email: "kontributor@waranusa.id",
    password: "MitraWaraNusa^26",
    role: "Kontributor",
    roleKey: "kontributor",
    accessLabel: "Pengajuan Budaya",
    badgeClass: "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
] as const;

export default function LoginView({ route }: { route?: Route } = {}) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const canAccessCMS = useAuth((s) => s.canAccessCMS);

  const [showDemoManual, setShowDemoManual] = useState(false);
  const [isEvaluatorMode, setIsEvaluatorMode] = useState(false);

  useEffect(() => {
    let fromSearch = false;
    if (typeof window !== "undefined") {
      try {
        const sp = new URLSearchParams(window.location.search);
        fromSearch = sp.get("demo") === "evaluator";
      } catch {}
    }
    const fromHash = typeof window !== "undefined" && window.location.hash.includes("demo=evaluator");
    const fromRoute = route?.query?.demo === "evaluator";
    setIsEvaluatorMode(Boolean(fromSearch || fromHash || fromRoute));
  }, [route]);

  const showDemoAccounts = isEvaluatorMode || showDemoManual;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const target = () => (canAccessCMS() ? "/admin" : "/kontribusi-saya");

  // Sudah login → langsung alihkan sesuai peran
  useEffect(() => {
    if (user) {
      router.push(target());
    }
  }, [user, router]);

  const fillDemo = async (a: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(a.email);
    setPassword(a.password);
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);
    try {
      const u = await login(a.email, a.password);
      try {
        localStorage.setItem("waranusa_has_registered", "true");
      } catch {}
      toast.success(`Selamat datang, ${u.name}!`);
      const targetPath = ["SUPER_ADMIN", "EDITOR", "REVIEWER"].includes(u.role)
        ? "/admin"
        : "/kontribusi-saya";
      router.push(targetPath);
    } catch {
      toast.info("Kredensial demo terisi — silakan tekan Masuk.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = "Email wajib diisi.";
    if (!password) errs.password = "Kata sandi wajib diisi.";
    setFieldErrors(errs);
    setFormError(null);
    if (Object.values(errs).some(Boolean)) return;

    setSubmitting(true);
    try {
      const u = await login(email.trim(), password);
      try {
        localStorage.setItem("waranusa_has_registered", "true");
      } catch {}
      toast.success(`Selamat datang, ${u.name}!`);
      const targetPath = ["SUPER_ADMIN", "EDITOR", "REVIEWER"].includes(u.role)
        ? "/admin"
        : "/kontribusi-saya";
      router.push(targetPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal masuk. Coba lagi.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCF8EC] lg:grid lg:grid-cols-2 overflow-x-hidden selection:bg-[#6E472D] selection:text-white">
      {/* ============ PANEL KIRI: BRAND & FILOSOFI (DESKTOP) ============ */}
      <aside
        className="relative hidden overflow-hidden bg-gradient-to-br from-[#2D1F17] via-[#3B271A] to-[#4A3222] p-10 lg:p-14 text-white lg:flex lg:flex-col lg:justify-between select-none"
        aria-label="Tentang WaraNusa"
      >
        {/* Ornamen Geometris Nusantara Samar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#F5ECE0_1px,transparent_1px)] [background-size:20px_20px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#8C5E3C]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#8C5E3C]/15 blur-3xl"
        />

        {/* Logo & Headline Platform */}
        <div
          className="relative cursor-pointer select-none"
          onDoubleClick={() => setShowDemoManual((v) => !v)}
          title="Klik dua kali untuk membuka opsi evaluasi"
        >
          <Link href="/" className="inline-flex items-center gap-3.5 group" aria-label="WaraNusa — Beranda">
            <img
              src="/images/brand/waranusa-logo.png?v=3"
              alt="Logo WaraNusa"
              className="h-12 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FCF8EC]">
                WaraNusa
              </span>
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-stone-300">
                Pelestarian Warisan Nusantara
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone-300 font-normal">
            Platform eksplorasi &amp; pelestarian budaya Indonesia — peta 38 provinsi, katalog artefak bersumber,
            model 3D, dan instrumen musik virtual terintegrasi.
          </p>
        </div>

        {/* Falsafah Luhur Konservasi Digital */}
        <figure className="relative my-auto max-w-md py-8">
          <blockquote className="font-serif text-2xl lg:text-3xl font-bold leading-snug text-[#FCF8EC]">
            &ldquo;Budaya yang dipahami adalah budaya yang lestari.&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-xs lg:text-sm text-stone-300/80 font-medium">
            — Falsafah Luhur Konservasi Digital Nusantara
          </figcaption>
        </figure>

        {/* Chip Akreditasi & SDG 11.4 */}
        <div className="relative pt-6 border-t border-white/10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-xs text-amber-200 backdrop-blur-xs w-fit">
            <Award className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            <span className="font-medium">Sistem Terakreditasi Preservasi Warisan Budaya • SDG 11.4</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Hak Cipta &copy; 2026 WaraNusa. Dikurasi untuk Penjurian UINIC 8.0.
          </p>
        </div>
      </aside>

      {/* ============ PANEL KANAN: FORM KANVAS & MOBILE FLOATING CARD ============ */}
      <main className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen bg-[#FCF8EC]">
        <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 border border-stone-200/80 transition-all my-auto">
          {/* Pill Navigasi Kembali & Mobile Logo */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-[#FAF7F0] px-3.5 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-[#F2ECE1] hover:text-[#2D1E12] transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Beranda</span>
            </Link>

            <div
              className="lg:hidden cursor-pointer select-none"
              onDoubleClick={() => setShowDemoManual((v) => !v)}
              title="Klik dua kali untuk membuka opsi evaluasi"
            >
              <BrandLogo variant="earthy" />
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2D1E12]">
            Masuk ke WaraNusa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
            Portal kurator, editor, dan dewan juri evaluasi WaraNusa.
          </p>

          {/* Form Masuk Utama */}
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {formError && (
              <Alert variant="destructive" role="alert" className="rounded-2xl">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-bold text-stone-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((fe) => ({ ...fe, email: undefined }));
                  }}
                  placeholder="nama@waranusa.id"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "err-lemail" : undefined}
                  className="pl-10 min-h-[46px] bg-[#FAF7F0] border-stone-200 focus:bg-white focus:ring-2 focus:ring-[#8C5E3C] focus:border-transparent transition-all rounded-xl text-sm"
                />
              </div>
              {fieldErrors.email && (
                <p id="err-lemail" className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-xs font-bold text-stone-700">Kata sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((fe) => ({ ...fe, password: undefined }));
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "err-lpass" : undefined}
                  className="pl-10 pr-10 min-h-[46px] bg-[#FAF7F0] border-stone-200 focus:bg-white focus:ring-2 focus:ring-[#8C5E3C] focus:border-transparent transition-all rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="err-lpass" className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="min-h-[46px] w-full rounded-xl bg-gradient-to-r from-[#8C5E3C] to-[#6E472B] hover:from-[#7B5133] hover:to-[#5E3B22] text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
            >
              {submitting ? (
                "Memproses Masuk…"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Masuk ke Sistem
                </span>
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#8C5E3C]" />
              <span>Koneksi Terenkripsi TLS 1.3 • Sesi Terproteksi</span>
            </p>
          </form>

          {/* ============ PANEL KHUSUS EVALUATOR UINIC 8.0 ============ */}
          {showDemoAccounts && (
            <div className="mt-6 pt-6 border-t border-stone-200/80 space-y-3.5 animate-in fade-in duration-300">
              {/* Banner Lencana Juri UINIC 8.0 */}
              <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-amber-100/60 p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-800 shrink-0">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-amber-950 truncate">Mode Akses Dewan Juri UINIC 8.0 Terbuka</p>
                    <p className="text-[10.5px] text-amber-900/80 truncate">Pilih salah satu profil untuk evaluasi instan tanpa perlu mengetik.</p>
                  </div>
                </div>
                {!isEvaluatorMode && (
                  <button
                    type="button"
                    onClick={() => setShowDemoManual(false)}
                    className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded-lg hover:bg-amber-200/50 transition-colors shrink-0"
                  >
                    Tutup
                  </button>
                )}
              </div>

              {/* Grid 4 Kartu Role Juri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_ACCOUNTS.map((a) => (
                  <div
                    key={a.email}
                    className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-[#FAF8F5] p-3 shadow-2xs hover:border-[#8C5E3C]/40 hover:bg-white transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold ${a.badgeClass}`}>
                          {a.role}
                        </span>
                        <span className="text-[9.5px] font-semibold text-stone-500">{a.accessLabel}</span>
                      </div>
                      <p className="mt-2 text-xs font-bold text-[#2D1E12] group-hover:text-[#8C5E3C] transition-colors leading-tight">
                        {a.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-stone-500">
                        {a.email}
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => fillDemo(a)}
                      disabled={submitting}
                      className="mt-3 w-full rounded-xl border border-[#8C5E3C]/30 bg-white hover:bg-[#8C5E3C] hover:text-white text-[#6E472D] text-[11px] font-bold h-8 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      Gunakan Profil Ini
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
