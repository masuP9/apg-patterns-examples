/**
 * Generate pattern markdown files from TypeScript accessibility data sources
 *
 * This script reads accessibility-data.ts files from each pattern directory
 * and generates corresponding [pattern].md files (implementation guides).
 *
 * Usage:
 *   npx tsx scripts/generate-pattern-md.ts [pattern] [--locale=<locale>] [--all-locales]
 *
 * Examples:
 *   npx tsx scripts/generate-pattern-md.ts                    # Generate all patterns (English)
 *   npx tsx scripts/generate-pattern-md.ts tabs               # Generate only tabs pattern (English)
 *   npx tsx scripts/generate-pattern-md.ts tabs --locale=ja   # Generate tabs pattern (Japanese)
 *   npx tsx scripts/generate-pattern-md.ts --all-locales      # Generate all patterns in all locales
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type {
  PatternAccessibilityData,
  TestCheckItem,
  LocalizedField,
} from '../src/lib/pattern-data/types';

const PATTERNS_DIR = path.join(process.cwd(), 'src/patterns');
const SUPPORTED_LOCALES = ['en', 'ja'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

interface GenerateOptions {
  locale: Locale;
}

/**
 * Find all patterns that have accessibility-data.ts files
 */
async function findPatternsWithData(): Promise<string[]> {
  const patterns: string[] = [];
  const entries = fs.readdirSync(PATTERNS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dataFile = path.join(PATTERNS_DIR, entry.name, 'accessibility-data.ts');
      if (fs.existsSync(dataFile)) {
        patterns.push(entry.name);
      }
    }
  }

  return patterns;
}

/**
 * Load accessibility data for a pattern
 */
async function loadPatternData(pattern: string): Promise<PatternAccessibilityData | null> {
  const dataFile = path.join(PATTERNS_DIR, pattern, 'accessibility-data.ts');

  if (!fs.existsSync(dataFile)) {
    return null;
  }

  try {
    // Dynamic import of the TypeScript file
    const module = await import(dataFile);

    // Find the exported data (should be named `{pattern}AccessibilityData`)
    const expectedName = `${pattern.replace(/-/g, '')}AccessibilityData`;
    const data = module[expectedName] || module.default || Object.values(module)[0];

    if (!data || typeof data !== 'object') {
      console.warn(`Warning: Could not find accessibility data in ${dataFile}`);
      return null;
    }

    return data as PatternAccessibilityData;
  } catch (error) {
    console.error(`Error loading ${dataFile}:`, error);
    return null;
  }
}

/**
 * Get localized text from a LocalizedField value
 */
function localize(value: LocalizedField, locale: Locale): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[locale] ?? value.en;
}

/**
 * Format pattern name for display (e.g., 'tabs' -> 'Tabs', 'toggle-button' -> 'Toggle Button')
 */
