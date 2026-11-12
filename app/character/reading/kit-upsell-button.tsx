"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { getStripe } from "../stripe-client";

type Result = { status: "succeeded" } | { status: "requires_action"; clientSecret: string } | { status: "failed"; message: string };

/** One tap: charges the card saved at the reading checkout, then refreshes to show the kit download. */
export function KitUpsellButton({ sessionId, priceLabel }: { sessionId: string | null; priceLabel: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState("");

  async function buy() {
    if (!sessionId) return;
    setState("working");
    setError("");
    track("kit_click");
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
      setState("idle");
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={buy}
        disabled={!sessionId || state !== "idle"}
        className="w-full rounded-2xl bg-ink px-6 py-4 font-medium text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "working" ? "Adding your kit…" : state === "done" ? "Added! Loading your kit…" : `Add the kit — ${priceLabel}`}
      </button>
      <p className="mt-2 text-center text-xs text-gray">
        {sessionId ? "One tap. Charged to the card you just used." : "One-tap purchase works after a real checkout (preview)."}
      </p>
      {error && <p className="mt-2 text-center text-sm text-red" role="alert">{error}</p>}
    </div>
  );
}
