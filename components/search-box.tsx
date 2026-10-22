import Form from "next/form";
import { Search } from "lucide-react";

export function SearchBox({ q, tag }: { q?: string; tag?: string }) {
  return (
    <Form action="/" role="search" className="flex max-w-xl items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 transition-colors focus-within:border-ink-3">
        <Search className="size-4 shrink-0 text-ink-3" aria-hidden />
        <label htmlFor="q" className="sr-only">Search bookmarks</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search titles and summaries"
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-3 focus-visible:outline-none"
        />
      </div>
      {tag && <input type="hidden" name="tag" value={tag} />}
      <button
        type="submit"
        className="h-10 rounded-xl border border-line bg-surface px-4 text-[15px] font-medium transition-colors hover:bg-hover"
      >
        Search
      </button>
    </Form>
  );
}
