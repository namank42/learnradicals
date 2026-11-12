# Docs Digest — character quiz funnel — 2026-11-12

## next/og ImageResponse (context7: /vercel/next.js) — next 16.1.6 (installed)
- `import { ImageResponse } from 'next/og'`; return `new ImageResponse(<jsx/>, { width, height, fonts: [{ name, data, weight, style }] })` from a route handler or `opengraph-image.tsx`.
- Load fonts once at module scope: `const font = await readFile(join(process.cwd(), 'assets/X.ttf'))` (Node runtime).
- Font formats: the bundled parser accepts TrueType/OpenType (`0x00010000`, `OTTO`) and WOFF (`wOFF`). **No WOFF2** — the existing `public/fonts/noto-serif-sc-*.woff2` cannot be used, and they are 17 KB subsets (landing-page glyphs only).
- Gotcha: a full Noto Serif SC TTF is ~10+ MB. The quiz's character set is fixed and known at build time, so ship a **subset TTF** (pyftsubset) containing only the library's characters + Latin, and add it to `outputFileTracingIncludes` like `private/**`.
- Default font when none is given is Geist Regular (Latin only), so CJK glyphs would render as tofu without a custom font.
- Source: context7 /vercel/next.js; node_modules/next/dist/compiled/@vercel/og/index.node.js (font signature check).

## Stripe Checkout (context7: /websites/stripe) — stripe-node 20.4.0, API 2026-02-25.clover (installed)
- `stripe.checkout.sessions.create({ mode: 'payment', line_items: [...], metadata, success_url, cancel_url, optional_items? })`.
- Adaptive Pricing converts both price IDs and inline `price_data` into the customer's local currency, as long as the price currency is a settlement currency (USD). It is skipped for a currency already defined in the price's `currency_options`, and for `capture_method: manual`.
- Regional pricing: create **two Prices** (e.g. `STRIPE_PRICE_READING_STD` $7 USD, `STRIPE_PRICE_READING_SEA` $4 USD) and pick one server-side from the visitor's country; Adaptive Pricing then shows it in IDR/VND/MYR. Avoid `currency_options` (it disables adaptive conversion for those currencies).
- `optional_items` (added 2025-03-31.basil): `[{ price, quantity, adjustable_quantity? }]`, max 10; not allowed with `ui_mode` `elements`/`form`. Used for the digital Goat-kit pre-order as an order bump.
- Metadata: string key/values, no PII.
- Source: context7 /websites/stripe (adaptive-pricing restrictions, manual-currency-prices, sessions/create optional_items).

## Resend (context7: /websites/resend) — resend 6.9.3 (installed)
- Audiences are deprecated (Nov 2025). Contacts are global; group them with **Segments**.
- `resend.contacts.create({ email, unsubscribed?: false, properties?: {k: string|number|null}, segments?: [{ id }] })` — verified in installed `index.d.mts`.
- Add an existing contact: `resend.contacts.segments.add({ email | contactId, segmentId })`.
- Sending stays `resend.emails.send({ from, to, subject, html })` (already used in app/api/webhook).
- Source: context7 /websites/resend; node_modules/resend/dist/index.d.mts.

## Vercel geolocation — visitor country
- Vercel sets the `x-vercel-ip-country` request header (ISO 3166-1 alpha-2) on production requests; read it in the checkout route handler with `request.headers.get('x-vercel-ip-country')`. Missing locally, so default to the standard price.
- Source: Vercel platform header (not re-verified via context7; it is a stable header and needs no new dependency).

## pdf-lib (context7: /hopding/pdf-lib) — v1.17.1 (installed)
- `const doc = await PDFDocument.create(); doc.setTitle(...); const img = await doc.embedPng(bytes); const page = doc.addPage([w, h]); page.drawImage(img, { x: 0, y: 0, width: w, height: h }); const out: Uint8Array = await doc.save();`
- PNG bytes come from `await new ImageResponse(...).arrayBuffer()` on the server (next/og), one image per page.
- Source: context7 /hopding/pdf-lib (README, PDFPage.drawImage, PDFDocument.save).
