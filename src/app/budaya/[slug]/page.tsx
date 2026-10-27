import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `Objek Budaya ${slug} — WaraNusa`,
    description: `Pelajari detail dan dokumentasi mendalam tentang warisan budaya ${slug} di WaraNusa.`,
  };
}

const CultureDetailView = dynamic(
  () => import("@/components/culture/culture-detail-view"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
        Memuat Objek Budaya...
      </div>
    ),
  }
);

export default async function CultureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Objek Budaya...
          </div>
        }
      >
        <CultureDetailView slug={slug} />
      </Suspense>
    </PublicShell>
  );
}
