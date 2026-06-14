import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import Listbox from './Listbox.astro';

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

describe('Listbox (Astro)', () => {
  // 🔴 High Priority: APG 準拠の核心 (初期レンダリングのみ)
  describe('APG: ARIA 属性 (初期レンダリング)', () => {
    it('role="listbox" を持つ ul 要素をレンダリングする', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox).not.toBeNull();
    });

    it('aria-orientation="vertical" がデフォルト', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox!.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('aria-orientation="horizontal" を指定できる', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, orientation: 'horizontal', 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox!.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('各オプションが role="option" を持つ', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const opts = doc.querySelectorAll('[role="option"]');
      expect(opts).toHaveLength(3);
    });

    it('シングルセレクトでは aria-multiselectable が付かない', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox!.hasAttribute('aria-multiselectable')).toBe(false);
    });

    it('multiselectable=true で aria-multiselectable="true" が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, multiselectable: true, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox!.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('aria-label が listbox に付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox!.getAttribute('aria-label')).toBe('フルーツ');
    });

    it('disabled オプションに aria-disabled="true" が付く', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options: optionsWithDisabled, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const opts = doc.querySelectorAll('[role="option"]');
      const banana = Array.from(opts).find((o) => o.textContent?.includes('Banana'));
      expect(banana).not.toBeNull();
      expect(banana!.getAttribute('aria-disabled')).toBe('true');
    });

    it('シングルセレクトで最初の利用可能オプションが初期選択される', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const opts = doc.querySelectorAll('[role="option"]');
      const apple = Array.from(opts).find((o) => o.textContent?.includes('Apple'));
      expect(apple!.getAttribute('aria-selected')).toBe('true');
    });

    it('初期状態でちょうど 1 つのオプションが tabindex="0" を持つ', async () => {
      const container = await AstroContainer.create();
      const html = await container.renderToString(Listbox, {
        props: { options, 'aria-label': 'フルーツ' },
      });
      const doc = new JSDOM(html).window.document;
      const opts = doc.querySelectorAll('[role="option"]');
      const tabbable = Array.from(opts).filter((o) => o.getAttribute('tabindex') === '0');
      expect(tabbable).toHaveLength(1);
    });
  });
});
