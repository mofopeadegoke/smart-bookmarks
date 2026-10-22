import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, bookmarkTags, tags } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { deleteBookmark } from "@/app/actions";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { AutoRefresh } from "@/components/auto-refresh";

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

  // This user's bookmarks, newest first
  const rows = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, user.id))
    .orderBy(desc(bookmarks.createdAt));

  // NEW: every (bookmark, tag name) pair for this user
  const tagRows = await db
    .select({ bookmarkId: bookmarkTags.bookmarkId, name: tags.name })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(eq(tags.userId, user.id));

  // NEW: group them, so we can look up "which tags does bookmark X have?"
  const tagsByBookmark = new Map<string, string[]>();
  for (const { bookmarkId, name } of tagRows) {
    const list = tagsByBookmark.get(bookmarkId) ?? [];
    list.push(name);
    tagsByBookmark.set(bookmarkId, list);
  }

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
                <form action={deleteBookmark.bind(null, b.id)}>
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>

              {b.status === "pending" && <p className="mt-2 text-sm text-gray-500">Analyzing…</p>}

              {b.status === "ready" && (
                <>
                  <p className="mt-2 text-sm">{b.summary}</p>
                  {/* NEW: the tags */}
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {(tagsByBookmark.get(b.id) ?? []).map((name) => (
                      <li key={name} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {name}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {b.status === "failed" && (
                <p className="mt-2 text-sm text-red-600">
                  Couldn't analyze this page: {b.error ?? "unknown error"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}