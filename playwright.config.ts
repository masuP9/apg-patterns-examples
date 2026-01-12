import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Skip webServer when running as part of parallel execution (server managed externally)
const skipWebServer = !!process.env.E2E_SKIP_SERVER;

// Base path depends on deploy target:
// - DEPLOY_TARGET=github-pages: /apg-patterns-examples
// - Otherwise: /
const basePath = process.env.DEPLOY_TARGET === 'github-pages' ? '/apg-patterns-examples' : '';

// Framework filter from environment variable (for CI parallel execution)
const frameworkFilter = process.env.E2E_FRAMEWORK;

/**
 * Get dev server port from environment variable or generate from worktree path
 * This must match the logic in astro.config.mjs
 */
function getDevPort(): number {
  if (process.env.DEV_PORT) {
    return parseInt(process.env.DEV_PORT, 10);
  }

  const cwd = process.cwd();
  let hash = 0;
  for (let i = 0; i < cwd.length; i++) {
    hash = (hash * 31 + cwd.charCodeAt(i)) >>> 0;
  }
  return 4321 + (hash % 79);
}

const devPort = getDevPort();

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
  workers: isCI ? 2 : 1,
  reporter: isCI ? 'github' : 'html',
  // Filter tests by framework if E2E_FRAMEWORK is set
  grep: frameworkFilter ? new RegExp(`\\(${frameworkFilter}\\)`) : undefined,
  use: {
    baseURL: `http://localhost:${devPort}${basePath}/`,
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
        url: `http://localhost:${devPort}${basePath}/`,
        reuseExistingServer: !isCI,
        timeout: 180 * 1000, // 3 minutes for CI
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
