module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['dist', '.eslintrc.js', 'node_modules', 'build'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // React specific rules
    'react/react-in-jsx-scope': 'off', // React 17+ JSX Transform
    'react/prop-types': 'off', // TypeScript handles this
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // 型アサーション制限: どうしても必要な場合のみ許可
    '@typescript-eslint/consistent-type-assertions': ['error', {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'never'
    }],
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    
    // General code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'quotes': ['error', 'double', { avoidEscape: true }],
    'semi': ['error', 'always'],
    
    // Import ordering
    'sort-imports': ['error', {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};