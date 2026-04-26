# Technology Stack

> Do not upgrade or add dependencies without confirming compatibility with the versions listed below.

## Core

| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.2.0` | UI framework |
| `react-dom` | `^18.2.0` | DOM renderer |
| `typescript` | `^5.9.3` | Static typing (strict mode) |
| `vite` | `^7.3.2` | Build tool and dev server |
| `@vitejs/plugin-react` | `^5.0.0` | Vite React plugin (SWC transform) |

## Styling

| Package | Version | Purpose |
|---|---|---|
| `@mui/material` | `^5.16.14` | MUI v5 component library |
| `@mui/icons-material` | `^5.15.6` | MUI icon set |
| `@mui/system` | `^9.0.0` | MUI system utilities |
| `@emotion/react` | `^11.14.0` | CSS-in-JS engine (MUI peer dep) |
| `@emotion/styled` | `^11.14.1` | Styled components (MUI peer dep) |
| `@fontsource/inter` | `^5.2.8` | Inter font (weights 400/500/600) |
| `@fontsource/roboto` | `^5.2.10` | Roboto font fallback |
| `sass` | `^1.64.1` | SCSS support (rarely used) |

> **Important:** This project uses **MUI v5**, not v7. The `sx` prop, `Grid`, `styled()`, and theme APIs follow the MUI v5 API. The `Grid` component uses `xs`, `sm`, `md`, `lg`, `xl` props directly (not the `size` prop introduced in v6+).

## State Management

| Package | Version | Purpose |
|---|---|---|
| `@reduxjs/toolkit` | `^1.9.5` | Redux Toolkit (slices, createSlice, nanoid) |
| `react-redux` | `^8.1.1` | React bindings for Redux |
| `redux` | `^4.2.1` | Redux core (peer dep) |
| `redux-thunk` | `^2.4.2` | Thunk middleware |
| `@types/react-redux` | `^7.1.25` | TypeScript types |

## Routing

| Package | Version | Purpose |
|---|---|---|
| `react-router-dom` | `^6.14.2` | React Router v6 (data router) |
| `react-error-boundary` | `^6.1.1` | Error boundary component |

## Internationalization

| Package | Version | Purpose |
|---|---|---|
| `i18next` | `^25.6.2` | i18n core |
| `react-i18next` | `^16.3.3` | React bindings |
| `i18next-http-backend` | `^3.0.5` | Runtime JSON file loading |
| `i18next-browser-languagedetector` | `^8.2.0` | Browser language detection (installed, not yet active) |

## Video Processing

| Package | Version | Purpose |
|---|---|---|
| `@ffmpeg/ffmpeg` | `^0.11.6` | FFmpeg.wasm JS bindings |
| `@ffmpeg/core-st` | `^0.11.1` | Single-threaded WASM core (no SharedArrayBuffer) |
| `fflate` | `^0.8.2` | Fast ZIP creation for export bundles |

## Testing

| Package | Version | Purpose |
|---|---|---|
| `vitest` | `^4.0.10` | Test runner |
| `@vitest/coverage-v8` | `^4.0.10` | V8 coverage provider |
| `@vitest/ui` | `^4.0.10` | Browser-based test UI |
| `happy-dom` | `^20.9.0` | DOM implementation for tests |
| `@testing-library/react` | `^16.3.0` | Component testing utilities |
| `@testing-library/jest-dom` | `^6.9.1` | Custom DOM matchers |
| `@testing-library/user-event` | `^14.4.3` | User interaction simulation |

## Storybook

| Package | Version | Purpose |
|---|---|---|
| `storybook` | `^10.3.5` | Storybook CLI and core |
| `@storybook/react-vite` | `^10.3.5` | Storybook Vite/React framework |
| `@storybook/addon-a11y` | `^10.3.5` | Accessibility panel |
| `@storybook/addon-links` | `^10.3.5` | Story linking |
| `@storybook/addon-vitest` | `^10.3.5` | Vitest integration inside Storybook |
| `eslint-plugin-storybook` | `^10.3.5` | ESLint rules for story files |

## Linting and Code Quality

| Package | Version | Purpose |
|---|---|---|
| `eslint` | `^9.39.2` | Linter (v9 flat config) |
| `@eslint/js` | `^9.39.2` | Core ESLint rules |
| `typescript-eslint` | `^8.54.0` | TypeScript ESLint integration |
| `@typescript-eslint/eslint-plugin` | `^8.54.0` | TypeScript-specific lint rules |
| `@typescript-eslint/parser` | `^8.54.0` | TypeScript ESLint parser |
| `@stylistic/eslint-plugin` | `^5.10.0` | Formatting rules (replaces deprecated ESLint core style rules) |
| `eslint-plugin-react` | `^7.37.5` | React lint rules |
| `eslint-plugin-react-hooks` | `^7.0.1` | Hooks rules enforcement |
| `eslint-plugin-jsx-a11y` | `^6.10.2` | Accessibility lint rules for JSX |
| `stylelint` | `^16.25.0` | CSS/SCSS linter |
| `stylelint-config-standard-scss` | `^16.0.0` | Standard SCSS config |
| `husky` | `^9.1.7` | Git hooks (pre-commit lint) |
