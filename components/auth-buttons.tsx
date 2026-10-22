"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/spinner";

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
      className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {pending && <Spinner label="Signing in" />}
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
      onClick={async () => {
        setPending(true);
        try {
          await authClient.signOut();
          router.refresh();
        } catch {
          setPending(false);
        }
      }}
      className="inline-flex items-center gap-2 rounded-md border px-4 py-2 disabled:opacity-50"
    >
      {pending && <Spinner label="Signing out" />}
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
