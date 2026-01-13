import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import vue from 'eslint-plugin-vue';
import svelte from 'eslint-plugin-svelte';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

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
  // Base: ESLint recommended
  // ===========================================
  js.configs.recommended,

  // ===========================================
  // TypeScript: recommended
  // ===========================================
  ...tseslint.configs.recommended,

  // ===========================================
  // Global settings (applied first, can be overridden)
  // ===========================================
  {
    rules: {
      // console.log は警告（本番コードでは削除推奨）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 制御文字の正規表現は許可（Astro Heading で必要）
      'no-control-regex': 'off',
      // 型キャストはデフォルトで許可（純粋なTS/TSXファイルでのみ禁止）
      '@typescript-eslint/consistent-type-assertions': 'off',
    },
  },

  // ===========================================
  // Browser environment globals
  // ===========================================
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // ===========================================
  // React configuration
  // ===========================================
  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'], // React 17+ JSX transform
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
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
      // @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
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
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        // DOM types
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLDivElement: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        FocusEvent: 'readonly',
        Event: 'readonly',
      },
    },
    rules: {
      // シングルワードのコンポーネント名を許可（APG パターンでは一般的）
      'vue/multi-word-component-names': 'off',
      // 属性の順序は厳密にしない
      'vue/attributes-order': 'off',
      // 1行あたりの属性数は制限しない（Prettierが整形）
      'vue/max-attributes-per-line': 'off',
      // 1行要素の改行は強制しない（Prettierが整形）
      'vue/singleline-html-element-content-newline': 'off',
      // 属性名のハイフネーションは強制しない（React 由来のコンポーネントで camelCase が一般的）
      'vue/attribute-hyphenation': 'off',
      // v-html は APG デモでコンテンツ表示に必要
      'vue/no-v-html': 'warn',
      // Prettier が整形するフォーマット関連ルールを off
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
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
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        // DOM types
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLDivElement: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        FocusEvent: 'readonly',
        Event: 'readonly',
      },
    },
    rules: {
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
      // Svelte のリアクティビティパターンで import を再代入する場合がある
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
      globals: {
        ...globals.browser,
      },
    },
  },

  // ===========================================
  // Svelte test files (special handling)
  // ===========================================
  {
    files: ['**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
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
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // ===========================================
  // Astro configuration
  // ===========================================
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        // Astro/DOM globals
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
      // 未使用の import は Astro で許可
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Astro <script> tags (treated as virtual files)
  {
    files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // ===========================================
  // TypeScript-specific rules (pure TS/TSX files only)
  // ===========================================
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      '**/*.svelte',
      '**/*.vue',
      '**/*.astro',
      '**/*.astro/*', // Astro virtual files (script tags)
      '**/*.test.*',
      '**/*.spec.*',
    ],
    rules: {
      // 型キャスト（type assertion）を禁止
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
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
    },
  },

  // ===========================================
  // Unit test files: relax some rules
  // ===========================================
  {
    files: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.test.*.ts',
      'src/**/*.spec.{ts,tsx}',
      'src/**/test/**/*.ts',
      'src/**/tests/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
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
      '@typescript-eslint/no-unused-vars': 'off',
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
  },

  // ===========================================
  // Final overrides: Astro files
  // (Must be last to override TypeScript stylistic rules)
  // ===========================================
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
    },
  }
);
