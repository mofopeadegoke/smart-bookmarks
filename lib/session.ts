import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Who is signed in? Returns the user, or null if nobody is.
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// The guard: use this in any code that saves or reads bookmarks.
// Stops right away if nobody is signed in.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
