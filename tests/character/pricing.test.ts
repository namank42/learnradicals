import { describe, expect, it } from "vitest";
import { buildReadingMetadata, displayPrices, kitPriceKey, kitPriceKeyForRegion, readingPriceKey } from "@/lib/character/pricing";

describe("readingPriceKey", () => {
  it.each([
    ["ID", "STRIPE_PRICE_READING_SEA"],
    ["vn", "STRIPE_PRICE_READING_SEA"],
    ["MY", "STRIPE_PRICE_READING_SEA"],
    ["PH", "STRIPE_PRICE_READING_SEA"],
    ["TH", "STRIPE_PRICE_READING_SEA"],
    ["US", "STRIPE_PRICE_READING_STD"],
    ["SG", "STRIPE_PRICE_READING_STD"],
    [null, "STRIPE_PRICE_READING_STD"],
    ["", "STRIPE_PRICE_READING_STD"],
  ] as const)("%j -> %s", (country, key) => {
    expect(readingPriceKey(country)).toBe(key);
  });
});

describe("buildReadingMetadata", () => {
  it("always sets product and result_id, overriding attribution keys", () => {
    expect(
      buildReadingMetadata({ vid: "v1", product: "spoofed", result_id: "x" }, "wisdom-rabbit-water"),
    ).toEqual({ vid: "v1", product: "reading", result_id: "wisdom-rabbit-water" });
  });
});

describe("kit pricing", () => {
  it("is +$5 standard and +$3 in Southeast Asia", () => {
    expect(kitPriceKey("US")).toBe("STRIPE_PRICE_GOAT_KIT_STD");
    expect(kitPriceKey("id")).toBe("STRIPE_PRICE_GOAT_KIT_SEA");
    expect(kitPriceKey(null)).toBe("STRIPE_PRICE_GOAT_KIT_STD");
    expect(displayPrices("US")).toEqual({ reading: "$7", kit: "$5", bundle: "$12" });
    expect(displayPrices("VN")).toEqual({ reading: "$4", kit: "$3", bundle: "$7" });
  });
});

describe("kitPriceKeyForRegion", () => {
  it("maps the stored region to the kit price", () => {
    expect(kitPriceKeyForRegion("sea")).toBe("STRIPE_PRICE_GOAT_KIT_SEA");
    expect(kitPriceKeyForRegion("std")).toBe("STRIPE_PRICE_GOAT_KIT_STD");
    expect(kitPriceKeyForRegion(undefined)).toBe("STRIPE_PRICE_GOAT_KIT_STD");
  });
});
