import { Suspense } from "react";
import AdminApp from "@/components/admin/admin-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CMS Dashboard — WaraNusa",
  description: "Panel pengelolaan konten dan kurasi data budaya Nusantara WaraNusa.",
};

export default async function AdminOptionalSlugPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
      <AdminApp />
    </Suspense>
  );
}
