import { defineConfig, devices } from '@playwright/test';

// Single source of truth for the deploy-target → (base path, dev port) contract,
// shared with astro.config.mjs so local dev and e2e can never disagree on the base.
import { getDevPort, getLocalBaseUrl } from './scripts/deploy-target.mjs';

const isCI = !!process.env.CI;

// Skip webServer when running as part of parallel execution (server managed externally)
const skipWebServer = !!process.env.E2E_SKIP_SERVER;

// Framework filter from environment variable (for CI parallel execution)
const frameworkFilter = process.env.E2E_FRAMEWORK;

const devPort = getDevPort();
// Includes the base path, e.g. http://localhost:4336/apg-patterns-examples/
// (DEPLOY_TARGET unset → github-pages → /apg-patterns-examples/, matching prod).
const baseUrl = getLocalBaseUrl();

/**
 * Playwright E2E Test Configuration
 *
 * Run with: npm run test:e2e
 *
 * In CI: Uses `npm run preview` to serve pre-built files from dist/
 * Locally: Uses `npm run dev` for hot reload during development
 *
 * Framework-specific runs:
 *   E2E_FRAMEWORK=react npx playwright test
 *   E2E_FRAMEWORK=vue npx playwright test
 *   E2E_FRAMEWORK=svelte npx playwright test
 *   E2E_FRAMEWORK=astro npx playwright test
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Use single worker locally to avoid flakiness from parallel execution
  workers: isCI ? 2 : 1,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',
  // Filter tests by framework if E2E_FRAMEWORK is set
  grep: frameworkFilter ? new RegExp(`\\(${frameworkFilter}\\)`) : undefined,
  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: skipWebServer
    ? undefined
    : {
        // CI: Use preview server (serves pre-built dist/)
        // Local: Use dev server (hot reload)
        command: isCI ? `npx astro preview --host 0.0.0.0 --port ${devPort}` : 'npm run dev',
        url: baseUrl,
        reuseExistingServer: !isCI,
        timeout: 180 * 1000, // 3 minutes for CI
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
