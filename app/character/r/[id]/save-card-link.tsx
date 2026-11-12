"use client";

import { track } from "@vercel/analytics";

export function SaveCardLink({ id }: { id: string }) {
  return (
    <a
      href={`/api/character/card/${id}`}
      download
      onClick={() => track("card_saved", { id })}
      className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border-2 border-ink px-8 py-4 text-lg font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      Save my card &darr;
    </a>
  );
}
