import { Suspense } from "react";
import CatalogView from "@/components/catalog/catalog-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Katalog Budaya Nusantara — WaraNusa",
  description: "Jelajahi dokumentasi lengkap warisan budaya Indonesia: rumah adat, alat musik, tekstil, kuliner, seni pertunjukan, dan tradisi lokal.",
};

export default function CatalogPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Katalog Budaya...
          </div>
        }
      >
        <CatalogView />
      </Suspense>
    </PublicShell>
  );
}
