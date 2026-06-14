import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import Disclosure from './Disclosure.astro';

describe('Disclosure (Astro)', () => {
  // 🔴 High Priority: APG 準拠の核心 (初期レンダリングのみ)
  describe('APG: ARIA 属性 (初期レンダリング)', () => {
    it('トリガーボタンに aria-expanded="false" の初期状態が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Disclosure, {
        props: { trigger: '詳細を見る' },
        slots: { default: '<p>コンテンツ</p>' },
      });
      const doc = new JSDOM(html).window.document;
      const button = doc.querySelector('button.apg-disclosure-trigger');
      expect(button).not.toBeNull();
      expect(button!.getAttribute('aria-expanded')).toBe('false');
    });

    it('defaultExpanded=true で aria-expanded="true" の初期状態になる', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Disclosure, {
        props: { trigger: '詳細を見る', defaultExpanded: true },
        slots: { default: '<p>コンテンツ</p>' },
      });
      const doc = new JSDOM(html).window.document;
      const button = doc.querySelector('button.apg-disclosure-trigger');
      expect(button!.getAttribute('aria-expanded')).toBe('true');
    });

    it('トリガーの aria-controls がパネルの id と一致する', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Disclosure, {
        props: { trigger: '詳細を見る' },
        slots: { default: '<p>コンテンツ</p>' },
      });
      const doc = new JSDOM(html).window.document;
      const button = doc.querySelector('button.apg-disclosure-trigger');
      const panelId = button!.getAttribute('aria-controls');
      expect(panelId).not.toBeNull();
      const panel = doc.getElementById(panelId!);
      expect(panel).not.toBeNull();
    });

    it('初期状態でパネルが aria-hidden="true" になっている', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Disclosure, {
        props: { trigger: '詳細を見る' },
        slots: { default: '<p>コンテンツ</p>' },
      });
      const doc = new JSDOM(html).window.document;
      const panel = doc.querySelector('.apg-disclosure-panel');
      expect(panel).not.toBeNull();
      expect(panel!.getAttribute('aria-hidden')).toBe('true');
    });

    it('disabled のときボタンに disabled 属性が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Disclosure, {
        props: { trigger: '詳細を見る', disabled: true },
        slots: { default: '<p>コンテンツ</p>' },
      });
      const doc = new JSDOM(html).window.document;
      const button = doc.querySelector('button.apg-disclosure-trigger');
      expect(button).not.toBeNull();
      expect(button!.hasAttribute('disabled')).toBe(true);
    });
  });
});
