// Resets the API's database to the baseline (reference data + test users) before a full run.
// Usage: node bin/reset-db.mjs   (npm run db:reset)
import dotenv from 'dotenv';

dotenv.config({ quiet: true });
const apiUrl = (process.env.API_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

const res = await fetch(`${apiUrl}/api/e2e/reset/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sample_data: false }),
}).catch((error) => {
  console.error(`API not reachable at ${apiUrl}: ${error.message}`);
  process.exit(1);
});

if (!res.ok) {
  console.error(`Reset failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log('Database reset to baseline.');
