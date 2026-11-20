// Downloads the API's OpenAPI schema to openapi.yaml, the input for Kubb.
// Usage: node bin/download-schema.mjs   (part of npm run types)
import { writeFile } from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });
const apiUrl = (process.env.API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

const res = await fetch(`${apiUrl}/api/schema/`).catch((error) => {
  console.error(`API not reachable at ${apiUrl}: ${error.message}`);
  process.exit(1);
});

if (!res.ok) {
  console.error(`Schema download failed: ${res.status}`);
  process.exit(1);
}
await writeFile('openapi.yaml', await res.text());
console.log('Saved openapi.yaml');
