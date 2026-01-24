/**
 * UI text translations
 *
 * Based on Astro i18n recipe:
 * https://docs.astro.build/en/recipes/i18n/
 */

// Language configuration
export const languages = {
  en: 'English',
  ja: '日本語',
} as const;

export type Locale = keyof typeof languages;
export const defaultLang: Locale = 'en';
export const showDefaultLang = false;

export const ui = {
  en: {
    // Navigation
    'nav.patterns': 'Patterns',
    'nav.guide': 'Guide',
    'nav.about': 'About',
    'nav.skipToContent': 'Skip to main content',
    'nav.openMenu': 'Open menu',

    // Site
    'site.title': 'APG Patterns Examples',
    'site.description':
      'APG Patterns Examples - Accessible component patterns for React, Vue, Svelte, and Astro',
    'site.logo': 'APG Patterns',
    'site.footerDescription': 'APG Patterns Examples - Accessible component implementations',

    // Pattern page sections
    'pattern.demo': 'Demo',
    'pattern.sourceCode': 'Source Code',
    'pattern.accessibility': 'Accessibility',
    'pattern.testing': 'Testing',
    'pattern.resources': 'Resources',
    'pattern.usage': 'Usage',
    'pattern.api': 'API',

    // Pattern list
    'patterns.title': 'Patterns',
    'patterns.available': 'Available Patterns',
    'patterns.planned': 'Planned Patterns',

    // Accessibility docs sections
    'a11y.ariaRoles': 'WAI-ARIA Roles',
    'a11y.ariaStates': 'WAI-ARIA States / Properties',
    'a11y.keyboardSupport': 'Keyboard Support',
    'a11y.nativeHtml': 'Native HTML Considerations',

    // Table headers
    'table.key': 'Key',
    'table.function': 'Function',
    'table.role': 'Role',
    'table.element': 'Element',
    'table.attribute': 'Attribute',
    'table.value': 'Value',
    'table.description': 'Description',

    // Status
    'status.available': 'Available',

    // Language
    'language.switch': 'Language',
    'language.en': 'English',
    'language.ja': '日本語',

    // 404
    '404.title': 'Page Not Found',
    '404.description': 'The page you are looking for does not exist.',
    '404.backHome': 'Back to Home',

    // AI Guide Actions
    'ai.downloadMarkdown': 'Download Markdown',
    'ai.copyToClipboard': 'Copy to Clipboard',
    'ai.copyOpenChatGPT': 'Copy & Open ChatGPT',
    'ai.copyOpenClaude': 'Copy & Open Claude',
    'ai.copied': 'Copied!',
    'ai.moreActions': 'More actions',
  },
  ja: {
    // Navigation
    'nav.patterns': 'パターン',
    'nav.guide': 'ガイド',
    'nav.about': 'このサイトについて',
    'nav.skipToContent': 'メインコンテンツへスキップ',
    'nav.openMenu': 'メニューを開く',

    // Site
    'site.title': 'APG Patterns Examples',
    'site.description':
      'APG Patterns Examples - React、Vue、Svelte、Astro で実装したアクセシブルなコンポーネントパターン',
    'site.logo': 'APG Patterns',
    'site.footerDescription': 'APG Patterns Examples - Accessible component implementations',

    // Pattern page sections
    'pattern.demo': 'デモ',
    'pattern.sourceCode': 'ソースコード',
    'pattern.accessibility': 'アクセシビリティ',
    'pattern.testing': 'テスト',
    'pattern.resources': 'リソース',
    'pattern.usage': '使い方',
    'pattern.api': 'API',

    // Pattern list
    'patterns.title': 'パターン',
    'patterns.available': '実装済みパターン',
    'patterns.planned': '実装予定パターン',

    // Accessibility docs sections
    'a11y.ariaRoles': 'WAI-ARIA ロール',
    'a11y.ariaStates': 'WAI-ARIA ステート / プロパティ',
    'a11y.keyboardSupport': 'キーボード操作',
    'a11y.nativeHtml': 'ネイティブ HTML の考慮事項',

    // Table headers
    'table.key': 'キー',
    'table.function': '機能',
    'table.role': 'ロール',
    'table.element': '要素',
    'table.attribute': '属性',
    'table.value': '値',
    'table.description': '説明',

    // Status
    'status.available': '実装済み',

    // Language
    'language.switch': '言語',
    'language.en': 'English',
    'language.ja': '日本語',

    // 404
    '404.title': 'ページが見つかりません',
    '404.description': 'お探しのページは存在しません。',
    '404.backHome': 'ホームに戻る',

    // AI Guide Actions
    'ai.downloadMarkdown': 'Markdown をダウンロード',
    'ai.copyToClipboard': 'クリップボードにコピー',
    'ai.copyOpenChatGPT': 'コピーして ChatGPT を開く',
    'ai.copyOpenClaude': 'コピーして Claude を開く',
    'ai.copied': 'コピーしました！',
    'ai.moreActions': 'その他の操作',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

/**
 * Get translation function for a specific locale
 */
export function useTranslation(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}

/**
 * Get a single translation
 */
export function t(lang: Locale, key: UIKey): string {
  return ui[lang][key] || ui[defaultLang][key] || key;
}
