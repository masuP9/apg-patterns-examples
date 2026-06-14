import { render, screen } from '@testing-library/vue';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import Breadcrumb from './Breadcrumb.vue';

const threeItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
];

describe('Breadcrumb (Vue)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('nav 要素にデフォルトの aria-label="Breadcrumb" が付く', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('ariaLabel をカスタム値で上書きできる', () => {
      render(Breadcrumb, { props: { items: threeItems, ariaLabel: 'パンくず' } });
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'パンくず');
    });

    it('最後のアイテムに aria-current="page" が付く', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      const current = screen.getByText('Widget');
      expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('最後以外のアイテムに aria-current が付かない', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).not.toHaveAttribute('aria-current');
    });
  });

  describe('APG: 構造', () => {
    it('nav > ol > li の構造を持つ', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      const nav = screen.getByRole('navigation');
      const list = nav.querySelector('ol.apg-breadcrumb-list');
      expect(list).not.toBeNull();
      const items = list!.querySelectorAll('li.apg-breadcrumb-item');
      expect(items).toHaveLength(3);
    });

    it('href を持つ非最終アイテムはリンクとしてレンダリングされる', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    });

    it('最終アイテムはリンクでない span としてレンダリングされる', () => {
      render(Breadcrumb, { props: { items: threeItems } });
      const current = screen.getByText('Widget');
      expect(current.tagName).toBe('SPAN');
      expect(current).toHaveClass('apg-breadcrumb-current');
    });

    it('アイテム数が 0 の場合は何もレンダリングしない', () => {
      render(Breadcrumb, { props: { items: [] } });
      expect(screen.queryByRole('navigation')).toBeNull();
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Breadcrumb, { props: { items: threeItems } });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
