# Storybook Standards

## Overview

The project uses **Storybook 10** with the `@storybook/react-vite` framework. Storybook serves as both a component development environment and the basis for automated snapshot testing.

## Running Storybook

```bash
npm run storybook         # Dev server on port 6006
npm run storybook:build   # Build to dist/storybook
```

## Story File Location and Naming

Stories are **co-located** with the components or templates they document:

```
src/features/Layout/components/Header/
├── index.tsx
└── Header.stories.tsx

src/features/Assessment/templates/AssessmentTemplate/
├── index.tsx
└── AssessmentTemplate.stories.tsx
```

Naming convention: `ComponentName.stories.tsx`

## Story File Structure

Every story file follows this structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import MyComponent from '.';

// 1. Meta — describes the component and its argTypes
const meta: Meta<typeof MyComponent> = {
  title: 'Category / Component Name',
  component: MyComponent,
};

export default meta;

// 2. Type alias for the story type
type Story = StoryObj<typeof MyComponent>;

// 3. Named story exports
export const Default: Story = {
  args: {
    // Props for this story
  },
};
```

### Key conventions:

- **Import the component from `.`** (the index barrel export), not the full path
- **Types come from `@storybook/react-vite`** — use `Meta<typeof Comp>` and `StoryObj<typeof Comp>`
- **`meta` is the default export** — it defines `title` and `component`
- **Each story is a named export** using PascalCase: `Default`, `WithAction`, `LoadingUser`

## Story Titles

Titles use `/` separators with spaces around them for grouping in the Storybook sidebar:

| Location | Title Format | Example |
|---|---|---|
| Components | `'Components / ComponentName'` | `'Components / Header'` |
| Features | `'Features / FeatureName / TemplateName'` | `'Features / Assessment / Assessment Template'` |
| Theme | `'Theme / ThemeName'` | `'Theme / Theme'` |
| Logos | `'Components / Logos / LogoName'` | `'Components / Logos / Catalyst Logo'` |

## Using Actions for Callbacks

Import `action` from `storybook/actions` (not `@storybook/addon-actions`):

```typescript
import { action } from 'storybook/actions';

export const Default: Story = {
  args: {
    onUserButtonClick: action('onUserButtonClick'),
    onActionClick: action('onActionClick'),
  },
};
```

## Composing Stories

Reuse args from other stories using spread:

```typescript
export const Default: Story = {
  args: {
    user: { name: 'Gordie', avatarUrl: 'https://placepengu.in/250' },
    menuEntries: [
      { id: 'me', label: 'Me' },
      { id: 'teams', label: 'Teams' },
    ],
  },
};

export const NoMenuEntries: Story = {
  args: {
    ...Default.args,
    menuEntries: [],
  },
};

export const LoadingUser: Story = {
  args: {
    ...Default.args,
    user: { name: undefined, avatarUrl: undefined },
  },
};
```

## Stories with Shared Args on Meta

For stories within a feature that share common callback handlers, define them on the meta:

```typescript
const meta: Meta = {
  title: 'Features / Analysis / Analysis Template',
  component: AnalysisTemplate,
  args: {
    onAnalyze: action('onAnalyze'),
    onReset: action('onReset'),
  },
  parameters: {
    layout: 'padded',
  },
};
```

## Snapshot Integration

All stories are automatically included in snapshot tests (see [TESTING_STANDARDS.md](TESTING_STANDARDS.md)). To exclude a specific story from snapshots:

```typescript
export const AnimatedStory: Story = {
  parameters: {
    storyshots: { disable: true },
  },
};
```

## Storybook Configuration

The Storybook configuration lives in `.storybook/`:

| File | Purpose |
|---|---|
| `.storybook/main.ts` | Stories glob pattern (`src/**/*.stories.@(js|jsx|mjs|ts|tsx)`), addons list, framework config, static dirs (`public/`) |
| `.storybook/preview.tsx` | Global decorators, theme/i18n/router wrapping, viewport presets, a11y config |
| `.storybook/i18n.ts` | i18next instance for Storybook (uses same `initOptions` as the app) |
| `.storybook/i18nEmpty.ts` | Empty i18n instance (returns `undefined` for all keys, used for skeleton testing) |
| `.storybook/storyUtils.ts` | Shared story utilities |

### Global Decorators (preview.tsx)

Every story is automatically wrapped with:

1. **I18nextProvider** — Translations (use `parameters.noTranslations: true` for empty i18n)
2. **ThemeProvider** — The app's MUI theme
3. **CssBaseline** — Baseline CSS reset
4. **MemoryRouter** — React Router context (so `<Link>` and `useNavigate` work in stories)

### Viewport Presets

Storybook viewports map to MUI breakpoints:

| Name | Width | Type |
|---|---|---|
| xs (Extra small) | 360px | mobile |
| sm (Small) | 600px | mobile |
| md (Medium) | 900px | tablet |
| lg (Large) | 1200px | desktop |
| xl (Extra large) | 1536px | desktop |

### Accessibility Testing

The `@storybook/addon-a11y` addon is configured to run WCAG 2.0 A/AA, WCAG 2.1 A/AA, WCAG 2.0 AAA, and best-practice rules. Check the a11y panel in Storybook for violations.

### Portable Stories (Test Setup)

The portable stories setup is in `src/config/setupPortableStories.ts`, which:

- Sets project annotations from `.storybook/preview`
- Mocks i18n for test contexts
- Mocks DOM APIs (canvas, ResizeObserver, matchMedia)

## Addons

The project includes these Storybook addons:

| Addon | Purpose |
|---|---|
| `@storybook/addon-a11y` | Accessibility panel in Storybook UI |
| `@storybook/addon-links` | Story linking between stories |
| `@storybook/addon-vitest` | Runs Vitest unit tests inside Storybook |
| `@storybook/addon-links` | Link between stories |
| `@storybook/addon-vitest` | Vitest integration |

## Canonical Story Examples

| Story File | Demonstrates |
|---|---|
| `src/features/Layout/components/Header/Header.stories.tsx` | Multiple variants, composed args, action callbacks |
| `src/theme/theme.stories.tsx` | Theme showcase with multiple story types (Typography, Colors, Inputs, etc.) |
