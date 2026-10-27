import { Suspense } from "react";
import InstrumentView from "@/components/instrument/instrument-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instrumen Virtual — WaraNusa",
  description: "Studio interaktif 38 alat musik tradisional Nusantara dengan simulasi tangga nada dan akustik alami.",
};

export default function VirtualInstrumentsPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <InstrumentView />
      </Suspense>
    </PublicShell>
  );
}
