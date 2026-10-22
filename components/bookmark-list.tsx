import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmarks, bookmarkTags, tags } from "@/db/schema";
import { deleteBookmark } from "@/app/actions";
import { AutoRefresh } from "@/components/auto-refresh";
import { DeleteButton } from "@/components/delete-button";
import { Spinner } from "@/components/spinner";

export async function BookmarkList({ userId }: { userId: string }) {
  const rows = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));

  const tagRows = await db
    .select({ bookmarkId: bookmarkTags.bookmarkId, name: tags.name })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(eq(tags.userId, userId));

  const tagsByBookmark = new Map<string, string[]>();
  for (const { bookmarkId, name } of tagRows) {
    const list = tagsByBookmark.get(bookmarkId) ?? [];
    list.push(name);
    tagsByBookmark.set(bookmarkId, list);
  }

  const anyPending = rows.some((b) => b.status === "pending");

  return (
    <>
      <AutoRefresh active={anyPending} />

      {rows.length === 0 ? (
        <p className="text-gray-500">No bookmarks yet. Paste a link to start.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((b) => (
            <li key={b.id} className="rounded-md border p-4 transition-opacity has-[[data-pending]]:opacity-50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                    {b.title ?? new URL(b.url).hostname}
                  </a>
                  <p className="truncate text-sm text-gray-500">{b.url}</p>
                </div>
                <form action={deleteBookmark.bind(null, b.id)}>
                  <DeleteButton />
                </form>
              </div>

              {b.status === "pending" && (
                <div className="mt-2">
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Spinner label="Analyzing" /> Analyzing…
                  </p>
                  <div aria-hidden className="mt-2 flex animate-pulse flex-col gap-2">
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-4/5 rounded bg-gray-200" />
                    <div className="mt-1 flex gap-2">
                      <div className="h-5 w-14 rounded-full bg-gray-200" />
                      <div className="h-5 w-20 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              )}

              {b.status === "ready" && (
                <>
                  <p className="mt-2 text-sm">{b.summary}</p>
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
                  Couldn&apos;t analyze this page: {b.error ?? "unknown error"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function BookmarkListSkeleton() {
  return (
    <ul aria-busy className="flex animate-pulse flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="rounded-md border p-4">
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}
