import { Suspense } from "react";
import AdminApp from "@/components/admin/admin-app";

export const metadata = {
  title: "CMS Dashboard — WaraNusa",
  description: "Panel pengelolaan konten dan kurasi data budaya Nusantara WaraNusa.",
};

export default function AdminSlugPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
      <AdminApp />
    </Suspense>
  );
}
