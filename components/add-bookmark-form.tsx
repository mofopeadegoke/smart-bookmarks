"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleAlert, Link2, Plus } from "lucide-react";
import { saveBookmark, type SaveState } from "@/app/actions";
import { Spinner } from "@/components/spinner";

export function AddBookmarkForm() {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(saveBookmark, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card transition-shadow focus-within:shadow-lift">
        <Link2 className="ml-2 size-5 shrink-0 text-ink-3" aria-hidden />
        <label htmlFor="url" className="sr-only">Link to save</label>
        <input
          id="url"
          name="url"
          placeholder="Paste a link to save"
          required
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-ink-3 focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {pending ? <Spinner label="Saving" /> : <Plus className="size-4" strokeWidth={2.5} aria-hidden />}
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="flex items-center gap-1.5 px-2 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {state.error}
        </p>
      )}
    </form>
  );
}
