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
    // Other Astro tests using Web Component classes should be tested via E2E or browser tests
    include: [
      'src/patterns/table/Table.test.astro.ts',
      'src/patterns/checkbox/Checkbox.test.astro.ts',
      'src/patterns/carousel/Carousel.test.astro.ts',
      'src/patterns/landmarks/LandmarkDemo.test.astro.ts',
      'src/patterns/feed/Feed.test.astro.ts',
      'src/patterns/grid/Grid.test.astro.ts',
      'src/patterns/accessibility-docs-smoke.test.astro.ts',
      'src/patterns/breadcrumb/Breadcrumb.test.astro.ts',
      'src/patterns/disclosure/Disclosure.test.astro.ts',
      'src/patterns/listbox/Listbox.test.astro.ts',
      'src/patterns/switch/Switch.test.astro.ts',
      'src/patterns/toggle-button/ToggleButton.test.astro.ts',
      'src/patterns/tooltip/Tooltip.test.astro.ts',
      'src/patterns/accordion/Accordion.test.astro.ts',
      'src/patterns/combobox/Combobox.test.astro.ts',
      'src/patterns/dialog/Dialog.test.astro.ts',
      'src/patterns/tabs/Tabs.test.astro.ts',
      'src/patterns/toolbar/Toolbar.test.astro.ts',
      'src/patterns/alert/Alert.test.astro.ts',
      'src/patterns/data-grid/DataGrid.test.astro.ts',
      'src/patterns/radio/RadioGroup.test.astro.ts',
      'src/patterns/slider-multithumb/MultiThumbSlider.test.astro.ts',
      'src/patterns/treegrid/TreeGrid.test.astro.ts',
      'src/patterns/treeview/TreeView.test.astro.ts',
    ],
  },
});
