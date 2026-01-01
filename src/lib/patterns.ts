/**
 * Pattern definitions for APG Patterns Examples
 *
 * This module provides a single source of truth for all patterns.
 * Add new patterns here to make them available throughout the application.
 */

/**
 * Pattern status
 */
export type PatternStatus = "available" | "planned";

/**
 * Pattern definition
 */
export interface Pattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  complexity: "Low" | "Medium" | "High";
  status: PatternStatus;
}

/**
 * All patterns (available and planned)
 */
export const PATTERNS: Pattern[] = [
  {
    id: "button",
    name: "Toggle Button",
    description:
      'A two-state button that can be either "pressed" or "not pressed".',
    icon: "🔘",
    complexity: "Low",
    status: "available",
  },
  {
    id: "tabs",
    name: "Tabs",
    description:
      "A set of layered sections of content, known as tab panels, that display one panel at a time.",
    icon: "📑",
    complexity: "Medium",
    status: "available",
  },
  {
    id: "accordion",
    name: "Accordion",
    description:
      "A vertically stacked set of interactive headings that each reveal a section of content.",
    icon: "📋",
    complexity: "Medium",
    status: "available",
  },
  {
    id: "dialog",
    name: "Dialog (Modal)",
    description:
      "A window overlaid on the primary window, rendering the content underneath inert.",
    icon: "💬",
    complexity: "High",
    status: "available",
  },
  {
    id: "toolbar",
    name: "Toolbar",
    description:
      "A container for grouping a set of controls, such as buttons, toggle buttons, or other input elements.",
    icon: "🔧",
    complexity: "Medium",
    status: "available",
  },
  {
    id: "switch",
    name: "Switch",
    description:
      "A control that allows users to toggle between two states: on and off.",
    icon: "🎚️",
    complexity: "Low",
    status: "available",
  },
  {
    id: "menu-button",
    name: "Menu Button",
    description: "A button that opens a menu of actions or options.",
    icon: "☰",
    complexity: "High",
    status: "planned",
  },
  {
    id: "disclosure",
    name: "Disclosure",
    description:
      "A button that controls the visibility of a section of content.",
    icon: "▼",
    complexity: "Low",
    status: "planned",
  },
];

/**
 * Get available patterns only
 */
export function getAvailablePatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.status === "available");
}

/**
 * Get planned patterns only
 */
export function getPlannedPatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.status === "planned");
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
