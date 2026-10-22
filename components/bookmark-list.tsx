import Link from "next/link";
import { CircleAlert, RefreshCw, Sparkles } from "lucide-react";
import { getBookmarks, getTagsByBookmark } from "@/lib/queries";
import { toneFor } from "@/lib/tag-colors";
import { savedOn } from "@/lib/dates";
import { deleteBookmark, reanalyzeBookmark } from "@/app/actions";
import { AutoRefresh } from "@/components/auto-refresh";
import { BookmarkTags } from "@/components/bookmark-tags";
import { BrandMark } from "@/components/brand";
import { DeleteButton } from "@/components/delete-button";
import { FormButton } from "@/components/form-button";
import { TypingDots } from "@/components/typing-dots";

type Props = { userId: string; q?: string; tag?: string };
type Bookmark = Awaited<ReturnType<typeof getBookmarks>>[number];


export async function BookmarkList({ userId, q, tag }: Props) {
  const [rows, tagsByBookmark] = await Promise.all([
    getBookmarks(userId, { q, tag }),
    getTagsByBookmark(userId),
  ]);

  const anyPending = rows.some((b) => b.status === "pending");
  const filtering = Boolean(q || tag);

  return (
    <section className="flex flex-col gap-4">
      <AutoRefresh active={anyPending} />

      {filtering && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-2">
          <span className="tabular-nums">
            {rows.length} {rows.length === 1 ? "result" : "results"}
          </span>
          {q && <span>for &ldquo;<span className="font-medium text-ink">{q}</span>&rdquo;</span>}
          {tag && (
            <span className="inline-flex items-center gap-1.5">
              tagged
              <span className={`tone-${toneFor(tag)} inline-flex items-center gap-1.5 rounded-md bg-(--t-bg) px-2 py-0.5 text-(--t-ink)`}>
                <span aria-hidden className="size-1.5 rounded-full bg-(--t-dot)" />
                {tag}
              </span>
            </span>
          )}
          <Link href="/" className="rounded-md px-1.5 font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            Clear
          </Link>
        </p>
      )}

      {rows.length === 0 ? (
        <EmptyState filtering={filtering} />
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)] items-start gap-3 lg:grid-cols-2">
          {rows.map((b) => (
            <BookmarkCard
              key={b.id}
              bookmark={b}
              tags={tagsByBookmark.get(b.id) ?? []}
              q={q}
              justReady={b.status === "ready" && b.savedRecently}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function BookmarkCard({ bookmark: b, tags, q, justReady }: { bookmark: Bookmark; tags: string[]; q?: string; justReady: boolean }) {
  const host = new URL(b.url).hostname.replace(/^www\./, "");
  const pending = b.status === "pending";

  return (
    <li
      className={`group/card relative flex min-w-0 flex-col gap-3 rounded-2xl border p-5 transition-[opacity,box-shadow] has-[[data-pending]]:opacity-50 ${
        pending
          ? "border-transparent bg-sticky text-sticky-ink shadow-card"
          : `border-line bg-surface shadow-card hover:shadow-lift ${justReady ? "just-ready" : ""}`
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`tone-${toneFor(host)} grid size-9 shrink-0 place-items-center rounded-lg bg-(--t-bg) text-sm font-bold text-(--t-ink) uppercase`}
        >
          {host.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 font-semibold leading-snug tracking-tight hover:underline"
          >
            {b.title ?? host}
          </a>
          <p className={`flex min-w-0 gap-1.5 text-sm ${pending ? "opacity-75" : "text-ink-3"}`}>
            <span className="sr-only">{b.url}</span>
            <span aria-hidden className="truncate">{b.url.replace(/^https?:\/\//, "")}</span>
            <span aria-hidden>·</span>
            <span className="shrink-0 tabular-nums">{savedOn.format(b.createdAt)}</span>
          </p>
        </div>
        <div className="-mt-1 -mr-2 flex shrink-0 items-center">
          {!pending && (
            <form action={reanalyzeBookmark.bind(null, b.id)}>
              <FormButton
                aria-label="Re-analyze"
                title="Re-analyze"
                className="size-8 justify-center rounded-lg text-ink-3 hover:bg-hover hover:text-ink"
              >
                <RefreshCw className="size-4" aria-hidden />
              </FormButton>
            </form>
          )}
          <form action={deleteBookmark.bind(null, b.id)}>
            <DeleteButton />
          </form>
        </div>
      </div>

      {pending && (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4" aria-hidden />
            Claude is reading this page
            <TypingDots />
            <span className="sr-only">Analyzing…</span>
          </p>
          <div aria-hidden className="flex flex-col gap-2 opacity-40">
            <div className="h-2.5 w-full rounded-full bg-current/30" />
            <div className="h-2.5 w-3/4 rounded-full bg-current/30" />
          </div>
        </div>
      )}

      {b.status === "ready" && (
        <>
          <p className="text-[15px] leading-relaxed text-ink-2">{b.summary}</p>
          <BookmarkTags bookmarkId={b.id} tags={tags} q={q} />
        </>
      )}

      {b.status === "failed" && (
        <p className="flex items-start gap-2 rounded-xl bg-danger-bg px-3 py-2.5 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>Couldn&apos;t analyze this page: {b.error ?? "unknown error"}. Try Re-analyze, or delete it.</span>
        </p>
      )}
    </li>
  );
}

function EmptyState({ filtering }: { filtering: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface/70 px-6 py-14 text-center">
      <BrandMark size="lg" />
      {filtering ? (
        <>
          <p className="text-lg font-semibold">No bookmarks match.</p>
          <p className="max-w-sm text-ink-2">Try fewer words, or clear the filter to see everything.</p>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold">No bookmarks yet.</p>
          <p className="max-w-sm text-ink-2">Paste a link above. Claude will summarize it and add tags in a few seconds.</p>
        </>
      )}
    </div>
  );
}

export function BookmarkListSkeleton() {
  return (
    <ul aria-busy className="grid animate-pulse grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          <div className="flex gap-3">
            <div className="size-9 rounded-lg bg-line" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-2/3 rounded bg-line" />
              <div className="h-3 w-1/2 rounded bg-line" />
            </div>
          </div>
          <div className="h-3 w-full rounded bg-line" />
          <div className="h-3 w-5/6 rounded bg-line" />
          <div className="flex gap-1.5">
            <div className="h-5 w-14 rounded-md bg-line" />
            <div className="h-5 w-20 rounded-md bg-line" />
          </div>
        </li>
      ))}
    </ul>
  );
}
