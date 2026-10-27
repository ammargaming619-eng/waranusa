import { Suspense } from "react";
import CatalogView from "@/components/catalog/catalog-view";
import { PublicShell } from "@/components/site/public-shell";

export const metadata = {
  title: "Katalog Budaya Nusantara — WaraNusa",
  description: "Jelajahi dokumentasi lengkap warisan budaya Indonesia: rumah adat, alat musik, tekstil, kuliner, seni pertunjukan, dan tradisi lokal.",
};

export default function CatalogPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <CatalogView />
      </Suspense>
    </PublicShell>
  );
}
