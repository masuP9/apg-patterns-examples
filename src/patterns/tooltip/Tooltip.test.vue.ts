import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Tooltip from './Tooltip.vue';

describe('Tooltip (Vue)', () => {
  describe('APG: ARIA 属性', () => {
    it('role="tooltip" を持つ', () => {
      render(Tooltip, {
        props: { content: 'This is a tooltip' },
        slots: { default: '<button>Hover me</button>' },
      });
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });

    it('非表示時は aria-hidden が true', () => {
      render(Tooltip, {
        props: { content: 'This is a tooltip' },
        slots: { default: '<button>Hover me</button>' },
      });
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });

    it('表示時は aria-hidden が false', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'This is a tooltip', delay: 0 },
        slots: { default: '<button>Hover me</button>' },
      });
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
      });
    });
  });

  describe('APG: キーボード操作', () => {
    it('Escape キーで閉じる', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'This is a tooltip', delay: 0 },
        slots: { default: '<button>Hover me</button>' },
      });
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });

    it('フォーカスで表示される', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'This is a tooltip', delay: 0 },
        slots: { default: '<button>Hover me</button>' },
      });

      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });
    });
  });

  describe('ホバー操作', () => {
    it('ホバーで表示される', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'This is a tooltip', delay: 0 },
        slots: { default: '<button>Hover me</button>' },
      });

      await user.hover(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('ホバー解除で閉じる', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'This is a tooltip', delay: 0 },
        slots: { default: '<button>Hover me</button>' },
      });
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      await user.unhover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Tooltip, {
        props: { content: 'This is a tooltip' },
        slots: { default: '<button>Hover me</button>' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('tooltip がフォーカスを受け取らない', () => {
      render(Tooltip, {
        props: { content: 'This is a tooltip' },
        slots: { default: '<button>Hover me</button>' },
      });
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).not.toHaveAttribute('tabindex');
    });
  });

  describe('Props', () => {
    it('placement prop で位置を変更できる', () => {
      render(Tooltip, {
        props: { content: 'Tooltip', placement: 'bottom' },
        slots: { default: '<button>Hover me</button>' },
      });
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass('top-full');
    });

    it('disabled の場合、tooltip が表示されない', async () => {
      const user = userEvent.setup();
      render(Tooltip, {
        props: { content: 'Tooltip', delay: 0, disabled: true },
        slots: { default: '<button>Hover me</button>' },
      });

      await user.hover(screen.getByRole('button'));
      await new Promise((r) => setTimeout(r, 50));
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });

    it('id prop でカスタム ID を設定できる', () => {
      render(Tooltip, {
        props: { content: 'Tooltip', id: 'custom-tooltip-id' },
        slots: { default: '<button>Hover me</button>' },
      });
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveAttribute('id', 'custom-tooltip-id');
    });
  });
});
