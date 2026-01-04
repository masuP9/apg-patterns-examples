/**
 * Framework definitions for APG Patterns Examples
 *
 * This module provides a single source of truth for all supported frameworks.
 * Add new frameworks here to make them available throughout the application.
 */

/**
 * Supported frameworks
 */
export const FRAMEWORKS = ['react', 'vue', 'svelte', 'astro'] as const;

/**
 * Framework identifier type
 */
export type Framework = (typeof FRAMEWORKS)[number];

/**
 * Default framework for redirects and initial selection
 */
export const DEFAULT_FRAMEWORK: Framework = 'react';

/**
 * Framework metadata for UI display, code highlighting, and branding
 */
export interface FrameworkInfo {
  /** Display name */
  label: string;
  /** File extension for code examples */
  ext: string;
  /** Brand color (hex) */
  color: string;
  /** Light variant for backgrounds (hex with alpha) */
  colorLight: string;
  /** Foreground color for text on brand background (light mode) */
  colorForeground: string;
  /** Foreground color for text on brand background (dark mode) */
  colorForegroundDark: string;
}

export const FRAMEWORK_INFO: Record<Framework, FrameworkInfo> = {
  react: {
    label: 'React',
    ext: 'tsx',
    color: '#61DAFB',
    colorLight: 'rgba(97, 218, 251, 0.12)',
    colorForeground: '#087EA4',
    colorForegroundDark: '#7DD3FC',
  },
  vue: {
    label: 'Vue',
    ext: 'vue',
    color: '#42B883',
    colorLight: 'rgba(66, 184, 131, 0.12)',
    colorForeground: '#34855B',
    colorForegroundDark: '#6EE7B7',
  },
  svelte: {
    label: 'Svelte',
    ext: 'svelte',
    color: '#FF3E00',
    colorLight: 'rgba(255, 62, 0, 0.12)',
    colorForeground: '#D83300',
    colorForegroundDark: '#FB923C',
  },
  astro: {
    label: 'Astro',
    ext: 'astro',
    color: '#BC52EE',
    colorLight: 'rgba(188, 82, 238, 0.12)',
    colorForeground: '#9333EA',
    colorForegroundDark: '#C084FC',
  },
};

/**
 * Type guard to check if a value is a valid framework
 */
export function isValidFramework(value: unknown): value is Framework {
  return typeof value === 'string' && FRAMEWORKS.includes(value as Framework);
}
