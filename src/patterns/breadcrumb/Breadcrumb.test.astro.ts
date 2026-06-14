import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import Breadcrumb from './Breadcrumb.astro';

const threeItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
];

describe('Breadcrumb (Astro)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('nav 要素にデフォルトの aria-label="Breadcrumb" が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: threeItems } });
      const doc = new JSDOM(html).window.document;
      const nav = doc.querySelector('nav');
      expect(nav).not.toBeNull();
      expect(nav!.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('ariaLabel をカスタム値で上書きできる', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, {
        props: { items: threeItems, ariaLabel: 'パンくず' },
      });
      const doc = new JSDOM(html).window.document;
      const nav = doc.querySelector('nav');
      expect(nav!.getAttribute('aria-label')).toBe('パンくず');
    });

    it('最後のアイテムに aria-current="page" が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: threeItems } });
      const doc = new JSDOM(html).window.document;
      const spans = doc.querySelectorAll('span.apg-breadcrumb-current');
      // 最後のアイテムのみ aria-current="page"
      const lastSpan = Array.from(spans).find((s) => s.textContent?.trim() === 'Widget');
      expect(lastSpan).not.toBeNull();
      expect(lastSpan!.getAttribute('aria-current')).toBe('page');
    });

    it('最後以外のアイテムに aria-current が付かない', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: threeItems } });
      const doc = new JSDOM(html).window.document;
      const homeLink = doc.querySelector('a[href="/"]');
      expect(homeLink).not.toBeNull();
      expect(homeLink!.getAttribute('aria-current')).toBeNull();
    });
  });

  describe('APG: 構造', () => {
    it('nav > ol > li の構造で各アイテムが li にレンダリングされる', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: threeItems } });
      const doc = new JSDOM(html).window.document;
      const list = doc.querySelector('nav ol.apg-breadcrumb-list');
      expect(list).not.toBeNull();
      expect(list!.querySelectorAll('li.apg-breadcrumb-item')).toHaveLength(3);
    });

    it('href を持つ非最終アイテムはリンクとしてレンダリングされる', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: threeItems } });
      const doc = new JSDOM(html).window.document;
      const homeLink = doc.querySelector('a.apg-breadcrumb-link[href="/"]');
      const productsLink = doc.querySelector('a.apg-breadcrumb-link[href="/products"]');
      expect(homeLink).not.toBeNull();
      expect(productsLink).not.toBeNull();
    });

    it('アイテム数が 0 の場合は nav がレンダリングされない', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Breadcrumb, { props: { items: [] } });
      const doc = new JSDOM(html).window.document;
      expect(doc.querySelector('nav')).toBeNull();
    });
  });
});
