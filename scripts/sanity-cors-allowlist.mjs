#!/usr/bin/env node

/**
 * Idempotently upserts Sanity CORS origins for this project.
 *
 * Required env:
 * - SANITY_AUTH_TOKEN
 *
 * Optional env:
 * - SANITY_PROJECT_ID (default: 9iae1qca)
 * - SANITY_CORS_ORIGINS (comma separated list)
 */

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "9iae1qca";
const token = process.env.SANITY_AUTH_TOKEN || "";
const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "https://staging.rixly.com",
  "https://rixly.com",
  "https://www.rixly.com",
];

const origins = (process.env.SANITY_CORS_ORIGINS || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN. Cannot update Sanity CORS allowlist.");
  process.exit(1);
}

const baseUrl = `https://api.sanity.io/v1/projects/${projectId}/cors`;

async function sanityRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Sanity API ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function run() {
  console.log(`Loading current Sanity CORS origins for project ${projectId}...`);
  const existing = await sanityRequest(baseUrl);
  const existingOrigins = new Set((existing || []).map((item) => String(item.origin || "").trim()));

  for (const origin of origins) {
    if (existingOrigins.has(origin)) {
      console.log(`- already exists: ${origin}`);
      continue;
    }

    await sanityRequest(baseUrl, {
      method: "POST",
      body: JSON.stringify({
        origin,
        allowCredentials: true,
      }),
    });

    console.log(`+ added: ${origin}`);
  }

  console.log("Sanity CORS allowlist update complete.");
}

run().catch((error) => {
  console.error("Failed to update Sanity CORS allowlist:", error);
  process.exit(1);
});
