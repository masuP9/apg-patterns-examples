/**
 * WindowSplitter Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of WindowSplitter.astro.
 * Web Component behavior (keyboard, collapse/expand, RTL, pointer, popup,
 * positionchange/collapsedchange events and the setPosition/toggleCollapse
 * methods) is covered by E2E tests in e2e/windowsplitter.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import WindowSplitter from './WindowSplitter.astro';

describe('WindowSplitter (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderSplitter(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(WindowSplitter, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-window-splitter custom element wrapper', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      expect(doc.querySelector('apg-window-splitter')).not.toBeNull();
    });

    it('renders an element with role="separator"', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      expect(doc.querySelector('[role="separator"]')).not.toBeNull();
    });

    it('sets the initial position as --splitter-position on the container', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        defaultPosition: 30,
        'aria-label': 'Resize',
      });
      const splitterContainer = doc.querySelector<HTMLElement>('.apg-window-splitter');
      expect(splitterContainer?.getAttribute('style')).toBe('--splitter-position: 30%');
    });

    it('adds the vertical modifier class for a vertical splitter', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        orientation: 'vertical',
        'aria-label': 'Resize',
      });
      const splitterContainer = doc.querySelector('.apg-window-splitter');
      expect(splitterContainer?.classList.contains('apg-window-splitter--vertical')).toBe(true);
    });

    it('adds the disabled modifier class when disabled', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        disabled: true,
        'aria-label': 'Resize',
      });
      const splitterContainer = doc.querySelector('.apg-window-splitter');
      expect(splitterContainer?.classList.contains('apg-window-splitter--disabled')).toBe(true);
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has aria-valuenow set to defaultPosition', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        defaultPosition: 30,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('30');
    });

    it('has aria-valuenow="50" when no defaultPosition is given', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuenow="0" when defaultCollapsed is true', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        defaultPosition: 30,
        defaultCollapsed: true,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('has aria-valuemin="10" and aria-valuemax="90" by default', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuemin')).toBe('10');
      expect(separator?.getAttribute('aria-valuemax')).toBe('90');
    });

    it('has aria-valuemin set to min', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        min: 5,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuemin')).toBe('5');
    });

    it('has aria-valuemax set to max', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        max: 95,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuemax')).toBe('95');
    });

    it('has aria-controls referencing the primary pane', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'main-panel', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-controls')).toBe('main-panel');
    });

    it('has aria-controls referencing both panes when secondaryPaneId is provided', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        secondaryPaneId: 'secondary',
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-controls')).toBe('primary secondary');
    });

    it('has aria-orientation="vertical" for a vertical splitter', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        orientation: 'vertical',
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('does not have aria-orientation for a horizontal splitter', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.hasAttribute('aria-orientation')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        disabled: true,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.hasAttribute('aria-disabled')).toBe(false);
    });

    // aria-readonly is not a valid attribute for role="separator";
    // readonly behavior is enforced by the Web Component only.
    it('does not have aria-readonly when readonly', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        readonly: true,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.hasAttribute('aria-readonly')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has aria-label when provided', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize panels' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-label')).toBe('Resize panels');
    });

    it('has aria-labelledby when provided', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        'aria-labelledby': 'splitter-label',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-labelledby')).toBe('splitter-label');
    });

    it('has aria-describedby when provided', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        'aria-label': 'Resize',
        'aria-describedby': 'splitter-help',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-describedby')).toBe('splitter-help');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on the separator', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Resize' });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" on the separator when disabled', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        disabled: true,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="0" on the separator when readonly', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        readonly: true,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('0');
    });
  });

  // 🟡 Medium Priority: Popup Buttons
  describe('Popup Buttons', () => {
    it('renders a labelled group of adjust buttons', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Sidebar' });
      const group = doc.querySelector('[role="group"]');
      const labels = Array.from(group?.querySelectorAll('button') ?? []).map((button) =>
        button.getAttribute('aria-label')
      );
      expect(group?.getAttribute('aria-label')).toBe('Adjust Sidebar');
      expect(labels).toEqual([
        'Collapse Sidebar',
        'Shrink Sidebar',
        'Expand Sidebar',
        'Expand Sidebar to maximum',
      ]);
    });

    it('has tabindex="-1" on the adjust buttons', async () => {
      const doc = await renderSplitter({ primaryPaneId: 'primary', 'aria-label': 'Sidebar' });
      const tabindexes = Array.from(doc.querySelectorAll('[role="group"] button')).map((button) =>
        button.getAttribute('tabindex')
      );
      expect(tabindexes).toEqual(['-1', '-1', '-1', '-1']);
    });

    it('does not render the adjust buttons when disabled', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        disabled: true,
        'aria-label': 'Sidebar',
      });
      expect(doc.querySelector('[role="group"]')).toBeNull();
    });

    it('does not render the adjust buttons when readonly', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        readonly: true,
        'aria-label': 'Sidebar',
      });
      expect(doc.querySelector('[role="group"]')).toBeNull();
    });
  });

  // 🟡 Medium Priority: Initial Position Normalization
  describe('Initial Position Normalization', () => {
    it('clamps defaultPosition below min to min', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        defaultPosition: 5,
        min: 10,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('10');
    });

    it('clamps defaultPosition above max to max', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        defaultPosition: 95,
        max: 90,
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('90');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('sets the id attribute on the separator', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        id: 'sidebar-splitter',
        'aria-label': 'Resize',
      });
      expect(doc.querySelector('[role="separator"]')?.id).toBe('sidebar-splitter');
    });

    it('applies a custom class to the container', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        class: 'custom-class',
        'aria-label': 'Resize',
      });
      const splitterContainer = doc.querySelector('.apg-window-splitter');
      expect(splitterContainer?.classList.contains('custom-class')).toBe(true);
    });

    it('sets data-testid on the separator', async () => {
      const doc = await renderSplitter({
        primaryPaneId: 'primary',
        'data-testid': 'splitter',
        'aria-label': 'Resize',
      });
      const separator = doc.querySelector('[role="separator"]');
      expect(separator?.getAttribute('data-testid')).toBe('splitter');
    });
  });
});
