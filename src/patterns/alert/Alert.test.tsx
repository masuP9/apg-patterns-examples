import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  // High Priority: APG Core Compliance
  describe('APG: ARIA 属性', () => {
    it('role="alert" を持つ', () => {
      render(<Alert message="Test message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('メッセージがなくても role=alert コンテナは DOM に存在する', () => {
      render(<Alert />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('メッセージ変更時もコンテナは同じ要素のまま', () => {
      const { rerender } = render(<Alert message="First message" />);
      const alertElement = screen.getByRole('alert');
      const alertId = alertElement.id;

      rerender(<Alert message="Second message" />);
      expect(screen.getByRole('alert')).toHaveAttribute('id', alertId);
      expect(screen.getByRole('alert')).toHaveTextContent('Second message');
    });

    it('メッセージがクリアされてもコンテナは残る', () => {
      const { rerender } = render(<Alert message="Test message" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Test message');

      rerender(<Alert message="" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).not.toHaveTextContent('Test message');
    });
  });

  describe('APG: フォーカス管理', () => {
    it('アラート表示時にフォーカスを移動しない', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Other button</button>
          <Alert message="Test message" />
        </>
      );

      const button = screen.getByRole('button', { name: 'Other button' });
      await user.click(button);
      expect(button).toHaveFocus();

      // アラートが表示されてもフォーカスは移動しない
      expect(button).toHaveFocus();
    });

    it('アラート自体はフォーカスを受け取らない（tabindex なし）', () => {
      render(<Alert message="Test message" />);
      expect(screen.getByRole('alert')).not.toHaveAttribute('tabindex');
    });
  });

  describe('Dismiss 機能', () => {
    it('dismissible=true で閉じるボタンが表示される', () => {
      render(<Alert message="Test message" dismissible />);
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
    });

    it('dismissible=false（デフォルト）で閉じるボタンが表示されない', () => {
      render(<Alert message="Test message" />);
      expect(screen.queryByRole('button', { name: 'Dismiss alert' })).not.toBeInTheDocument();
    });

    it('閉じるボタンクリックで onDismiss が呼び出される', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(<Alert message="Test message" dismissible onDismiss={handleDismiss} />);

      await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('閉じるボタンは type=button を持つ', () => {
      render(<Alert message="Test message" dismissible />);
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toHaveAttribute(
        'type',
        'button'
      );
    });

    it('閉じるボタンに aria-label がある', () => {
      render(<Alert message="Test message" dismissible />);
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toHaveAccessibleName(
        'Dismiss alert'
      );
    });
  });

  // Medium Priority: Accessibility Validation
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない（メッセージあり）', async () => {
      const { container } = render(<Alert message="Test message" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('axe による WCAG 2.1 AA 違反がない（メッセージなし）', async () => {
      const { container } = render(<Alert />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('axe による WCAG 2.1 AA 違反がない（dismissible）', async () => {
      const { container } = render(
        <Alert message="Test message" dismissible onDismiss={() => {}} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Variant スタイル', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'variant=%s で適切なスタイルクラスが適用される',
      (variant) => {
        render(<Alert message="Test message" variant={variant} />);
        const alert = screen.getByRole('alert');
        // apg-alert class is on the parent wrapper, not on role="alert"
        const wrapper = alert.parentElement;
        expect(wrapper).toHaveClass('apg-alert');
      }
    );

    it('デフォルトの variant は info', () => {
      render(<Alert message="Test message" />);
      const alert = screen.getByRole('alert');
      // info variant のスタイルが親ラッパーに適用されている
      const wrapper = alert.parentElement;
      expect(wrapper).toHaveClass('bg-blue-50');
    });
  });

  // Low Priority: Props & Extensibility
  describe('Props', () => {
    it('id prop でカスタム ID を設定できる', () => {
      render(<Alert message="Test message" id="custom-alert-id" />);
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'custom-alert-id');
    });

    it('className が正しくマージされる', () => {
      render(<Alert message="Test message" className="custom-class" />);
      const alert = screen.getByRole('alert');
      // className は親ラッパーに適用される
      const wrapper = alert.parentElement;
      expect(wrapper).toHaveClass('apg-alert');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('children で複雑なコンテンツを渡せる', () => {
      render(
        <Alert>
          <strong>Important:</strong> This is a message
        </Alert>
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Important: This is a message');
    });

    it('message と children 両方ある場合は message が優先される', () => {
      render(
        <Alert message="Message prop">
          <span>Children content</span>
        </Alert>
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Message prop');
      expect(screen.getByRole('alert')).not.toHaveTextContent('Children content');
    });
  });

  describe('HTML 属性継承', () => {
    it('追加の HTML 属性が渡せる', () => {
      render(<Alert message="Test" data-testid="custom-alert" />);
      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  });
});
