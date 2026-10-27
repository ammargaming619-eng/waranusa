import { Suspense } from "react";
import ArchiveView from "@/components/archive/archive-view";
import { PublicShell } from "@/components/site/public-shell";

export const metadata = {
  title: "Arsip & Rujukan Budaya — WaraNusa",
  description: "Daftar sumber, buku rujukan, dan dokumentasi akademik pelestarian budaya Indonesia di WaraNusa.",
};

export default function ArsipPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <ArchiveView />
      </Suspense>
    </PublicShell>
  );
}
