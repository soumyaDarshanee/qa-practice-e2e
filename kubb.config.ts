import { defineConfig } from 'kubb';
import { adapterOas } from '@kubb/adapter-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginFetch } from '@kubb/plugin-fetch';
import { pluginFaker } from '@kubb/plugin-faker';

export default defineConfig({
  root: '.',
  adapter: adapterOas(),        // reads the OpenAPI schema (replaces v4's pluginOas)
  input: './openapi.yaml',      // v5 takes a plain path, URL, or inline spec
  output: {
    path: './src/@generated',
    clean: true,                // wipe stale files before each run
  },
  plugins: [
    pluginTs(),                 // types: Supplier, Certificate, ...
    pluginFetch({               // typed functions to call each endpoint
      baseURL: 'http://localhost:8000', // spec paths already start with /api
    }),
    pluginFaker(),              // fake-data builders for your factories
  ],
});
