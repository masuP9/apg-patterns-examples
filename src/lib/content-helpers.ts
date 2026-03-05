import { getEntry, render } from 'astro:content';
import type { Locale } from '@/i18n';

export async function getAccessibilityContent(pattern: string, locale: Locale) {
  const entry = await getEntry('accessibility-docs', `${pattern}/${locale}`);
  if (!entry) {
    throw new Error(`Accessibility docs not found: ${pattern}/${locale}`);
  }
  return render(entry);
}
