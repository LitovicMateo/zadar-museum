/**
 * Tests for whitelist validation functions
 */
import {
  validateWhitelist,
  validateOptionalWhitelist,
  validateSeason,
  validateLeagueSlug,
  ALLOWED_DATABASES,
  ALLOWED_STATS,
  ALLOWED_LOCATIONS,
} from "./whitelists";

describe("validateWhitelist", () => {
  it("should return value if it is in the whitelist", () => {
    const result = validateWhitelist("zadar", ALLOWED_DATABASES, "database");
    expect(result).toBe("zadar");
  });

  it("should throw error if value is not in whitelist", () => {
    expect(() => {
      validateWhitelist("invalid", ALLOWED_DATABASES, "database");
    }).toThrow('Invalid database: "invalid". Allowed values: zadar, opponent');
  });

  it("should throw error if value is null", () => {
    expect(() => {
      validateWhitelist(null, ALLOWED_DATABASES, "database");
    }).toThrow("database is required");
  });

  it("should throw error if value is undefined", () => {
    expect(() => {
      validateWhitelist(undefined, ALLOWED_DATABASES, "database");
    }).toThrow("database is required");
  });

  it("should work with different whitelists", () => {
    expect(validateWhitelist("total", ALLOWED_STATS, "stats")).toBe("total");
    expect(validateWhitelist("home", ALLOWED_LOCATIONS, "location")).toBe(
      "home",
    );
  });
});

describe("validateOptionalWhitelist", () => {
  it("should return value if it is in the whitelist", () => {
    const result = validateOptionalWhitelist(
      "zadar",
      ALLOWED_DATABASES,
      "database",
    );
    expect(result).toBe("zadar");
  });

  it("should return null if value is null or undefined", () => {
    expect(
      validateOptionalWhitelist(null, ALLOWED_DATABASES, "database"),
    ).toBeNull();
    expect(
      validateOptionalWhitelist(undefined, ALLOWED_DATABASES, "database"),
    ).toBeNull();
  });

  it("should throw error if value is not in whitelist", () => {
    expect(() => {
      validateOptionalWhitelist("invalid", ALLOWED_DATABASES, "database");
    }).toThrow('Invalid database: "invalid". Allowed values: zadar, opponent');
  });
});

describe("validateSeason", () => {
  it("should return null for null or undefined", () => {
    expect(validateSeason(null)).toBeNull();
    expect(validateSeason(undefined)).toBeNull();
  });

  it("should accept valid 4-digit years", () => {
    expect(validateSeason("2023")).toBe("2023");
    expect(validateSeason("2024")).toBe("2024");
    expect(validateSeason("1900")).toBe("1900");
    expect(validateSeason("2100")).toBe("2100");
  });

  it("should reject non-4-digit formats", () => {
    expect(() => validateSeason("23")).toThrow("Invalid season format");
    expect(() => validateSeason("202")).toThrow("Invalid season format");
    expect(() => validateSeason("20234")).toThrow("Invalid season format");
    expect(() => validateSeason("abcd")).toThrow("Invalid season format");
  });

  it("should reject years outside valid range", () => {
    expect(() => validateSeason("1899")).toThrow("Invalid season year");
    expect(() => validateSeason("2101")).toThrow("Invalid season year");
  });
});

describe("validateLeagueSlug", () => {
  it("should return null for null or undefined", () => {
    expect(validateLeagueSlug(null)).toBeNull();
    expect(validateLeagueSlug(undefined)).toBeNull();
  });

  it("should accept valid league slugs", () => {
    expect(validateLeagueSlug("a1-liga")).toBe("a1-liga");
    expect(validateLeagueSlug("super-liga")).toBe("super-liga");
    expect(validateLeagueSlug("liga123")).toBe("liga123");
  });

  it("should reject slugs with uppercase letters", () => {
    expect(() => validateLeagueSlug("A1-Liga")).toThrow("Invalid league slug");
  });

  it("should reject slugs with special characters", () => {
    expect(() => validateLeagueSlug("a1_liga")).toThrow("Invalid league slug");
    expect(() => validateLeagueSlug("a1.liga")).toThrow("Invalid league slug");
    expect(() => validateLeagueSlug("a1 liga")).toThrow("Invalid league slug");
  });

  it("should reject slugs longer than 50 characters", () => {
    const longSlug = "a".repeat(51);
    expect(() => validateLeagueSlug(longSlug)).toThrow("League slug too long");
  });

  it("should accept slugs exactly 50 characters", () => {
    const slug = "a".repeat(50);
    expect(validateLeagueSlug(slug)).toBe(slug);
  });
});