function formatPatternName(pattern: string): string {
  return pattern
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate section titles based on locale
 */
function getSectionTitles(locale: Locale) {
  const titles = {
    en: {
      aiGuide: 'AI Implementation Guide',
      apgReference: 'APG Reference',
      overview: 'Overview',
      nativeVsCustom: 'Native HTML vs Custom Implementation',
      nativeComparison: 'Native vs Custom Comparison',
      ariaRequirements: 'ARIA Requirements',
      roles: 'Roles',
      properties: 'Properties',
      states: 'States',
      keyboardSupport: 'Keyboard Support',
      focusManagement: 'Focus Management',
      testChecklist: 'Test Checklist',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      implementationNotes: 'Implementation Notes',
      exampleTestReact: 'Example Test Code (React + Testing Library)',
      exampleTestE2E: 'Example E2E Test Code (Playwright)',
      // Table headers
      role: 'Role',
      element: 'Element',
      description: 'Description',
      attribute: 'Attribute',
      values: 'Values',
      required: 'Required',
      notes: 'Notes',
      changeTrigger: 'Change Trigger',
      key: 'Key',
      action: 'Action',
      useCase: 'Use Case',
      recommended: 'Recommended',
      feature: 'Feature',
      native: 'Native',
      custom: 'Custom',
    },
    ja: {
      aiGuide: 'AI実装ガイド',
      apgReference: 'APGリファレンス',
      overview: '概要',
      nativeVsCustom: 'ネイティブHTML vs カスタム実装',
      nativeComparison: 'ネイティブ vs カスタム比較',
      ariaRequirements: 'ARIA要件',
      roles: 'ロール',
      properties: 'プロパティ',
      states: 'ステート',
      keyboardSupport: 'キーボードサポート',
      focusManagement: 'フォーカス管理',
      testChecklist: 'テストチェックリスト',
      highPriority: '高優先度',
      mediumPriority: '中優先度',
      implementationNotes: '実装ノート',
      exampleTestReact: 'テストコード例 (React + Testing Library)',
      exampleTestE2E: 'E2Eテストコード例 (Playwright)',
      // Table headers
      role: 'ロール',
      element: '要素',
      description: '説明',
      attribute: '属性',
      values: '値',
      required: '必須',
      notes: '備考',
      changeTrigger: '変更トリガー',
      key: 'キー',
      action: 'アクション',
      useCase: 'ユースケース',
      recommended: '推奨',
      feature: '機能',
      native: 'ネイティブ',
      custom: 'カスタム',
    },
  };
  return titles[locale];
}

/**
 * Generate Markdown content from accessibility data
 */
function generateMarkdown(data: PatternAccessibilityData, options: GenerateOptions): string {
  const { locale } = options;
  const lines: string[] = [];
  const patternName = formatPatternName(data.pattern);
  const t = getSectionTitles(locale);

  // Header
  lines.push(`# ${patternName} Pattern - ${t.aiGuide}`);
  lines.push('');
  lines.push(`> ${t.apgReference}: ${data.apgUrl}`);
  lines.push('');

  // Overview
  if (data.overview) {
    lines.push(`## ${t.overview}`);
    lines.push('');
    lines.push(localize(data.overview, locale));
    lines.push('');
  }

  // Native HTML Considerations (if present)
  // Handle both array format (llm.md style) and object format (AccessibilityDocs style)
  if (data.nativeHtmlConsiderations) {
    const considerations = Array.isArray(data.nativeHtmlConsiderations)
      ? data.nativeHtmlConsiderations
      : [data.nativeHtmlConsiderations];
    const hasUseCaseFormat = considerations.some((item) => item.useCase && item.recommended);
    if (hasUseCaseFormat && considerations.length > 0) {
      lines.push(`## ${t.nativeVsCustom}`);
      lines.push('');
      lines.push(`| ${t.useCase} | ${t.recommended} |`);
      lines.push('| --- | --- |');
      for (const item of considerations) {
        if (item.useCase && item.recommended) {
          lines.push(`| ${item.useCase} | ${item.recommended} |`);
        }
      }
      lines.push('');
    }
  }

  if (data.nativeVsCustom && data.nativeVsCustom.length > 0) {
    lines.push(`### ${t.nativeComparison}`);
    lines.push('');
    lines.push(`| ${t.feature} | ${t.native} | ${t.custom} |`);
    lines.push('| --- | --- | --- |');
    for (const row of data.nativeVsCustom) {
      const feature = row.feature || (row.useCase ? localize(row.useCase, locale) : '');
      const native = localize(row.native, locale);
      const custom = localize(row.custom, locale);
      lines.push(`| ${feature} | ${native} | ${custom} |`);
    }
    lines.push('');
  }

  // ARIA Requirements
  lines.push(`## ${t.ariaRequirements}`);
  lines.push('');

  // Roles
  lines.push(`### ${t.roles}`);
  lines.push('');
  lines.push(`| ${t.role} | ${t.element} | ${t.description} |`);
  lines.push('| --- | --- | --- |');
  for (const role of data.roles) {
    const element = localize(role.element, locale);
    const description = localize(role.description, locale);
    const required = role.required !== undefined ? (role.required ? ' (required)' : '') : '';
    lines.push(`| \`${role.name}\` | ${element} | ${description}${required} |`);
  }
  lines.push('');

  // Properties
  if (data.properties && data.properties.length > 0) {
    lines.push(`### ${t.properties}`);
    lines.push('');
    lines.push(`| ${t.attribute} | ${t.element} | ${t.values} | ${t.required} | ${t.notes} |`);
    lines.push('| --- | --- | --- | --- | --- |');
    for (const prop of data.properties) {
      let values = localize(prop.values, locale);
      if (values.includes('|')) {
        values = values
          .split('|')
          .map((v) => `\`${v.trim()}\``)
          .join(' \\| ');
      }

      const notes = prop.notes ? localize(prop.notes, locale) : '';
      const requiredText =
        locale === 'ja' ? (prop.required ? 'はい' : 'いいえ') : prop.required ? 'Yes' : 'No';

      const element = localize(prop.element, locale);
      lines.push(`| \`${prop.attribute}\` | ${element} | ${values} | ${requiredText} | ${notes} |`);
    }
    lines.push('');
  }

  // States
  if (data.states && data.states.length > 0) {
    lines.push(`### ${t.states}`);
    lines.push('');
    lines.push(
      `| ${t.attribute} | ${t.element} | ${t.values} | ${t.required} | ${t.changeTrigger} |`
    );
    lines.push('| --- | --- | --- | --- | --- |');
    for (const state of data.states) {
      const element = localize(state.element, locale);
      const changeTrigger = state.changeTrigger ? localize(state.changeTrigger, locale) : '';

      let values = localize(state.values, locale);
      if (values.includes('|')) {
        values = values
          .split('|')
          .map((v: string) => `\`${v.trim()}\``)
          .join(' \\| ');
      }

      const requiredText =
        locale === 'ja' ? (state.required ? 'はい' : 'いいえ') : state.required ? 'Yes' : 'No';

      lines.push(
        `| \`${state.attribute}\` | ${element} | ${values} | ${requiredText} | ${changeTrigger} |`
      );
    }
    lines.push('');
  }

  // Keyboard Support
  lines.push(`## ${t.keyboardSupport}`);
  lines.push('');

  if (data.keyboardSections && data.keyboardSections.length > 0) {
    for (const section of data.keyboardSections) {
      if (section.title) {
        const sectionTitle = localize(section.title, locale);
        lines.push(`### ${sectionTitle}`);
        lines.push('');
      }
      lines.push(`| ${t.key} | ${t.action} |`);
      lines.push('| --- | --- |');
      for (const shortcut of section.shortcuts) {
        const action = localize(shortcut.action, locale);
        lines.push(`| \`${shortcut.key}\` | ${action} |`);
      }
      lines.push('');
    }
  } else if (data.keyboardSupport && data.keyboardSupport.length > 0) {
    lines.push(`| ${t.key} | ${t.action} |`);
    lines.push('| --- | --- |');
    for (const shortcut of data.keyboardSupport) {
      const action = localize(shortcut.action, locale);
      lines.push(`| \`${shortcut.key}\` | ${action} |`);
    }
    lines.push('');
  }

  // Focus Management
  if (data.focusManagement && data.focusManagement.length > 0) {
    lines.push(`## ${t.focusManagement}`);
    lines.push('');
    for (const rule of data.focusManagement) {
      const event = localize(rule.event, locale);
      const behavior = localize(rule.behavior, locale);
      lines.push(`- ${event}: ${behavior}`);
    }
    lines.push('');
  }

  // Test Checklist
  if (data.testChecklist && data.testChecklist.length > 0) {
    lines.push(`## ${t.testChecklist}`);
    lines.push('');

    const groupedTests = groupTestsByCategory(data.testChecklist);

    for (const [category, tests] of Object.entries(groupedTests)) {
      const highPriority = tests.filter((test) => test.priority === 'high');
      const mediumPriority = tests.filter((test) => test.priority === 'medium');

      if (highPriority.length > 0) {
        lines.push(`### ${t.highPriority}: ${formatCategory(category, locale)}`);
        lines.push('');
        for (const test of highPriority) {
          lines.push(`- [ ] ${test.description}`);
        }
        lines.push('');
      }

      if (mediumPriority.length > 0) {
        lines.push(`### ${t.mediumPriority}: ${formatCategory(category, locale)}`);
        lines.push('');
        for (const test of mediumPriority) {
          lines.push(`- [ ] ${test.description}`);
        }
        lines.push('');
      }
    }
  }

  // Implementation Notes
  if (data.implementationNotes) {
    lines.push(`## ${t.implementationNotes}`);
    lines.push('');
    lines.push(data.implementationNotes);
    lines.push('');
  }

  // Example Test Code - React
  if (data.exampleTestCodeReact) {
    lines.push(`## ${t.exampleTestReact}`);
    lines.push('');
    lines.push('```typescript');
    lines.push(data.exampleTestCodeReact);
    lines.push('```');
    lines.push('');
  }

  // Example Test Code - E2E
  if (data.exampleTestCodeE2E) {
    lines.push(`## ${t.exampleTestE2E}`);
    lines.push('');
    lines.push('```typescript');
    lines.push(data.exampleTestCodeE2E);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Group test checklist items by category
 */
function groupTestsByCategory(tests: TestCheckItem[]): Record<string, TestCheckItem[]> {
  const grouped: Record<string, TestCheckItem[]> = {};

  for (const test of tests) {
    if (!grouped[test.category]) {
      grouped[test.category] = [];
    }
    grouped[test.category].push(test);
  }

  return grouped;
}

/**
 * Format category name for display
 */
function formatCategory(category: string, locale: Locale): string {
  const categoryNames: Record<Locale, Record<string, string>> = {
    en: {
      aria: 'ARIA',
      keyboard: 'Keyboard',
      focus: 'Focus Management',
      click: 'Click Behavior',
      accessibility: 'Accessibility',
    },
    ja: {
      aria: 'ARIA',
      keyboard: 'キーボード',
      focus: 'フォーカス管理',
      click: 'クリック動作',
      accessibility: 'アクセシビリティ',
    },
  };
  return categoryNames[locale][category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Write pattern markdown file
 */
function writePatternMd(pattern: string, content: string, locale: Locale): void {
  const filename = locale === 'en' ? `${pattern}.md` : `${pattern}.${locale}.md`;
  const outputPath = path.join(PATTERNS_DIR, pattern, filename);
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`  Generated: ${outputPath}`);
}

/**
 * Parse command line arguments
 */
function parseArgs(): { pattern?: string; locale: Locale; allLocales: boolean } {
  const args = process.argv.slice(2);
  let pattern: string | undefined;
  let locale: Locale = 'en';
  let allLocales = false;

  for (const arg of args) {
    if (arg === '--all-locales') {
      allLocales = true;
    } else if (arg.startsWith('--locale=')) {
      const value = arg.split('=')[1] as Locale;
      if (SUPPORTED_LOCALES.includes(value)) {
        locale = value;
      } else {
        console.warn(`Warning: Unsupported locale '${value}'. Using 'en'.`);
      }
    } else if (!arg.startsWith('--')) {
      pattern = arg;
    }
  }

  return { pattern, locale, allLocales };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const { pattern: targetPattern, locale, allLocales } = parseArgs();
  const localesToGenerate = allLocales ? SUPPORTED_LOCALES : [locale];

  console.log('Generating pattern markdown files from accessibility data sources...');
  console.log(`Locales: ${localesToGenerate.join(', ')}\n`);

  let patterns: string[];

  if (targetPattern) {
    // Generate only the specified pattern
    patterns = [targetPattern];
  } else {
    // Find all patterns with data sources
    patterns = await findPatternsWithData();
  }

  if (patterns.length === 0) {
    console.log('No patterns with accessibility-data.ts files found.');
    return;
  }

  console.log(`Found ${patterns.length} pattern(s) with data sources:\n`);

  let generated = 0;
  let skipped = 0;

  for (const pattern of patterns) {
    process.stdout.write(`Processing: ${pattern}...`);

    const data = await loadPatternData(pattern);

    if (!data) {
      console.log(' skipped (no data)');
      skipped++;
      continue;
    }

    console.log('');

    for (const loc of localesToGenerate) {
      const markdown = generateMarkdown(data, { locale: loc });
      writePatternMd(pattern, markdown, loc);
      generated++;
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
}

main().catch(console.error);
