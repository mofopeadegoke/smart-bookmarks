import { getCurrentUser } from "@/lib/session";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Smart Bookmarks</h1>
        <p>Save links. Get summaries and tags automatically.</p>
        <SignInButton />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      <p>Your user ID is {user.id}</p>
      <SignOutButton />
    </main>
  );
}