/**
 * Shared demo data for the Tabs pattern.
 *
 * Pure data shared across all four framework-specific DemoSection files.
 * Framework-specific prop names and rendering live in the per-framework
 * `DemoSection.{react,vue,svelte,web-component}.astro` files.
 */

export const demoTabs = [
  {
    id: 'tab1',
    label: 'Overview',
    content:
      'This is the overview panel content. It provides a general introduction to the product or service.',
  },
  {
    id: 'tab2',
    label: 'Features',
    content: 'Keyboard navigation support, ARIA compliant, Automatic and manual activation modes.',
  },
  { id: 'tab3', label: 'Pricing', content: 'Pricing information would be displayed here.' },
];

export const manualTabs = [
  {
    id: 'manual1',
    label: 'Tab One',
    content: 'Content for tab one. Press Enter or Space to activate tabs.',
  },
  { id: 'manual2', label: 'Tab Two', content: 'Content for tab two.' },
  { id: 'manual3', label: 'Tab Three', content: 'Content for tab three.' },
];

export const verticalTabs = [
  { id: 'vert1', label: 'Settings', content: 'Configure your application settings here.' },
  { id: 'vert2', label: 'Profile', content: 'Manage your profile information.' },
  { id: 'vert3', label: 'Notifications', content: 'Set your notification preferences.' },
];
