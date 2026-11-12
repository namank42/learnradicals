"use client";

import { useCallback, useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { track } from "@vercel/analytics";
import { getStripe } from "../../stripe-client";

type Props = { id: string; char: string; answers: string | null; priceLabel: string; className?: string; style?: React.CSSProperties };

/** Unlock button that opens Stripe's embedded checkout in a sheet, so buyers never leave the page. */
export function UnlockSheet({ id, char, answers, priceLabel, className, style }: Props) {
  const [open, setOpen] = useState(false);
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/character/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, answers }),
    });
    const data = (await res.json()) as { clientSecret?: string; error?: string };
    if (!data.clientSecret) throw new Error(data.error ?? "Could not start checkout");
    return data.clientSecret;
  }, [id, answers]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => {
          track("unlock_click", { id });
          setOpen(true);
        }}
        className={className}
        style={style}
      >
        Unlock your full reading — {priceLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Unlock your full reading"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white pb-4 shadow-2xl md:max-w-lg md:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-light/50 bg-white px-5 py-4">
              <p className="font-heading text-lg font-bold text-ink">
                Unlock your <span className="quiz-char text-red" lang="zh">{char}</span> reading
              </p>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full px-2 text-2xl leading-none text-gray hover:text-ink">
                &times;
              </button>
            </div>
            <div className="px-2 pt-2">
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
