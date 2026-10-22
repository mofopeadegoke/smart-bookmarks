"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

// `data-pending` lets the parent card fade via `has-[[data-pending]]`.
export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      data-pending={pending || undefined}
      className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline disabled:no-underline"
    >
      {pending && <Spinner label="Deleting" />}
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
