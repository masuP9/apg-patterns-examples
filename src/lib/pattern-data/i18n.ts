/**
 * Pattern Data i18n Utilities
 *
 * Provides localization support for pattern accessibility data.
 * - Technical terms (role names, ARIA attributes) remain in English
 * - Descriptive text uses LocalizedText objects with { en, ja } properties
 */

import type { Locale } from '@/i18n';
import type { LocalizedField, LocalizedText, PatternTranslations } from './types';
import { isLocalizedText } from './types';

/**
 * Get localized text from a LocalizedField value
 *
 * If the value is a string, it's returned as-is (for technical terms).
 * If the value is a LocalizedText object, the locale-specific text is returned,
 * with fallback to English.
 */
export function getLocalizedText(value: LocalizedField, locale: Locale): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[locale] ?? value.en;
}

/**
 * Create a localization function bound to a specific locale
 *
 * Usage:
 * ```typescript
 * const t = localize('ja');
 * const text = t(role.description); // Returns Japanese text
 * ```
 */
export function localize(locale: Locale) {
  return (value: LocalizedField): string => getLocalizedText(value, locale);
}

/**
 * Common table headers used across all patterns
 * These are used by AccessibilityDocs components for table column headers
 */
export const commonTableHeaders: PatternTranslations = {
  en: {
    // Roles table
    'table.role': 'Role',
    'table.element': 'Target Element',
    'table.description': 'Description',
    // Properties table
    'table.attribute': 'Attribute',
    'table.target': 'Target',
    'table.values': 'Values',
    'table.required': 'Required',
    'table.configuration': 'Configuration',
    'table.notes': 'Notes',
    // States table
    'table.changeTrigger': 'Change Trigger',
    'table.reference': 'Reference',
    // Keyboard table
    'table.key': 'Key',
    'table.action': 'Action',
    // Focus management
    'table.event': 'Event',
    'table.behavior': 'Behavior',
    // Common values
    'value.yes': 'Yes',
    'value.no': 'No',
    // Section titles
    'section.ariaRoles': 'WAI-ARIA Roles',
    'section.ariaProperties': 'WAI-ARIA Properties',
    'section.ariaStates': 'WAI-ARIA States',
    'section.keyboardSupport': 'Keyboard Support',
    'section.focusManagement': 'Focus Management',
    'section.implementationNotes': 'Implementation Notes',
    'section.activationModes': 'Activation Modes',
    'section.structure': 'Structure',
    'section.mousePointerBehavior': 'Mouse/Pointer Behavior',
    'section.visualDesign': 'Visual Design',
    'section.importantNotes': 'Important Notes',
    'section.accessibleNaming': 'Accessible Naming',
    'section.nativeHtmlNotice': 'Use Native HTML First',
    'section.references': 'References',
  },
  ja: {
    // Roles table
    'table.role': 'ロール',
    'table.element': '対象要素',
    'table.description': '説明',
    // Properties table
    'table.attribute': '属性',
    'table.target': '対象',
    'table.values': '値',
    'table.required': '必須',
    'table.configuration': '設定',
    'table.notes': '備考',
    // States table
    'table.changeTrigger': '変更トリガー',
    'table.reference': 'リファレンス',
    // Keyboard table
    'table.key': 'キー',
    'table.action': 'アクション',
    // Focus management
    'table.event': 'イベント',
    'table.behavior': '振る舞い',
    // Common values
    'value.yes': 'はい',
    'value.no': 'いいえ',
    // Section titles
    'section.ariaRoles': 'WAI-ARIA ロール',
    'section.ariaProperties': 'WAI-ARIA プロパティ',
    'section.ariaStates': 'WAI-ARIA ステート',
    'section.keyboardSupport': 'キーボードサポート',
    'section.focusManagement': 'フォーカス管理',
    'section.implementationNotes': '実装ノート',
    'section.activationModes': 'アクティベーションモード',
    'section.structure': '構造',
    'section.mousePointerBehavior': 'マウス/ポインター動作',
    'section.visualDesign': 'ビジュアルデザイン',
    'section.importantNotes': '重要な注意事項',
    'section.accessibleNaming': 'アクセシブルな名前',
    'section.nativeHtmlNotice': 'ネイティブ HTML を優先',
    'section.references': '参考資料',
  },
};

/**
 * Get common table header text
 */
export function getTableHeader(key: string, locale: Locale): string {
  return commonTableHeaders[locale]?.[key] ?? commonTableHeaders.en[key] ?? key;
}

/**
 * Create a common table header translator
 */
export function createTableHeaderTranslator(locale: Locale) {
  return (key: string): string => getTableHeader(key, locale);
}
