import { Suspense } from "react";
import { CalendarDays, Library } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getBookmarkStats } from "@/lib/queries";
import { savedOn } from "@/lib/dates";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { SearchBox } from "@/components/search-box";
import { BookmarkList, BookmarkListSkeleton } from "@/components/bookmark-list";
import { BrandMark } from "@/components/brand";
import { Sidebar, SidebarTags, SidebarTagsSkeleton } from "@/components/sidebar";
import { Welcome } from "@/components/welcome";

type SearchParams = Promise<{ q?: string | string[]; tag?: string | string[] }>;

// With cacheComponents, reading the session and search params must happen inside <Suspense>.
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Home searchParams={searchParams} />
    </Suspense>
  );
}

async function Home({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();

  if (!user) return <Welcome />;

  const params = await searchParams;
  // "?tag=a&tag=b" arrives as an array; ignore it
  const q = typeof params.q === "string" ? params.q.trim() || undefined : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const filterKey = `${q ?? ""}-${tag ?? ""}`;

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <Sidebar user={user}>
        <Suspense fallback={<SidebarTagsSkeleton />}>
          <SidebarTags user={user} q={q} tag={tag} />
        </Suspense>
      </Sidebar>

      <main className="bg-dots min-w-0 flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-10 md:py-12">
          <header className="flex flex-col gap-3">
            <BrandMark size="lg" />
            <h1 className="text-4xl font-bold tracking-tight md:text-[2.75rem]">Bookmarks</h1>
            <Suspense fallback={<div className="h-7 w-72 animate-pulse rounded-lg bg-line" />}>
              <PageProperties userId={user.id} />
            </Suspense>
          </header>
          <AddBookmarkForm />
          {/* Resets the input when the filter changes, e.g. after Clear */}
          <SearchBox key={`search:${filterKey}`} q={q} tag={tag} />
          {/* A new key shows the skeleton while a new filter loads, instead of stale results */}
          <Suspense key={`list:${filterKey}`} fallback={<BookmarkListSkeleton />}>
            <BookmarkList userId={user.id} q={q} tag={tag} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function PageProperties({ userId }: { userId: string }) {
  const { total, lastSaved } = await getBookmarkStats(userId);
  const property = "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-sm text-ink-2 tabular-nums";

  return (
    <dl className="-ml-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
      <div className={property}>
        <Library className="size-4 text-ink-3" aria-hidden />
        <dt className="sr-only">Bookmarks</dt>
        <dd>{total} {total === 1 ? "bookmark" : "bookmarks"}</dd>
      </div>
      {lastSaved && (
        <div className={property}>
          <CalendarDays className="size-4 text-ink-3" aria-hidden />
          <dt>Last saved</dt>
          <dd className="font-medium text-ink">{savedOn.format(lastSaved)}</dd>
        </div>
      )}
    </dl>
  );
}

function HomeSkeleton() {
  return (
    <div aria-busy className="flex flex-1 flex-col md:flex-row">
      <div className="h-24 border-b border-line bg-sidebar md:h-screen md:w-66 md:border-r md:border-b-0" />
      <div className="bg-dots flex-1">
        <div className="mx-auto flex max-w-5xl animate-pulse flex-col gap-6 px-4 py-8 md:px-10 md:py-12">
          <div className="size-14 rounded-2xl bg-line" />
          <div className="h-10 w-56 rounded-lg bg-line" />
          <div className="h-14 rounded-2xl bg-line" />
          <div className="h-11 max-w-md rounded-xl bg-line" />
        </div>
      </div>
    </div>
  );
}
