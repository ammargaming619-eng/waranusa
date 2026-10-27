import { Suspense } from "react";
import Exploration3DView from "@/components/explore/exploration-3d-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eksplorasi 3D — WaraNusa",
  description: "Wahana visualisasi 3D arsitektur rumah adat dan instrumen musik tradisional dari 38 provinsi di Indonesia.",
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
