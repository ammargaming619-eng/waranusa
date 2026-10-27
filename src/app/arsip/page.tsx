import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arsip & Rujukan Budaya — WaraNusa",
  description: "Daftar sumber, buku rujukan, dan dokumentasi akademik pelestarian budaya Indonesia di WaraNusa.",
};

const ArchiveView = dynamic(
  () => import("@/components/archive/archive-view"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
        Memuat Arsip & Rujukan...
      </div>
    ),
  }
);

export default function ArsipPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Arsip...
          </div>
        }
      >
        <ArchiveView />
      </Suspense>
    </PublicShell>
  );
}
