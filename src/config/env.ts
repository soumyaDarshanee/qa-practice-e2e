import dotenv from 'dotenv';

// Locally the values come from .env; in CI from the pipeline's environment variables.
dotenv.config({ quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value.replace(/\/+$/, '');
}

export const env = {
  WEB_URL: required('WEB_URL'),
  API_URL: required('API_URL'),
};
