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

  test("allows missing optional variable", () => {
    delete process.env.API_KEY;

    expect(() =>
      validateEnv({
        API_KEY: {
          type: "string",
          optional: true,
        },
      }),
    ).not.toThrow();
  });

  test("validates optional variable when present", () => {
    process.env.API_KEY = "secret";

    const env = validateEnv({
      API_KEY: {
        type: "string",
        optional: true,
      },
    });

    expect(env.API_KEY).toBe("secret");
  });

  test("throws when optional variable has an invalid value", () => {
    process.env.PORT = "abc";

    expect(() =>
      validateEnv({
        PORT: {
          type: "number",
          optional: true,
        },
      }),
    ).toThrow("PORT must be a valid number");
  });

  test("still throws for required variable", () => {
    delete process.env.API_KEY;

    expect(() =>
      validateEnv({
        API_KEY: "string",
      }),
    ).toThrow();
  });

  test("uses default string value", () => {
    delete process.env.HOST;

    const env = validateEnv({
      HOST: {
        type: "string",
        default: "localhost",
      },
    });

    expect(env.HOST).toBe("localhost");
  });

  test("uses default number value", () => {
    delete process.env.PORT;

    const env = validateEnv({
      PORT: {
        type: "number",
        default: 3000,
      },
    });

    expect(env.PORT).toBe(3000);
  });

  test("uses default boolean value", () => {
    delete process.env.DEBUG;

    const env = validateEnv({
      DEBUG: {
        type: "boolean",
        default: true,
      },
    });

    expect(env.DEBUG).toBe(true);
  });

  test("environment variable overrides default", () => {
    process.env.PORT = "8080";

    const env = validateEnv({
      PORT: {
        type: "number",
        default: 3000,
      },
    });

    expect(env.PORT).toBe(8080);
  });

  test("required variable without default still throws", () => {
    delete process.env.PORT;

    expect(() =>
      validateEnv({
        PORT: "number",
      }),
    ).toThrow();
  });

  test("throws when optional and default are used together", () => {
    expect(() =>
      validateEnv({
        API_KEY: {
          type: "string",
          optional: true,
          default: "secret",
        },
      }),
    ).toThrow('API_KEY cannot have both "optional" and "default". Choose one.');
  });

  beforeEach(() => {
    delete process.env.NAME;
    delete process.env.PORT;
    delete process.env.DEBUG;
    delete process.env.MISSING;
    delete process.env.NODE_ENV;
    delete process.env.API_KEY;
    delete process.env.HOST;
    delete process.env.API_KEY;
  });
});
