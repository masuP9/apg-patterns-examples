// 共通のデモパス型定義
// この型は全フレームワークのルーター定義と同期させる必要があります
export const DEMO_PATHS = {
  'toggle-button': 'toggle-button',
  'tabs': 'tabs', 
  'accordion': 'accordion',
} as const;

export type DemoPath = keyof typeof DEMO_PATHS;

// URL マッピングヘルパー
export const getDemoUrl = (path: DemoPath): string => `/${DEMO_PATHS[path]}`;

// デモパスの検証
export const isValidDemoPath = (path: string): path is DemoPath => {
  return path in DEMO_PATHS;
};