import { createHmac, timingSafeEqual } from "node:crypto";
import { decodeResultId } from "./ids";

// Shared reading links look like /character/s/<resultId>.<answers|->.<sig>.
// The signature stops anyone from typing a result id and reading it for free.

function secret(): string {
  const s = process.env.READING_SHARE_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("READING_SHARE_SECRET is not set");
  return "dev-only-reading-share-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url").slice(0, 22);
}

const encodeAnswers = (answers: number[] | null) => (answers ? answers.join("") : "-");

export function signReading(resultId: string, answers: number[] | null): string {
  const a = encodeAnswers(answers);
  return `${resultId}.${a}.${sign(`${resultId}|${a}`)}`;
}

export function verifyReadingToken(token: string): { resultId: string; answers: number[] | null } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [resultId, a, sig] = parts;
  if (!decodeResultId(resultId)) return null;
  if (a !== "-" && !/^[0-3]{4}$/.test(a)) return null;

  const expected = Buffer.from(sign(`${resultId}|${a}`));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  return { resultId, answers: a === "-" ? null : [...a].map(Number) };
}
