"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/spinner";

type Props = Omit<ComponentProps<"button">, "type" | "disabled"> & {
  pendingText?: string;
};

export function FormButton({ children, pendingText, className = "", ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-1 disabled:opacity-60 ${className}`}
    >
      {pending ? (
        <>
          <Spinner label={pendingText ?? "Working"} />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
