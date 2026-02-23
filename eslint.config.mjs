import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import vue from 'eslint-plugin-vue';
import svelte from 'eslint-plugin-svelte';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import noSetHtmlOnSelfClosing from './eslint-rules/no-set-html-on-self-closing.js';

// ===========================================
// Shared globals definitions
// ===========================================
const browserGlobals = {
  ...globals.browser,
};

const domTypeGlobals = {
  HTMLElement: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLInputElement: 'readonly',
  HTMLDialogElement: 'readonly',
  HTMLDivElement: 'readonly',
  KeyboardEvent: 'readonly',
  MouseEvent: 'readonly',
  FocusEvent: 'readonly',
  Event: 'readonly',
};

export default tseslint.config(
  // ===========================================
  // Global ignores
  // ===========================================
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.internal/**',
      'node_modules/**',
      '**/*.d.ts',
      'src/env.d.ts',
    ],
  },

  // ===========================================
  // Base: ESLint recommended (JS files)
  // ===========================================
  js.configs.recommended,

  // ===========================================
  // Global settings and quality rules
  // ===========================================
  {
    rules: {
      // console.log は警告（本番コードでは削除推奨）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 基礎品質ルール
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-debugger': 'error',
      // no-shadow は TypeScript ブロックで有効化（@typescript-eslint/no-shadow を使用）
    },
  },

  // ===========================================
  // Browser environment globals (shared base)
  // ===========================================
  {
    files: ['src/**/*.{ts,tsx,js,jsx,vue,svelte,astro}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
      },
    },
  },

  // ===========================================
  // TypeScript configuration (scoped to TS/TSX only)
  // ===========================================
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // 型アサーションのベースライン設定:
      // - 'as' スタイルを許可（angle-bracket は禁止）
      // - オブジェクトリテラルは関数引数でのみ許可
      // - 純粋な src ファイルでは後のブロックで 'never' に上書きされる
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],
      // 未使用変数のチェック（_ prefix は許可）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // シャドウイング検出（警告レベル - 変数の命名によっては許容される場合もある）
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
    },
  },

  // ===========================================
  // React configuration
  // ===========================================
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      // TypeScript で型定義しているので prop-types は不要
      'react/prop-types': 'off',
    },
  },

  // React Hooks
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // マウント時の setState は一般的なパターンのため警告に緩和
      'react-hooks/set-state-in-effect': 'warn',
      // useRef の値を useEffect 内で変更するパターンは一般的なので緩和
      'react-hooks/immutability': 'warn',
    },
  },

  // ===========================================
  // JSX Accessibility (React)
  // ===========================================
  {
    files: ['**/*.{jsx,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Listbox コンポーネントをラベルでラップすることを許可
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          controlComponents: ['Listbox'],
          depth: 3,
        },
      ],
    },
  },

  // ===========================================
  // Vue configuration
  // ===========================================
  ...vue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.vue'],
  })),
  {
    files: ['**/*.vue'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...domTypeGlobals,
      },
    },
    rules: {
      // 標準の no-unused-vars を無効化し、TypeScript 版を使用
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // シングルワードのコンポーネント名を許可（APG パターンでは一般的）
      'vue/multi-word-component-names': 'off',
      // Prettier が整形するフォーマット関連ルールを off
      'vue/attributes-order': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      // v-html は APG デモでコンテンツ表示に必要
      'vue/no-v-html': 'warn',
      // props のデフォルト値は必須としない（optional props パターン）
      'vue/require-default-prop': 'off',
      // Vue 3 の filter 非推奨は警告に（段階的な移行のため）
      'vue/no-deprecated-filter': 'warn',
    },
  },

  // ===========================================
  // Svelte configuration
  // ===========================================
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...domTypeGlobals,
      },
    },
    rules: {
      // 標準の no-unused-vars を無効化し、TypeScript 版を使用
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // @html は APG デモでコンテンツ表示に必要
      'svelte/no-at-html-tags': 'warn',
      // 空のアロー関数はデフォルト値として許可
      '@typescript-eslint/no-empty-function': 'off',
      // Svelte 5 リアクティビティルールは警告のみ（段階的な移行のため）
      'svelte/prefer-svelte-reactivity': 'warn',
      'svelte/prefer-writable-derived': 'warn',
      // 未使用の svelte-ignore コメントは警告のみ
      'svelte/no-unused-svelte-ignore': 'warn',
      // each ブロックの key は推奨だが必須としない
      'svelte/require-each-key': 'warn',
      // 不要な children snippet は警告のみ
      'svelte/no-useless-children-snippet': 'warn',
      // Svelte のリアクティビティパターンでは import を再代入する場合がある
      'no-import-assign': 'off',
    },
  },

  // ===========================================
  // Svelte .svelte.ts files (TypeScript modules for Svelte)
  // ===========================================
  {
    files: ['**/*.svelte.ts'],
    ignores: ['**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // ===========================================
  // Astro configuration (consolidated)
  // ===========================================
  ...astro.configs.recommended.map((config) => ({
    ...config,
    files: config.files || ['**/*.astro'],
  })),
  {
    files: ['**/*.astro'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      local: { rules: { 'no-set-html-on-self-closing': noSetHtmlOnSelfClosing } },
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        alert: 'readonly',
        confirm: 'readonly',
        HTMLElement: 'readonly',
      },
    },
    rules: {
      // Astro ではフロントマターで type assertion が必要な場面が多い
      '@typescript-eslint/consistent-type-assertions': 'off',
      // Astro の Props パターンで空のインターフェースが必要
      '@typescript-eslint/no-empty-object-type': 'off',
      // Astro では any が必要な場面がある
      '@typescript-eslint/no-explicit-any': 'warn',
      // Astro の props 分割代入で発生する false positive を抑制
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      // 標準の no-unused-vars を無効化し、TypeScript 版を使用
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // 制御文字の正規表現は許可（Astro Heading で必要）
      'no-control-regex': 'off',
      // 非void要素の自己閉じタグで set:html を使うとコンテンツが消失する
      'local/no-set-html-on-self-closing': 'error',
    },
  },

  // Astro <script> tags (treated as virtual files)
  // Note: These virtual files inherit TypeScript rules from tseslint.configs.recommended
  // but need explicit rule overrides
  {
    files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
    rules: {
      // Relax TypeScript rules in Astro script tags
    },
  },

  // ===========================================
  // TypeScript strict rules for pure source files
  // 純粋なソースファイル（テスト/フレームワークテンプレート除く）では
  // 型アサーションを完全に禁止し、型安全性を最大化する
  // ===========================================
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      '**/*.svelte',
      '**/*.vue',
      '**/*.astro',
      '**/*.astro/*',
      '**/*.test.*',
      '**/*.spec.*',
    ],
    rules: {
      // 純粋なソースファイルでは型アサーションを完全禁止
      // （ベースラインの 'as' スタイル許可を上書き）
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
    },
  },

  // ===========================================
  // Test files: relax some rules (but keep basic checks)
  // ===========================================
  {
    files: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.test.*.ts',
      'src/**/*.spec.{ts,tsx}',
      'src/**/test/**/*.ts',
      'src/**/tests/**/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用変数は _ prefix で許可（完全 off ではない）
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Svelte test files (special handling with explicit parser)
  {
    files: ['**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // ===========================================
  // E2E test files: relax rules
  // ===========================================
  {
    files: ['e2e/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用変数は _ prefix で許可
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      'no-console': 'off',
    },
  },

  // ===========================================
  // Config files: Node.js environment
  // ===========================================
  {
    files: ['*.config.{js,mjs,ts}', 'vitest.*.config.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  // ===========================================
  // Scripts: Node.js environment
  // ===========================================
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
    },
  }
);
