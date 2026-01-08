import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Base path depends on deploy target:
// - DEPLOY_TARGET=github-pages: /apg-patterns-examples
// - Otherwise: /
const basePath = process.env.DEPLOY_TARGET === 'github-pages' ? '/apg-patterns-examples' : '';

// Framework filter from environment variable (for CI parallel execution)
const frameworkFilter = process.env.E2E_FRAMEWORK;

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
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'html',
  // Filter tests by framework if E2E_FRAMEWORK is set
  grep: frameworkFilter ? new RegExp(`\\(${frameworkFilter}\\)`) : undefined,
  use: {
    baseURL: `http://localhost:4321${basePath}/`,
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
    url: `http://localhost:4321${basePath}/`,
    reuseExistingServer: !isCI,
    timeout: 180 * 1000, // 3 minutes for CI
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
