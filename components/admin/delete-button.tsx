"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  confirmText,
  label = "Obriši",
  compact = false,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  confirmText: string;
  label?: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={label}
        className={
          compact
            ? "inline-flex items-center justify-center rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            : "inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        }
      >
        <Trash2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {label}
      </button>
    </form>
  );
}
