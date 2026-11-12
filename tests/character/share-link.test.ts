import { describe, expect, it } from "vitest";
import { signReading, verifyReadingToken } from "@/lib/character/share-link";

describe("signed reading links", () => {
  it("round-trips a result with answers", () => {
    const t = signReading("wisdom-rabbit-water", [3, 1, 0, 2]);
    expect(verifyReadingToken(t)).toEqual({ resultId: "wisdom-rabbit-water", answers: [3, 1, 0, 2] });
  });

  it("round-trips a result without answers", () => {
    const t = signReading("trust-tiger-fire", null);
    expect(verifyReadingToken(t)).toEqual({ resultId: "trust-tiger-fire", answers: null });
  });

  it("rejects a tampered result id", () => {
    const t = signReading("wisdom-rabbit-water", [3, 1, 0, 2]);
    expect(verifyReadingToken(t.replace("wisdom", "friend"))).toBeNull();
  });

  it("rejects tampered answers", () => {
    const t = signReading("wisdom-rabbit-water", [3, 1, 0, 2]);
    expect(verifyReadingToken(t.replace(".3102.", ".0000."))).toBeNull();
  });

  it.each(["", "wisdom-rabbit-water", "wisdom-rabbit-water.-.", "a.b.c", "nope-cat-air.-.abcdefabcdefabcdef"])(
    "rejects %j",
    (t) => expect(verifyReadingToken(t)).toBeNull(),
  );
});
