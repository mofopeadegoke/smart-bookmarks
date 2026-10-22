import Link from "next/link";
import { addTag, removeTag } from "@/app/actions";
import { bookmarksHref } from "@/lib/urls";
import { FormButton } from "@/components/form-button";

type Props = { bookmarkId: string; tags: string[]; q?: string };

export function BookmarkTags({ bookmarkId, tags, q }: Props) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <ul className="flex flex-wrap gap-2">
        {tags.map((name) => (
          <li
            key={name}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-0.5 pr-1 pl-2 text-xs text-gray-700"
          >
            <Link href={bookmarksHref({ q, tag: name })} className="hover:underline">
              {name}
            </Link>
            <form action={removeTag.bind(null, bookmarkId, name)}>
              <FormButton
                aria-label={`Remove tag ${name}`}
                className="rounded-full px-1 hover:bg-gray-200"
              >
                ×
              </FormButton>
            </form>
          </li>
        ))}
      </ul>

      <form action={addTag.bind(null, bookmarkId)} className="flex items-center gap-1">
        <label htmlFor={`tag-${bookmarkId}`} className="sr-only">Add a tag</label>
        <input
          id={`tag-${bookmarkId}`}
          name="tag"
          required
          maxLength={30}
          placeholder="add tag"
          className="w-24 rounded-full border px-2 py-0.5 text-xs"
        />
        <FormButton pendingText="Adding…" className="text-xs text-gray-600 hover:underline">
          Add
        </FormButton>
      </form>
    </div>
  );
}
