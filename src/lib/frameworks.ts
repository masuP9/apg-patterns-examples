/**
 * Framework definitions for APG Patterns Examples
 *
 * This module provides a single source of truth for all supported frameworks.
 * Add new frameworks here to make them available throughout the application.
 */

/**
 * Supported frameworks
 */
export const FRAMEWORKS = ["react", "vue", "svelte", "astro"] as const;

/**
 * Framework identifier type
 */
export type Framework = (typeof FRAMEWORKS)[number];

/**
 * Default framework for redirects and initial selection
 */
export const DEFAULT_FRAMEWORK: Framework = "react";

/**
 * Framework metadata for UI display and code highlighting
 */
export const FRAMEWORK_INFO: Record<
  Framework,
  { label: string; ext: string }
> = {
  react: { label: "React", ext: "tsx" },
  vue: { label: "Vue", ext: "vue" },
  svelte: { label: "Svelte", ext: "svelte" },
  astro: { label: "Astro", ext: "astro" },
};

/**
 * Type guard to check if a value is a valid framework
 */
export function isValidFramework(value: unknown): value is Framework {
  return typeof value === "string" && FRAMEWORKS.includes(value as Framework);
}
