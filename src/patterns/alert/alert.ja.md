# Alert Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

## 概要

アラートは、ユーザーのタスクを中断することなく、ユーザーの注意を引く簡潔で重要なメッセージを表示します。コンテンツが変更されると、スクリーンリーダーによって即座にアナウンスされます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `alert` | アラートコンテナ | ユーザーのタスクを中断することなく、ユーザーの注意を引く簡潔で重要なメッセージを表示する要素 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Enter` | 閉じるボタンをアクティブ化（存在する場合） |
| `Space` | 閉じるボタンをアクティブ化（存在する場合） |

## フォーカス管理

- アラートはフォーカスを移動してはいけません: アラートは非モーダルであり、フォーカスを奪うことでユーザーのワークフローを中断してはいけません
- アラートコンテナはフォーカス不可: アラート要素は tabindex を持たず、キーボードフォーカスを受け取ってはいけません
- 閉じるボタンはフォーカス可能: 存在する場合、閉じるボタンは Tab ナビゲーションで到達可能です

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="alert"
- [ ] Live region exists in DOM before content
- [ ] Content changes are announced

### 高優先度: フォーカス管理

- [ ] Alert does NOT steal focus
- [ ] Alert container is NOT focusable
- [ ] Dismiss button (if present) is focusable

### 高優先度: Behavior

- [ ] Initial page load content is NOT announced
- [ ] Dynamic content changes ARE announced
- [ ] No auto-dismissal (or user control provided)

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Critical Implementation Rule

**The live region container MUST exist in the DOM from page load.**

```jsx
// WRONG: Dynamically adding live region
{showAlert && <div role="alert">Message</div>}

// CORRECT: Live region always exists, content changes
<div role="alert">
  {message && <span>{message}</span>}
</div>
```

## Structure

```
<!-- Container always in DOM -->
<div role="alert">
  <!-- Content added dynamically -->
  <span>Your changes have been saved.</span>
</div>

Announcement Behavior:
- Page load content: NOT announced
- Dynamic changes: ANNOUNCED immediately
- aria-live="assertive": interrupts current speech
```

## Alert vs Status

| role="alert" | role="status"        |
|--------------|----------------------|
| assertive    | polite               |
| interrupts   | waits for pause      |
| urgent info  | non-urgent updates   |

## Alert vs Alert Dialog

| Use Alert                         | Use Alert Dialog                   |
|-----------------------------------|------------------------------------|
| Informational, no action required | Requires immediate response        |
| Should NOT interrupt workflow     | Must acknowledge before continuing |
| Focus stays on current task       | Focus moves to dialog              |

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

// Live region exists
it('has role="alert"', () => {
  render(<Alert message="Saved" />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

// Dynamic content announced
it('announces dynamic content', async () => {
  const { rerender } = render(<Alert message="" />);

  // Change content
  rerender(<Alert message="Changes saved" />);

  expect(screen.getByRole('alert')).toHaveTextContent('Changes saved');
});

// Does not steal focus
it('does not move focus', () => {
  const button = document.createElement('button');
  document.body.appendChild(button);
  button.focus();

  render(<Alert message="Saved" />);

  expect(document.activeElement).toBe(button);
  button.remove();
});

// Alert container not focusable
it('is not focusable', () => {
  render(<Alert message="Saved" />);
  const alert = screen.getByRole('alert');
  expect(alert).not.toHaveAttribute('tabindex');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure: Live region exists in DOM
test('has role="alert" on container', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const alert = page.locator('[role="alert"]');
  await expect(alert).toHaveAttribute('role', 'alert');
  await expect(alert).toBeAttached();
});

// Focus Management: Alert does NOT steal focus
test('does NOT steal focus when alert appears', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.focus();
  await expect(infoButton).toBeFocused();

  await infoButton.click();

  // Focus should still be on the button, not on the alert
  await expect(infoButton).toBeFocused();
});

// Accessibility: No axe-core violations
test('has no axe-core violations (with message)', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.click();
  await expect(page.locator('[role="alert"]')).toContainText('informational');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="alert"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
