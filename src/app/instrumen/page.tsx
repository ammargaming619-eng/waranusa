import { Suspense } from "react";
import { PublicShell } from "@/components/site/public-shell";
import InstrumentView from "@/components/instrument/instrument-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instrumen Virtual — WaraNusa",
  description: "Studio interaktif 38 alat musik tradisional Nusantara dengan simulasi tangga nada dan akustik alami.",
};

export default function InstrumenAliasPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#1A110B] flex items-center justify-center font-mono text-sm text-[#E5A93C]">
            Memuat Studio Instrumen...
          </div>
        }
      >
        <InstrumentView />
      </Suspense>
    </PublicShell>
  );
}
