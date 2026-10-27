import { Suspense } from "react";
import ExploreView from "@/components/explore/explore-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jelajahi Wilayah Budaya 38 Provinsi — WaraNusa",
  description: "Peta interaktif sebaran warisan budaya, rumah adat, dan instrumen musik tradisional di 38 provinsi Indonesia.",
};

export default function JelajahPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FAF5EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Peta Jelajah Nusantara...
          </div>
        }
      >
        <ExploreView />
      </Suspense>
    </PublicShell>
  );
}
