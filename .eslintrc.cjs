module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  overrides: [{
    // Typescript specific settings
    files: ['*.ts', '*.tsx', '*.stories.*'],
    extends: ['airbnb-typescript'],
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', {
        functions: false,
      }],
      '@typescript-eslint/type-annotation-spacing': ['error', {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      }],
      'import/no-anonymous-default-export': 'off',
    },
  }],
  rules: {
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-props-no-spreading': 'off',
    'consistent-return': 'off',
    'react/no-unused-prop-types': 'off',
    'react/jsx-newline': ['error', { prevent: false }],
    'eol-last': ['error', 'always'],
    'max-len': ['warn', { comments: 500, code: 128 }],
    'no-console': 'off',
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['self'] }],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-restricted-exports': 'off',
    'react/function-component-definition': ['error', {
      namedComponents: ['function-declaration', 'arrow-function'],
      unnamedComponents: 'arrow-function',
    }],
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'import/no-cycle': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
