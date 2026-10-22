import Link from "next/link";
import { Library } from "lucide-react";
import { bookmarksHref } from "@/lib/urls";
import { toneFor } from "@/lib/tag-colors";

type Props = {
  total: number;
  tags: { name: string; count: number }[];
  active?: string;
  q?: string;
};

const item =
  "flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[15px] text-ink-2 transition-colors hover:bg-hover hover:text-ink md:shrink";
const current = "bg-accent !text-accent-ink font-medium hover:bg-accent-hover [&_.count]:text-accent-ink [&_svg]:text-accent-ink";

export function TagFilter({ total, tags, active, q }: Props) {
  return (
    <nav aria-label="Filter by tag" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      <Link
        href={bookmarksHref({ q })}
        aria-current={!active ? "page" : undefined}
        className={`${item} ${!active ? current : ""}`}
      >
        <Library className="size-4 text-ink-3" aria-hidden />
        All bookmarks
        <span className="count ml-auto pl-2 text-sm text-ink-3 tabular-nums">{total}</span>
      </Link>

      {tags.length > 0 && (
        <p className="hidden px-2.5 pt-5 pb-1.5 text-xs font-semibold tracking-wide text-ink-3 uppercase md:block">
          Tags
        </p>
      )}

      {tags.map((t) => (
        <Link
          key={t.name}
          href={bookmarksHref({ q, tag: t.name })}
          aria-current={active === t.name ? "page" : undefined}
          className={`${item} ${active === t.name ? current : ""}`}
        >
          <span aria-hidden className={`tone-${toneFor(t.name)} size-2.5 shrink-0 rounded-full bg-(--t-dot)`} />
          <span className="truncate">{t.name}</span>
          <span className="count ml-auto pl-2 text-sm text-ink-3 tabular-nums">{t.count}</span>
        </Link>
      ))}
    </nav>
  );
}
