import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import AlertDialog from './AlertDialog.vue';

// テスト用のラッパーコンポーネント
const TestAlertDialog = {
  components: { AlertDialog },
  props: {
    title: { type: String, default: 'Confirm Action' },
    message: { type: String, default: 'Are you sure you want to proceed?' },
    confirmLabel: { type: String, default: 'Confirm' },
    cancelLabel: { type: String, default: 'Cancel' },
    confirmVariant: { type: String as () => 'default' | 'danger', default: 'default' },
    allowEscapeClose: { type: Boolean, default: false },
    defaultOpen: { type: Boolean, default: false },
  },
  emits: ['confirm', 'cancel'],
  template: `
    <AlertDialog
      :title="title"
      :message="message"
      :confirm-label="confirmLabel"
      :cancel-label="cancelLabel"
      :confirm-variant="confirmVariant"
      :allow-escape-close="allowEscapeClose"
      :default-open="defaultOpen"
      @confirm="$emit('confirm')"
      @cancel="$emit('cancel')"
    >
      <template #trigger="{ open }">
        <button @click="open">Open Alert</button>
      </template>
    </AlertDialog>
  `,
};

describe('AlertDialog (Vue)', () => {
  // 🔴 High Priority: APG ARIA 属性
  describe('APG: ARIA 属性', () => {
    it('role="alertdialog" を持つ（dialog ではない）', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('aria-modal="true" を持つ', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelledby でタイトルを参照', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog, {
        props: { title: 'Delete Item' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      const dialog = screen.getByRole('alertdialog');
      const titleId = dialog.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toHaveTextContent('Delete Item');
    });

    it('aria-describedby でメッセージを参照（必須 - Dialog と異なる）', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog, {
        props: { message: 'This action cannot be undone.' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      const dialog = screen.getByRole('alertdialog');
      const messageId = dialog.getAttribute('aria-describedby');

      expect(messageId).toBeTruthy();
      expect(document.getElementById(messageId!)).toHaveTextContent(
        'This action cannot be undone.'
      );
    });
  });

  // 🔴 High Priority: キーボード操作
  describe('APG: キーボード操作', () => {
    it('デフォルトで Escape キーで閉じない（Dialog と異なる）', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(TestAlertDialog, {
        props: { onCancel },
        attrs: { onCancel },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('allowEscapeClose=true で Escape キーで閉じる', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(TestAlertDialog, {
        props: { allowEscapeClose: true, onCancel },
        attrs: { onCancel },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(onCancel).toHaveBeenCalled();
    });

    it('Tab で次のフォーカス可能要素に移動', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });

      await user.tab();
      expect(confirmButton).toHaveFocus();
    });

    it('Tab が最後から最初にループする', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });

      await user.tab();
      expect(confirmButton).toHaveFocus();

      await user.tab();
      expect(cancelButton).toHaveFocus();
    });
  });

  // 🔴 High Priority: フォーカス管理
  describe('APG: フォーカス管理', () => {
    it('開いた時に Cancel ボタンにフォーカス（安全なアクション、Dialog と異なる）', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog, {
        props: { cancelLabel: 'Cancel', confirmLabel: 'Delete' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });
    });

    it('閉じた時にトリガーにフォーカス復元', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      const trigger = screen.getByRole('button', { name: 'Open Alert' });
      await user.click(trigger);

      await vi.waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(trigger).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: アクセシビリティ
  describe('アクセシビリティ', () => {
    it('axe による違反がない', async () => {
      const user = userEvent.setup();
      const { container } = render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Callbacks
  describe('Props & Callbacks', () => {
    it('confirm ボタンクリックで onConfirm を呼ぶ', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(TestAlertDialog, {
        props: { onConfirm },
        attrs: { onConfirm },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('cancel ボタンクリックで onCancel を呼ぶ', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(TestAlertDialog, {
        props: { onCancel },
        attrs: { onCancel },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('カスタムボタンラベルが表示される', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog, {
        props: { confirmLabel: 'Delete', cancelLabel: 'Keep' },
      });

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });

    it('defaultOpen=true で初期表示', async () => {
      render(TestAlertDialog, {
        props: { defaultOpen: true },
      });
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  // Alert Dialog 固有の動作
  describe('Alert Dialog 固有の動作', () => {
    it('閉じるボタン（×）がない（通常の Dialog と異なる）', async () => {
      const user = userEvent.setup();
      render(TestAlertDialog);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });
});
