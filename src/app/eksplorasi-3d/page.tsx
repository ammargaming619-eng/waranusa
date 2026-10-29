import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/site/public-shell";

const Exploration3DView = dynamic(() => import("@/components/explore/exploration-3d-view"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
      Memuat Studio 3D Rumah Adat...
    </div>
  ),
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Eksplorasi 3D Rumah Adat — WaraNusa",
  description: "Wahana visualisasi 3D arsitektur rumah adat vernakular dari 38 provinsi di Indonesia dengan fitur bedah struktur interaktif.",
};

export default function Eksplorasi3DPage() {
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
