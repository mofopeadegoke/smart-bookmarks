import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { deleteBookmark } from "@/app/actions";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { AutoRefresh } from "@/components/auto-refresh";

export default async function Home() {
  const user = await getCurrentUser();

  // Signed out: show the welcome screen
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Smart Bookmarks</h1>
        <p>Save links. Get summaries and tags automatically.</p>
        <SignInButton />
      </main>
    );
  }

  // Signed in: get ONLY this user's bookmarks, newest first
  const rows = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, user.id))
    .orderBy(desc(bookmarks.createdAt));

  const anyPending = rows.some((b) => b.status === "pending");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your bookmarks</h1>
        <SignOutButton />
      </header>

      <AddBookmarkForm />
      <AutoRefresh active={anyPending} />

      {rows.length === 0 ? (
        <p className="text-gray-500">No bookmarks yet. Paste a link to start.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((b) => (
            <li key={b.id} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    {b.title ?? new URL(b.url).hostname}
                  </a>
                  <p className="truncate text-sm text-gray-500">{b.url}</p>
                </div>

                {/* .bind fills in which bookmark to delete */}
                <form action={deleteBookmark.bind(null, b.id)}>
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>

              {b.status === "pending" && <p className="mt-2 text-sm text-gray-500">Analyzing…</p>}
              {b.status === "ready" && <p className="mt-2 text-sm">{b.summary}</p>}
              {b.status === "failed" && (
                <p className="mt-2 text-sm text-red-600">Couldn't analyze this page.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}