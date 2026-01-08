import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Playwright E2E Test Configuration
 *
 * Run with: npm run test:e2e
 *
 * In CI: Uses `npm run preview` to serve pre-built files from dist/
 * Locally: Uses `npm run dev` for hot reload during development
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'html',
  use: {
    // Include base path for GitHub Pages deployment
    baseURL: 'http://localhost:4321/apg-patterns-examples',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // CI: Use preview server (serves pre-built dist/)
    // Local: Use dev server (hot reload)
    command: isCI ? 'npx astro preview --host 0.0.0.0' : 'npm run dev',
    // Use full URL with base path for health check (Astro uses /apg-patterns-examples base)
    url: 'http://localhost:4321/apg-patterns-examples/',
    reuseExistingServer: !isCI,
    timeout: 180 * 1000, // 3 minutes for CI
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
