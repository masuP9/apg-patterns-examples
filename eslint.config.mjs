import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.test.*.ts', 'src/test/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // 型キャスト（type assertion）を禁止
      // `as` や `<Type>` による型アサーションは型安全性を損なうため使用しない
      // 代わりに型ガード（instanceof, typeof, in）や適切な型付けを使用する
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
    },
  },
  // テストファイルでは型キャストを許可（DOMテストで頻繁に必要なため）
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.test.*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
    },
  },
];
