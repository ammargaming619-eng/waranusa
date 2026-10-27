import { Suspense } from "react";
import MyContributionsView from "@/components/account/my-contributions-view";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kontribusi Saya — WaraNusa",
  description: "Pantau status peninjauan dan riwayat dokumentasi budaya yang telah Anda kirimkan di WaraNusa.",
};

export default function MyContributionsPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="min-h-screen bg-[#FCF8EC]" />}>
        <MyContributionsView />
      </Suspense>
    </PublicShell>
  );
}
