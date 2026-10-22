"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/spinner";

// `data-pending` lets the parent card fade via `has-[[data-pending]]`.
export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      data-pending={pending || undefined}
      title="Delete"
      className="inline-flex size-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-danger-bg hover:text-danger"
    >
      {pending ? <Spinner label="Deleting" /> : <Trash2 className="size-4" aria-hidden />}
      <span className="sr-only">{pending ? "Deleting…" : "Delete"}</span>
    </button>
  );
}
