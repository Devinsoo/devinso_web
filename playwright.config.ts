import { defineConfig, devices } from "@playwright/test";

const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  // The hero animations are time-based, so a flake here usually means a real
  // race. Never retry it away.
  retries: 0,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Matches the window the bug was reported from.
        viewport: { width: 1900, height: 945 },
      },
    },
  ],
  webServer: {
    command: `npm run dev`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
