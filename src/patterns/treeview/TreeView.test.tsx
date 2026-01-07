import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TreeView, type TreeNode } from './TreeView';

// Test tree data
const simpleNodes: TreeNode[] = [
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

const nestedNodes: TreeNode[] = [
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

const nodesWithDisabled: TreeNode[] = [
  { id: 'item1', label: 'Item 1' },
  { id: 'item2', label: 'Item 2', disabled: true },
  { id: 'item3', label: 'Item 3' },
];

const nodesWithDisabledParent: TreeNode[] = [
  {
    id: 'parent',
    label: 'Disabled Parent',
    disabled: true,
    children: [{ id: 'child', label: 'Child' }],
  },
  { id: 'item', label: 'Item' },
];

describe('TreeView', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('has role="tree" on container', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      expect(screen.getByRole('tree')).toBeInTheDocument();
    });

    it('has role="treeitem" on all nodes', () => {
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs', 'images']} />
      );

      // 3 top-level + 2 docs children + 2 images children = 7
      expect(screen.getAllByRole('treeitem')).toHaveLength(7);
    });

    it('has role="group" on child containers', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has aria-expanded on parent nodes only', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });

      expect(docs).toHaveAttribute('aria-expanded');
      expect(images).toHaveAttribute('aria-expanded');
      expect(readme).not.toHaveAttribute('aria-expanded');
    });

    it('leaf nodes do NOT have aria-expanded', () => {
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs', 'images']} />
      );

      const report = screen.getByRole('treeitem', { name: 'report.pdf' });
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });

      expect(report).not.toHaveAttribute('aria-expanded');
      expect(readme).not.toHaveAttribute('aria-expanded');
    });

    it('updates aria-expanded on expand/collapse', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      expect(docs).toHaveAttribute('aria-expanded', 'false');

      docs.focus();
      await user.keyboard('{ArrowRight}');
      expect(docs).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('all treeitems have aria-selected when selection enabled', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const treeitems = screen.getAllByRole('treeitem');
      treeitems.forEach((item) => {
        expect(item).toHaveAttribute('aria-selected');
      });
    });

    it('selected node has aria-selected="true", others have "false"', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultSelectedIds={['readme']} />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      const docs = screen.getByRole('treeitem', { name: 'Documents' });

      expect(readme).toHaveAttribute('aria-selected', 'true');
      expect(docs).toHaveAttribute('aria-selected', 'false');
    });

    it('has aria-multiselectable="true" on multi-select tree', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('does not have aria-multiselectable on single-select tree', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      expect(screen.getByRole('tree')).not.toHaveAttribute('aria-multiselectable');
    });

    it('has accessible name via aria-label', () => {
      render(<TreeView nodes={simpleNodes} aria-label="File Explorer" />);

      expect(screen.getByRole('tree', { name: 'File Explorer' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <h2 id="tree-label">My Files</h2>
          <TreeView nodes={simpleNodes} aria-labelledby="tree-label" />
        </>
      );

      expect(screen.getByRole('tree', { name: 'My Files' })).toBeInTheDocument();
    });

    it('disabled nodes have aria-disabled="true"', () => {
      render(<TreeView nodes={nodesWithDisabled} aria-label="Items" />);

      const disabled = screen.getByRole('treeitem', { name: 'Item 2' });
      expect(disabled).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: Keyboard Navigation
  describe('APG: Keyboard Navigation', () => {
    it('ArrowDown moves to next visible node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveFocus();
    });

    it('ArrowDown moves into expanded children', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('ArrowUp moves to previous visible node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const images = screen.getByRole('treeitem', { name: 'Images' });
      images.focus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowUp moves to parent from first child', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      // Start from Documents (which is expanded) and navigate to first child
      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowRight}'); // Move to first child (report.pdf)

      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowRight expands closed parent', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowRight}');
      expect(docs).toHaveAttribute('aria-expanded', 'true');
    });

    it('ArrowRight moves to first child when parent is expanded', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('ArrowRight does nothing on leaf node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      // Navigate to leaf node via keyboard
      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowRight}'); // Move to report.pdf

      const report = screen.getByRole('treeitem', { name: 'report.pdf' });
      expect(report).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(report).toHaveFocus();
    });

    it('ArrowLeft collapses open parent', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      expect(docs).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('ArrowLeft moves to parent from child', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      // Navigate to child via keyboard
      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowRight}'); // Move to report.pdf

      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowLeft moves to parent from closed parent', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={nestedNodes} aria-label="Nested" defaultExpandedIds={['root']} />);

      // Navigate to Level 1 via keyboard
      const root = screen.getByRole('treeitem', { name: 'Root' });
      root.focus();
      await user.keyboard('{ArrowRight}'); // Move to Level 1

      const level1 = screen.getByRole('treeitem', { name: 'Level 1' });
      expect(level1).toHaveFocus();
      expect(level1).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('treeitem', { name: 'Root' })).toHaveFocus();
    });

    it('ArrowLeft does nothing on root node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      // First collapse, then try ArrowLeft again
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowLeft}');
      expect(docs).toHaveFocus();
    });

    it('Home moves focus to first node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      await user.keyboard('{Home}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
    });

    it('End moves focus to last visible node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{End}');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('End moves to last visible node when children are expanded', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['images']} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{End}');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('Enter activates node but does not toggle expansion', async () => {
      const user = userEvent.setup();
      const onActivate = vi.fn();
      render(<TreeView nodes={simpleNodes} aria-label="Files" onActivate={onActivate} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      expect(docs).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{Enter}');
      expect(docs).toHaveAttribute('aria-expanded', 'false');
      expect(onActivate).toHaveBeenCalledWith('docs');
    });

    it('* expands all siblings at current level', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

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
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      // docs is collapsed, so ArrowDown should skip its children
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Type-ahead
  describe('APG: Type-ahead', () => {
    it('focuses matching visible node on character input', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('cycles through matches on repeated character', async () => {
      const user = userEvent.setup();
      const nodesWithSamePrefix: TreeNode[] = [
        { id: 'apple', label: 'Apple' },
        { id: 'apricot', label: 'Apricot' },
        { id: 'avocado', label: 'Avocado' },
      ];
      render(<TreeView nodes={nodesWithSamePrefix} aria-label="Fruits" />);

      const apple = screen.getByRole('treeitem', { name: 'Apple' });
      apple.focus();

      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Apricot' })).toHaveFocus();

      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Avocado' })).toHaveFocus();

      await user.keyboard('a');
      expect(screen.getByRole('treeitem', { name: 'Apple' })).toHaveFocus();
    });

    it('only searches visible nodes', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      // "report.pdf" is collapsed, so 'r' should match 'readme.md' instead
      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveFocus();
    });

    it('matches multiple characters typed quickly', async () => {
      const user = userEvent.setup();
      const nodesForTypeAhead: TreeNode[] = [
        { id: 'readme', label: 'readme.md' },
        { id: 'report', label: 'report.pdf' },
        { id: 'resources', label: 'resources' },
      ];
      render(<TreeView nodes={nodesForTypeAhead} aria-label="Files" />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      // Type "rep" quickly to match "report.pdf"
      await user.keyboard('rep');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
    });

    it('resets buffer after timeout', async () => {
      const user = userEvent.setup();
      const nodesForTypeAhead: TreeNode[] = [
        { id: 'readme', label: 'readme.md' },
        { id: 'report', label: 'report.pdf' },
        { id: 'resources', label: 'resources' },
      ];
      render(<TreeView nodes={nodesForTypeAhead} aria-label="Files" typeAheadTimeout={100} />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      // Wait for timeout to reset buffer
      await new Promise((resolve) => setTimeout(resolve, 150));

      // New 'r' should cycle again
      await user.keyboard('r');
      expect(screen.getByRole('treeitem', { name: 'resources' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('tree is single Tab stop', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <TreeView nodes={simpleNodes} aria-label="Files" />
          <button>After</button>
        </>
      );

      const before = screen.getByRole('button', { name: 'Before' });
      before.focus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('focused node has tabindex="0"', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      expect(docs).toHaveAttribute('tabindex', '0');
    });

    it('other nodes have tabindex="-1"', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const images = screen.getByRole('treeitem', { name: 'Images' });
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });

      expect(images).toHaveAttribute('tabindex', '-1');
      expect(readme).toHaveAttribute('tabindex', '-1');
    });

    it('focus moves to parent when child is focused and parent collapses', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      // Navigate to report.pdf via keyboard
      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard('{ArrowRight}'); // Move to report.pdf

      expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();

      // ArrowLeft from child goes to parent, then collapse
      await user.keyboard('{ArrowLeft}'); // Move to parent (Documents)
      expect(docs).toHaveFocus();

      await user.keyboard('{ArrowLeft}'); // Collapse parent
      expect(docs).toHaveFocus();
      expect(docs).toHaveAttribute('aria-expanded', 'false');
    });

    it('focus moves to parent when parent is collapsed programmatically while child has focus', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />);

      const report = screen.getByRole('treeitem', { name: 'report.pdf' });
      const docs = screen.getByRole('treeitem', { name: 'Documents' });

      report.focus();
      expect(report).toHaveFocus();

      // Simulate clicking the parent to collapse while child has focus
      await user.click(docs);

      // Focus should move to parent when collapsed
      expect(docs).toHaveFocus();
    });

    it('disabled nodes are focusable', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={nodesWithDisabled} aria-label="Items" />);

      const item1 = screen.getByRole('treeitem', { name: 'Item 1' });
      item1.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('treeitem', { name: 'Item 2' })).toHaveFocus();
    });

    it('disabled nodes cannot be selected', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={nodesWithDisabled} aria-label="Items" />);

      const disabled = screen.getByRole('treeitem', { name: 'Item 2' });
      disabled.focus();

      // In single-select, selection follows focus but disabled nodes stay unselected
      expect(disabled).toHaveAttribute('aria-selected', 'false');
    });

    it('disabled parent nodes cannot be expanded', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={nodesWithDisabledParent} aria-label="Items" />);

      const parent = screen.getByRole('treeitem', { name: 'Disabled Parent' });
      parent.focus();

      expect(parent).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowRight}');
      expect(parent).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled nodes do not trigger onActivate on Enter', async () => {
      const user = userEvent.setup();
      const onActivate = vi.fn();
      render(<TreeView nodes={nodesWithDisabled} aria-label="Items" onActivate={onActivate} />);

      const disabled = screen.getByRole('treeitem', { name: 'Item 2' });
      disabled.focus();

      await user.keyboard('{Enter}');
      expect(onActivate).not.toHaveBeenCalled();
    });

    it('disabled nodes do not toggle selection on Space in multi-select', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <TreeView
          nodes={nodesWithDisabled}
          aria-label="Items"
          multiselectable
          onSelectionChange={onSelectionChange}
        />
      );

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
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowUp}');
      expect(docs).toHaveFocus();
    });

    it('ArrowDown at last visible node does nothing', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      await user.keyboard('{ArrowDown}');
      expect(readme).toHaveFocus();
    });

    it('ArrowDown at last visible node with expanded children does nothing', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['images']} />);

      // Last visible is photo2.jpg when images is expanded, then readme.md
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      await user.keyboard('{ArrowDown}');
      expect(readme).toHaveFocus();
    });
  });

  // 🔴 High Priority: Selection (Single-Select) - Explicit Selection Model
  // Arrow keys move focus only, Enter/Space/Click selects
  describe('APG: Selection (Single-Select)', () => {
    it('arrow keys move focus only (selection does NOT follow focus)', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultSelectedIds={['docs']} />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });

      docs.focus();
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'false');

      await user.keyboard('{ArrowDown}');
      // Focus moved but selection did NOT follow
      expect(images).toHaveFocus();
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'false');
    });

    it('only one node is selected at a time', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      docs.focus();

      // Select first node with Enter
      await user.keyboard('{Enter}');
      expect(docs).toHaveAttribute('aria-selected', 'true');

      // Move focus and select another node
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      // Only the new node should be selected
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
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" onSelectionChange={onSelectionChange} />
      );

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard(' ');
      expect(onSelectionChange).toHaveBeenCalledWith(['docs']);
      expect(docs).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onSelectionChange when Enter selects a node', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" onSelectionChange={onSelectionChange} />
      );

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{Enter}');
      expect(onSelectionChange).toHaveBeenCalledWith(['docs']);
    });
  });

  // 🔴 High Priority: Selection (Multi-Select)
  describe('APG: Selection (Multi-Select)', () => {
    it('Space toggles selection', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

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
      render(
        <TreeView
          nodes={simpleNodes}
          aria-label="Files"
          multiselectable
          defaultSelectedIds={['docs']}
        />
      );

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
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();
      await user.keyboard(' '); // Select docs

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
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{Control>}a{/Control}');

      const allItems = screen.getAllByRole('treeitem');
      allItems.forEach((item) => {
        expect(item).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('Ctrl+A selects only visible nodes (not collapsed children)', async () => {
      const user = userEvent.setup();
      render(
        <TreeView
          nodes={simpleNodes}
          aria-label="Files"
          multiselectable
          defaultExpandedIds={['docs']}
        />
      );

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{Control>}a{/Control}');

      // docs and its children are visible
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

      // images is visible but collapsed, so its children should not be selected
      // (they're not in the DOM when collapsed)
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
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      const images = screen.getByRole('treeitem', { name: 'Images' });
      const readme = screen.getByRole('treeitem', { name: 'readme.md' });

      docs.focus();

      // Select docs with Space (sets anchor to docs)
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'true');

      // Move to Images and toggle with Ctrl+Space (should NOT update anchor)
      await user.keyboard('{ArrowDown}');
      expect(images).toHaveFocus();
      await user.keyboard('{Control>} {/Control}');
      expect(images).toHaveAttribute('aria-selected', 'true');

      // Now Shift+ArrowDown should extend from original anchor (docs), not from Images
      // This will select from docs to readme (anchor=docs, current=images, target=readme)
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

      // All three should be selected because we extend from anchor (docs) to readme
      expect(docs).toHaveAttribute('aria-selected', 'true');
      expect(images).toHaveAttribute('aria-selected', 'true');
      expect(readme).toHaveAttribute('aria-selected', 'true');
    });

    it('Shift+Home extends selection from anchor to first node', async () => {
      const user = userEvent.setup();
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      const readme = screen.getByRole('treeitem', { name: 'readme.md' });
      readme.focus();

      // Set anchor by selecting with Space
      await user.keyboard(' ');
      expect(readme).toHaveAttribute('aria-selected', 'true');

      // Shift+Home should select from readme.md to Documents
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
      render(<TreeView nodes={simpleNodes} aria-label="Files" multiselectable />);

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      // Set anchor by selecting with Space
      await user.keyboard(' ');
      expect(docs).toHaveAttribute('aria-selected', 'true');

      // Shift+End should select from Documents to readme.md
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
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" onExpandedChange={onExpandedChange} />
      );

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowRight}');
      expect(onExpandedChange).toHaveBeenCalledWith(['docs']);
    });

    it('calls onExpandedChange when nodes are collapsed', async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      render(
        <TreeView
          nodes={simpleNodes}
          aria-label="Files"
          defaultExpandedIds={['docs']}
          onExpandedChange={onExpandedChange}
        />
      );

      const docs = screen.getByRole('treeitem', { name: 'Documents' });
      docs.focus();

      await user.keyboard('{ArrowLeft}');
      expect(onExpandedChange).toHaveBeenCalledWith([]);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs']} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with multi-select', async () => {
      const { container } = render(
        <TreeView nodes={simpleNodes} aria-label="Files" multiselectable />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with disabled nodes', async () => {
      const { container } = render(<TreeView nodes={nodesWithDisabled} aria-label="Items" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('respects defaultExpandedIds', () => {
      render(
        <TreeView nodes={simpleNodes} aria-label="Files" defaultExpandedIds={['docs', 'images']} />
      );

      expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      expect(screen.getByRole('treeitem', { name: 'Images' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('respects defaultSelectedIds', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" defaultSelectedIds={['readme']} />);

      expect(screen.getByRole('treeitem', { name: 'readme.md' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('applies className to container', () => {
      render(<TreeView nodes={simpleNodes} aria-label="Files" className="custom-tree" />);

      expect(screen.getByRole('tree')).toHaveClass('custom-tree');
    });
  });
});
