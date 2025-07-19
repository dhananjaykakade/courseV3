// app/providers.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    if (window.gtag) {
      window.gtag("config", "G-0W7HZG9MF0", {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
