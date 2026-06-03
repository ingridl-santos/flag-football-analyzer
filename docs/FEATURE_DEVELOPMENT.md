# Feature Development

This guide covers how to add a new feature to the application, from folder structure to routing to translations.

> **Note:** All components inside a feature — pages, templates, and any sub-components in `components/` — are React components and must follow all rules in [COMPONENT_STANDARDS.md](COMPONENT_STANDARDS.md). That document is the authoritative reference for props conventions, styling, skeleton loading, dialogs, accessibility, and more. This guide covers only the feature-specific concerns (routing, folder layout, translations, Storybook) that are not already covered there.

## Folder Structure

Create a new folder under `src/features/` using PascalCase:

```
src/features/MyFeature/
├── pages/
│   └── MyFeaturePage.tsx           # Thin page wrapper
└── templates/
    └── MyFeatureTemplate/
        ├── index.tsx               # Template component (UI logic)
        └── MyFeatureTemplate.stories.tsx  # Storybook stories
```

### Pages vs Templates

- **Pages** live in `pages/` and are responsible for:
  - Wiring up data (Redux selectors, API calls, route params)
  - Passing data as props to the template
  - Being as thin as possible

- **Templates** live in `templates/<TemplateName>/` and are responsible for:
  - All UI layout and presentation
  - Receiving all data via props (no direct Redux/API access)
  - Being independently renderable in Storybook
  - **Using correct heading hierarchy** — the first heading on a page template must be an `<h1>` (see below)

**Example page** (minimal, no data dependencies):

```typescript
import MyFeatureTemplate from '../templates/MyFeatureTemplate';

export default function MyFeaturePage() {
  return <MyFeatureTemplate />;
}
```

**Example page with data wiring**:

```typescript
import { useTranslation } from 'react-i18next';
import { selectAnalysisState } from '../../../redux/AnalysisSlice';
import { useAppSelector } from '../../../redux/hooks';
import MyFeatureTemplate from '../templates/MyFeatureTemplate';

export default function MyFeaturePage() {
  const { mode } = useAppSelector(selectAnalysisState);

  return <MyFeatureTemplate mode={mode} />;
}
```

**Every page must have a corresponding template.** This separation is non-negotiable — pages are the logic/data layer and templates are the presentation layer. Never put UI markup directly in a page.

### Heading Hierarchy in Templates

The first heading rendered by a page template must be an `<h1>` in the DOM. Use the MUI `Typography` `component` prop to decouple the visual style from the HTML element so the design can differ from the semantic level:

```tsx
// The page visually uses an h2 style, but the DOM element is h1
<Typography variant="h2" component="h1">
  {t('title')}
</Typography>
```

Never skip heading levels (e.g. jumping from `h1` to `h3`). Subsequent headings within the same template should descend in order (`h2`, `h3`, …).

## Step 1: Create the Feature Folder

```
src/features/MyFeature/
├── pages/
│   └── MyFeaturePage.tsx
└── templates/
    └── MyFeatureTemplate/
        ├── index.tsx
        └── MyFeatureTemplate.stories.tsx
```

## Step 2: Add to Route Definitions

In `src/router/routeDefinitions.tsx`:

### 2a. Add the lazy import at the top:

```typescript
const MyFeaturePage = lazy(() => import('../features/MyFeature/pages/MyFeaturePage'));
```

### 2b. Add to the ROUTES constant:

```typescript
export const ROUTES = {
  // ... existing routes
  MyFeature: 'MyFeaturePage',
} as const;
```

### 2c. Add the route definition in ROUTES_DEFINITIONS:

Place the new route as a child of the Layout route:

```typescript
{
  name: ROUTES.MyFeature,
  path: '/my-feature',
  element: <MyFeaturePage />,
  errorElement: <Errors.ErrorPage />,
},
```

## Step 3: Create Translation Files

If your feature needs its own translation namespace, create a JSON file in `public/locales/en-US/`:

```json
// public/locales/en-US/myFeature.json
{
  "title": "My Feature",
  "description": "This is my feature."
}
```

Also add a matching file at `public/locales/pt-BR/myFeature.json` (even if empty for now). Then use it in your component:

```typescript
const { t } = useTranslation('myFeature');
```

Add the page title key to `public/locales/en-US/pageTitles.json` — this is read by `useDocumentTitle`.

If your feature only needs a few strings, add them to `common.json` instead of creating a new namespace.

See [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) for full i18n details.

## Step 4: Add Storybook Stories

Create stories for your template (not the page). Put all shared callback `action()` handlers on `meta.args` so they apply to every story by default:

```typescript
// src/features/MyFeature/templates/MyFeatureTemplate/MyFeatureTemplate.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import MyFeatureTemplate from '.';

const meta: Meta<typeof MyFeatureTemplate> = {
  title: 'Features / My Feature / My Feature Template',
  component: MyFeatureTemplate,
  args: {
    onAction: action('onAction'),
  },
};

export default meta;

type Story = StoryObj<typeof MyFeatureTemplate>;

export const Default: Story = {
  args: {},
};

// Required: shows all skeleton loading states
export const Loading: Story = {
  parameters: { noTranslations: true },
};
```

See [STORYBOOK_STANDARDS.md](STORYBOOK_STANDARDS.md) for story conventions.

## Step 5: Run Snapshot Tests

After creating your stories, run the snapshot tests to generate baseline snapshots:

```sh
npm run test:update-snapshots
```

The snapshot test in `src/__tests__/snapshots.test.ts` automatically discovers all `*.stories.tsx` files and creates snapshots for each story.

## Checklist for a New Feature

- [ ] Feature folder created under `src/features/` with `pages/` and `templates/` subdirectories
- [ ] Page component created (thin wrapper, delegates to template)
- [ ] Template component created with `useTranslation` for i18n strings
- [ ] Page calls `useDocumentTitle` with the key from the `pageTitles` namespace
- [ ] Key added to `public/locales/en-US/pageTitles.json` for the page title
- [ ] Page dispatches `setBreadcrumbs` in `useEffect` (with `clearBreadcrumbs` cleanup) if the page is deeper than the root
- [ ] Lazy import added in `src/router/routeDefinitions.tsx`
- [ ] Route name added to `ROUTES` constant
- [ ] Route definition added to `ROUTES_DEFINITIONS` as a child of the Layout route (with `errorElement`)
- [ ] Translation JSON file created in `public/locales/en-US/` (and matching file in `pt-BR/`)
- [ ] Storybook stories created for the template (callbacks on `meta.args`, `Loading` story with `noTranslations: true`)
- [ ] Snapshot tests generated (`npm run test:update-snapshots`)
