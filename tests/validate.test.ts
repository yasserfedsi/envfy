import { describe, expect, test, beforeEach } from "vitest";
import { validateEnv } from "../src";

describe("validateEnv", () => {
  test("validates string", () => {
    process.env.NAME = "Ahmed";

    const env = validateEnv({
      NAME: "string",
    });

    expect(env.NAME).toBe("Ahmed");
  });

  test("validates number", () => {
    process.env.PORT = "3000";

    const env = validateEnv({
      PORT: "number",
    });

    expect(env.PORT).toBe(3000);
  });

  test("validates boolean", () => {
    process.env.DEBUG = "true";

    const env = validateEnv({
      DEBUG: "boolean",
    });

    expect(env.DEBUG).toBe(true);
  });

  test("throws when missing", () => {
    delete process.env.MISSING;

    expect(() => {
      validateEnv({
        MISSING: "string",
      });
    }).toThrow();
  });

  test("validates enum values", () => {
    process.env.NODE_ENV = "development";

    const env = validateEnv({
      NODE_ENV: ["development", "production", "test"],
    });

    expect(env.NODE_ENV).toBe("development");
  });

  test("throws on invalid enum", () => {
    process.env.NODE_ENV = "staging";

    expect(() =>
      validateEnv({
        NODE_ENV: ["development", "production", "test"],
      }),
    ).toThrow("NODE_ENV must be one of");
  });

  test("collects multiple validation errors", () => {
    process.env.PORT = "abc";
    process.env.DEBUG = "yes";

    expect(() =>
      validateEnv({
        PORT: "number",
        DEBUG: "boolean",
        DATABASE_URL: "string",
      }),
    ).toThrowError("Environment validation failed");
  });
});

beforeEach(() => {
  delete process.env.NAME;
  delete process.env.PORT;
  delete process.env.DEBUG;
  delete process.env.MISSING;
  delete process.env.NODE_ENV;
});
