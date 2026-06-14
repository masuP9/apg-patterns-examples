import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Listbox from './Listbox.vue';

const options = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
];

const optionsWithDisabled = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana', disabled: true },
  { id: 'c', label: 'Cherry' },
];

describe('Listbox (Vue)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('role="listbox" を持つ', () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('aria-orientation="vertical" がデフォルト', () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('aria-orientation="horizontal" を指定できる', () => {
      render(Listbox, { props: { options, orientation: 'horizontal', ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('各オプションが role="option" を持つ', () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      const opts = screen.getAllByRole('option');
      expect(opts).toHaveLength(3);
    });

    it('シングルセレクトでは aria-multiselectable が付かない', () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-multiselectable');
    });

    it('multiselectable=true で aria-multiselectable="true" が付く', () => {
      render(Listbox, { props: { options, multiselectable: true, ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('ariaLabel が listbox に付く', () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-label', 'フルーツ');
    });

    it('disabled オプションに aria-disabled="true" が付く', () => {
      render(Listbox, { props: { options: optionsWithDisabled, ariaLabel: 'フルーツ' } });
      const banana = screen.getByRole('option', { name: /Banana/ });
      expect(banana).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('APG: 選択状態', () => {
    it('シングルセレクトで最初の利用可能オプションが初期選択される', async () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      // Vue initializes on mount — wait for next tick
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      expect(apple).toHaveAttribute('aria-selected', 'true');
    });

    it('defaultSelectedIds で初期選択を指定できる', async () => {
      render(Listbox, {
        props: { options, defaultSelectedIds: ['b'], ariaLabel: 'フルーツ' },
      });
      await new Promise((r) => setTimeout(r, 0));
      const banana = screen.getByRole('option', { name: /Banana/ });
      expect(banana).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('APG: ローービングタブインデックス', () => {
    it('初期状態でちょうど 1 つのオプションが tabindex="0" を持つ', async () => {
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const opts = screen.getAllByRole('option');
      const tabbable = opts.filter((o) => o.getAttribute('tabindex') === '0');
      expect(tabbable).toHaveLength(1);
    });

    it('disabled オプションは tabindex="-1" を持つ', () => {
      render(Listbox, { props: { options: optionsWithDisabled, ariaLabel: 'フルーツ' } });
      const banana = screen.getByRole('option', { name: /Banana/ });
      expect(banana).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('APG: キーボード操作', () => {
    it('ArrowDown でフォーカスと選択が次のオプションに移動する', async () => {
      const user = userEvent.setup();
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard('{ArrowDown}');
      const banana = screen.getByRole('option', { name: /Banana/ });
      expect(banana).toHaveAttribute('aria-selected', 'true');
      expect(banana).toHaveAttribute('tabindex', '0');
    });

    it('ArrowUp でフォーカスと選択が前のオプションに移動する', async () => {
      const user = userEvent.setup();
      render(Listbox, {
        props: { options, defaultSelectedIds: ['b'], ariaLabel: 'フルーツ' },
      });
      await new Promise((r) => setTimeout(r, 0));
      const banana = screen.getByRole('option', { name: /Banana/ });
      banana.focus();

      await user.keyboard('{ArrowUp}');
      const apple = screen.getByRole('option', { name: /Apple/ });
      expect(apple).toHaveAttribute('aria-selected', 'true');
    });

    it('Home キーで最初のオプションに移動する', async () => {
      const user = userEvent.setup();
      render(Listbox, {
        props: { options, defaultSelectedIds: ['c'], ariaLabel: 'フルーツ' },
      });
      await new Promise((r) => setTimeout(r, 0));
      const cherry = screen.getByRole('option', { name: /Cherry/ });
      cherry.focus();

      await user.keyboard('{Home}');
      const apple = screen.getByRole('option', { name: /Apple/ });
      expect(apple).toHaveAttribute('aria-selected', 'true');
    });

    it('End キーで最後のオプションに移動する', async () => {
      const user = userEvent.setup();
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard('{End}');
      const cherry = screen.getByRole('option', { name: /Cherry/ });
      expect(cherry).toHaveAttribute('aria-selected', 'true');
    });

    it('タイプアヘッドで "b" を入力すると Banana にフォーカスする', async () => {
      const user = userEvent.setup();
      render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard('b');
      const banana = screen.getByRole('option', { name: /Banana/ });
      expect(banana).toHaveAttribute('tabindex', '0');
    });

    it('マルチセレクトで Space キーがフォーカスオプションをトグルする', async () => {
      const user = userEvent.setup();
      render(Listbox, { props: { options, multiselectable: true, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard(' ');
      expect(apple).toHaveAttribute('aria-selected', 'true');
    });

    it('マルチセレクトで Ctrl+A が全オプションを選択する', async () => {
      const user = userEvent.setup();
      render(Listbox, { props: { options, multiselectable: true, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard('{Control>}a{/Control}');
      const opts = screen.getAllByRole('option');
      opts.forEach((opt) => {
        expect(opt).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Props', () => {
    it('selectionChange イベントが選択変更時に発火する', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(Listbox, {
        props: { options, ariaLabel: 'フルーツ' },
        attrs: { onSelectionChange: handleChange },
      });
      await new Promise((r) => setTimeout(r, 0));
      const apple = screen.getByRole('option', { name: /Apple/ });
      apple.focus();

      await user.keyboard('{ArrowDown}');
      expect(handleChange).toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Listbox, { props: { options, ariaLabel: 'フルーツ' } });
      await new Promise((r) => setTimeout(r, 0));
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('マルチセレクトで axe 違反がない', async () => {
      const { container } = render(Listbox, {
        props: { options, multiselectable: true, ariaLabel: 'フルーツ' },
      });
      await new Promise((r) => setTimeout(r, 0));
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
