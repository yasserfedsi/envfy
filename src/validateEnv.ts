import { EnvValidationError } from "./errors/validationErrors";
import { EnvSchemaError } from "./errors/schemaError";
import {
  parseBoolean,
  parseNumber,
  parseString,
  parseEnum,
} from "./validators";

import type { PrimitiveType, EnumType, Schema } from "./types/index";

import type { InferSchema } from "./types/index";

export function validateEnv<T extends Schema>(schema: T): InferSchema<T> {
  const result: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const key in schema) {
    const rule = schema[key];
    let value = process.env[key];

    const isOptionalObject = !Array.isArray(rule) && typeof rule === "object";
    const isOptional =
      isOptionalObject && "optional" in rule && rule.optional === true;

    // if (isOptionalObject && rule.optional && rule.default !== undefined) {
    //   throw new EnvSchemaError(
    //     `${key} cannot have both "optional" and "default". Choose one. `,
    //   );
    // }

    if (
      isOptionalObject &&
      "optional" in rule &&
      rule.optional &&
      rule.default !== undefined
    ) {
      throw new EnvSchemaError(
        `${key} cannot have both "optional" and "default". Choose one. `,
      );
    }

    if (
      value === undefined &&
      isOptionalObject &&
      "default" in rule &&
      rule.default !== undefined
    ) {
      value = String(rule.default);
    }

    if (value === undefined) {
      if (isOptional) {
        continue;
      }
      errors.push(`Missing environment variable: ${key}`);
      continue;
    }

    let actualRule = rule as PrimitiveType | EnumType;

    if (isOptionalObject && "type" in rule) {
      actualRule = rule.type;
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

  return result as InferSchema<T>;
}
