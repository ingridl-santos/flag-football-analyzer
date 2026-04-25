# Linting and Code Style

## Overview

The project enforces code quality through **ESLint v8** (legacy config), **Stylelint ^16**, **TypeScript strict mode**, and **Husky** for git hooks.

## Running Linters

```bash
npm run lint          # Run all: tsc + ESLint + Stylelint
npm run lint:js       # ESLint only on src/**/*.{ts,tsx}
npm run lint:js:fix   # ESLint with auto-fix
npm run lint:css      # Stylelint on src/**/*.{css,scss}
npm run lint:css:fix  # Stylelint with auto-fix
```

## ESLint Configuration

Defined in `.eslintrc.cjs` using the **ESLint v8 legacy config** format.

### Config Layers (Applied in Order)

1. **Global**: `plugin:react/recommended`, `airbnb`, `plugin:storybook/recommended`, `plugin:@typescript-eslint/recommended`
2. **TypeScript file overrides** (`*.ts`, `*.tsx`, `*.stories.*`): extends `airbnb-typescript` with project-specific TypeScript parser rules
3. **Import ordering**: enforces `builtin` → `external` → `internal` groups with newlines between, React imports sorted first

### Formatting Rules (@stylistic)

| Rule | Value |
|---|---|
| Semicolons | Required (`semi: true`) |
| Quote style | Single quotes (default) |
| Arrow parens | Always (`(x) => ...`, not `x => ...`) |
| Comma dangle | Always multiline |
| Max line length (code) | 128 characters |
| Max line length (comments) | 500 characters |
| JSX one expression per line | Off |

### React Rules

| Rule | Setting | Notes |
|---|---|---|
| `react/react-in-jsx-scope` | Off | Not needed with React 19's JSX transform |
| `react/require-default-props` | Off | TypeScript handles default values |
| `react/no-unescaped-entities` | Off | Allowed |
| `react/jsx-props-no-spreading` | Off | Spreading is common with MUI |
| `react/no-unused-prop-types` | Off | TypeScript handles this |
| `react/function-component-definition` | Error | Named: `function-declaration` or `arrow-function`; Unnamed: `arrow-function` |
| `react/jsx-newline` | Error | Require newline between JSX elements (`prevent: false`) |
| `react/prop-types` | Off | TypeScript replaces prop-types |
| `react-hooks/rules-of-hooks` | Error | Enforce Rules of Hooks |
| `react-hooks/exhaustive-deps` | Off | Disabled |

### TypeScript Rules

| Rule | Setting |
|---|---|
| `@typescript-eslint/no-use-before-define` | Error (functions exempt) |
| `@typescript-eslint/no-unused-vars` | Error (ignore `_` prefixed args/vars) |

### General Rules

| Rule | Setting |
|---|---|
| `no-console` | Off (console.log allowed) |
| `no-param-reassign` | Error (except `self` property mutations — for Redux Immer) |
| `no-restricted-syntax` | Error (ForInStatement, LabeledStatement, WithStatement banned) |
| `object-shorthand` | Error (always use shorthand) |

### Accessibility (jsx-a11y)

The `eslint-plugin-jsx-a11y` recommended rules are applied to all JSX files. This enforces accessible markup (alt text, ARIA attributes, semantic HTML, etc.).


## Stylelint Configuration

For CSS/SCSS files, Stylelint (`^16`) uses `stylelint-config-standard-scss`. Run with:

```bash
npm run lint:css
```

## TypeScript Strict Mode

The `tsconfig.json` enables strict type checking:

- `strict: true` — Enables all strict checks
- `noUnusedLocals: true` — Error on unused local variables
- `noUnusedParameters: true` — Error on unused function parameters
- `noFallthroughCasesInSwitch: true` — Error on fallthrough in switch statements

## Git Hooks (Husky)

Husky v9 is configured for git hooks (via the `prepare` script: `"prepare": "husky"`). This typically runs linting on pre-commit to catch issues before they reach the repository.

## Code Style Conventions Summary

| Convention | Rule |
|---|---|
| Semicolons | Always required |
| Quotes | Single quotes |
| Indentation | 2 spaces (default) |
| Trailing commas | Always in multiline |
| Arrow function parens | Always required |
| Max line length | 128 chars (code), 500 chars (comments) |
| Unused variables | Error (prefix with `_` to ignore) |
| Console statements | Allowed |
| For...in loops | Banned |
| Object shorthand | Always required |
| Function components | Named function declaration or arrow function |
| JSX elements | Newline between elements |
| Hard-coded text | Banned (use i18n) |
