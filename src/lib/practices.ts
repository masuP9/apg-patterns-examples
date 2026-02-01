/**
 * Practice definitions for APG Practices
 *
 * This module provides a single source of truth for all APG practices.
 * Based on WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/practices/
 */

/**
 * Practice definition
 */
export interface Practice {
  id: string;
  name: string;
  description: string;
  icon: string;
  apgUrl: string;
  relatedPatterns: string[];
}

/**
 * All practices
 * Based on WAI-ARIA APG Practices: https://www.w3.org/WAI/ARIA/apg/practices/
 */
export const PRACTICES: Practice[] = [
  {
    id: 'landmark-regions',
    name: 'Landmark Regions',
    description:
      'ARIA landmark roles provide a powerful way to identify the organization and structure of a web page.',
    icon: '🗺️',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
    relatedPatterns: ['landmarks'],
  },
  {
    id: 'names-and-descriptions',
    name: 'Providing Accessible Names and Descriptions',
    description:
      'Providing elements with accessible names, and where appropriate, accessible descriptions is one of the most important responsibilities authors have.',
    icon: '🏷️',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/',
    relatedPatterns: ['button', 'link', 'dialog', 'alert-dialog'],
  },
  {
    id: 'keyboard-interface',
    name: 'Developing a Keyboard Interface',
    description:
      'Unlike native HTML form elements, browsers do not provide keyboard support for custom widgets. Authors must provide keyboard access.',
    icon: '⌨️',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/',
    relatedPatterns: ['tabs', 'menu-button', 'combobox', 'listbox', 'grid'],
  },
  {
    id: 'grid-and-table-properties',
    name: 'Grid and Table Properties',
    description:
      'To fully convey the structure and relationships in a grid or table, authors need to ensure ARIA row and column properties are correctly set.',
    icon: '📊',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/',
    relatedPatterns: ['grid', 'table', 'data-grid', 'treegrid'],
  },
  {
    id: 'range-related-properties',
    name: 'Communicating Value and Limits for Range Widgets',
    description:
      'ARIA defines roles for four types of range widgets: scrollbar, slider, spinbutton, and meter.',
    icon: '📏',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/',
    relatedPatterns: ['slider', 'slider-multithumb', 'spinbutton', 'meter'],
  },
  {
    id: 'structural-roles',
    name: 'Structural Roles',
    description:
      'The structural roles are used to describe the structure of a page and are typically used for document content.',
    icon: '🏗️',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/',
    relatedPatterns: ['accordion', 'disclosure', 'tabs'],
  },
  {
    id: 'hiding-semantics',
    name: 'Hiding Semantics with the presentation Role',
    description:
      'The presentation role removes implicit ARIA semantics from the accessibility tree while keeping content visible.',
    icon: '🙈',
    apgUrl: 'https://www.w3.org/WAI/ARIA/apg/practices/hiding-semantics/',
    relatedPatterns: ['tabs', 'toolbar'],
  },
];

/**
 * Get all practices
 */
export function getPractices(): Practice[] {
  return PRACTICES;
}

/**
 * Get practice by ID
 */
export function getPracticeById(id: string): Practice | undefined {
  return PRACTICES.find((p) => p.id === id);
}

/**
 * Get all practice IDs
 */
export function getPracticeIds(): string[] {
  return PRACTICES.map((p) => p.id);
}
