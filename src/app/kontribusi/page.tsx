import { Suspense } from "react";
import ContributeView from "@/components/contribute/contribute-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kirim Dokumentasi Budaya — WaraNusa",
  description: "Bantu dokumentasikan dan lestarikan warisan budaya Indonesia dengan mengirimkan cerita, foto, dan referensi budaya.",
};

export default function KontribusiPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <ContributeView />
      </Suspense>
    </PublicShell>
  );
}
