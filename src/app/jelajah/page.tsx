import { Suspense } from "react";
import ExploreView from "@/components/explore/explore-view";
import { PublicShell } from "@/components/site/public-shell";

export const metadata = {
  title: "Jelajahi Wilayah Budaya 38 Provinsi — WaraNusa",
  description: "Peta interaktif sebaran warisan budaya, rumah adat, dan instrumen musik tradisional di 38 provinsi Indonesia.",
};

export default function JelajahPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <ExploreView />
      </Suspense>
    </PublicShell>
  );
}
