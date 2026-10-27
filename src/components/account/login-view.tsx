"use client";

/**
 * WaraNusa — LoginView (#/masuk)
 * Tampilan mandiri (tanpa header publik). Split layar: panel brand kiri,
 * formulir masuk kanan + kartu akun demo (hanya pengisian otomatis, bukan login langsung).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Box, Eye, EyeOff, KeyRound, Lock, LogIn, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { navigate, type Route } from "@/lib/router";
import { BrandLogo, BrandMark } from "@/components/shared/brand-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

void Sparkles;

const DEMO_ACCOUNTS = [
  { email: "admin@waranusa.id", password: "Admin#2025", role: "Super Admin" },
  { email: "editor@waranusa.id", password: "Editor#2025", role: "Editor" },
  { email: "reviewer@waranusa.id", password: "Reviewer#2025", role: "Reviewer" },
  { email: "kontributor@waranusa.id", password: "Kontrib#2025", role: "Kontributor" },
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

  const fillDemo = (a: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(a.email);
    setPassword(a.password);
    setFieldErrors({});
    setFormError(null);
    toast.info("Kredensial demo terisi — tekan Masuk untuk melanjutkan.");
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
      const targetPath = (["SUPER_ADMIN", "EDITOR", "REVIEWER"].includes(u.role)) ? "/admin" : "/kontribusi-saya";
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
    <div className="flex min-h-screen flex-col bg-background lg:grid lg:grid-cols-2">
      {/* ============ PANEL BRAND (desktop) ============ */}
      <aside
        className="relative hidden overflow-hidden bg-gradient-to-br from-[#24170E] via-[#3D2617] to-[#5C3B24] p-10 pb-28 lg:pb-32 text-white lg:flex lg:flex-col lg:justify-between"
        aria-label="Tentang WaraNusa"
      >
        {/* Hiasan bunder-bunder (dipertahankan dengan nuansa hangat) */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -right-16 h-64 w-64 rounded-full bg-[#8C5E3C]/20 blur-2xl" />

        <div className="relative">
          {/* Logo baru resmi WaraNusa */}
          <Link href="/" className="inline-flex items-center gap-3 group" aria-label="WaraNusa — Beranda">
            <img
              src="/images/brand/waranusa-logo.png?v=3"
              alt="Logo WaraNusa"
              className="h-12 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FCF8EC]">
                WaraNusa
              </span>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-stone-300 mt-0.5">
                Pelestarian Warisan Nusantara
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone-200">
            Platform eksplorasi &amp; pelestarian budaya Indonesia — peta wilayah, katalog objek,
            model 3D, dan instrumen virtual dalam satu tempat.
          </p>
        </div>
        <figure className="relative my-8 max-w-md">
          <blockquote className="font-serif text-2xl font-bold leading-snug text-[#FCF8EC]">
            &ldquo;Budaya yang dipahami adalah budaya yang lestari.&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm text-stone-300">— Nilai yang kami pegang</figcaption>
        </figure>
        <ul className="relative space-y-4 mb-4">
          {[
            { icon: MapPinned, text: "Peta interaktif 38 provinsi budaya Nusantara" },
            { icon: Box, text: "Model 3D & instrumen musik virtual yang bisa dimainkan" },
            { icon: ShieldCheck, text: "Dokumentasi transparan dengan sumber terverifikasi" },
          ].map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm text-stone-200">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-200">
                <f.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </aside>

      {/* ============ FORM ============ */}
      <main className="flex flex-1 flex-col px-4 py-8 sm:px-8 lg:justify-center lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Brand kecil untuk mobile + tautan kembali */}
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="lg:hidden">
              <BrandLogo variant="earthy" />
            </div>
            <Link
              href="/"
              className="ml-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2D1E12] sm:text-3xl">
            Masuk ke WaraNusa
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Untuk pengelola konten dan kontributor terdaftar.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {formError && (
              <Alert variant="destructive" role="alert" className="rounded-2xl">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
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
                className="min-h-[48px]"
              />
              {fieldErrors.email && (
                <p id="err-lemail" className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">Kata sandi</Label>
              <div className="relative">
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
                  className="min-h-[48px] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" aria-hidden="true" /> : <Eye className="h-4.5 w-4.5" aria-hidden="true" />}
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
              className="min-h-[48px] w-full rounded-full bg-gradient-to-r from-[#6E472D] to-[#8C5E3C] hover:from-[#5C3B24] hover:to-[#785032] text-base font-bold text-white shadow-md transition-all"
            >
              {submitting ? (
                "Memproses…"
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Masuk
                </>
              )}
            </Button>
          </form>

          {/* ============ AKUN DEMO (HANYA MUNCUL JIKA ?demo=evaluator ATAU DIKLIK MANUAL OLEH JURI) ============ */}
          {showDemoAccounts ? (
            <Card className="mt-8 rounded-3xl border-stone-200 bg-[#FCFAF6] shadow-sm animate-in fade-in duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-[#2D1E12]">
                    <KeyRound className="h-4.5 w-4.5 text-[#8C5E3C]" aria-hidden="true" />
                    Akun Demo (data seeder)
                  </CardTitle>
                  {isEvaluatorMode ? (
                    <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Sesi Penjurian Aktif
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDemoManual(false)}
                      className="text-xs text-stone-400 hover:text-stone-600 font-medium transition-colors"
                    >
                      Sembunyikan
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {DEMO_ACCOUNTS.map((a) => (
                  <div
                    key={a.email}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 shadow-xs"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2D1E12]">{a.role}</p>
                      <p className="truncate font-mono text-[11px] text-stone-500">
                        {a.email} / {a.password}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fillDemo(a)}
                      className="min-h-[36px] shrink-0 rounded-full text-xs font-bold text-[#6E472D] hover:bg-[#8C5E3C]/10 hover:text-[#5C3B24]"
                    >
                      Isi otomatis
                    </Button>
                  </div>
                ))}
                <p className="flex items-start gap-1.5 pt-1 text-[11px] text-stone-500">
                  <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  Kredensial demo disediakan khusus untuk evaluasi dan pengujian sistem.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowDemoManual(true)}
                className="text-xs text-stone-400 hover:text-[#6E472D] transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-[#6E472D]"
              >
                Akses Penjurian Lomba? Klik di sini
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
