/**
 * Pattern definitions for APG Patterns Examples
 *
 * This module provides a single source of truth for all patterns.
 * Add new patterns here to make them available throughout the application.
 */

/**
 * Pattern status
 */
export type PatternStatus = 'available' | 'planned';

/**
 * Pattern definition
 */
export interface Pattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  complexity: 'Low' | 'Medium' | 'High';
  status: PatternStatus;
}

/**
 * All patterns (available and planned)
 * Based on WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/patterns/
 */
export const PATTERNS: Pattern[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    description:
      'A vertically stacked set of interactive headings that each reveal a section of content.',
    icon: '🪗',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'alert',
    name: 'Alert',
    description:
      "An element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.",
    icon: '⚠️',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    description:
      "A modal dialog that interrupts the user's workflow to communicate an important message and acquire a response.",
    icon: '🚨',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'A list of links to the parent pages of the current page in hierarchical order.',
    icon: '🔗',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'button',
    name: 'Button',
    description:
      'A widget that enables users to trigger an action or event, such as submitting a form or toggling a state.',
    icon: '🔘',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'carousel',
    name: 'Carousel',
    description:
      'Presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides.',
    icon: '🎠',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description:
      'Supports dual-state (checked/unchecked) and tri-state (checked/unchecked/partially checked) checkboxes.',
    icon: '☑️',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'combobox',
    name: 'Combobox',
    description:
      'An input widget with an associated popup that enables users to select a value from a collection.',
    icon: '🔽',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'dialog',
    name: 'Dialog (Modal)',
    description: 'A window overlaid on the primary window, rendering the content underneath inert.',
    icon: '💬',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'disclosure',
    name: 'Disclosure',
    description: 'A button that controls the visibility of a section of content.',
    icon: '▼',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'feed',
    name: 'Feed',
    description:
      'A section of a page that automatically loads new sections of content as the user scrolls.',
    icon: '📰',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'grid',
    name: 'Grid',
    description:
      'A container that enables users to navigate the information or interactive elements using directional navigation keys.',
    icon: '📊',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'landmarks',
    name: 'Landmarks',
    description: 'A set of eight roles that identify the major sections of a page.',
    icon: '🗺️',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'link',
    name: 'Link',
    description: 'A widget that provides an interactive reference to a resource.',
    icon: '↗️',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'listbox',
    name: 'Listbox',
    description:
      'A widget that allows the user to select one or more items from a list of choices.',
    icon: '📝',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'menubar',
    name: 'Menubar',
    description:
      'A horizontal menu bar with dropdown menus, submenus, checkbox items, and radio groups for application-style navigation.',
    icon: '🖥️',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'menu-button',
    name: 'Menu Button',
    description: 'A button that opens a menu of actions or options.',
    icon: '☰',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'meter',
    name: 'Meter',
    description: 'A graphical display of a numeric value that varies within a defined range.',
    icon: '📶',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    description:
      'A set of checkable buttons, known as radio buttons, where only one can be checked at a time.',
    icon: '🔘',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'slider',
    name: 'Slider',
    description: 'An input where the user selects a value from within a given range.',
    icon: '🎚️',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'spinbutton',
    name: 'Spinbutton',
    description:
      'An input widget for selecting from a range of discrete values, typically with increment/decrement buttons.',
    icon: '🔢',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'switch',
    name: 'Switch',
    description:
      'A type of checkbox that represents on/off values, as opposed to checked/unchecked.',
    icon: '🌓',
    complexity: 'Low',
    status: 'available',
  },
  {
    id: 'table',
    name: 'Table',
    description:
      'A static tabular structure containing one or more rows that each contain one or more cells.',
    icon: '🧮',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description:
      'A set of layered sections of content, known as tab panels, that display one panel at a time.',
    icon: '🗂️',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'toolbar',
    name: 'Toolbar',
    description:
      'A container for grouping a set of controls, such as buttons, toggle buttons, or checkboxes.',
    icon: '🔧',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    icon: '💡',
    complexity: 'Medium',
    status: 'available',
  },
  {
    id: 'tree-view',
    name: 'Tree View',
    description:
      'A widget that presents a hierarchical list with nested groups that can be collapsed and expanded.',
    icon: '🌲',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'treegrid',
    name: 'Treegrid',
    description:
      'A widget that presents a hierarchical data grid consisting of tabular information that is editable or interactive.',
    icon: '📊',
    complexity: 'High',
    status: 'available',
  },
  {
    id: 'data-grid',
    name: 'Data Grid',
    description:
      'An advanced grid for displaying and manipulating tabular data with sorting, filtering, and row selection.',
    icon: '📋',
    complexity: 'High',
    status: 'planned',
  },
  {
    id: 'editable-grid',
    name: 'Editable Grid',
    description:
      'A spreadsheet-like grid with inline cell editing, dropdowns, and validation support.',
    icon: '✏️',
    complexity: 'High',
    status: 'planned',
  },
  {
    id: 'window-splitter',
    name: 'Window Splitter',
    description:
      'A moveable separator between two sections, or panes, that enables users to change the relative size of the panes.',
    icon: '↔️',
    complexity: 'Medium',
    status: 'available',
  },
];

/**
 * Get available patterns only
 */
export function getAvailablePatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.status === 'available');
}

/**
 * Get planned patterns only
 */
export function getPlannedPatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.status === 'planned');
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
