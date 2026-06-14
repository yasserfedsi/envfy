# Envfy

A simple and type-safe environment variable validator for Node.js applications.

## Features

- Validate required environment variables
- Built-in support for `string`, `number`, and `boolean`
- Enum (allowed values) support
- Fails fast on missing or invalid values
- TypeScript support

## Installation

```bash
npm install @yasserfedsi/envfy
```

## Why envfy?
Environment variables are always strings and error-prone.

`envfy` ensures your app:
- validates config at startup
- fails fast if something is wrong
- reduces runtime bugs caused by bad env values

## Usage
```ts
import { validateEnv } from "@yasserfedsi/envfy";

const env = validateEnv({
  PORT: "number",
  DATABASE_URL: "string",
  NODE_ENV: ["development", "production", "test"]
});

console.log(env.PORT);
```

## Enum / Allowed Values
Restrict values using an array:
```ts
const env = validateEnv({
  NODE_ENV: ["development", "production", "test"]
});
```
If the value is not in the list, an error is thrown.

## Example Errors
Missing variable:
```bash
Error: Missing environment variable: DATABASE_URL
```
Invalid number:
```bash
Error: PORT must be a valid number
```
Invalid boolean:
```sh
Error: DEBUG must be true or false
```

## Roadmap
Planned features:
- Optional variables
- Default values
- Custom validators
- Regex validation
- Better TypeScript inference (v2)

## Tech Stack
- Node.js
- TypeScript
- Vitest
- tsup

## License
<a href="https://github.com/yasserfedsi/envfy/blob/main/LICENSE" target="_blank" style="">MIT</a>

## Contributing
This is an early-stage open source project.

Feel free to open issues or suggest improvements.
