import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Dialog from './Dialog.vue';

// テスト用のラッパーコンポーネント
const TestDialog = {
  components: { Dialog },
  props: {
    title: { type: String, default: 'Test Dialog' },
    description: { type: String, default: undefined },
    closeOnOverlayClick: { type: Boolean, default: true },
    defaultOpen: { type: Boolean, default: false },
    className: { type: String, default: '' },
  },
  emits: ['openChange'],
  template: `
    <Dialog
      :title="title"
      :description="description"
      :close-on-overlay-click="closeOnOverlayClick"
      :default-open="defaultOpen"
      :class-name="className"
      @open-change="$emit('openChange', $event)"
    >
      <template #trigger="{ open }">
        <button @click="open">Open Dialog</button>
      </template>
      <slot>
        <p>Dialog content</p>
      </slot>
    </Dialog>
  `,
};

describe('Dialog (Vue)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: キーボード操作', () => {
    it('Escape キーでダイアログを閉じる', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(TestDialog, {
        props: { onOpenChange },
        attrs: { onOpenChange },
      });

      // ダイアログを開く
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Escape で閉じる
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('APG: ARIA 属性', () => {
    it('role="dialog" を持つ', async () => {
      const user = userEvent.setup();
      render(TestDialog);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true" を持つ', async () => {
      const user = userEvent.setup();
      render(TestDialog);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelledby でタイトルを参照', async () => {
      const user = userEvent.setup();
      render(TestDialog, {
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
      render(TestDialog, {
        props: { description: 'This is a description' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');
      const descriptionId = dialog.getAttribute('aria-describedby');

      expect(descriptionId).toBeTruthy();
      expect(document.getElementById(descriptionId!)).toHaveTextContent('This is a description');
    });

    it('description がない場合 aria-describedby なし', async () => {
      const user = userEvent.setup();
      render(TestDialog);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      expect(dialog).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('APG: フォーカス管理', () => {
    it('開いた時に最初のフォーカス可能要素にフォーカス', async () => {
      const user = userEvent.setup();
      render(TestDialog);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      // ダイアログ内の最初のフォーカス可能要素（Close ボタン）にフォーカス
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
      });
    });

    it('閉じた時にトリガーにフォーカス復元', async () => {
      const user = userEvent.setup();
      render(TestDialog);

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
      const { container } = render(TestDialog, {
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
      render(TestDialog, {
        props: { title: 'Custom Title' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('description が表示される', async () => {
      const user = userEvent.setup();
      render(TestDialog, {
        props: { description: 'Custom Description' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('closeOnOverlayClick=true でオーバーレイクリックで閉じる', async () => {
      const user = userEvent.setup();
      render(TestDialog, {
        props: { closeOnOverlayClick: true },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      await user.click(dialog);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closeOnOverlayClick=false でオーバーレイクリックしても閉じない', async () => {
      const user = userEvent.setup();
      render(TestDialog, {
        props: { closeOnOverlayClick: false },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      await user.click(dialog);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('defaultOpen=true で初期表示', async () => {
      render(TestDialog, {
        props: { defaultOpen: true },
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('className がダイアログに適用される', async () => {
      const user = userEvent.setup();
      render(TestDialog, {
        props: { className: 'custom-class' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toHaveClass('custom-class');
    });
  });
});
