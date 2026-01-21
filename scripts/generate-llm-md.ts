/**
 * Generate llm.md files from TypeScript accessibility data sources
 *
 * This script reads accessibility-data.ts files from each pattern directory
 * and generates corresponding llm.md files for AI coding assistants.
 *
 * Usage:
 *   npx tsx scripts/generate-llm-md.ts [pattern]
 *
 * Examples:
 *   npx tsx scripts/generate-llm-md.ts         # Generate all patterns with data sources
 *   npx tsx scripts/generate-llm-md.ts tabs    # Generate only tabs pattern
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type {
  PatternAccessibilityData,
  KeyboardSection,
  TestCheckItem,
} from '../src/lib/pattern-data/types';

const PATTERNS_DIR = path.join(process.cwd(), 'src/patterns');

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
 * Format pattern name for display (e.g., 'tabs' -> 'Tabs', 'toggle-button' -> 'Toggle Button')
 */
function formatPatternName(pattern: string): string {
  return pattern
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate Markdown content from accessibility data
 */
function generateMarkdown(data: PatternAccessibilityData): string {
  const lines: string[] = [];
  const patternName = formatPatternName(data.pattern);

  // Header
  lines.push(`# ${patternName} Pattern - AI Implementation Guide`);
  lines.push('');
  lines.push(`> APG Reference: ${data.apgUrl}`);
  lines.push('');

  // Overview
  if (data.overview) {
    lines.push('## Overview');
    lines.push('');
    lines.push(data.overview);
    lines.push('');
  }

  // Native HTML Considerations (if present)
  if (data.nativeHtmlConsiderations && data.nativeHtmlConsiderations.length > 0) {
    lines.push('## Native HTML vs Custom Implementation');
    lines.push('');
    lines.push('| Use Case | Recommended |');
    lines.push('| --- | --- |');
    for (const item of data.nativeHtmlConsiderations) {
      lines.push(`| ${item.useCase} | ${item.recommended} |`);
    }
    lines.push('');
  }

  if (data.nativeVsCustom && data.nativeVsCustom.length > 0) {
    lines.push('### Native vs Custom Comparison');
    lines.push('');
    lines.push('| Feature | Native | Custom |');
    lines.push('| --- | --- | --- |');
    for (const row of data.nativeVsCustom) {
      lines.push(`| ${row.feature} | ${row.native} | ${row.custom} |`);
    }
    lines.push('');
  }

  // ARIA Requirements
  lines.push('## ARIA Requirements');
  lines.push('');

  // Roles
  lines.push('### Roles');
  lines.push('');
  lines.push('| Role | Element | Description |');
  lines.push('| --- | --- | --- |');
  for (const role of data.roles) {
    const required = role.required !== undefined ? (role.required ? ' (required)' : '') : '';
    lines.push(`| \`${role.name}\` | ${role.element} | ${role.description}${required} |`);
  }
  lines.push('');

  // Properties
  if (data.properties && data.properties.length > 0) {
    lines.push('### Properties');
    lines.push('');
    lines.push('| Attribute | Element | Values | Required | Notes |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const prop of data.properties) {
      const values = prop.values.includes('|')
        ? prop.values
            .split('|')
            .map((v) => `\`${v.trim()}\``)
            .join(' \\| ')
        : prop.values;
      lines.push(
        `| \`${prop.attribute}\` | ${prop.element} | ${values} | ${prop.required ? 'Yes' : 'No'} | ${prop.notes || ''} |`
      );
    }
    lines.push('');
  }

  // States
  if (data.states && data.states.length > 0) {
    lines.push('### States');
    lines.push('');
    lines.push('| Attribute | Element | Values | Required | Change Trigger |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const state of data.states) {
      const values = state.values.includes('|')
        ? state.values
            .split('|')
            .map((v) => `\`${v.trim()}\``)
            .join(' \\| ')
        : state.values;
      lines.push(
        `| \`${state.attribute}\` | ${state.element} | ${values} | ${state.required ? 'Yes' : 'No'} | ${state.changeTrigger || ''} |`
      );
    }
    lines.push('');
  }

  // Keyboard Support
  lines.push('## Keyboard Support');
  lines.push('');

  if (data.keyboardSections && data.keyboardSections.length > 0) {
    for (const section of data.keyboardSections) {
      if (section.title) {
        lines.push(`### ${section.title}`);
        lines.push('');
      }
      lines.push('| Key | Action |');
      lines.push('| --- | --- |');
      for (const shortcut of section.shortcuts) {
        lines.push(`| \`${shortcut.key}\` | ${shortcut.action} |`);
      }
      lines.push('');
    }
  } else if (data.keyboardSupport && data.keyboardSupport.length > 0) {
    lines.push('| Key | Action |');
    lines.push('| --- | --- |');
    for (const shortcut of data.keyboardSupport) {
      lines.push(`| \`${shortcut.key}\` | ${shortcut.action} |`);
    }
    lines.push('');
  }

  // Focus Management
  if (data.focusManagement && data.focusManagement.length > 0) {
    lines.push('## Focus Management');
    lines.push('');
    for (const rule of data.focusManagement) {
      lines.push(`- ${rule.event}: ${rule.behavior}`);
    }
    lines.push('');
  }

  // Test Checklist
  if (data.testChecklist && data.testChecklist.length > 0) {
    lines.push('## Test Checklist');
    lines.push('');

    const groupedTests = groupTestsByCategory(data.testChecklist);

    for (const [category, tests] of Object.entries(groupedTests)) {
      const highPriority = tests.filter((t) => t.priority === 'high');
      const mediumPriority = tests.filter((t) => t.priority === 'medium');

      if (highPriority.length > 0) {
        lines.push(`### High Priority: ${formatCategory(category)}`);
        lines.push('');
        for (const test of highPriority) {
          lines.push(`- [ ] ${test.description}`);
        }
        lines.push('');
      }

      if (mediumPriority.length > 0) {
        lines.push(`### Medium Priority: ${formatCategory(category)}`);
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
    lines.push('## Implementation Notes');
    lines.push('');
    lines.push(data.implementationNotes);
    lines.push('');
  }

  // Example Test Code - React
  if (data.exampleTestCodeReact) {
    lines.push('## Example Test Code (React + Testing Library)');
    lines.push('');
    lines.push('```typescript');
    lines.push(data.exampleTestCodeReact);
    lines.push('```');
    lines.push('');
  }

  // Example Test Code - E2E
  if (data.exampleTestCodeE2E) {
    lines.push('## Example E2E Test Code (Playwright)');
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
function formatCategory(category: string): string {
  const categoryNames: Record<string, string> = {
    aria: 'ARIA',
    keyboard: 'Keyboard',
    focus: 'Focus Management',
    click: 'Click Behavior',
    accessibility: 'Accessibility',
  };
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Write llm.md file for a pattern
 */
function writeLlmMd(pattern: string, content: string): void {
  const outputPath = path.join(PATTERNS_DIR, pattern, 'llm.md');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`  Generated: ${outputPath}`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const targetPattern = args[0];

  console.log('Generating llm.md files from accessibility data sources...\n');

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

    const markdown = generateMarkdown(data);
    writeLlmMd(pattern, markdown);
    generated++;
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
}

main().catch(console.error);
