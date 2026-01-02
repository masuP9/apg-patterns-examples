import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Switch from './Switch.svelte';

describe('Switch (Svelte)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('role="switch" を持つ', () => {
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('初期状態で aria-checked="false"', () => {
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });

    it('クリック後に aria-checked="true" に変わる', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('type="button" が設定されている', () => {
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('type', 'button');
    });

    it('disabled 時に aria-disabled が設定される', () => {
      render(Switch, {
        props: { children: 'Wi-Fi', disabled: true },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled 状態で aria-checked 変更不可', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi', disabled: true },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('APG: キーボード操作', () => {
    it('Space キーでトグルする', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      switchEl.focus();
      await user.keyboard(' ');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('Enter キーでトグルする', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      switchEl.focus();
      await user.keyboard('{Enter}');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('disabled 時は Tab キースキップ', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      const { unmount: unmount1 } = render(Switch, {
        target: container,
        props: { children: 'Switch 1' },
      });
      const { unmount: unmount2 } = render(Switch, {
        target: container,
        props: { children: 'Switch 2', disabled: true },
      });
      const { unmount: unmount3 } = render(Switch, {
        target: container,
        props: { children: 'Switch 3' },
      });

      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 3' })).toHaveFocus();

      unmount1();
      unmount2();
      unmount3();
      document.body.removeChild(container);
    });

    it('disabled 時はキー操作無効', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi', disabled: true },
      });
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      await user.keyboard(' ');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ラベル（children）でアクセシブルネームを持つ', () => {
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
    });

    it('aria-label でアクセシブルネームを設定できる', () => {
      render(Switch, {
        props: { 'aria-label': 'Enable notifications' },
      });
      expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
    });

    it('aria-labelledby で外部ラベルを参照できる', () => {
      const container = document.createElement('div');
      container.innerHTML = '<span id="switch-label">Bluetooth</span>';
      document.body.appendChild(container);

      render(Switch, {
        target: container,
        props: { 'aria-labelledby': 'switch-label' },
      });

      expect(screen.getByRole('switch', { name: 'Bluetooth' })).toBeInTheDocument();

      document.body.removeChild(container);
    });
  });

  describe('Props', () => {
    it('initialChecked=true で ON 状態でレンダリングされる', () => {
      render(Switch, {
        props: { children: 'Wi-Fi', initialChecked: true },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('onCheckedChange が状態変化時に呼び出される', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(Switch, {
        props: { children: 'Wi-Fi', onCheckedChange: handleCheckedChange },
      });

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('デフォルトで apg-switch クラスが設定される', () => {
      render(Switch, {
        props: { children: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('apg-switch');
    });

    it('data-* 属性が継承される', () => {
      render(Switch, {
        props: { children: 'Wi-Fi', 'data-testid': 'custom-switch' },
      });
      expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
    });
  });
});
