"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { useAuth } from "@/lib/auth-store";
import { useSiteSettings } from "@/lib/settings-store";

interface PublicShellProps {
  children: React.ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  const { init } = useAuth();
  const settings = useSiteSettings((s) => s.settings);
  const loadSettings = useSiteSettings((s) => s.load);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    init();
    loadSettings();
  }, [init, loadSettings]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FCF8EC] text-stone-900 overflow-x-hidden">
        <div className="h-16 w-full border-b border-stone-200/40 bg-[#FCF8EC]" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="h-9 w-9 animate-pulse rounded-full bg-[#8C5E3C]/30" />
            <p className="text-xs font-medium text-stone-500">Memuat WaraNusa…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCF8EC] text-stone-900 overflow-x-hidden">
      <SiteHeader introRevealed={true} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none relative" role="main">
        {children}
      </main>
      <SiteFooter
        siteName={settings.siteName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        footerNote={settings.footerNote}
      />
    </div>
  );
}
