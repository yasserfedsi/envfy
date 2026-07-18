export type PrimitiveType = "string" | "number" | "boolean";

export type EnumType = readonly string[];

export interface EnvOption {
  type: PrimitiveType;
  optional?: boolean;
  default?: string | number | boolean
}

export type SchemaValue = PrimitiveType | EnumType | EnvOption;

export type Schema = Record<string, SchemaValue>;
