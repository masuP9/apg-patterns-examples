import ToggleButtonDemo from './demos/ToggleButtonDemo.svelte';
import TabsDemo from './demos/TabsDemo.svelte';
import { getDemoUrl, type DemoPath } from '../../../src/types/demo';

// 共通型定義を使用
export type DemoRoute = DemoPath;

export const routes = {
  '/': ToggleButtonDemo, // デフォルト
  [getDemoUrl('toggle-button')]: ToggleButtonDemo,
  [getDemoUrl('tabs')]: TabsDemo,
  [getDemoUrl('accordion')]: () => Promise.resolve({
    default: { template: '<div>Accordion Demo - Coming Soon</div>' }
  }),
};