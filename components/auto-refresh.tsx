"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Polls so background analysis results appear without a manual reload.
export function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => router.refresh(), 2000);
    return () => clearInterval(timer);
  }, [active, router]);

  return null;
}