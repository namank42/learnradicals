# Character quiz — launch checklist

Branch: `feat/character-quiz`. Production deploys automatically from `main` (Vercel, repo `namank42/learnradicals`).

## Already in place (checked Nov 12)

- Live Stripe webhook `https://www.learnradicals.com/api/webhook` already sends `checkout.session.completed`
  (and `async_payment_succeeded`); the reading email and buyer contact use it. No new webhook needed.
- Vercel production already has `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `RESEND_API_KEY`,
  `NEXT_PUBLIC_BASE_URL`.
- Resend: lists "Character quiz" and "Character buyers" plus fields `quiz_result`, `quiz_character`, `quiz_animal`,
  `quiz_element` exist (same account in test and live).

## 1. Native-speaker review: skipped

- Skipped at launch on Nov 12 at the owner's call. The 26 flagged rows in `docs/launch/chinese-review.md` were
  self-checked. If a reader sends corrections later, edit `lib/character/content/*.ts`, then run `pnpm test` and
  `python3 -E scripts/subset-fonts.py --check`.

## 2. Live Stripe: done Nov 12

- [x] Live products and prices (Learn Radicals account, created via the Stripe connector because the CLI live key
      is restricted):
      reading `prod_Vc6iJRMbBTuNwp`: $7 `price_1UasVLBk3hlYQLIh96sYQmsc`, $4 SEA `price_1UasVfBk3hlYQLIheZ1JJuVc`;
      kit `prod_Vc6iXh8xD43fU1`: $5 `price_1UasVMBk3hlYQLIhmOqE8ROS`, $3 SEA `price_1UasVgBk3hlYQLIh3FAFNHxX`.
- [x] Payment method domains `learnradicals.com` and `www.learnradicals.com` registered; Apple Pay shows active.

## 3. Vercel production env: done Nov 12

- [x] Added to Production: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live), the four `STRIPE_PRICE_*` ids above,
      `READING_SHARE_SECRET` (random, sensitive; never change it after launch), `RESEND_SEGMENT_QUIZ`,
      `RESEND_SEGMENT_BUYERS`. Preview deploys don't have them.

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
