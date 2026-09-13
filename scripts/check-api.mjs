#!/usr/bin/env node
/**
 * Answers "is the API up, and is this app pointed at it?" without starting Next.
 *
 * Run it when the site renders bundled content instead of real data: it tells
 * you which of the two local processes is missing, rather than leaving you to
 * guess from an empty page.
 *
 *   npm run check:api
 */
import { readFileSync, existsSync } from "node:fs";

/** Minimal .env reader: dotenv is a dependency this script does not need. */
function loadEnvFile(path) {
  if (!existsSync(path)) return {};

  const entries = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;

    entries[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return entries;
}

const fileEnv = { ...loadEnvFile(".env.example"), ...loadEnvFile(".env.local") };
const apiOrigin = (process.env.DEVINSO_API_URL ?? fileEnv.DEVINSO_API_URL ?? "http://localhost:5200").replace(/\/$/, "");
const mediaOrigin = (process.env.DEVINSO_MEDIA_URL ?? fileEnv.DEVINSO_MEDIA_URL ?? "").replace(/\/$/, "");

const checks = [
  { label: "health", url: `${apiOrigin}/health` },
  { label: "site settings", url: `${apiOrigin}/api/v1/site` },
  { label: "members", url: `${apiOrigin}/api/v1/members` },
  { label: "projects", url: `${apiOrigin}/api/v1/projects` },
];

console.log(`Devinso API: ${apiOrigin}`);
if (mediaOrigin) console.log(`Media origin: ${mediaOrigin}`);
console.log("");

let failures = 0;

for (const { label, url } of checks) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const body = response.ok ? await response.json() : undefined;
    const count = Array.isArray(body) ? ` (${body.length} item${body.length === 1 ? "" : "s"})` : "";

    if (response.ok) {
      console.log(`  ok    ${label}${count}`);
    } else {
      failures += 1;
      console.log(`  FAIL  ${label} — HTTP ${response.status}`);
    }
  } catch (error) {
    failures += 1;
    console.log(`  DOWN  ${label} — ${error.message}`);
  }
}

console.log("");

if (failures > 0) {
  console.log("The API is not answering. Start it from the backend repo:");
  console.log("  dotnet run --project Devinso.Api");
  console.log("");
  console.log("The site still renders with bundled content while it is down.");
  process.exit(1);
}

console.log("API reachable. `npm run dev` will render live data.");
