/**
 * TreeView Astro Component Tests using Container API
 *
 * Verifies the TreeView.astro initial HTML structure and ARIA attributes.
 * Interaction cases (keyboard navigation, type-ahead, selection, expansion,
 * focus management) are covered by the Vue unit tests and E2E; the Container
 * API only renders initial HTML.
 *
 * Astro renders the FULL tree up-front and hides collapsed subtrees with the
 * `hidden` attribute on the child `<ul role="group">` (rather than omitting
 * them from the DOM as React/Vue do). Structural assertions account for this.
 *
 * Ported structural/initial-state subset of TreeView.test.tsx. Interaction-only
 * React cases (keyboard, type-ahead, selection toggles, expansion callbacks,
 * focus movement) are omitted here — they require a browser and are covered
 * elsewhere.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import TreeView from './TreeView.astro';

const simpleNodes = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [
      { id: 'photo1', label: 'photo1.jpg' },
      { id: 'photo2', label: 'photo2.jpg' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

const nodesWithDisabled = [
  { id: 'item1', label: 'Item 1' },
  { id: 'item2', label: 'Item 2', disabled: true },
  { id: 'item3', label: 'Item 3' },
];

describe('TreeView (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderTree(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(TreeView, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  function itemByLabel(doc: Document, label: string): Element | null {
    return (
      Array.from(doc.querySelectorAll('[role="treeitem"]')).find(
        (item) => item.querySelector('.apg-treeview-item-label')?.textContent?.trim() === label
      ) ?? null
    );
  }

  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('has role="tree" on container', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'Files' });
      expect(doc.querySelector('[role="tree"]')).not.toBeNull();
    });

    it('has role="treeitem" on all nodes', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      // Astro renders the full tree up-front, so all 7 treeitems are present.
      expect(doc.querySelectorAll('[role="treeitem"]')).toHaveLength(7);
    });

    it('has role="group" on child containers', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultExpandedIds: ['docs'],
      });
      expect(doc.querySelector('[role="group"]')).not.toBeNull();
    });

    it('has aria-expanded on parent nodes only', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'Files' });
      expect(itemByLabel(doc, 'Documents')?.hasAttribute('aria-expanded')).toBe(true);
      expect(itemByLabel(doc, 'Images')?.hasAttribute('aria-expanded')).toBe(true);
      expect(itemByLabel(doc, 'readme.md')?.hasAttribute('aria-expanded')).toBe(false);
    });

    it('leaf nodes do NOT have aria-expanded', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      expect(itemByLabel(doc, 'report.pdf')?.hasAttribute('aria-expanded')).toBe(false);
      expect(itemByLabel(doc, 'readme.md')?.hasAttribute('aria-expanded')).toBe(false);
    });

    it('all treeitems have aria-selected when selection enabled', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      doc.querySelectorAll('[role="treeitem"]').forEach((item) => {
        expect(item.hasAttribute('aria-selected')).toBe(true);
      });
    });

    it('selected node has aria-selected="true", others have "false"', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultSelectedIds: ['readme'],
      });
      expect(itemByLabel(doc, 'readme.md')?.getAttribute('aria-selected')).toBe('true');
      expect(itemByLabel(doc, 'Documents')?.getAttribute('aria-selected')).toBe('false');
    });

    it('has aria-multiselectable="true" on multi-select tree', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        multiselectable: true,
      });
      expect(doc.querySelector('[role="tree"]')?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('does not have aria-multiselectable on single-select tree', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'Files' });
      expect(doc.querySelector('[role="tree"]')?.hasAttribute('aria-multiselectable')).toBe(false);
    });

    it('has accessible name via aria-label', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'File Explorer' });
      expect(doc.querySelector('[role="tree"]')?.getAttribute('aria-label')).toBe('File Explorer');
    });

    it('has accessible name via aria-labelledby', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-labelledby': 'tree-label' });
      expect(doc.querySelector('[role="tree"]')?.getAttribute('aria-labelledby')).toBe(
        'tree-label'
      );
    });

    it('disabled nodes have aria-disabled="true"', async () => {
      const doc = await renderTree({ nodes: nodesWithDisabled, 'aria-label': 'Items' });
      expect(itemByLabel(doc, 'Item 2')?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  // 🔴 High Priority: Focus Management (initial roving tabindex)
  describe('APG: Focus Management', () => {
    it('focused node has tabindex="0"', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'Files' });
      expect(itemByLabel(doc, 'Documents')?.getAttribute('tabindex')).toBe('0');
    });

    it('other nodes have tabindex="-1"', async () => {
      const doc = await renderTree({ nodes: simpleNodes, 'aria-label': 'Files' });
      expect(itemByLabel(doc, 'Images')?.getAttribute('tabindex')).toBe('-1');
      expect(itemByLabel(doc, 'readme.md')?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('respects defaultExpandedIds', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      expect(itemByLabel(doc, 'Documents')?.getAttribute('aria-expanded')).toBe('true');
      expect(itemByLabel(doc, 'Images')?.getAttribute('aria-expanded')).toBe('true');
    });

    it('respects defaultSelectedIds', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        defaultSelectedIds: ['readme'],
      });
      expect(itemByLabel(doc, 'readme.md')?.getAttribute('aria-selected')).toBe('true');
    });

    it('applies className to container', async () => {
      const doc = await renderTree({
        nodes: simpleNodes,
        'aria-label': 'Files',
        class: 'custom-tree',
      });
      expect(doc.querySelector('[role="tree"]')?.classList.contains('custom-tree')).toBe(true);
    });
  });
});
