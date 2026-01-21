/**
 * Pattern Accessibility Data Types
 *
 * These types define the structure for accessibility data that is shared between
 * AccessibilityDocs.astro (HTML rendering) and llm.md generation (Markdown).
 */

import type { Locale } from '@/i18n';

// =============================================================================
// Localization Types
// =============================================================================

/**
 * Localized text - contains translations for all supported locales
 * Used for fields that need to be displayed in multiple languages.
 */
export type LocalizedText = {
  [K in Locale]: string;
};

/**
 * Localized field - can be either a plain string or localized text
 * Plain strings are used for technical terms that don't need translation.
 * LocalizedText is used for descriptive text that should be translated.
 */
export type LocalizedField = string | LocalizedText;

/**
 * Pattern translations for all supported locales (for shared headers)
 */
export type PatternTranslations = {
  [K in Locale]: Record<string, string>;
};

/**
 * Type guard to check if a value is LocalizedText
 */
export function isLocalizedText(value: LocalizedField): value is LocalizedText {
  return typeof value === 'object' && value !== null && 'en' in value;
}

// =============================================================================
// Core ARIA Data Types (used by both AccessibilityDocs and llm.md)
// =============================================================================

/**
 * WAI-ARIA Role definition
 */
export interface AriaRole {
  /** Role name (e.g., 'tablist', 'tab', 'button') - technical term, not translated */
  name: string;
  /** Target element (e.g., 'Container', 'Tab button', '<button>') */
  element: LocalizedField;
  /** Description of the role's purpose */
  description: LocalizedField;
  /** Whether this role is required */
  required?: boolean;
}

/**
 * WAI-ARIA Property definition (aria-* attributes)
 */
export interface AriaProperty {
  /** Attribute name (e.g., 'aria-controls', 'aria-labelledby') - technical term, not translated */
  attribute: string;
  /** Target element (e.g., 'tab', 'tabpanel', 'dialog') - can be translated for some patterns */
  element: LocalizedField;
  /** Possible values (e.g., 'ID reference', '"horizontal" | "vertical"') */
  values: LocalizedField;
  /** Whether this property is required - can be boolean or localized for conditional requirements */
  required: boolean | LocalizedField;
  /** Additional notes or description */
  notes?: LocalizedField;
  /** Specification URL */
  specUrl?: string;
}

/**
 * WAI-ARIA State definition
 */
export interface AriaState {
  /** Attribute name (e.g., 'aria-selected', 'aria-pressed') - technical term, not translated */
  attribute: string;
  /** Target element */
  element: LocalizedField;
  /** Possible values (e.g., 'true | false') - can be technical string or localized field */
  values: LocalizedField;
  /** Whether this state is required */
  required: boolean;
  /** Description of when/how the state changes */
  changeTrigger?: LocalizedField;
  /** Reference URL (optional) */
  reference?: string;
}

/**
 * Implicit property (for roles that automatically set certain ARIA attributes)
 */
export interface ImplicitProperty {
  /** Attribute name (e.g., 'aria-live') */
  attribute: string;
  /** Implicit value (e.g., 'assertive') */
  implicitValue: string;
  /** Description of the implicit behavior */
  description: LocalizedField;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** Key or key combination (e.g., 'Tab', 'ArrowRight', 'Shift + Tab') - technical term, not translated */
  key: string | LocalizedField;
  /** Action performed when key is pressed */
  action: LocalizedField;
  /** Section name for grouping keyboard shortcuts (e.g., 'Input Focus', 'Listbox Open') */
  section?: LocalizedField;
}

/**
 * Focus management rule
 */
export interface FocusRule {
  /** Event or condition (e.g., 'Dialog opens', 'Selected tab') */
  event: LocalizedField;
  /** Focus behavior description */
  behavior: LocalizedField;
}

// =============================================================================
// Implementation Notes Types
// =============================================================================

/**
 * Activation mode description for patterns with multiple modes
 */
export interface ActivationMode {
  /** Mode identifier */
  mode: string;
  /** Mode title (e.g., 'Automatic (default)', 'Manual') */
  title: LocalizedField;
  /** Description points for this mode */
  points: LocalizedField[];
}

/**
 * Structure diagram for visual representation
 */
export interface StructureDiagram {
  /** ASCII art or code block showing structure */
  diagram: string;
  /** Caption or description */
  caption?: LocalizedField;
}

/**
 * Comparison option (for patterns with variations like alert vs alertdialog)
 */
export interface ComparisonOption {
  /** Option title */
  title: LocalizedField;
  /** Points describing when to use this option */
  points: LocalizedField[];
}

