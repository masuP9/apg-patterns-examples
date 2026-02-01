/**
 * Practice metadata translations
 */

import type { Locale } from './ui';

interface PracticeTranslation {
  name: string;
  description: string;
}

type PracticeTranslations = Record<string, PracticeTranslation>;

const practiceTranslations: Record<Locale, PracticeTranslations> = {
  en: {
    // English uses the default values from practices.ts
  },
  ja: {
    'landmark-regions': {
      name: 'ランドマーク領域',
      description:
        'ARIA ランドマークロールは、ウェブページの構成と構造を識別する強力な手段を提供します。',
    },
    'names-and-descriptions': {
      name: 'アクセシブルな名前と説明の提供',
      description:
        '要素にアクセシブルな名前を提供し、適切な場合はアクセシブルな説明を提供することは、制作者の最も重要な責任の一つです。',
    },
    'keyboard-interface': {
      name: 'キーボードインターフェースの開発',
      description:
        'ネイティブ HTML フォーム要素とは異なり、ブラウザはカスタムウィジェットにキーボードサポートを提供しません。制作者がキーボードアクセスを提供する必要があります。',
    },
    'grid-and-table-properties': {
      name: 'グリッドとテーブルのプロパティ',
      description:
        'グリッドやテーブルの構造と関係性を完全に伝えるために、制作者は ARIA の行と列のプロパティが正しく設定されていることを確認する必要があります。',
    },
    'range-related-properties': {
      name: '範囲ウィジェットの値と限界の伝達',
      description:
        'ARIA は4種類の範囲ウィジェットのロールを定義しています: scrollbar、slider、spinbutton、meter。',
    },
    'structural-roles': {
      name: '構造的ロール',
      description:
        '構造的ロールは、ページの構造を記述するために使用され、通常はドキュメントコンテンツに使用されます。',
    },
    'hiding-semantics': {
      name: 'presentation ロールによるセマンティクスの非表示',
      description:
        'presentation ロールは、コンテンツを表示したまま、暗黙の ARIA セマンティクスをアクセシビリティツリーから削除します。',
    },
  },
};

/**
 * Get translated practice metadata
 */
export function getPracticeTranslation(
  practiceId: string,
  locale: Locale
): PracticeTranslation | undefined {
  // For English, return undefined to use default values
  if (locale === 'en') {
    return undefined;
  }
  return practiceTranslations[locale]?.[practiceId];
}

/**
 * Get practice name with translation
 */
export function getPracticeName(practiceId: string, defaultName: string, locale: Locale): string {
  const translation = getPracticeTranslation(practiceId, locale);
  return translation?.name || defaultName;
}

/**
 * Get practice description with translation
 */
export function getPracticeDescription(
  practiceId: string,
  defaultDescription: string,
  locale: Locale
): string {
  const translation = getPracticeTranslation(practiceId, locale);
  return translation?.description || defaultDescription;
}
