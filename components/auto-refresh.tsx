"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// While `active` is true, reload the page's data every 2 seconds.
// The page passes active={true} only while some bookmark is still pending.
export function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => router.refresh(), 2000);
    return () => clearInterval(timer); // stop when no longer needed
  }, [active, router]);

  return null; // shows nothing on screen
}