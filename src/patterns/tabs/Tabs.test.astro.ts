/**
 * Tabs Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Tabs.astro.
 * Keyboard navigation and tab switching are covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Tabs from './Tabs.astro';

const sampleTabs = [
  { id: 'tab1', label: 'Tab 1', content: '<p>Content 1</p>' },
  { id: 'tab2', label: 'Tab 2', content: '<p>Content 2</p>' },
  { id: 'tab3', label: 'Tab 3', content: '<p>Content 3</p>', disabled: true },
];

describe('Tabs (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderTabs(
    props: {
      tabs?: typeof sampleTabs;
      defaultSelectedId?: string;
      orientation?: 'horizontal' | 'vertical';
      activation?: 'automatic' | 'manual';
      class?: string;
    } = {}
  ): Promise<Document> {
    const html = await container.renderToString(Tabs, {
      props: { tabs: sampleTabs, ...props },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-tabs custom element wrapper', async () => {
      const doc = await renderTabs();
      expect(doc.querySelector('apg-tabs')).not.toBeNull();
    });

    it('renders tablist with role="tablist"', async () => {
      const doc = await renderTabs();
      expect(doc.querySelector('[role="tablist"]')).not.toBeNull();
    });

    it('renders one tab button per tab', async () => {
      const doc = await renderTabs();
      const tabs = doc.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(3);
    });

    it('renders one tabpanel per tab', async () => {
      const doc = await renderTabs();
      const panels = doc.querySelectorAll('[role="tabpanel"]');
      expect(panels.length).toBe(3);
    });
  });

  // 🔴 High Priority: ARIA - Initial Selection
  describe('aria-selected', () => {
    it('first non-disabled tab is selected by default', async () => {
      const doc = await renderTabs();
      const tabs = doc.querySelectorAll<HTMLElement>('[role="tab"]');
      expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
      expect(tabs[1]?.getAttribute('aria-selected')).toBe('false');
    });

    it('respects defaultSelectedId', async () => {
      const doc = await renderTabs({ defaultSelectedId: 'tab2' });
      const tabs = doc.querySelectorAll<HTMLElement>('[role="tab"]');
      expect(tabs[0]?.getAttribute('aria-selected')).toBe('false');
      expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
    });
  });

  // 🔴 High Priority: ARIA - aria-controls
  describe('aria-controls', () => {
    it('selected tab has aria-controls pointing to its panel', async () => {
      const doc = await renderTabs();
      const selectedTab = doc.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      const controlsId = selectedTab?.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      const panel = doc.getElementById(controlsId!);
      expect(panel).not.toBeNull();
      expect(panel?.getAttribute('role')).toBe('tabpanel');
    });

    it('non-selected tabs do not have aria-controls', async () => {
      const doc = await renderTabs();
      const unselectedTab = doc.querySelector<HTMLElement>('[role="tab"][aria-selected="false"]');
      expect(unselectedTab?.hasAttribute('aria-controls')).toBe(false);
    });
  });

  // 🔴 High Priority: tabpanel hidden state
  describe('Tabpanel visibility', () => {
    it('active tabpanel is not hidden', async () => {
      const doc = await renderTabs();
      const activePanels = doc.querySelectorAll<HTMLElement>('[role="tabpanel"]:not([hidden])');
      expect(activePanels.length).toBe(1);
    });

    it('inactive tabpanels have hidden attribute', async () => {
      const doc = await renderTabs();
      const hiddenPanels = doc.querySelectorAll<HTMLElement>('[role="tabpanel"][hidden]');
      expect(hiddenPanels.length).toBe(2);
    });
  });

  // 🔴 High Priority: tabpanel aria-labelledby
  describe('aria-labelledby on tabpanel', () => {
    it('each tabpanel has aria-labelledby pointing to its tab', async () => {
      const doc = await renderTabs();
      const panels = doc.querySelectorAll<HTMLElement>('[role="tabpanel"]');
      panels.forEach((panel) => {
        const labelledby = panel.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();
        const tab = doc.getElementById(labelledby!);
        expect(tab).not.toBeNull();
        expect(tab?.getAttribute('role')).toBe('tab');
      });
    });
  });

  // 🟡 Medium Priority: Orientation
  describe('Orientation', () => {
    it('tablist has aria-orientation="horizontal" by default', async () => {
      const doc = await renderTabs();
      const tablist = doc.querySelector('[role="tablist"]');
      expect(tablist?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('tablist has aria-orientation="vertical" when vertical', async () => {
      const doc = await renderTabs({ orientation: 'vertical' });
      const tablist = doc.querySelector('[role="tablist"]');
      expect(tablist?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  // 🟡 Medium Priority: Disabled Tab
  describe('Disabled Tab', () => {
    it('disabled tab has disabled attribute', async () => {
      const doc = await renderTabs();
      const tabs = doc.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      // tab3 is disabled
      expect(tabs[2]?.hasAttribute('disabled')).toBe(true);
    });

    it('disabled tab has tabindex="-1"', async () => {
      const doc = await renderTabs();
      const tabs = doc.querySelectorAll<HTMLElement>('[role="tab"]');
      expect(tabs[2]?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('wrapper has apg-tabs class', async () => {
      const doc = await renderTabs();
      const wrapper = doc.querySelector('apg-tabs');
      expect(wrapper?.classList.contains('apg-tabs')).toBe(true);
    });

    it('selected tab has apg-tab--selected class', async () => {
      const doc = await renderTabs();
      const selectedTab = doc.querySelector('[role="tab"][aria-selected="true"]');
      expect(selectedTab?.classList.contains('apg-tab--selected')).toBe(true);
    });

    it('active tabpanel has apg-tabpanel--active class', async () => {
      const doc = await renderTabs();
      const activePanel = doc.querySelector('[role="tabpanel"]:not([hidden])');
      expect(activePanel?.classList.contains('apg-tabpanel--active')).toBe(true);
    });
  });
});
