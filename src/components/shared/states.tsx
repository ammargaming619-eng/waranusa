"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

export function Loader({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground", className)} role="status" aria-live="polite">
      <Loader2 className="h-7 w-7 animate-spin text-brand-teal" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi kesalahan",
  message,
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 py-14 px-6 text-center", className)} role="alert">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      {message && <p className="max-w-md text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" /> Coba lagi
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 py-14 px-6 text-center", className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Icon className="h-6 w-6 text-brand-teal" />
        </div>
      )}
      <h3 className="font-semibold">{title}</h3>
      {message && <p className="max-w-md text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "light",
  titleClassName,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  variant?: "light" | "dark" | "maroon-sans";
  titleClassName?: string;
  className?: string;
}) {
  const isDark = variant === "dark";
  const isMaroonSans = variant === "maroon-sans";
  return (
    <div className={cn("space-y-2", align === "center" && "text-center mx-auto max-w-2xl", className)}>
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em]",
            align === "center" && "justify-center",
            isDark ? "text-[#D4A843]" : "text-[#7A4B29]"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("inline-block h-[1.5px] w-6", isDark ? "bg-[#D4A843]/70" : "bg-[#7A4B29]/70")}
          />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2
        className={cn(
          isMaroonSans
            ? "font-sans text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#482B18]"
            : "font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight",
          !isMaroonSans && (isDark ? "text-[#FAF6F0]" : "text-[#2D1E12]"),
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm md:text-base leading-relaxed text-balance",
            isDark ? "text-stone-300" : "text-stone-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
