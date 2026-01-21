import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import DialogTestWrapper from './DialogTestWrapper.svelte';

describe('Dialog (Svelte)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: キーボード操作', () => {
    it('Escape キーでダイアログを閉じる', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(DialogTestWrapper, {
        props: { onOpenChange },
      });

      // ダイアログを開く
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Escape で閉じる
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe('APG: ARIA 属性', () => {
    it('role="dialog" を持つ', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true" を持つ', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelledby でタイトルを参照', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { title: 'My Dialog Title' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');
      const titleId = dialog.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toHaveTextContent('My Dialog Title');
    });

    it('description がある場合 aria-describedby で参照', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { description: 'This is a description' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      await vi.waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const descriptionId = dialog.getAttribute('aria-describedby');

        expect(descriptionId).toBeTruthy();
        expect(document.getElementById(descriptionId!)).toHaveTextContent('This is a description');
      });
    });

    it('description がない場合 aria-describedby なし', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      expect(dialog).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('APG: フォーカス管理', () => {
    it('開いた時に最初のフォーカス可能要素にフォーカス', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      // ダイアログ内の最初のフォーカス可能要素（Close ボタン）にフォーカス
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
      });
    });

    it('閉じた時にトリガーにフォーカス復元', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await vi.waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    // Note: フォーカストラップはネイティブ <dialog> 要素の showModal() が処理する。
    // jsdom では showModal() のフォーカストラップ動作が未実装のため、
    // これらのテストはブラウザでの E2E テスト（Playwright）で検証することを推奨。
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による違反がない', async () => {
      const user = userEvent.setup();
      const { container } = render(DialogTestWrapper, {
        props: { description: 'Description' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props', () => {
    it('title が表示される', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { title: 'Custom Title' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('description が表示される', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { description: 'Custom Description' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('closeOnOverlayClick=true でオーバーレイクリックで閉じる', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { closeOnOverlayClick: true },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      await user.click(dialog);
      await vi.waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closeOnOverlayClick=false でオーバーレイクリックしても閉じない', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { closeOnOverlayClick: false },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      await user.click(dialog);
      await vi.waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('onOpenChange が開閉時に呼ばれる', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(DialogTestWrapper, {
        props: { onOpenChange },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      await user.keyboard('{Escape}');
      await vi.waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('defaultOpen=true で初期表示', async () => {
      render(DialogTestWrapper, {
        props: { defaultOpen: true },
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('className がダイアログに適用される', async () => {
      const user = userEvent.setup();
      render(DialogTestWrapper, {
        props: { className: 'custom-class' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toHaveClass('custom-class');
    });
  });
});
