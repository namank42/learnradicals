#!/usr/bin/env bash
# Creates the character-quiz products and prices with the Stripe CLI and prints the env vars.
# Usage: STRIPE_PROJECT=learnradicals scripts/stripe-setup.sh          (test mode)
#        STRIPE_PROJECT=learnradicals scripts/stripe-setup.sh --live   (live mode; review before running)
set -euo pipefail
# Set STRIPE_PROJECT to use a named CLI profile (e.g. `stripe login --project-name learnradicals`),
# so the Learn Radicals account is used without logging other projects out.
MODE=()
[[ "${1:-}" == "--live" ]] && MODE=(--live)
[[ -n "${STRIPE_PROJECT:-}" ]] && MODE+=(--project-name "$STRIPE_PROJECT")

price_id() { python3 -E -c 'import sys,json;print(json.load(sys.stdin)["id"])'; }

reading=$(stripe products create ${MODE[@]+"${MODE[@]}"} --name "Your Chinese character: full reading" \
  -d "description=Your full Chinese character reading, wallpapers and PDF. Digital download." | price_id)
kit=$(stripe products create ${MODE[@]+"${MODE[@]}"} --name "2027 Year of the Goat kit" \
  -d "description=20-page PDF planner and lucky guide for your zodiac animal. Digital download." | price_id)

std=$(stripe prices create ${MODE[@]+"${MODE[@]}"} --product "$reading" --currency usd --unit-amount 700 | price_id)
sea=$(stripe prices create ${MODE[@]+"${MODE[@]}"} --product "$reading" --currency usd --unit-amount 400 | price_id)
kstd=$(stripe prices create ${MODE[@]+"${MODE[@]}"} --product "$kit" --currency usd --unit-amount 500 | price_id)
ksea=$(stripe prices create ${MODE[@]+"${MODE[@]}"} --product "$kit" --currency usd --unit-amount 300 | price_id)

cat <<OUT
STRIPE_PRICE_READING_STD=$std
STRIPE_PRICE_READING_SEA=$sea
STRIPE_PRICE_GOAT_KIT_STD=$kstd
STRIPE_PRICE_GOAT_KIT_SEA=$ksea
OUT
