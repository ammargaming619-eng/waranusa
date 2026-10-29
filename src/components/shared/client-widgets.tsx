"use client";

import dynamic from "next/dynamic";

const AccessibilityWidget = dynamic(
  () =>
    import("@/components/shared/accessibility-widget").then(
      (m) => m.AccessibilityWidget
    ),
  { ssr: false }
);

const UnifiedAssistantWidget = dynamic(
  () =>
    import("@/components/shared/unified-assistant-widget").then(
      (m) => m.UnifiedAssistantWidget
    ),
  { ssr: false }
);

export function ClientWidgets() {
  return (
    <>
      <AccessibilityWidget />
      <UnifiedAssistantWidget />
    </>
  );
}
