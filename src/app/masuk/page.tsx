import { Suspense } from "react";
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Masuk ke WaraNusa",
  description: "Masuk ke platform WaraNusa untuk mengakses dashboard pengelolaan budaya atau kontribusi.",
};

const LoginView = dynamic(
  () => import("@/components/account/login-view"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
        Memuat Masuk WaraNusa...
      </div>
    ),
  }
);

export default function MasukAliasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCF8EC] flex items-center justify-center font-mono text-sm text-[#7A4B29]">
          Memuat Masuk...
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
