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
  /** Foreground color for text on brand background */
  colorForeground: string;
}

export const FRAMEWORK_INFO: Record<Framework, FrameworkInfo> = {
  react: {
    label: "React",
    ext: "tsx",
    color: "#087EA4",
    colorLight: "rgba(8, 126, 164, 0.12)",
    colorForeground: "#087EA4",
  },
  vue: {
    label: "Vue",
    ext: "vue",
    color: "#42B883",
    colorLight: "rgba(66, 184, 131, 0.12)",
    colorForeground: "#3AA876",
  },
  svelte: {
    label: "Svelte",
    ext: "svelte",
    color: "#FF3E00",
    colorLight: "rgba(255, 62, 0, 0.12)",
    colorForeground: "#E63600",
  },
  astro: {
    label: "Astro",
    ext: "astro",
    color: "#7C3AED",
    colorLight: "rgba(124, 58, 237, 0.12)",
    colorForeground: "#7C3AED",
  },
};

/**
 * Type guard to check if a value is a valid framework
 */
export function isValidFramework(value: unknown): value is Framework {
  return typeof value === "string" && FRAMEWORKS.includes(value as Framework);
}
