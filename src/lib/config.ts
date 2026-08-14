// src/lib/config.ts
// Single source of truth for API base URL — imported by both api.ts and httpClient.ts
// without creating a circular dependency.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"