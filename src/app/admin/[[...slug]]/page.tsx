import { Suspense } from "react";
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CMS Dashboard — WaraNusa",
  description: "Panel pengelolaan konten dan kurasi data budaya Nusantara WaraNusa.",
};

const AdminApp = dynamic(() => import("@/components/admin/admin-app"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-stone-900" />,
});

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
