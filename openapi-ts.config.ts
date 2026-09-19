import 'dotenv/config';
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.VITE_OPENAPI_SPEC_URL ?? 'http://localhost:7000/v3/api-docs',
  output: 'src/api',
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@tanstack/react-query',
  ],
});
