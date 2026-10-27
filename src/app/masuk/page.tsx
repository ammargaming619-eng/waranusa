import { Suspense } from "react";
import LoginView from "@/components/account/login-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Masuk ke WaraNusa",
  description: "Masuk ke platform WaraNusa untuk mengakses dashboard pengelolaan budaya atau kontribusi.",
};

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
