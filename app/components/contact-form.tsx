"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-lg font-bold text-ink mb-1">Message sent!</h2>
        <p className="text-sm text-gray">We&rsquo;ll get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 p-6 space-y-4">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
              Name <span className="text-gray text-xs font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={100}
              className="w-full rounded-xl border border-gray-light bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/50 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              maxLength={320}
              className="w-full rounded-xl border border-gray-light bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={2000}
              rows={5}
              className="w-full rounded-xl border border-gray-light bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-red/30 focus:border-red/50 transition-colors resize-y"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-xl bg-red px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "sending" ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </form>

      {status === "error" && (
        <p className="mt-3 text-sm text-red text-center">{errorMessage}</p>
      )}
    </>
  );
}
