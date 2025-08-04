import { createRouter, createWebHistory } from 'vue-router';
import ToggleButtonDemo from './demos/ToggleButtonDemo.vue';
import TabsDemo from './demos/TabsDemo.vue';
import { getDemoUrl, type DemoPath } from '../../../src/types/demo';

// 共通型定義を使用
export type DemoRoute = DemoPath;

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: getDemoUrl('toggle-button'),
    },
    {
      path: getDemoUrl('toggle-button'),
      name: 'toggle-button',
      component: ToggleButtonDemo,
    },
    {
      path: getDemoUrl('tabs'),
      name: 'tabs', 
      component: TabsDemo,
    },
    {
      path: getDemoUrl('accordion'),
      name: 'accordion',
      component: () => Promise.resolve({
        template: '<div>Accordion Demo - Coming Soon</div>'
      }),
    },
    // 404 fallback
    {
      path: '/:pathMatch(.*)*',
      redirect: getDemoUrl('toggle-button'),
    },
  ],
});