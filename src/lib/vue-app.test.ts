import { createApp, defineComponent, h, useId } from 'vue';
import { describe, expect, it } from 'vitest';
import setupVueApp from './vue-app';

// Mounts a one-component Vue app and returns the id useId() produced in it.
const mountAndGetId = (configure: (app: ReturnType<typeof createApp>) => void) => {
  let id: string | undefined;
  const app = createApp(
    defineComponent({
      setup() {
        id = useId();
        return () => h('div');
      },
    })
  );
  configure(app);
  app.mount(document.createElement('div'));
  app.unmount();
  return id;
};

describe('Vue appEntrypoint (setupVueApp)', () => {
  it('idPrefix のない2つのアプリ（client:only の island）では useId() が別々の値になる', () => {
    const first = mountAndGetId((app) => setupVueApp(app));
    const second = mountAndGetId((app) => setupVueApp(app));

    expect(first).not.toBe(second);
  });

  it('SSR から引き継いだ idPrefix "s1" があるアプリでは、その prefix のまま useId() が "s1-0" を返す', () => {
    const id = mountAndGetId((app) => {
      app.config.idPrefix = 's1';
      setupVueApp(app);
    });

    expect(id).toBe('s1-0');
  });
});