/**
 * Alert vs AlertDialog comparison (for alert pattern)
 */
export interface AlertVsAlertDialogComparison {
  /** Alert usage */
  alert: ComparisonOption;
  /** AlertDialog usage */
  alertDialog: ComparisonOption;
}

/**
 * Implementation notes for a pattern
 */
export interface PatternImplementationNotes {
  /** Activation modes (for patterns with multiple modes) */
  activationModes?: ActivationMode[];
  /** Structure diagram */
  structure?: StructureDiagram;
  /** Additional implementation tips */
  tips?: LocalizedField[];
  /** Alert vs AlertDialog comparison (for alert pattern) */
  alertVsAlertDialog?: AlertVsAlertDialogComparison;
}

// =============================================================================
// Testing Documentation Types
// =============================================================================

/**
 * Testing strategy section (Unit tests / E2E tests)
 */
export interface TestingStrategy {
  /** Strategy type */
  type: 'unit' | 'e2e';
  /** Strategy title (e.g., 'Unit Tests (Testing Library)') */
  title: LocalizedField;
  /** Description of the strategy */
  description: LocalizedField;
  /** List of test areas covered */
  areas: LocalizedField[];
}

/**
 * Detailed test item with name and description
 */
export interface DetailedTestItem {
  /** Test name/code (e.g., 'ArrowRight/Left', 'role="tablist"') - technical, not translated */
  name: string;
  /** Test description */
  description: LocalizedField;
}

/**
 * Test category with priority and items
 */
export interface TestCategory {
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Category title (e.g., 'APG Keyboard Interaction') */
  title: LocalizedField;
  /** Test type indicator (e.g., 'Unit + E2E', 'E2E') */
  testType: string;
  /** Test items in this category */
  items: DetailedTestItem[];
}

/**
 * Test command for running tests
 */
export interface TestCommand {
  /** Command description/comment */
  comment: LocalizedField;
  /** Actual command to run */
  command: string;
}

/**
 * Testing tool with link
 */
export interface TestingTool {
  /** Tool name */
  name: string;
  /** Tool URL */
  url: string;
  /** Tool description */
  description: LocalizedField;
}

/**
 * Screen reader testing platform info
 */
export interface ScreenReaderPlatform {
  /** Screen reader name (e.g., 'VoiceOver', 'NVDA') */
  name: string;
  /** Platform (e.g., 'macOS / iOS', 'Windows') */
  platform: string;
}

/**
 * Screen reader testing documentation
 */
export interface ScreenReaderTesting {
  /** Description of screen reader testing importance */
  description: LocalizedField;
  /** List of platforms to test */
  platforms: ScreenReaderPlatform[];
  /** Verification note */
  verificationNote?: LocalizedField;
}

/**
 * Complete testing documentation data for a pattern
 */
export interface PatternTestingData {
  /** Testing strategies (unit, e2e) */
  strategies: TestingStrategy[];
  /** Test categories with items */
  categories: TestCategory[];
  /** E2E test file path (relative to project root) */
  e2eTestFile?: string;
  /** Commands for running tests */
  commands: TestCommand[];
  /** Testing tools used */
  tools: TestingTool[];
  /** Link to full testing documentation */
  documentationLink?: string;
  /** Screen reader testing information (for patterns where screen reader testing is important) */
  screenReaderTesting?: ScreenReaderTesting;
}

// =============================================================================
// Extended Types for llm.md Generation
// =============================================================================

/**
 * Test checklist item (simplified version for llm.md)
 */
export interface TestCheckItem {
  /** Test description */
  description: string;
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Test category (e.g., 'aria', 'keyboard', 'focus') */
  category: 'aria' | 'keyboard' | 'focus' | 'click' | 'accessibility' | 'behavior';
}

/**
 * Native HTML consideration (for patterns where native elements are preferred)
 * Extended version with localization support for AccessibilityDocs
 */
export interface NativeHtmlConsideration {
  /** Use case description (can be string for llm.md or LocalizedField for AccessibilityDocs) */
  useCase?: LocalizedField;
  /** Recommended approach (can be string for llm.md or LocalizedField for AccessibilityDocs) */
  recommended?: LocalizedField;
  /** Recommendation text (localized, for AccessibilityDocs) */
  recommendation?: LocalizedField;
  /** Benefits of using native HTML (localized, for AccessibilityDocs) */
  benefits?: LocalizedField;
  /** Code example showing native HTML */
  codeExample?: string;
  /** Cases where custom implementation is needed (localized, for AccessibilityDocs) */
  customUseCases?: LocalizedField;
}

/**
 * Native vs Custom comparison row
 */
