/**
 * Pattern metadata translations
 */

import type { Locale } from './utils';

interface PatternTranslation {
  name: string;
  description: string;
}

type PatternTranslations = Record<string, PatternTranslation>;

const patternTranslations: Record<Locale, PatternTranslations> = {
  en: {
    // English uses the default values from patterns.ts
  },
  ja: {
    accordion: {
      name: 'アコーディオン',
      description:
        '垂直に積み重ねられたインタラクティブな見出しのセット。各見出しをクリックするとコンテンツセクションが展開されます。',
    },
    alert: {
      name: 'アラート',
      description:
        'ユーザーのタスクを中断せずに、重要なメッセージを目立つ形で表示する要素。',
    },
    'alert-dialog': {
      name: 'アラートダイアログ',
      description:
        'ユーザーのワークフローを中断し、重要なメッセージを伝えて応答を求めるモーダルダイアログ。',
    },
    breadcrumb: {
      name: 'パンくずリスト',
      description: '現在のページから親ページへの階層的なリンクのリスト。',
    },
    button: {
      name: 'ボタン',
      description:
        'フォームの送信や状態のトグルなど、アクションやイベントをトリガーするウィジェット。',
    },
    carousel: {
      name: 'カルーセル',
      description:
        'スライドと呼ばれるアイテムのセットを、1つまたは複数のスライドのサブセットを順次表示することで提示します。',
    },
    checkbox: {
      name: 'チェックボックス',
      description:
        '2状態（チェック済み/未チェック）および3状態（チェック済み/未チェック/部分的にチェック）をサポートします。',
    },
    combobox: {
      name: 'コンボボックス',
      description:
        'ユーザーがコレクションから値を選択できるポップアップを持つ入力ウィジェット。',
    },
    dialog: {
      name: 'ダイアログ（モーダル）',
      description:
        'プライマリウィンドウの上に重なるウィンドウで、背後のコンテンツを不活性にします。',
    },
    disclosure: {
      name: 'ディスクロージャー',
      description: 'コンテンツセクションの表示/非表示を制御するボタン。',
    },
    feed: {
      name: 'フィード',
      description:
        'ユーザーがスクロールすると新しいコンテンツセクションを自動的に読み込むページの領域。',
    },
    grid: {
      name: 'グリッド',
      description:
        'ユーザーが方向キーを使用して情報やインタラクティブ要素をナビゲートできるコンテナ。',
    },
    landmarks: {
      name: 'ランドマーク',
      description: 'ページの主要なセクションを識別する8つのロールのセット。',
    },
    link: {
      name: 'リンク',
      description: 'リソースへのインタラクティブな参照を提供するウィジェット。',
    },
    listbox: {
      name: 'リストボックス',
      description:
        'ユーザーが選択肢のリストから1つまたは複数のアイテムを選択できるウィジェット。',
    },
    menu: {
      name: 'メニュー / メニューバー',
      description:
        'アクションや機能のセットなど、ユーザーに選択肢のリストを提供するウィジェット。',
    },
    'menu-button': {
      name: 'メニューボタン',
      description: 'アクションやオプションのメニューを開くボタン。',
    },
    meter: {
      name: 'メーター',
      description: '定義された範囲内で変化する数値のグラフィカル表示。',
    },
    'radio-group': {
      name: 'ラジオグループ',
      description:
        'ラジオボタンと呼ばれるチェック可能なボタンのセットで、一度に1つだけチェックできます。',
    },
    slider: {
      name: 'スライダー',
      description: '指定された範囲内から値を選択する入力。',
    },
    spinbutton: {
      name: 'スピンボタン',
      description:
        '離散値の範囲から選択するための入力ウィジェット。通常、増減ボタンを持ちます。',
    },
    switch: {
      name: 'スイッチ',
      description:
        'チェック済み/未チェックではなく、オン/オフの値を表すチェックボックスの一種。',
    },
    table: {
      name: 'テーブル',
      description:
        '1つ以上の行を含む静的な表形式の構造で、各行は1つ以上のセルを含みます。',
    },
    tabs: {
      name: 'タブ',
      description:
        'タブパネルと呼ばれるコンテンツの層状セクションのセットで、一度に1つのパネルを表示します。',
    },
    toolbar: {
      name: 'ツールバー',
      description:
        'ボタン、トグルボタン、チェックボックスなどのコントロールセットをグループ化するコンテナ。',
    },
    tooltip: {
      name: 'ツールチップ',
      description:
        '要素がキーボードフォーカスを受けたとき、またはマウスがホバーしたときに、要素に関連する情報を表示するポップアップ。',
    },
    'tree-view': {
      name: 'ツリービュー',
      description:
        '折りたたみや展開が可能なネストされたグループを持つ階層的なリストを表示するウィジェット。',
    },
    treegrid: {
      name: 'ツリーグリッド',
      description:
        '編集可能またはインタラクティブな表形式の情報で構成される階層的なデータグリッドを表示するウィジェット。',
    },
    'window-splitter': {
      name: 'ウィンドウスプリッター',
      description:
        '2つのセクションまたはペイン間の移動可能なセパレーターで、ユーザーがペインの相対サイズを変更できます。',
    },
  },
};

/**
 * Get translated pattern metadata
 */
export function getPatternTranslation(
  patternId: string,
  locale: Locale
): PatternTranslation | undefined {
  // For English, return undefined to use default values
  if (locale === 'en') {
    return undefined;
  }
  return patternTranslations[locale]?.[patternId];
}

/**
 * Get pattern name (always returns English name for consistency)
 */
export function getPatternName(patternId: string, defaultName: string, _locale: Locale): string {
  // Pattern names are kept in English for consistency across languages
  return defaultName;
}

/**
 * Get pattern description with translation
 */
export function getPatternDescription(
  patternId: string,
  defaultDescription: string,
  locale: Locale
): string {
  const translation = getPatternTranslation(patternId, locale);
  return translation?.description || defaultDescription;
}
