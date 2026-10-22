import Form from "next/form";

export function SearchBox({ q, tag }: { q?: string; tag?: string }) {
  return (
    <Form action="/" role="search" className="flex gap-2">
      <label htmlFor="q" className="sr-only">Search bookmarks</label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search titles and summaries"
        className="flex-1 rounded-md border px-3 py-2"
      />
      {tag && <input type="hidden" name="tag" value={tag} />}
      <button type="submit" className="rounded-md border px-4 py-2">Search</button>
    </Form>
  );
}