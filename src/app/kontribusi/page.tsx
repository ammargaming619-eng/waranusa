import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kirim Dokumentasi Budaya — WaraNusa",
  description: "Bantu dokumentasikan dan lestarikan warisan budaya Indonesia dengan mengirimkan cerita, foto, dan referensi budaya.",
};

const ContributeView = dynamic(
  () => import("@/components/contribute/contribute-view"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
        Memuat Formulir Kontribusi...
      </div>
    ),
  }
);

export default function KontribusiPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Formulir Kontribusi...
          </div>
        }
      >
        <ContributeView />
      </Suspense>
    </PublicShell>
  );
}
