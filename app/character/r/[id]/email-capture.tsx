"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/** Small "Email it to me" link that expands into an inline email box. */
export function EmailCapture({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    try {
      const res = await fetch("/api/character/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id, website }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Couldn't send.");
      track("email_signup", { id });
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return <p className="mt-3 text-sm text-ink">Sent. Check your inbox for your card.</p>;
  }

  if (!open) {
    return (
      <>
        <span className="text-gray-light" aria-hidden="true">·</span>
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-gray underline-offset-4 hover:text-ink hover:underline">
          Email it to me
        </button>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 w-full">
      <div className="flex gap-2">
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Your email"
          className="min-w-0 flex-1 rounded-xl border border-gray-light bg-white px-3 py-3 text-base text-ink focus:border-red focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-paper disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <p className="mt-2 text-[11px] leading-relaxed text-gray/80">
        We&rsquo;ll send your card, and occasional Chinese character notes. Unsubscribe anytime.
      </p>
      {error && <p className="mt-1 text-sm text-red" role="alert">{error}</p>}
    </form>
  );
}
