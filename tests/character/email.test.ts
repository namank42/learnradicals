import { describe, expect, it } from "vitest";
import { freeCardEmailHtml, isValidEmail, quizProperties } from "@/lib/character/email-capture";
import { getResult } from "@/lib/character";

describe("email capture", () => {
  it.each(["a@b.co", "first.last+tag@example.com"])("accepts %s", (e) => expect(isValidEmail(e)).toBe(true));
  it.each(["", "nope", "a@b", "a b@c.com", "a@b.c", `${"x".repeat(250)}@b.com`])("rejects %j", (e) =>
    expect(isValidEmail(e)).toBe(false),
  );

  it("tags contacts with the result", () => {
    const view = getResult("wisdom-rabbit-fire")!;
    expect(quizProperties(view)).toEqual({
      quiz_result: "wisdom-rabbit-fire",
      quiz_character: "慧",
      quiz_animal: "rabbit",
      quiz_element: "fire",
    });
  });

  it("emails the card, the decode, an unlock link and an unsubscribe note", () => {
    const html = freeCardEmailHtml(getResult("wisdom-rabbit-fire")!);
    expect(html).toContain("/api/character/card/wisdom-rabbit-fire");
    expect(html).toContain("/character/r/wisdom-rabbit-fire");
    expect(html).toContain("Wisdom is a heart");
    expect(html).toContain("unsubscribe anytime");
  });
});
