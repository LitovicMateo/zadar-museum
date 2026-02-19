import { seasonSchema } from "./common";

describe("seasonSchema", () => {
  test("accepts 'all' (case-insensitive)", () => {
    expect(seasonSchema.parse("all")).toBe("all");
    expect(seasonSchema.parse("ALL")).toBe("ALL");
    expect(seasonSchema.parse("All")).toBe("All");
  });

  test("accepts valid 4-digit year within range", () => {
    expect(seasonSchema.parse("2025")).toBe("2025");
    expect(seasonSchema.parse("1900")).toBe("1900");
    expect(seasonSchema.parse("2100")).toBe("2100");
  });

  test("rejects invalid format and out-of-range years", () => {
    expect(() => seasonSchema.parse("20a5")).toThrow();
    expect(() => seasonSchema.parse("20244")).toThrow();
    expect(() => seasonSchema.parse("1800")).toThrow();
  });

  test("allows empty / null / undefined", () => {
    expect(seasonSchema.parse("")).toBeUndefined();
    expect(seasonSchema.parse(null)).toBeNull();
    // when optional + undefined, Zod's parse will throw for missing arg, so use safeParse
    expect(seasonSchema.safeParse(undefined).success).toBe(true);
  });
});
