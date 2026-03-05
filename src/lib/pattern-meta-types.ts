/**
 * Type definitions for pattern metadata (meta.ts)
 *
 * Each pattern's meta.ts exports a PatternMeta object containing
 * all framework-specific data needed to render the pattern page.
 * This is the single source of truth for page content that differs
 * between frameworks or locales.
 */

import type { Framework } from './frameworks';
import type { Locale } from '@/i18n/ui';

export interface TocItem {
  id: string;
  text: string;
}

export interface ApiProp {
  name: string;
  type: string;
  default: string;
  description: Record<Locale, string>;
}

export interface ApiEvent {
  name: string;
  detail: string;
  description: Record<Locale, string>;
}

export interface ApiSlot {
  name: string;
  default: string;
  description: Record<Locale, string>;
}

export interface ResourceLink {
  href: string;
  label: Record<Locale, string>;
}

export interface ApiSubComponent {
  /** Sub-component name (e.g., 'ToolbarButton') */
  name: string;
  /** Props for this sub-component */
  props: ApiProp[];
}

export interface FrameworkMeta {
  /** Source code file name relative to pattern dir (e.g., 'Button.tsx') */
  sourceFile: string;
  /** Test code file name relative to pattern dir (e.g., 'Button.test.tsx'). Omit if no test file exists. */
  testFile?: string;
  /** Shiki language for code highlighting */
  lang: 'tsx' | 'vue' | 'svelte' | 'astro' | 'typescript' | 'javascript' | 'html' | 'css';
  /** Usage code example string */
  usageCode: string;
  /** API props table data */
  apiProps: ApiProp[];
  /** API note text shown below the table */
  apiNote?: Record<Locale, string>;
  /** Slot definitions for Vue/Svelte/Astro components */
  apiSlots?: ApiSlot[];
  /** Additional API event sections (e.g., Custom Events for Astro Web Components) */
  apiEvents?: ApiEvent[];
  /** Sub-component API tables (e.g., ToolbarButton, ToolbarToggleButton) */
  apiSubComponents?: ApiSubComponent[];
}

export interface PatternMeta {
  /** Pattern display name per locale */
  title: Record<Locale, string>;
  /** Pattern description per locale */
  description: Record<Locale, string>;
  /** Table of contents items per locale */
  tocItems: Record<Locale, TocItem[]>;
  /** Whether this pattern has a NativeHtmlNotice component */
  hasNativeHtmlNotice?: boolean;
  /** Whether this pattern has a ComparisonSection component */
  hasComparisonSection?: boolean;
  /** External resource links */
  resources: ResourceLink[];
  /** Framework-specific metadata */
  frameworks: Record<Framework, FrameworkMeta>;
}
