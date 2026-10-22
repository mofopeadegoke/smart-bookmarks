import Link from "next/link";
import { getBookmarks, getTagCounts, getTagsByBookmark } from "@/lib/queries";
import { bookmarksHref } from "@/lib/urls";
import { deleteBookmark } from "@/app/actions";
import { AutoRefresh } from "@/components/auto-refresh";
import { DeleteButton } from "@/components/delete-button";
import { Spinner } from "@/components/spinner";
import { TagFilter } from "@/components/tag-filter";

type Props = { userId: string; q?: string; tag?: string };

export async function BookmarkList({ userId, q, tag }: Props) {
  const [rows, tagCounts, tagsByBookmark] = await Promise.all([
    getBookmarks(userId, { q, tag }),
    getTagCounts(userId),
    getTagsByBookmark(userId),
  ]);

  const anyPending = rows.some((b) => b.status === "pending");
  const filtering = Boolean(q || tag);

  return (
    <section className="flex flex-col gap-4">
      <AutoRefresh active={anyPending} />
      <TagFilter tags={tagCounts} active={tag} q={q} />

      {filtering && (
        <p className="text-sm text-gray-600">
          {rows.length} {rows.length === 1 ? "result" : "results"}
          {q && <> for &ldquo;{q}&rdquo;</>}
          {tag && <> tagged <strong>{tag}</strong></>}
          {" · "}
          <Link href="/" className="underline">Clear</Link>
        </p>
      )}

      {rows.length === 0 ? (
        <p className="text-gray-500">
          {filtering ? "No bookmarks match." : "No bookmarks yet. Paste a link to start."}
        </p>
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
                      <li key={name}>
                        <Link
                          href={bookmarksHref({ q, tag: name })}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-200"
                        >
                          {name}
                        </Link>
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
    </section>
  );
}

export function BookmarkListSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-4">
      <div className="flex animate-pulse gap-2">
        <div className="h-7 w-14 rounded-full bg-gray-200" />
        <div className="h-7 w-20 rounded-full bg-gray-200" />
        <div className="h-7 w-16 rounded-full bg-gray-200" />
      </div>
      <ul className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="animate-pulse rounded-md border p-4">
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-full rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}