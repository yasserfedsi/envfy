import { EnvValidationError } from "./errors/validationErrors";
import {
  parseBoolean,
  parseNumber,
  parseString,
  parseEnum,
} from "./validators";

import type { PrimitiveType, EnumType, Schema } from "./types/index";

export function validateEnv(schema: Schema) {
  const result: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const key in schema) {
    const rule = schema[key];
    const value = process.env[key];

    const isOptional =
      !Array.isArray(rule) &&
      typeof rule === "object" &&
      "optional" in rule &&
      rule.optional === true;

    if (value === undefined) {
      if (isOptional) {
        continue;
      }

      errors.push(`Missing environment variable: ${key}`);
      continue;
    }

    let actualRule: PrimitiveType | EnumType;

    if (Array.isArray(rule)) {
      actualRule = rule;
    } else if (typeof rule === "object" && "type" in rule) {
      actualRule = rule.type;
    } else {
      actualRule = rule;
    }

    try {
      if (Array.isArray(actualRule)) {
        result[key] = parseEnum(key, value, actualRule);
        continue;
      }

      switch (actualRule) {
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
