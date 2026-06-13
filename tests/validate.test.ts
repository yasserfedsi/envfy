import { parseNumber, parseBoolean, parseString } from "../src/validators";
import { describe, expect, test } from "vitest";

describe("validators", () => {
  test("parses number", () => {
    expect(parseNumber("PORT", "3000")).toBe(3000);
  });

  test("throws on invalid number", () => {
    expect(() => parseNumber("PORT", "abc")).toThrow();
  });

  test("parses true", () => {
    expect(parseBoolean("DEBUG", "true")).toBe(true);
  });

  test("parses false", () => {
    expect(parseBoolean("DEBUG", "false")).toBe(false);
  });

  test("throws on invalid boolean", () => {
    expect(() => parseBoolean("DEBUG", "yes")).toThrow();
  });

  test("returs string", () => {
    expect(parseString("hello")).toBe("hello");
  });
});
