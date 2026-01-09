import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// jest-axe マッチャーを追加
expect.extend(toHaveNoViolations);

// IntersectionObserver モック（jsdom 未サポート）
// Feed パターンの無限スクロール機能でIntersection Observerを使用
class IntersectionObserverMock implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    // テスト中は即座にコールバックを呼び出さない
  }

  unobserve(): void {
    // No-op
  }

  disconnect(): void {
    // No-op
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// グローバルに IntersectionObserver を設定
global.IntersectionObserver = IntersectionObserverMock;

// <dialog> 要素のポリフィル（jsdom 未サポート）
// ネイティブの <dialog> は showModal() で開くと自動的に Escape キーで閉じる。
// jsdom ではこの動作がサポートされていないためエミュレートする。

// Global Escape key handler (native <dialog> handles this at document level)
// This must be added regardless of HTMLDialogElement support
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // Find all open modal dialogs
    const openDialogs = document.querySelectorAll("dialog[open][aria-modal='true']");
    const topModal = openDialogs[openDialogs.length - 1] as HTMLDialogElement | undefined;
    if (topModal) {
      event.preventDefault();
      topModal.close();
    }
  }
});

if (typeof HTMLDialogElement !== 'undefined') {
  // showModal のポリフィル
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    if (originalShowModal) {
      try {
        originalShowModal.call(this);
      } catch {
        // jsdom doesn't fully support showModal
      }
    }
    this.setAttribute('open', '');
    this.setAttribute('aria-modal', 'true');

    // 初期フォーカス管理（ネイティブ <dialog> の動作をエミュレート）
    // 優先順位: autofocus 属性 → 最初のフォーカス可能要素 → dialog 自体
    requestAnimationFrame(() => {
      const autofocusEl = this.querySelector<HTMLElement>('[autofocus]');
      if (autofocusEl) {
        autofocusEl.focus();
        return;
      }

      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusable = this.querySelector<HTMLElement>(focusableSelector);
      if (firstFocusable) {
        firstFocusable.focus();
        return;
      }

      // フォーカス可能要素がない場合は dialog 自体にフォーカス
      this.setAttribute('tabindex', '-1');
      this.focus();
    });
  };

  // close のポリフィル
  const originalClose = HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (originalClose) {
      try {
        originalClose.call(this);
      } catch {
        // jsdom doesn't fully support close
      }
    }
    this.removeAttribute('open');
    this.removeAttribute('aria-modal');
    this.dispatchEvent(new Event('close'));
  };
}
