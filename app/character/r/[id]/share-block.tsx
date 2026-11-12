"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

type Props = { id: string; char: string; decode: string };

const btn =
  "flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-light bg-white px-2 py-3 text-xs font-medium text-ink transition-colors hover:border-ink";

export function ShareBlock({ id, char, decode }: Props) {
  const cardUrl = `/api/character/card/${id}`;
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com"}/character/r/${id}`;

  // Fetch the card ahead of time: iOS only allows navigator.share() straight after a tap,
  // so the image must already be in memory when the button is pressed.
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

  const text = `My Chinese character is ${char}: “${decode}” What's yours?`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is often blocked in Threads/Instagram in-app browsers: show the link instead.
      setManualCopy(true);
    }
    track("share", { id, method: "copy" });
  }

  async function shareNative() {
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

  const encoded = encodeURIComponent(`${text} ${pageUrl}`);

  return (
    <section className="mt-12 rounded-3xl bg-cream px-5 pb-6 pt-8 text-center">
      <h2 className="font-heading text-2xl font-bold">Share your character</h2>
      <p className="mt-2 text-gray">Your friends will want to know theirs.</p>

      {/* eslint-disable-next-line @next/next/no-img-element -- dynamic next/og image */}
      <img
        src={cardUrl}
        alt={`My Chinese character card: ${char}`}
        width={1080}
        height={1920}
        className="mx-auto mt-6 aspect-[9/16] w-full max-w-[260px] rounded-3xl bg-paper shadow-2xl shadow-black/15"
      />

      <button
        onClick={shareNative}
        className="cta-button mt-7 w-full rounded-2xl bg-ink px-8 py-5 text-lg font-medium text-paper"
      >
        Share my character
      </button>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <a
          href={`https://www.threads.net/intent/post?text=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share", { id, method: "threads" })}
          className={btn}
        >
          <span aria-hidden="true" className="text-lg leading-none">@</span>
          Threads
        </a>
        <a
          href={`https://wa.me/?text=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share", { id, method: "whatsapp" })}
          className={btn}
        >
          <span aria-hidden="true" className="text-lg leading-none">&#9993;</span>
          WhatsApp
        </a>
        <button onClick={copyLink} className={btn}>
          <span aria-hidden="true" className="text-lg leading-none">&#128279;</span>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a href={cardUrl} download onClick={() => track("card_saved", { id })} className={btn}>
          <span aria-hidden="true" className="text-lg leading-none">&darr;</span>
          Save image
        </a>
      </div>
      {manualCopy && (
        <input
          readOnly
          value={pageUrl}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Link to your result"
          className="mt-3 w-full rounded-xl border border-gray-light bg-white px-3 py-2 text-center text-sm text-ink"
        />
      )}
      <p className="mt-3 text-xs text-gray">
        {manualCopy ? "Press and hold the link to copy it." : "Save the image to post it to your Instagram Story."}
      </p>
    </section>
  );
}
