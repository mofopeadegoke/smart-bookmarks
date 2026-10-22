import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { SearchBox } from "@/components/search-box";
import { BookmarkList, BookmarkListSkeleton } from "@/components/bookmark-list";

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

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Smart Bookmarks</h1>
        <p>Save links. Get summaries and tags automatically.</p>
        <SignInButton />
      </main>
    );
  }

  const params = await searchParams;
  // "?tag=a&tag=b" arrives as an array; ignore it
  const q = typeof params.q === "string" ? params.q.trim() || undefined : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const filterKey = `${q ?? ""}-${tag ?? ""}`;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your bookmarks</h1>
        <SignOutButton />
      </header>

      <AddBookmarkForm />

      {/* Resets the input when the filter changes, e.g. after Clear */}
      <SearchBox key={`search:${filterKey}`} q={q} tag={tag} />

      {/* A new key shows the skeleton while a new filter loads, instead of stale results */}
      <Suspense key={`list:${filterKey}`} fallback={<BookmarkListSkeleton />}>
        <BookmarkList userId={user.id} q={q} tag={tag} />
      </Suspense>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <main aria-busy className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex animate-pulse items-center justify-between">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-10 w-24 rounded-md bg-gray-200" />
      </div>
      <div className="h-10 animate-pulse rounded-md bg-gray-200" />
      <div className="h-10 animate-pulse rounded-md bg-gray-200" />
      <BookmarkListSkeleton />
    </main>
  );
}