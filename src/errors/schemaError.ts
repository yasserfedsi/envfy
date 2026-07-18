export class EnvSchemaError extends Error {
  constructor(message: string) {
    super(message);
    
    this.name = "EnvSchemaError";
  }
}
