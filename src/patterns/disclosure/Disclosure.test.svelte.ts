import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Disclosure from './Disclosure.svelte';

describe('Disclosure (Svelte)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('トリガーに aria-expanded="false" の初期状態が付く', () => {
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('defaultExpanded=true で aria-expanded="true" の初期状態になる', () => {
      render(Disclosure, { props: { trigger: '詳細を見る', defaultExpanded: true } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('トリガーの aria-controls がパネルの id と一致する', () => {
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      const panelId = button.getAttribute('aria-controls');
      expect(panelId).not.toBeNull();
      const panel = document.getElementById(panelId!);
      expect(panel).not.toBeNull();
    });

    it('初期状態でパネルが aria-hidden="true" になっている', () => {
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      const panelId = button.getAttribute('aria-controls')!;
      const panel = document.getElementById(panelId)!;
      expect(panel).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('APG: キーボード操作', () => {
    it('クリックで aria-expanded がトグルする', async () => {
      const user = userEvent.setup();
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });

      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('Enter キーで aria-expanded がトグルする', async () => {
      const user = userEvent.setup();
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      button.focus();

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('Space キーで aria-expanded がトグルする', async () => {
      const user = userEvent.setup();
      render(Disclosure, { props: { trigger: '詳細を見る' } });
      const button = screen.getByRole('button', { name: '詳細を見る' });
      button.focus();

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Props', () => {
    it('onExpandedChange が新しい展開状態とともに呼ばれる', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(Disclosure, { props: { trigger: '詳細を見る', onExpandedChange: handleChange } });
      const button = screen.getByRole('button', { name: '詳細を見る' });

      await user.click(button);
      expect(handleChange).toHaveBeenCalledWith(true);
      await user.click(button);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('disabled のときボタンが無効化されトグルできない', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(Disclosure, {
        props: { trigger: '詳細を見る', disabled: true, onExpandedChange: handleChange },
      });
      const button = screen.getByRole('button', { name: '詳細を見る' });

      expect(button).toBeDisabled();
      await user.click(button);
      expect(handleChange).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('閉じた状態で axe 違反がない', async () => {
      const { container } = render(Disclosure, { props: { trigger: '詳細を見る' } });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('開いた状態で axe 違反がない', async () => {
      const { container } = render(Disclosure, {
        props: { trigger: '詳細を見る', defaultExpanded: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
