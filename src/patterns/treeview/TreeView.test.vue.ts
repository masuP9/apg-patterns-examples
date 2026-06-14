import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import TreeView from './TreeView.vue';
import type { TreeNodeData } from './TreeView.vue';

// Prop/event mapping vs React:
// - React `aria-label` / `aria-labelledby` -> Vue `ariaLabel` / `ariaLabelledby` props.
// - React `onSelectionChange` / `onExpandedChange` / `onActivate` callback props ->
//   Vue `selectionChange` / `expandedChange` / `activate` emits (assert via on* listeners).
// - React `className` -> Vue `class`.
// No React-specific cases are skipped; all titles are ported 1:1.
//
// The Vue TreeView initializes expansion/selection/focus state inside onMounted, so the
// resulting DOM only reflects defaults after a reactivity flush. `renderTree` awaits a tick
// after mounting so initial-state assertions see the applied props (mirrors React's sync render).
const renderTree = async (
  ...args: Parameters<typeof render>
): Promise<ReturnType<typeof render>> => {
  const result = render(...args);
  await nextTick();
  return result;
};

const simpleNodes: TreeNodeData[] = [
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

const nestedNodes: TreeNodeData[] = [
  {
    id: 'root',
    label: 'Root',
    children: [
      {
        id: 'level1',
        label: 'Level 1',
        children: [
          {
            id: 'level2',
            label: 'Level 2',
            children: [{ id: 'level3', label: 'Level 3' }],
          },
        ],
      },
    ],
  },
];

const nodesWithDisabled: TreeNodeData[] = [
  { id: 'item1', label: 'Item 1' },
  { id: 'item2', label: 'Item 2', disabled: true },
  { id: 'item3', label: 'Item 3' },
];

const nodesWithDisabledParent: TreeNodeData[] = [
  {
    id: 'parent',
    label: 'Disabled Parent',
    disabled: true,
    children: [{ id: 'child', label: 'Child' }],
  },
  { id: 'item', label: 'Item' },
];

describe('TreeView (Vue)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('has role="tree" on container', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      expect(screen.getByRole('tree')).toBeInTheDocument();
    });

    it('has role="treeitem" on all nodes', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs', 'images'] },
      });
      expect(screen.getAllByRole('treeitem')).toHaveLength(7);
    });

    it('has role="group" on child containers', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has aria-expanded on parent nodes only', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute('aria-expanded');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute('aria-expanded');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).not.toHaveAttribute(
        'aria-expanded'
      );
    });

    it('leaf nodes do NOT have aria-expanded', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs', 'images'] },
      });
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).not.toHaveAttribute(
        'aria-expanded'
      );
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).not.toHaveAttribute(
        'aria-expanded'
      );
    });

    it('updates aria-expanded on expand/collapse', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      expect(docs).toHaveAttribute('aria-expanded', 'false');

      docs.focus();
      await user.keyboard('{ArrowRight}');
      expect(docs).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('all treeitems have aria-selected when selection enabled', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      screen.getAllByRole('treeitem').forEach((item) => {
        expect(item).toHaveAttribute('aria-selected');
      });
    });

    it('selected node has aria-selected="true", others have "false"', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultSelectedIds: ['readme'] },
      });
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('has aria-multiselectable="true" on multi-select tree', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });
      expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('does not have aria-multiselectable on single-select tree', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      expect(screen.getByRole('tree')).not.toHaveAttribute('aria-multiselectable');
    });

    it('has accessible name via aria-label', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'File Explorer' } });
      expect(screen.getByRole('tree', { name: 'File Explorer' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', async () => {
      await renderTree({
        components: { TreeView },
        setup() {
          return () =>
            h('div', [
              h('h2', { id: 'tree-label' }, 'My Files'),
              h(TreeView, { nodes: simpleNodes, ariaLabelledby: 'tree-label' }),
            ]);
        },
      });
      expect(screen.getByRole('tree', { name: 'My Files' })).toBeInTheDocument();
    });

    it('disabled nodes have aria-disabled="true"', async () => {
      await renderTree(TreeView, { props: { nodes: nodesWithDisabled, ariaLabel: 'Items' } });
      expect(screen.getByRole('treeitem', { name: 'Item 2' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });

  // 🔴 High Priority: Keyboard Navigation
  describe('APG: Keyboard Navigation', () => {
    it('ArrowDown moves to next visible node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveFocus();
    });

    it('ArrowDown moves into expanded children', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('ArrowUp moves to previous visible node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Images' }).focus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowUp moves to parent from first child', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowRight expands closed parent', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowRight}');
      expect(docs).toHaveAttribute('aria-expanded', 'true');
    });

    it('ArrowRight moves to first child when parent is expanded', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('ArrowRight does nothing on leaf node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowRight}');
      const report = screen.getByRole('treeitem', { name: 'report.pdf' });
      expect(report).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(report).toHaveFocus();
    });

    it('ArrowLeft collapses open parent', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('ArrowLeft moves to parent from child', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowLeft moves to parent from closed parent', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: nestedNodes, ariaLabel: 'Nested', defaultExpandedIds: ['root'] },
      });

      screen.getByRole('treeitem', { name: 'Root' }).focus();
      await user.keyboard('{ArrowRight}');
      const level1 = screen.getByRole('treeitem', { name: 'Level 1' });
      expect(level1).toHaveFocus();
      expect(level1).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('treeitem', { name: 'Root' })).toHaveFocus();
    });

    it('ArrowLeft does nothing on root node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveFocus();
    });

    it('Home moves focus to first node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'readme.md' }).focus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('End moves focus to last visible node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('End moves to last visible node when children are expanded', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['images'] },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('Enter activates node but does not toggle expansion', async () => {
      const user = userEvent.setup();
      const onActivate = vi.fn();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files', onActivate } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{Enter}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      expect(onActivate).toHaveBeenCalledWith('docs');
    });

    it('* expands all siblings at current level', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('*');
      expect(docs).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('collapsed children are skipped during navigation', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Type-ahead
  describe('APG: Type-ahead', () => {
    it('focuses matching visible node on character input', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('cycles through matches on repeated character', async () => {
      const user = userEvent.setup();
      const nodesWithSamePrefix: TreeNodeData[] = [
        { id: 'apple', label: 'Apple' },
        { id: 'apricot', label: 'Apricot' },
        { id: 'avocado', label: 'Avocado' },
      ];
      await renderTree(TreeView, { props: { nodes: nodesWithSamePrefix, ariaLabel: 'Fruits' } });

      screen.getByRole('treeitem', { name: 'Apple' }).focus();
      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Apricot' })).toHaveFocus();
      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Avocado' })).toHaveFocus();
      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Apple' })).toHaveFocus();
    });

    it('only searches visible nodes', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('matches multiple characters typed quickly', async () => {
      const user = userEvent.setup();
      const nodesForTypeAhead: TreeNodeData[] = [
        { id: 'readme', label: 'readme.md' },
        { id: 'report', label: 'report.pdf' },
        { id: 'resources', label: 'resources' },
      ];
      await renderTree(TreeView, { props: { nodes: nodesForTypeAhead, ariaLabel: 'Files' } });

      screen.getByRole('treeitem', { name: 'readme.md' }).focus();
      await user.keyboard('rep');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('resets buffer after timeout', async () => {
      const user = userEvent.setup();
      const nodesForTypeAhead: TreeNodeData[] = [
        { id: 'readme', label: 'readme.md' },
        { id: 'report', label: 'report.pdf' },
        { id: 'resources', label: 'resources' },
      ];
      await renderTree(TreeView, {
        props: { nodes: nodesForTypeAhead, ariaLabel: 'Files', typeAheadTimeout: 100 },
      });

      screen.getByRole('treeitem', { name: 'readme.md' }).focus();
      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      await new Promise((resolve) => setTimeout(resolve, 150));

      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'resources' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('tree is single Tab stop', async () => {
      const user = userEvent.setup();
      await renderTree({
        components: { TreeView },
        setup() {
          return () =>
            h('div', [
              h('button', 'Before'),
              h(TreeView, { nodes: simpleNodes, ariaLabel: 'Files' }),
              h('button', 'After'),
            ]);
        },
      });

      screen.getByRole('button', { name: 'Before' }).focus();
      await user.keyboard('{Tab}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('focused node has tabindex="0"', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute('tabindex', '0');
    });

    it('other nodes have tabindex="-1"', async () => {
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute('tabindex', '-1');
    });

    it('focus moves to parent when child is focused and parent collapses', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveFocus();
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('focus moves to parent when parent is collapsed programmatically while child has focus', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });

      const report = screen.getByRole('treeitem', { name: 'report.pdf' });
      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      report.focus();
      expect(report).toHaveFocus();
      await user.click(docs);
      expect(docs).toHaveFocus();
    });

    it('disabled nodes are focusable', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: nodesWithDisabled, ariaLabel: 'Items' } });

      screen.getByRole('treeitem', { name: 'Item 1' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Item 2' })).toHaveFocus();
    });

    it('disabled nodes cannot be selected', async () => {
      await renderTree(TreeView, { props: { nodes: nodesWithDisabled, ariaLabel: 'Items' } });

      const disabled = screen.getByRole('treeitem', { name: 'Item 2' });
      disabled.focus();
      expect(disabled).toHaveAttribute('aria-selected', 'false');
    });

    it('disabled parent nodes cannot be expanded', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: nodesWithDisabledParent, ariaLabel: 'Items' } });

      const parent = screen.getByRole('treeitem', { name: 'Disabled Parent' });
      parent.focus();
      expect(parent).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowRight}');
      expect(parent).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled nodes do not trigger onActivate on Enter', async () => {
      const user = userEvent.setup();
      const onActivate = vi.fn();
      await renderTree(TreeView, {
        props: { nodes: nodesWithDisabled, ariaLabel: 'Items', onActivate },
      });

      screen.getByRole('treeitem', { name: 'Item 2' }).focus();
      await user.keyboard('{Enter}');
      expect(onActivate).not.toHaveBeenCalled();
    });

    it('disabled nodes do not toggle selection on Space in multi-select', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      await renderTree(TreeView, {
        props: {
          nodes: nodesWithDisabled,
          ariaLabel: 'Items',
          multiselectable: true,
          onSelectionChange,
        },
      });

      const disabled = screen.getByRole('treeitem', { name: 'Item 2' });
      disabled.focus();
      onSelectionChange.mockClear();
      await user.keyboard(' ');
      expect(onSelectionChange).not.toHaveBeenCalled();
      expect(disabled).toHaveAttribute('aria-selected', 'false');
    });
  });

  // 🔴 High Priority: Boundary Navigation
  describe('APG: Boundary Navigation', () => {
    it('ArrowUp at first node does nothing', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowUp}');
      expect(docs).toHaveFocus();
    });

    it('ArrowDown at last visible node does nothing', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();
      await user.keyboard('{ArrowDown}');
      expect(readme).toHaveFocus();
    });

    it('ArrowDown at last visible node with expanded children does nothing', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['images'] },
      });

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();
      await user.keyboard('{ArrowDown}');
      expect(readme).toHaveFocus();
    });
  });

  // 🔴 High Priority: Selection (Single-Select)
  describe('APG: Selection (Single-Select)', () => {
    it('arrow keys move focus only (selection does NOT follow focus)', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultSelectedIds: ['docs'] },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'false');
      await user.keyboard('{ArrowDown}');
      expect(images).toHaveFocus();
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'false');
    });

    it('only one node is selected at a time', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, { props: { nodes: simpleNodes, ariaLabel: 'Files' } });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      docs.focus();
      await user.keyboard('{Enter}');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      expect(docs).toHaveAttribute('aria-selected', 'false');
      expect(images).toHaveAttribute('aria-selected', 'true');
      const selected = screen
        .getAllByRole('treeitem')
        .filter((item) => item.getAttribute('aria-selected') === 'true');
      expect(selected).toHaveLength(1);
    });

    it('Space selects focused node in single-select mode', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', onSelectionChange },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard(' ');
      expect(onSelectionChange).toHaveBeenCalledWith(['docs']);
      expect(docs).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onSelectionChange when Enter selects a node', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', onSelectionChange },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{Enter}');
      expect(onSelectionChange).toHaveBeenCalledWith(['docs']);
    });
  });

  // 🔴 High Priority: Selection (Multi-Select)
  describe('APG: Selection (Multi-Select)', () => {
    it('Space toggles selection', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      expect(docs).toHaveAttribute('aria-selected', 'false');
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'false');
    });

    it('arrow keys move focus without changing selection', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: {
          nodes: simpleNodes,
          ariaLabel: 'Files',
          multiselectable: true,
          defaultSelectedIds: ['docs'],
        },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowDown}');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('Shift+Arrow extends selection range', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard(' ');
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('Ctrl+A selects all visible nodes', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{Control>}a{/Control}');
      screen.getAllByRole('treeitem').forEach((item) => {
        expect(item).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('Ctrl+A selects only visible nodes (not collapsed children)', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: {
          nodes: simpleNodes,
          ariaLabel: 'Files',
          multiselectable: true,
          defaultExpandedIds: ['docs'],
        },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{Control>}a{/Control}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'notes.txt' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('Ctrl+Space toggles selection without updating anchor', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      docs.focus();
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{ArrowDown}');
      expect(images).toHaveFocus();
      await user.keyboard('{Control>} {/Control}');
      expect(images).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'true');
      expect(readme).toHaveAttribute('aria-selected', 'true');
    });

    it('Shift+Home extends selection from anchor to first node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();
      await user.keyboard(' ');
      expect(readme).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{Shift>}{Home}{/Shift}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(readme).toHaveAttribute('aria-selected', 'true');
    });

    it('Shift+End extends selection from anchor to last visible node', async () => {
      const user = userEvent.setup();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'true');
      await user.keyboard('{Shift>}{End}{/Shift}');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  // 🔴 High Priority: Expansion Callbacks
  describe('Expansion', () => {
    it('calls onExpandedChange when nodes are expanded', async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', onExpandedChange },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(onExpandedChange).toHaveBeenCalledWith(['docs']);
    });

    it('calls onExpandedChange when nodes are collapsed', async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      await renderTree(TreeView, {
        props: {
          nodes: simpleNodes,
          ariaLabel: 'Files',
          defaultExpandedIds: ['docs'],
          onExpandedChange,
        },
      });

      screen.getByRole('treeitem', { name: 'Documents' }).focus();
      await user.keyboard('{ArrowLeft}');
      expect(onExpandedChange).toHaveBeenCalledWith([]);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs'] },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with multi-select', async () => {
      const { container } = await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', multiselectable: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with disabled nodes', async () => {
      const { container } = await renderTree(TreeView, {
        props: { nodes: nodesWithDisabled, ariaLabel: 'Items' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('respects defaultExpandedIds', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultExpandedIds: ['docs', 'images'] },
      });
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('respects defaultSelectedIds', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', defaultSelectedIds: ['readme'] },
      });
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('applies className to container', async () => {
      await renderTree(TreeView, {
        props: { nodes: simpleNodes, ariaLabel: 'Files', class: 'custom-tree' },
      });
      expect(screen.getByRole('tree')).toHaveClass('custom-tree');
    });
  });
});
