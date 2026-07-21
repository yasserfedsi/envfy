import type { PrimitiveType, EnumType, EnvOption, Schema } from "./schema";

/**
 * Infer primitive types
 */
export type InferPrimitive<T extends PrimitiveType> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "boolean"
      ? boolean
      : never;

/**
 * Infer enum types
 *  */
export type InferEnum<T extends readonly string[]> = T[number];

/**
 * Infer object schema
 */
export type InferOption<T extends EnvOption> = InferPrimitive<T["type"]>;

/**
 *  Infer a schema value
 */
export type InferSchemaValue<T> = T extends PrimitiveType
  ? InferPrimitive<T>
  : T extends readonly string[]
    ? InferEnum<T>
    : T extends EnvOption
      ? InferOption<T>
      : never;

/**
 * Infer the complete schema
 */
export type InferSchema<T extends Schema> = {
  [K in keyof T]: InferSchemaValue<T[K]>;
};
