"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/spinner";
import { GitHubMark } from "@/components/brand";

export function SignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          // On success the browser leaves for GitHub, so we stay "pending" until then
          await authClient.signIn.social({ provider: "github", callbackURL: "/" });
        } catch {
          setPending(false);
        }
      }}
      className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-ink px-5 font-semibold text-canvas shadow-card transition-transform hover:-translate-y-px hover:shadow-lift disabled:opacity-70"
    >
      {pending ? <Spinner label="Signing in" /> : <GitHubMark />}
      {pending ? "Signing in…" : "Sign in with GitHub"}
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      disabled={pending}
      title="Sign out"
      onClick={async () => {
        setPending(true);
        try {
          await authClient.signOut();
          router.refresh();
        } catch {
          setPending(false);
        }
      }}
      className="inline-flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:opacity-70"
    >
      {pending ? <Spinner label="Signing out" /> : <LogOut className="size-4" aria-hidden />}
      <span className="sr-only">{pending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
