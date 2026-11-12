import { describe, expect, it } from "vitest";
import { decodeResultId, encodeResultId } from "@/lib/character/ids";
import { CHARACTERS } from "@/lib/character/content/characters";
import { ANIMALS, ELEMENTS } from "@/lib/character/types";

describe("result ids", () => {
  it("round-trips every combination", () => {
    for (const c of CHARACTERS)
      for (const animal of ANIMALS)
        for (const element of ELEMENTS) {
          const id = encodeResultId(c.slug, animal, element);
          expect(decodeResultId(id)).toEqual({ slug: c.slug, animal, element });
        }
  });

  it("formats as slug-animal-element", () => {
    expect(encodeResultId("wisdom", "rabbit", "water")).toBe("wisdom-rabbit-water");
  });

  it.each(["", "wisdom", "nope-rabbit-water", "wisdom-cat-water", "wisdom-rabbit-air", "wisdom-rabbit-water-x", "WISDOM-rabbit-water"])(
    "rejects %j",
    (id) => expect(decodeResultId(id)).toBeNull(),
  );
});

import { getResult } from "@/lib/character";

describe("getResult", () => {
  it("assembles a view for a valid id", () => {
    const v = getResult("wisdom-rabbit-water");
    expect(v?.character.slug).toBe("wisdom");
    expect(v?.animal.animal).toBe("rabbit");
    expect(v?.element.element).toBe("water");
    expect(v?.pair.slug).toBe(v?.character.pairsWith);
  });

  it("returns null for an unknown id", () => {
    expect(getResult("wisdom-cat-water")).toBeNull();
  });
});
