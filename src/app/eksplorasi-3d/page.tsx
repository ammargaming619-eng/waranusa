import { Suspense } from "react";
import Exploration3DView from "@/components/explore/exploration-3d-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eksplorasi 3D Rumah Adat — WaraNusa",
  description: "Wahana visualisasi 3D arsitektur rumah adat vernakular dari 38 provinsi di Indonesia dengan fitur bedah struktur interaktif.",
};

export default function Eksplorasi3DPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <Exploration3DView />
      </Suspense>
    </PublicShell>
  );
}
