import { EnvValidationError } from "./errors/validationErrors";
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
  const errors: string[] = [];

  for (const key in schema) {
    const rule = schema[key];

    const value = process.env[key];

    if (value === undefined) {
      errors.push(`Missing environment variable: ${key}`);
      continue;
    }

    try {
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
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push(`Unknown validation error for ${key}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new EnvValidationError(errors);
  }

  return result;
}
