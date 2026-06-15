export function parseNumber(key: string, value: string): number {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new Error(`${key} must be a valid number`);
  }

  return num;
}

export function parseBoolean(key: string, value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;

  throw new Error(`${key} must be true or false`);
}

export function parseString(value: string): string {
  return value;
}

export function parseEnum(
  key: string,
  value: string,
  allowedValues: readonly string[],
): string {
  if (!allowedValues.includes(value)) {
    throw new Error(`${key} must be one of: ${allowedValues.join(", ")}`);
  }

  return value;
}
