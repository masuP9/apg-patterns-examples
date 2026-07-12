/**
 * Alert Astro Component Tests using Container API
 *
 * Verifies the Alert.astro component's initial HTML structure and attributes.
 * Interaction cases (dismiss click, focus) are covered by Vue/Svelte unit tests
 * and E2E; Container API only renders initial HTML.
 *
 * Ported structural subset of Alert.test.tsx. Interaction-only React cases
 * (focus management, onDismiss click, rerender id stability) are omitted here.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Alert from './Alert.astro';

describe('Alert (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderAlert(
    props: {
      message?: string;
      variant?: 'info' | 'success' | 'warning' | 'error';
      id?: string;
      dismissible?: boolean;
      class?: string;
    } = {}
  ): Promise<Document> {
    const html = await container.renderToString(Alert, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  // High Priority: APG Core Compliance
  describe('APG: ARIA Attributes', () => {
    it('has role="alert"', async () => {
      const doc = await renderAlert({ message: 'Test message' });
      expect(doc.querySelector('[role="alert"]')).not.toBeNull();
    });

    it('role=alert container exists in DOM even without message', async () => {
      const doc = await renderAlert();
      expect(doc.querySelector('[role="alert"]')).not.toBeNull();
    });
  });

  describe('APG: Focus Management', () => {
    it('alert itself does not receive focus (no tabindex)', async () => {
      const doc = await renderAlert({ message: 'Test message' });
      const alert = doc.querySelector('[role="alert"]');
      expect(alert?.hasAttribute('tabindex')).toBe(false);
    });
  });

  describe('Dismiss Feature', () => {
    it('shows dismiss button when dismissible=true', async () => {
      const doc = await renderAlert({ message: 'Test message', dismissible: true });
      expect(doc.querySelector('.apg-alert-dismiss')).not.toBeNull();
    });

    it('does not show dismiss button when dismissible=false (default)', async () => {
      const doc = await renderAlert({ message: 'Test message' });
      expect(doc.querySelector('.apg-alert-dismiss')).toBeNull();
    });

    it('dismiss button has type=button', async () => {
      const doc = await renderAlert({ message: 'Test message', dismissible: true });
      const button = doc.querySelector('.apg-alert-dismiss');
      expect(button?.getAttribute('type')).toBe('button');
    });

    it('dismiss button has aria-label', async () => {
      const doc = await renderAlert({ message: 'Test message', dismissible: true });
      const button = doc.querySelector('.apg-alert-dismiss');
      expect(button?.getAttribute('aria-label')).toBe('Dismiss alert');
    });
  });

  describe('Variant Styles', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'applies appropriate style class for variant=%s',
      async (variant) => {
        const doc = await renderAlert({ message: 'Test message', variant });
        const wrapper = doc.querySelector('apg-alert');
        expect(wrapper?.classList.contains('apg-alert')).toBe(true);
      }
    );

    it('default variant is info', async () => {
      const doc = await renderAlert({ message: 'Test message' });
      const wrapper = doc.querySelector('apg-alert');
      expect(wrapper?.classList.contains('bg-blue-50')).toBe(true);
    });
  });

  describe('Props', () => {
    it('can set custom ID with id prop', async () => {
      const doc = await renderAlert({ message: 'Test message', id: 'custom-alert-id' });
      const alert = doc.querySelector('[role="alert"]');
      expect(alert?.getAttribute('id')).toBe('custom-alert-id');
    });

    it('merges className correctly', async () => {
      const doc = await renderAlert({ message: 'Test message', class: 'custom-class' });
      const wrapper = doc.querySelector('apg-alert');
      expect(wrapper?.classList.contains('apg-alert')).toBe(true);
      expect(wrapper?.classList.contains('custom-class')).toBe(true);
    });
  });
});
