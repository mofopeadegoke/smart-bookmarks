"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveBookmark, type SaveState } from "@/app/actions";

export function AddBookmarkForm() {
  // useActionState runs saveBookmark and gives back its result plus a "pending" flag
  const [state, formAction, pending] = useActionState<SaveState, FormData>(saveBookmark, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the box after a successful save
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="url" className="sr-only">Link to save</label>
        <input
          id="url"
          name="url"
          placeholder="Paste a link, e.g. react.dev/learn"
          required
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}