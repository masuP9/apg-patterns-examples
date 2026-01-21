/**
 * Pattern Accessibility Data Types
 *
 * These types define the structure for accessibility data that is shared between
 * AccessibilityDocs.astro (HTML rendering) and llm.md generation (Markdown).
 */

// =============================================================================
// Core ARIA Data Types (used by both AccessibilityDocs and llm.md)
// =============================================================================

/**
 * WAI-ARIA Role definition
 */
export interface AriaRole {
  /** Role name (e.g., 'tablist', 'tab', 'button') */
  name: string;
  /** Target element (e.g., 'Container', 'Tab button', '<button>') */
  element: string;
  /** Description of the role's purpose */
  description: string;
  /** Whether this role is required */
  required?: boolean;
}

/**
 * WAI-ARIA Property definition (aria-* attributes)
 */
export interface AriaProperty {
  /** Attribute name (e.g., 'aria-controls', 'aria-labelledby') */
  attribute: string;
  /** Target element (e.g., 'tab', 'tabpanel', 'dialog') */
  element: string;
  /** Possible values (e.g., 'ID reference', '"horizontal" | "vertical"') */
  values: string;
  /** Whether this property is required */
  required: boolean;
  /** Additional notes or description */
  notes?: string;
}

/**
 * WAI-ARIA State definition
 */
export interface AriaState {
  /** Attribute name (e.g., 'aria-selected', 'aria-pressed') */
  attribute: string;
  /** Target element */
  element: string;
  /** Possible values (e.g., 'true | false') */
  values: string;
  /** Whether this state is required */
  required: boolean;
  /** Description of when/how the state changes */
  changeTrigger?: string;
  /** Reference URL (optional) */
  reference?: string;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** Key or key combination (e.g., 'Tab', 'ArrowRight', 'Shift + Tab') */
  key: string;
  /** Action performed when key is pressed */
  action: string;
}

/**
 * Focus management rule
 */
export interface FocusRule {
  /** Event or condition (e.g., 'Dialog opens', 'Selected tab') */
  event: string;
  /** Focus behavior description */
  behavior: string;
}

// =============================================================================
// Extended Types for llm.md Generation
// =============================================================================

/**
 * Test checklist item
 */
export interface TestCheckItem {
  /** Test description */
  description: string;
  /** Priority level */
  priority: 'high' | 'medium';
  /** Test category (e.g., 'aria', 'keyboard', 'focus') */
  category: 'aria' | 'keyboard' | 'focus' | 'click' | 'accessibility';
}

/**
 * Native HTML consideration (for patterns where native elements are preferred)
 */
export interface NativeHtmlConsideration {
  /** Use case description */
  useCase: string;
  /** Recommended approach */
  recommended: string;
}

/**
 * Native vs Custom comparison row
 */
export interface NativeVsCustomRow {
  /** Feature name */
  feature: string;
  /** Native element behavior */
  native: string;
  /** Custom implementation behavior */
  custom: string;
}

// =============================================================================
// Keyboard Support Sections
// =============================================================================

/**
 * Keyboard section for patterns with multiple orientations (e.g., tabs)
 */
export interface KeyboardSection {
  /** Section title (e.g., 'Horizontal Orientation') */
  title?: string;
  /** Keyboard shortcuts in this section */
  shortcuts: KeyboardShortcut[];
}

// =============================================================================
// Main Pattern Data Interface
// =============================================================================

/**
 * Complete accessibility data for a pattern
 */
export interface PatternAccessibilityData {
  /** Pattern identifier (e.g., 'tabs', 'button', 'dialog') */
  pattern: string;

  /** APG reference URL */
  apgUrl: string;

  /** Brief overview of the pattern (for llm.md) */
  overview?: string;

  // --- Native HTML Considerations (optional) ---

  /** Native HTML recommendations */
  nativeHtmlConsiderations?: NativeHtmlConsideration[];

  /** Native vs Custom comparison table */
  nativeVsCustom?: NativeVsCustomRow[];

  // --- ARIA Requirements ---

  /** WAI-ARIA roles */
  roles: AriaRole[];

  /** WAI-ARIA properties */
  properties?: AriaProperty[];

  /** WAI-ARIA states */
  states?: AriaState[];

  // --- Keyboard & Focus ---

  /** Keyboard shortcuts (simple list) */
  keyboardSupport?: KeyboardShortcut[];

  /** Keyboard sections (for patterns with multiple sections like horizontal/vertical) */
  keyboardSections?: KeyboardSection[];

  /** Focus management rules */
  focusManagement?: FocusRule[];

  // --- Additional Content ---

  /** Additional notes (rendered as bullet list) */
  additionalNotes?: string[];

  /** Reference links */
  references?: Array<{
    title: string;
    url: string;
  }>;

  // --- llm.md Specific Data ---

  /** Test checklist items (for llm.md) */
  testChecklist?: TestCheckItem[];

  /** Implementation notes (Markdown content for llm.md) */
  implementationNotes?: string;

  /** Example test code - React + Testing Library (for llm.md) */
  exampleTestCodeReact?: string;

  /** Example test code - Playwright E2E (for llm.md) */
  exampleTestCodeE2E?: string;
}

// =============================================================================
// Helper Type Guards
// =============================================================================

export function hasKeyboardSections(
  data: PatternAccessibilityData
): data is PatternAccessibilityData & { keyboardSections: KeyboardSection[] } {
  return Array.isArray(data.keyboardSections) && data.keyboardSections.length > 0;
}

export function hasSimpleKeyboardSupport(
  data: PatternAccessibilityData
): data is PatternAccessibilityData & { keyboardSupport: KeyboardShortcut[] } {
  return Array.isArray(data.keyboardSupport) && data.keyboardSupport.length > 0;
}

// =============================================================================
// Pattern Registry Type
// =============================================================================

/**
 * Registry of all pattern accessibility data
 */
export type PatternRegistry = Record<string, PatternAccessibilityData>;
