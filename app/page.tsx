import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";
import { AddBookmarkForm } from "@/components/add-bookmark-form";
import { BookmarkList, BookmarkListSkeleton } from "@/components/bookmark-list";

// With cacheComponents, reading the session must happen inside <Suspense>.
export default function Page() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Home />
    </Suspense>
  );
}

async function Home() {
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
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your bookmarks</h1>
        <SignOutButton />
      </header>

      <AddBookmarkForm />

      <Suspense fallback={<BookmarkListSkeleton />}>
        <BookmarkList userId={user.id} />
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
      <BookmarkListSkeleton />
    </main>
  );
}
