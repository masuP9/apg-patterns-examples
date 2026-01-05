import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, type AccordionItem } from './Accordion';

// Test accordion data
const defaultItems: AccordionItem[] = [
  { id: 'section1', header: 'Section 1', content: 'Content 1' },
  { id: 'section2', header: 'Section 2', content: 'Content 2' },
  { id: 'section3', header: 'Section 3', content: 'Content 3' },
];

const itemsWithDisabled: AccordionItem[] = [
  { id: 'section1', header: 'Section 1', content: 'Content 1' },
  { id: 'section2', header: 'Section 2', content: 'Content 2', disabled: true },
  { id: 'section3', header: 'Section 3', content: 'Content 3' },
];

const itemsWithDefaultExpanded: AccordionItem[] = [
  { id: 'section1', header: 'Section 1', content: 'Content 1', defaultExpanded: true },
  { id: 'section2', header: 'Section 2', content: 'Content 2' },
  { id: 'section3', header: 'Section 3', content: 'Content 3' },
];

// 7+ items (for region role test)
const manyItems: AccordionItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: `section${i + 1}`,
  header: `Section ${i + 1}`,
  content: `Content ${i + 1}`,
}));

describe('Accordion', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: Keyboard Interaction', () => {
    it('toggles panel with Enter', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button = screen.getByRole('button', { name: 'Section 1' });
      button.focus();

      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles panel with Space', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button = screen.getByRole('button', { name: 'Section 1' });
      button.focus();

      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('moves focus to next header with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      button1.focus();

      await user.keyboard('{ArrowDown}');

      const button2 = screen.getByRole('button', { name: 'Section 2' });
      expect(button2).toHaveFocus();
    });

    it('moves focus to previous header with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button2 = screen.getByRole('button', { name: 'Section 2' });
      button2.focus();

      await user.keyboard('{ArrowUp}');

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      expect(button1).toHaveFocus();
    });

    it('does not move focus when at last header with ArrowDown (no loop)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button3 = screen.getByRole('button', { name: 'Section 3' });
      button3.focus();

      await user.keyboard('{ArrowDown}');

      // Focus does not move
      expect(button3).toHaveFocus();
    });

    it('does not move focus when at first header with ArrowUp (no loop)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      button1.focus();

      await user.keyboard('{ArrowUp}');

      // Focus does not move
      expect(button1).toHaveFocus();
    });

    it('moves focus to first header with Home', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button3 = screen.getByRole('button', { name: 'Section 3' });
      button3.focus();

      await user.keyboard('{Home}');

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      expect(button1).toHaveFocus();
    });

    it('moves focus to last header with End', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      button1.focus();

      await user.keyboard('{End}');

      const button3 = screen.getByRole('button', { name: 'Section 3' });
      expect(button3).toHaveFocus();
    });

    it('skips disabled headers when navigating', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithDisabled} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      button1.focus();

      await user.keyboard('{ArrowDown}');

      // Section 2 is skipped, moves to Section 3
      const button3 = screen.getByRole('button', { name: 'Section 3' });
      expect(button3).toHaveFocus();
    });

    it('disables arrow key navigation when enableArrowKeys=false', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} enableArrowKeys={false} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      button1.focus();

      await user.keyboard('{ArrowDown}');

      // Focus does not move
      expect(button1).toHaveFocus();
    });
  });

  describe('APG: ARIA Attributes', () => {
    it('header buttons have aria-expanded', () => {
      render(<Accordion items={defaultItems} />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded');
      });
    });

    it('has aria-expanded="true" on open panel', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button = screen.getByRole('button', { name: 'Section 1' });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-expanded="false" on closed panel', () => {
      render(<Accordion items={defaultItems} />);
      const button = screen.getByRole('button', { name: 'Section 1' });

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('header aria-controls matches panel id', () => {
      render(<Accordion items={defaultItems} />);
      const button = screen.getByRole('button', { name: 'Section 1' });
      const ariaControls = button.getAttribute('aria-controls');

      expect(ariaControls).toBeTruthy();
      expect(document.getElementById(ariaControls!)).toBeInTheDocument();
    });

    it('panels have role="region" when 6 or fewer', () => {
      render(<Accordion items={defaultItems} />);
      const regions = screen.getAllByRole('region');

      expect(regions).toHaveLength(3);
    });

    it('panels do not have role="region" when 7 or more', () => {
      render(<Accordion items={manyItems} />);
      const regions = screen.queryAllByRole('region');

      expect(regions).toHaveLength(0);
    });

    it('panel aria-labelledby matches header id', () => {
      render(<Accordion items={defaultItems} />);
      const button = screen.getByRole('button', { name: 'Section 1' });
      const regions = screen.getAllByRole('region');

      expect(regions[0]).toHaveAttribute('aria-labelledby', button.id);
    });

    it('disabled item has aria-disabled="true"', () => {
      render(<Accordion items={itemsWithDisabled} />);
      const disabledButton = screen.getByRole('button', { name: 'Section 2' });

      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('APG: Heading Structure', () => {
    it('uses h3 element when headingLevel=3', () => {
      render(<Accordion items={defaultItems} headingLevel={3} />);
      const headings = document.querySelectorAll('h3');

      expect(headings).toHaveLength(3);
    });

    it('uses h2 element when headingLevel=2', () => {
      render(<Accordion items={defaultItems} headingLevel={2} />);
      const headings = document.querySelectorAll('h2');

      expect(headings).toHaveLength(3);
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations', async () => {
      const { container } = render(<Accordion items={defaultItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props', () => {
    it('can specify initial expanded state with defaultExpanded', () => {
      render(<Accordion items={itemsWithDefaultExpanded} />);
      const button = screen.getByRole('button', { name: 'Section 1' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('only one panel expanded when allowMultiple=false (default)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      const button2 = screen.getByRole('button', { name: 'Section 2' });

      await user.click(button1);
      expect(button1).toHaveAttribute('aria-expanded', 'true');

      await user.click(button2);
      expect(button1).toHaveAttribute('aria-expanded', 'false');
      expect(button2).toHaveAttribute('aria-expanded', 'true');
    });

    it('multiple panels can be expanded when allowMultiple=true', async () => {
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} allowMultiple />);

      const button1 = screen.getByRole('button', { name: 'Section 1' });
      const button2 = screen.getByRole('button', { name: 'Section 2' });

      await user.click(button1);
      await user.click(button2);

      expect(button1).toHaveAttribute('aria-expanded', 'true');
      expect(button2).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onExpandedChange when expanded state changes', async () => {
      const handleExpandedChange = vi.fn();
      const user = userEvent.setup();
      render(<Accordion items={defaultItems} onExpandedChange={handleExpandedChange} />);

      await user.click(screen.getByRole('button', { name: 'Section 1' }));

      expect(handleExpandedChange).toHaveBeenCalledWith(['section1']);
    });
  });

  describe('Edge Cases', () => {
    it('disabled item does not toggle on click', async () => {
      const user = userEvent.setup();
      render(<Accordion items={itemsWithDisabled} />);

      const disabledButton = screen.getByRole('button', { name: 'Section 2' });

      expect(disabledButton).toHaveAttribute('aria-expanded', 'false');
      await user.click(disabledButton);
      expect(disabledButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled item with defaultExpanded is not expanded', () => {
      const items: AccordionItem[] = [
        {
          id: 'section1',
          header: 'Section 1',
          content: 'Content 1',
          disabled: true,
          defaultExpanded: true,
        },
      ];
      render(<Accordion items={items} />);

      const button = screen.getByRole('button', { name: 'Section 1' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      const { container } = render(<Accordion items={defaultItems} className="custom-accordion" />);
      const accordionContainer = container.firstChild as HTMLElement;
      expect(accordionContainer).toHaveClass('custom-accordion');
    });
  });
});
