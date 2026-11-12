"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { getStripe } from "../stripe-client";

type Result = { status: "succeeded" } | { status: "requires_action"; clientSecret: string } | { status: "failed"; message: string };

/** Two taps: "Add the kit" shows the price and saved card, "Confirm purchase" charges it; then refreshes to show the download. */
export function KitUpsellButton({
  sessionId,
  priceLabel,
  savedCard,
}: {
  sessionId: string | null;
  priceLabel: string;
  savedCard: string | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "confirming" | "working" | "done">("idle");
  const [error, setError] = useState("");

  async function buy() {
    if (!sessionId) return;
    setState("working");
    setError("");
    try {
      const res = await fetch("/api/character/kit-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      let result = (await res.json()) as Result;
      if (result.status === "requires_action") {
        const stripe = await getStripe();
        const out = stripe ? await stripe.handleNextAction({ clientSecret: result.clientSecret }) : null;
        result = out && !out.error ? { status: "succeeded" } : { status: "failed", message: out?.error?.message ?? "Your bank didn't confirm the payment." };
      }
      if (result.status !== "succeeded") throw new Error(result.message);
      track("kit_purchase");
      setState("done");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setState("confirming");
    }
  }

  const card = savedCard ?? "the card you just used";

  if (state === "confirming" || state === "working") {
    return (
      <div className="mt-4 rounded-2xl border border-gray-light bg-white px-4 py-4 text-center">
        <p className="text-sm text-ink">
          Charge <span className="font-semibold">US{priceLabel}</span> to <span className="font-semibold">{card}</span> for the 2027
          Goat-year kit?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setState("idle")}
            disabled={state === "working"}
            className="rounded-xl border border-gray-light px-4 py-3 text-sm font-medium text-ink disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={buy}
            disabled={state === "working"}
            className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-paper disabled:opacity-60"
          >
            {state === "working" ? "Charging…" : "Confirm purchase"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray">Instant digital download. You&rsquo;ll see it here right away.</p>
        {error && <p className="mt-2 text-sm text-red" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => {
          setError("");
          setState("confirming");
          track("kit_click");
        }}
        disabled={!sessionId || state === "done"}
        className="w-full rounded-2xl bg-ink px-6 py-4 font-medium text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "done" ? "Added! Loading your kit…" : `Add the kit — ${priceLabel}`}
      </button>
      <p className="mt-2 text-center text-xs text-gray">
        {sessionId ? `No card form. You'll confirm before ${card} is charged.` : "Purchase works after a real checkout (preview)."}
      </p>
      {error && <p className="mt-2 text-center text-sm text-red" role="alert">{error}</p>}
    </div>
  );
}
