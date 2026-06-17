export class EnvValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(
      [
        "Environment validation failed: ",
        "",
        ...errors.map((error) => `-${error}`),
      ].join("\n"),
    );

    this.name = "EnvValidationError";
  }
}
