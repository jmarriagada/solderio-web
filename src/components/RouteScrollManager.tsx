"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * RouteScrollManager ensures that whenever the user navigates between different pages,
 * the new page always starts immediately from the top (0, 0) with no upward sweeping animations.
 */
export function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // If there is no specific anchor target in the URL, reset scroll to absolute top immediately
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  }, [pathname]);

  return null;
}
