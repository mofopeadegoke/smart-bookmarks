import { getBookmarkStats, getTagCounts } from "@/lib/queries";
import { BrandMark } from "@/components/brand";
import { SignOutButton } from "@/components/auth-buttons";
import { TagFilter } from "@/components/tag-filter";

type Props = {
  user: { id: string; name: string; email: string };
  q?: string;
  tag?: string;
};

export function Sidebar({ user, children }: { user: Props["user"]; children: React.ReactNode }) {
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <aside className="flex flex-col gap-4 border-b border-line bg-sidebar px-4 py-3 md:sticky md:top-0 md:h-screen md:w-66 md:shrink-0 md:gap-6 md:border-r md:border-b-0 md:px-3 md:py-4">
      <div className="flex items-center gap-2.5 px-1.5">
        <BrandMark />
        <span className="font-semibold tracking-tight">Smart Bookmarks</span>
        <div className="ml-auto md:hidden">
          <SignOutButton />
        </div>
      </div>

      <div className="min-w-0 md:flex-1 md:overflow-y-auto">{children}</div>

      <div className="hidden items-center gap-2.5 rounded-xl px-1.5 py-1 md:flex">
        <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink">
          {initial}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-ink-3">{user.email}</p>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}

export async function SidebarTags({ user, q, tag }: Props) {
  const [stats, tags] = await Promise.all([getBookmarkStats(user.id), getTagCounts(user.id)]);
  return <TagFilter total={stats.total} tags={tags} active={tag} q={q} />;
}

export function SidebarTagsSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse gap-2 md:flex-col">
      {[72, 56, 64, 48, 60].map((w, i) => (
        <div key={i} className="flex h-8 items-center gap-2.5 px-2.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="h-3 rounded bg-line" style={{ width: w }} />
        </div>
      ))}
    </div>
  );
}
