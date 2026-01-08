/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

/**
 * Vitest configuration for Astro component tests using Container API.
 *
 * This config uses Astro's getViteConfig() which enables proper Astro component
 * rendering via the Container API. Tests use JSDOM for DOM parsing.
 *
 * Note: Only tests that use the Container API pattern should be included here.
 * Other Astro tests that use Web Component classes directly (class X extends HTMLElement)
 * are not compatible with this config as HTMLElement is not defined in Node.js.
 *
 * Run with: npm run test:astro
 */
export default getViteConfig({
  test: {
    globals: true,
    // Include tests that use Container API pattern
    include: [
      'src/patterns/table/Table.test.astro.ts',
      'src/patterns/checkbox/Checkbox.test.astro.ts',
    ],
  },
});
