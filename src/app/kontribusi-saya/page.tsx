import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/site/public-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kontribusi Saya — WaraNusa",
  description: "Pantau status peninjauan dan riwayat dokumentasi budaya yang telah Anda kirimkan di WaraNusa.",
};

const MyContributionsView = dynamic(
  () => import("@/components/account/my-contributions-view"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
        Memuat Riwayat Kontribusi...
      </div>
    ),
  }
);

export default function MyContributionsPage() {
  return (
    <PublicShell>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
            Memuat Kontribusi...
          </div>
        }
      >
        <MyContributionsView />
      </Suspense>
    </PublicShell>
  );
}
