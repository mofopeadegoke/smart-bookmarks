"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  return (
    <button
      onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/" })}
      className="rounded-md bg-black px-4 py-2 text-white"
    >
      Sign in with GitHub
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.refresh(); // reload the page so it shows the signed-out view
      }}
      className="rounded-md border px-4 py-2"
    >
      Sign out
    </button>
  );
}