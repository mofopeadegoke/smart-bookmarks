import Link from "next/link";
import { bookmarksHref } from "@/lib/urls";

type Props = {
  tags: { name: string; count: number }[];
  active?: string;
  q?: string;
};

export function TagFilter({ tags, active, q }: Props) {
  if (tags.length === 0) return null;

  const base = "rounded-full border px-3 py-1 text-sm";
  const on = "border-black bg-black text-white";
  const off = "hover:bg-gray-100";

  return (
    <nav aria-label="Filter by tag" className="flex flex-wrap gap-2">
      <Link
        href={bookmarksHref({ q })}
        aria-current={!active ? "page" : undefined}
        className={`${base} ${!active ? on : off}`}
      >
        All
      </Link>

      {tags.map((t) => (
        <Link
          key={t.name}
          href={bookmarksHref({ q, tag: t.name })}
          aria-current={active === t.name ? "page" : undefined}
          className={`${base} ${active === t.name ? on : off}`}
        >
          {t.name} <span className="opacity-60">({t.count})</span>
        </Link>
      ))}
    </nav>
  );
}