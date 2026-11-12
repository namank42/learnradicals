"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

type Props = { id: string; char: string; decode: string; variant?: "button" | "link" };

/**
 * One tap: phones get the native share sheet with the Story card image attached;
 * browsers without it get the link copied (or shown, if the clipboard is blocked).
 */
export function ShareButton({ id, char, decode, variant = "button" }: Props) {
  const cardUrl = `/api/character/card/${id}`;
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com"}/character/r/${id}`;
  const text = `My Chinese character is ${char}: “${decode}” What's yours?`;
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");

  // iOS only allows navigator.share() straight after a tap, so load the image beforehand.
  useEffect(() => {
    let cancelled = false;
    fetch(cardUrl)
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (blob && !cancelled) setFile(new File([blob], `my-chinese-character-${char}.png`, { type: "image/png" }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [cardUrl, char]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("manual"); // clipboard is often blocked in Threads/Instagram in-app browsers
    }
    track("share", { id, method: "copy" });
  }

  async function share() {
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, url: pageUrl });
        track("share", { id, method: "native_image" });
      } else if (navigator.share) {
        await navigator.share({ title: "My Chinese character", text, url: pageUrl });
        track("share", { id, method: "native_link" });
      } else {
        await copyLink();
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") await copyLink();
    }
  }

  return (
    <>
      {variant === "link" ? (
        <button onClick={share} className="text-sm font-medium text-gray underline-offset-4 hover:text-ink hover:underline">
          {status === "copied" ? "Link copied!" : "Share my character \u2197"}
        </button>
      ) : (
        <button
          onClick={share}
          className="cta-button w-full rounded-2xl bg-ink px-8 py-4 text-lg font-medium text-paper"
        >
          {status === "copied" ? "Link copied!" : "Share my character"}
        </button>
      )}
      {status === "manual" && (
        <input
          readOnly
          value={pageUrl}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Link to your result — press and hold to copy"
          className="mt-2 w-full rounded-xl border border-gray-light bg-white px-3 py-2 text-center text-sm text-ink"
        />
      )}
    </>
  );
}
