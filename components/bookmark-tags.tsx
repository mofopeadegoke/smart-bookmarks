import Link from "next/link";
import { Plus, X } from "lucide-react";
import { addTag, removeTag } from "@/app/actions";
import { bookmarksHref } from "@/lib/urls";
import { toneFor } from "@/lib/tag-colors";
import { FormButton } from "@/components/form-button";

type Props = { bookmarkId: string; tags: string[]; q?: string };

export function BookmarkTags({ bookmarkId, tags, q }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ul className="contents">
        {tags.map((name, i) => (
          <li
            key={name}
            style={{ "--i": i } as React.CSSProperties}
            className={`tag-pill tone-${toneFor(name)} inline-flex items-center rounded-md bg-(--t-bg) text-sm text-(--t-ink)`}
          >
            <Link href={bookmarksHref({ q, tag: name })} className="inline-flex items-center gap-1.5 py-0.5 pl-2 hover:underline">
              <span aria-hidden className="size-1.5 rounded-full bg-(--t-dot)" />
              {name}
            </Link>
            <form action={removeTag.bind(null, bookmarkId, name)}>
              <FormButton
                aria-label={`Remove tag ${name}`}
                className="ml-0.5 rounded px-1 py-0.5 opacity-60 hover:opacity-100"
              >
                <X className="size-3.5" aria-hidden />
              </FormButton>
            </form>
          </li>
        ))}
      </ul>

      {/* Collapsed by width rather than display:none, so keyboard users can still tab into it. */}
      <form action={addTag.bind(null, bookmarkId)} className="group inline-flex items-center overflow-hidden rounded-md text-sm whitespace-nowrap text-ink-3 transition-[opacity,max-width] focus-within:bg-hover hover:bg-hover pointer-fine:max-w-0 pointer-fine:opacity-0 pointer-fine:group-hover/card:max-w-48 pointer-fine:group-hover/card:opacity-100 pointer-fine:focus-within:max-w-48 pointer-fine:focus-within:opacity-100">
        <label htmlFor={`tag-${bookmarkId}`} className="sr-only">Add a tag</label>
        <Plus className="ml-1.5 size-3.5 shrink-0" aria-hidden />
        <input
          id={`tag-${bookmarkId}`}
          name="tag"
          required
          maxLength={30}
          placeholder="Add tag"
          className="w-20 bg-transparent px-1 py-0.5 text-ink outline-none placeholder:text-ink-3 focus:w-28 focus-visible:outline-none"
        />
        <span className="hidden group-focus-within:inline-flex">
          <FormButton pendingText="Adding…" className="pr-2 font-medium text-ink">
            Add
          </FormButton>
        </span>
      </form>
    </div>
  );
}
