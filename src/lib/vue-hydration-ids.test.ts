import { createSSRApp, h, nextTick, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Accordion from '@patterns/accordion/Accordion.vue';
import Carousel from '@patterns/carousel/Carousel.vue';
import Feed from '@patterns/feed/Feed.vue';
import Listbox from '@patterns/listbox/Listbox.vue';
import ListboxDemo from '@patterns/listbox/ListboxDemo.vue';
import RadioGroup from '@patterns/radio/RadioGroup.vue';
import Spinbutton from '@patterns/spinbutton/Spinbutton.vue';
import Tabs from '@patterns/tabs/Tabs.vue';
import Tooltip from '@patterns/tooltip/Tooltip.vue';
import TreeView from '@patterns/treeview/TreeView.vue';

// Reproduces what @astrojs/vue does for a client:load island: render the component
// to HTML on the server, then hydrate that HTML in the browser with the same idPrefix.
const ID_ATTRIBUTES = ['id', 'aria-labelledby', 'aria-describedby', 'aria-controls'];

const collectIdAttributes = (root: Element) =>
  [...root.querySelectorAll('*')].flatMap((el) =>
    ID_ATTRIBUTES.filter((name) => el.hasAttribute(name)).map(
      (name) => `${el.tagName.toLowerCase()}[${name}=${el.getAttribute(name)}]`
    )
  );

const createIsland = (component: Component, props: Record<string, unknown>) => {
  const app = createSSRApp({ render: () => h(component, props) });
  app.config.idPrefix = 's0';
  return app;
};

const renderThenHydrate = async (component: Component, props: Record<string, unknown>) => {
  const html = await renderToString(createIsland(component, props));
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);
  const serverIds = collectIdAttributes(container);

  createIsland(component, props).mount(container);
  await nextTick();

  return { serverIds, hydratedIds: collectIdAttributes(container) };
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// Dialog and AlertDialog are left out: they render into <Teleport to="body">, which is
// not part of the island's server HTML, so they are only used as client:only islands.
describe('Vue components keep server-rendered ids when hydrated (client:load islands)', () => {
  it.each([
    ['Accordion', Accordion, { items: [{ id: 'a', header: 'A', content: 'a' }] }],
    ['Carousel', Carousel, { slides: [{ id: 'a', content: 'a' }], ariaLabel: 'Featured' }],
    ['Feed', Feed, { articles: [{ id: 'a', title: 'A', description: 'a', content: 'a' }] }],
    ['Listbox', Listbox, { options: [{ id: 'a', label: 'A' }], ariaLabel: 'Fruits' }],
    ['ListboxDemo', ListboxDemo, { options: [{ id: 'a', label: 'A' }], label: 'Fruits' }],
    [
      'RadioGroup',
      RadioGroup,
      { options: [{ id: 'a', label: 'A', value: 'a' }], name: 'color', ariaLabel: 'Color' },
    ],
    ['Spinbutton', Spinbutton, { label: 'Quantity' }],
    ['Tabs', Tabs, { tabs: [{ id: 'a', label: 'A', content: 'a' }] }],
    ['Tooltip', Tooltip, { content: 'Save', defaultOpen: true }],
    ['TreeView', TreeView, { nodes: [{ id: 'a', label: 'A' }], ariaLabel: 'Files' }],
  ] as const)(
    '%s をサーバー描画して hydrate すると、hydration mismatch の警告が出ず id 属性も変わらない',
    async (_name, component, props) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { serverIds, hydratedIds } = await renderThenHydrate(component, props);

      const hydrationMessages = [...warn.mock.calls, ...error.mock.calls]
        .map((args) => String(args[0]))
        .filter((message) => message.includes('Hydration'));
      expect(hydrationMessages).toEqual([]);
      expect(serverIds.length).toBeGreaterThan(0);
      expect(hydratedIds).toEqual(serverIds);
    }
  );
});
