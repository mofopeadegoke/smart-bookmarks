"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveBookmark, type SaveState } from "@/app/actions";
import { Spinner } from "@/components/spinner";

export function AddBookmarkForm() {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(saveBookmark, {});
  const formRef = useRef<HTMLFormElement>(null);

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
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending && <Spinner label="Saving" />}
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}