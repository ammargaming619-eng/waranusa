import { Suspense } from "react";
import { PublicShell } from "@/components/site/public-shell";
import Exploration3DView from "@/components/explore/exploration-3d-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eksplorasi 3D Rumah Adat — WaraNusa",
  description: "Wahana visualisasi 3D arsitektur rumah adat vernakular dari 38 provinsi di Indonesia.",
};

export default function ThreeDAliasPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Eksplorasi 3D...
          </div>
        }
      >
        <Exploration3DView />
      </Suspense>
    </PublicShell>
  );
}
