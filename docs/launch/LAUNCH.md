# Character quiz — launch checklist

Branch: `feat/character-quiz`. Production deploys automatically from `main` (Vercel, repo `namank42/learnradicals`).

## Already in place (checked Nov 12)

- Live Stripe webhook `https://www.learnradicals.com/api/webhook` already sends `checkout.session.completed`
  (and `async_payment_succeeded`); the reading email and buyer contact use it. No new webhook needed.
- Vercel production already has `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `RESEND_API_KEY`,
  `NEXT_PUBLIC_BASE_URL`.
- Resend: lists "Character quiz" and "Character buyers" plus fields `quiz_result`, `quiz_character`, `quiz_animal`,
  `quiz_element` exist (same account in test and live).

## 1. Native-speaker review (you)

- [ ] Send `docs/launch/chinese-review.md` to a fluent reader. 26 rows are flagged ⚑. Corrections go into
      `lib/character/content/*.ts`, then `pnpm test` and `python3 -E scripts/subset-fonts.py --check`.

## 2. Live Stripe (needs your OK)

- [ ] Create live products and prices:
      `STRIPE_PROJECT=learnradicals scripts/stripe-setup.sh --live`
      → reading $7 / $4, kit $5 / $3. Prints the four `STRIPE_PRICE_*` ids.
- [ ] Register Apple Pay / Google Pay / Link domains for embedded checkout: `learnradicals.com` and
      `www.learnradicals.com` (Stripe payment method domains). Only `checkout.stripe.com` is registered today.

## 3. Vercel production env (needs your OK)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | live publishable key (`pk_live_…`, Learn Radicals) |
| `STRIPE_PRICE_READING_STD` / `_SEA` | from step 2 |
| `STRIPE_PRICE_GOAT_KIT_STD` / `_SEA` | from step 2 |
| `READING_SHARE_SECRET` | new random string (`openssl rand -base64 32`); never change it after launch |
| `RESEND_SEGMENT_QUIZ` / `RESEND_SEGMENT_BUYERS` | ids from `scripts/resend-setup.mjs` (in `.env.local`) |

## 4. Ship (needs your OK)

- [ ] Merge `feat/character-quiz` into `main` and push → Vercel production deploy.
- [ ] Smoke test on the live site: `/character` → quiz → result → share card preview → example reading.

## 5. Live purchase test (you pay, I refund)

- [ ] On your phone: unlock a reading with a real card ($7). Check the reading opens, the email arrives,
      Apple Pay shows in the sheet, the PDF and wallpapers download, then add the kit ($5) with Confirm.
- [ ] Refund both charges in Stripe (I can do this via the Stripe connector once you say so).

## 6. Go live

- [ ] Threads bio link → `https://learnradicals.com/character`.
- [ ] Note the start date. After 14 days read: completion (`quiz_complete` / `quiz_start` ≥ 40%),
      unlock rate (reading sales / completions ≥ 3%), kit attach rate.
      Note: Vercel custom events (`track()`) need a Vercel Pro plan; on Hobby, use Stripe + server logs.
