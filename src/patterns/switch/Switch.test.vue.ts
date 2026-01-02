import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Switch from './Switch.vue';

describe('Switch (Vue)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('role="switch" を持つ', () => {
      render(Switch, {
        slots: { default: 'Wi-Fi' },
      });
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('初期状態で aria-checked="false"', () => {
      render(Switch, {
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });

    it('クリック後に aria-checked="true" に変わる', async () => {
      const user = userEvent.setup();
      render(Switch, {
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('type="button" が設定されている', () => {
      render(Switch, {
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('type', 'button');
    });

    it('disabled 時に aria-disabled が設定される', () => {
      render(Switch, {
        props: { disabled: true },
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled 状態で aria-checked 変更不可', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { disabled: true },
        slots: { default: 'Wi-Fi' },
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
        slots: { default: 'Wi-Fi' },
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
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      switchEl.focus();
      await user.keyboard('{Enter}');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('Tab キーでフォーカス移動可能', async () => {
      const user = userEvent.setup();
      render({
        components: { Switch },
        template: `
          <Switch>Switch 1</Switch>
          <Switch>Switch 2</Switch>
        `,
      });

      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 2' })).toHaveFocus();
    });

    it('disabled 時は Tab キースキップ', async () => {
      const user = userEvent.setup();
      render({
        components: { Switch },
        template: `
          <Switch>Switch 1</Switch>
          <Switch disabled>Switch 2</Switch>
          <Switch>Switch 3</Switch>
        `,
      });

      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 3' })).toHaveFocus();
    });

    it('disabled 時はキー操作無効', async () => {
      const user = userEvent.setup();
      render(Switch, {
        props: { disabled: true },
        slots: { default: 'Wi-Fi' },
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
        slots: { default: 'Wi-Fi' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ラベル（children）でアクセシブルネームを持つ', () => {
      render(Switch, {
        slots: { default: 'Wi-Fi' },
      });
      expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
    });

    it('aria-label でアクセシブルネームを設定できる', () => {
      render(Switch, {
        attrs: { 'aria-label': 'Enable notifications' },
      });
      expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
    });

    it('aria-labelledby で外部ラベルを参照できる', () => {
      render({
        components: { Switch },
        template: `
          <span id="switch-label">Bluetooth</span>
          <Switch aria-labelledby="switch-label" />
        `,
      });
      expect(screen.getByRole('switch', { name: 'Bluetooth' })).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('initialChecked=true で ON 状態でレンダリングされる', () => {
      render(Switch, {
        props: { initialChecked: true },
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('onCheckedChange が状態変化時に呼び出される', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(Switch, {
        props: { onCheckedChange: handleCheckedChange },
        slots: { default: 'Wi-Fi' },
      });

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });

    it('@change イベントが状態変化時に発火する', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(Switch, {
        props: { onCheckedChange: handleChange },
        slots: { default: 'Wi-Fi' },
      });

      await user.click(screen.getByRole('switch'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('class が正しくマージされる', () => {
      render(Switch, {
        attrs: { class: 'custom-class' },
        slots: { default: 'Wi-Fi' },
      });
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('custom-class');
      expect(switchEl).toHaveClass('apg-switch');
    });

    it('data-* 属性が継承される', () => {
      render(Switch, {
        attrs: { 'data-testid': 'custom-switch' },
        slots: { default: 'Wi-Fi' },
      });
      expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
    });
  });
});
