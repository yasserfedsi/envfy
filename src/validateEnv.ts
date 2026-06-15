import {
  parseBoolean,
  parseNumber,
  parseString,
  parseEnum,
} from "./validators";

export type PrimitiveType = "string" | "number" | "boolean";

export type EnumType = readonly string[];

export type Schema = Record<string, PrimitiveType | EnumType>;

export function validateEnv(schema: Schema) {
  const result: Record<string, unknown> = {};

  for (const key in schema) {
    const rule = schema[key];

    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    if (Array.isArray(rule)) {
      result[key] = parseEnum(key, value, rule);
      continue;
    }

    switch (rule) {
      case "string":
        result[key] = parseString(value);
        break;

      case "number":
        result[key] = parseNumber(key, value);
        break;

      case "boolean":
        result[key] = parseBoolean(key, value);
        break;
    }
  }

  return result;
}