export interface NativeVsCustomRow {
  /** Feature name (simple version for llm.md) */
  feature?: string;
  /** Use case description (localized, for AccessibilityDocs) */
  useCase?: LocalizedField;
  /** Native element behavior */
  native: LocalizedField;
  /** Custom implementation behavior */
  custom: LocalizedField;
  /** Whether native is the recommended approach for this use case */
  nativeRecommended?: boolean;
}

// =============================================================================
// Accessible Naming Types
// =============================================================================

/**
 * Naming method for accessible naming documentation
 */
export interface NamingMethod {
  /** Method name (e.g., 'Label element', 'aria-label') */
  method: LocalizedField;
  /** Description of how to use this method */
  description: LocalizedField;
}

/**
 * Accessible naming documentation
 */
export interface AccessibleNamingDoc {
  /** Section title */
  title?: LocalizedField;
  /** Description text */
  description?: LocalizedField;
  /** Naming methods */
  methods?: NamingMethod[];
}

// =============================================================================
// Visual Design Types
// =============================================================================

/**
 * State indicator for visual design documentation
 */
export interface StateIndicator {
  /** State name (e.g., 'Checked', 'Unchecked') */
  state: LocalizedField;
  /** Indicator description (e.g., 'Checkmark icon', 'Empty box') */
  indicator: LocalizedField;
}

/**
 * Visual design documentation with state indicators
 */
export interface VisualDesignDoc {
  /** Section title */
  title?: LocalizedField;
  /** Description text */
  description?: LocalizedField;
  /** State indicators */
  stateIndicators?: StateIndicator[];
}

// =============================================================================
// Keyboard Support Sections
// =============================================================================

/**
 * Keyboard section for patterns with multiple orientations (e.g., tabs)
 */
export interface KeyboardSection {
  /** Section title (e.g., 'Horizontal Orientation') */
  title?: LocalizedField;
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
  overview?: LocalizedField;

  /** Work in progress note (for patterns marked as WIP by WAI) */
  workInProgress?: LocalizedField;

  /** Critical implementation notes (for patterns with important warnings) */
  criticalImplementationNotes?: LocalizedField[];

  // --- Native HTML Considerations (optional) ---

  /** Native HTML recommendations - can be either an array (for llm.md) or a single object (for AccessibilityDocs) */
  nativeHtmlConsiderations?: NativeHtmlConsideration[] | NativeHtmlConsideration;

  /** Native vs Custom comparison table */
  nativeVsCustom?: NativeVsCustomRow[];

  /** Footnote for native HTML section */
  nativeHtmlFootnote?: LocalizedField;

  // --- ARIA Requirements ---

  /** WAI-ARIA roles */
  roles: AriaRole[];

  /** WAI-ARIA properties */
  properties?: AriaProperty[];

  /** WAI-ARIA states */
  states?: AriaState[];

  /** Implicit ARIA properties (attributes automatically set by roles) */
  implicitProperties?: ImplicitProperty[];

  // --- Keyboard & Focus ---

  /** Keyboard shortcuts (simple list) */
  keyboardSupport?: KeyboardShortcut[];

  /** Keyboard sections (for patterns with multiple sections like horizontal/vertical) */
  keyboardSections?: KeyboardSection[];

  /** Focus management rules */
  focusManagement?: FocusRule[];

  // --- Additional Content ---

  /** Additional notes (rendered as bullet list) */
  additionalNotes?: LocalizedField[];

  /** Accessible naming documentation (for patterns that need explicit naming guidance) */
  accessibleNaming?: AccessibleNamingDoc;

  /** Mouse/pointer behavior (rendered as bullet list) */
  mousePointerBehavior?: LocalizedField[];

  /** Visual design notes (rendered as bullet list or structured document) */
  visualDesign?: LocalizedField[] | VisualDesignDoc;

  /** Reference links */
  references?: Array<{
    title: string;
    url: string;
  }>;

  // --- Pattern-specific notes ---

  /** Structure note (for patterns that are structures, not widgets) */
  structureNote?: LocalizedField;

  /** Keyboard documentation note (for patterns with non-standard keyboard navigation) */
  keyboardDocNote?: LocalizedField;

  // --- Testing Documentation ---

  /** Testing documentation data (for TestingDocs) */
  testing?: PatternTestingData;

  // --- Implementation Notes ---

  /** Structured implementation notes (for AccessibilityDocs) */
  implementationNotesData?: PatternImplementationNotes;

  // --- llm.md Specific Data ---

  /** Test checklist items (for llm.md) */
  testChecklist?: TestCheckItem[];

  /** Implementation notes (Markdown content for llm.md) - deprecated, use implementationNotesData */
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
