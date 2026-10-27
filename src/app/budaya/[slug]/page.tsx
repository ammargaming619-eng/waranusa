import { Suspense } from "react";
import CultureDetailView from "@/components/culture/culture-detail-view";
import { PublicShell } from "@/components/site/public-shell";

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

export default async function CultureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <CultureDetailView slug={slug} />
      </Suspense>
    </PublicShell>
  );
}
