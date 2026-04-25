# flag-football-analyzer — Agent Instructions

Before writing any code in this repository, read the project documentation in the `docs/` directory. These documents define the standards, conventions, and patterns you must follow.

## Required Reading

1. [docs/PROJECT_OVERVIEW.md](../docs/PROJECT_OVERVIEW.md) — Project summary, commands, directory layout
2. [docs/TECHNOLOGY_STACK.md](../docs/TECHNOLOGY_STACK.md) — Exact library versions (do not upgrade or add dependencies without confirming compatibility)
3. [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — Project structure, provider composition, routing, page/template pattern
4. [docs/COMPONENT_STANDARDS.md](../docs/COMPONENT_STANDARDS.md) — Component file structure, props, data-testid, styling, accessibility
5. [docs/FEATURE_DEVELOPMENT.md](../docs/FEATURE_DEVELOPMENT.md) — Step-by-step guide for adding a new feature
6. [docs/LINTING_AND_CODE_STYLE.md](../docs/LINTING_AND_CODE_STYLE.md) — ESLint rules, code style conventions

## Topic-Specific References

- [docs/STATE_MANAGEMENT.md](../docs/STATE_MANAGEMENT.md) — Redux Toolkit slices, typed hooks, redux-persist
- [docs/STYLING_AND_THEME.md](../docs/STYLING_AND_THEME.md) — MUI v7 theme, custom palette, component overrides
- [docs/TESTING_STANDARDS.md](../docs/TESTING_STANDARDS.md) — Vitest, happy-dom, snapshot testing via Storybook, required unit tests for hooks and utils
- [docs/STORYBOOK_STANDARDS.md](../docs/STORYBOOK_STANDARDS.md) — Story file conventions, .storybook/ config
- [docs/INTERNATIONALIZATION.md](../docs/INTERNATIONALIZATION.md) — i18next namespaces, translations, Trans component
- [docs/API_SERVICES.md](../docs/API_SERVICES.md) — Axios client factory, service class pattern
- [docs/AUTHENTICATION.md](../docs/AUTHENTICATION.md) — OIDC auth flow, protected routes, token propagation
- [docs/ENVIRONMENT_AND_DEPLOYMENT.md](../docs/ENVIRONMENT_AND_DEPLOYMENT.md) — Runtime env vars, feature flags, LogRocket

## Before Writing Code

1. **Read the `docs/` directory** listed above to understand the project's conventions.
2. **Check if any documentation seems out of date** compared to the actual codebase (e.g., dependency versions in `TECHNOLOGY_STACK.md` vs `package.json`, file paths that no longer exist, patterns that have changed). If anything looks stale, ask the user whether it should be updated before proceeding.
3. **Ask the user if they have any questions or clarifications** before you start writing code. Confirm your understanding of the task and how it fits into the existing architecture.
4. **When uncertain about anything** — design intent, naming, behaviour, architectural fit — stop and ask. Do not guess or make assumptions silently.
5. **When you notice a repeated pattern** across components or features, pause and ask the user whether it should be extracted into a shared component before continuing.

## Key Rules

- **Pages delegate to templates.** Pages wire up data; templates handle UI. Templates must be Storybook-renderable.
- **All routes need `errorElement`.** Point to `<Errors.ErrorPage />`.
- **Create Storybook stories for templates and components.** Stories are automatically included in snapshot tests. Define `action()` calls for all function props in the `meta` object's `args` so they apply as defaults to every story. Use spaces in story titles instead of camelCase or PascalCase (e.g., `'Features / Learning Center / What Is Disc Template'`, not `'Features / LearningCenter / WhatIsDisc Template'`).
- **Use typed Redux hooks.** `useAppDispatch` and `useAppSelector` from `src/redux/hooks.ts`, never plain `useDispatch`/`useSelector`.
- **Use MUI v7 components and `sx` prop for styling.** Use `styled()` only for reusable styled variants. Always write out full property names in `sx` and `style` props — use `padding` instead of `p`, `marginLeft` instead of `ml`, `backgroundColor` instead of `bgcolor`, etc. Axis shorthands like `paddingX`, `paddingY`, `marginX`, `marginY` are allowed.
- **Use the `Dialog` component from `src/components/Dialog`** instead of MUI `Dialog` directly. It includes a required close button and a typed `onClose` reason (`'backdropClick' | 'escapeKeyDown' | 'closeButtonClick'`). Pass content via the `title`, `content`, and `actions` props.
- **Never hard-code color values.** All colors must come from the MUI theme — including white and black. Use `theme.palette.common.white` and `theme.palette.common.black` instead of the strings `'white'` or `'black'`. Access the theme via the `sx` callback syntax: `sx={{ color: (theme) => theme.palette.common.white }}`. The only exception is SVG `fill`/`stroke` attributes for icons and logos.
- **Use rem units for sizing**, not px or MUI numeric shortcuts. In `sx`, `style`, and component shorthand props, always use rem strings (e.g., `padding: '1.5rem'`, `gap="2rem"`). The only exception is values under 4px (e.g., border widths of `1px` or `2px`), which may use `px`. Zero values (`0`) never need a unit.
- **Do not pass default HTML tags to the `Trans` component's `components` prop.** The tags `sup`, `b`, `i`, and `br` are already configured in `i18nOptions.ts` via `transKeepBasicHtmlNodesFor` and are available in all `Trans` usages without being specified explicitly.
- **API services follow the static class pattern.** Each service registers a named Axios client via `ApiClient.init()`.
- **Environment variables are runtime-injected** via `window.env`, not build-time. Add new vars to `runtime-env.ts` and `environment.js`.
- **Lazy-load all route-level components** using `React.lazy(() => import(...))`.
- **Every page must call `useDocumentTitle`** from `src/hooks/useDocumentTitle.ts` to set the browser tab title. Pass a key from the `pageTitles` i18n namespace (e.g. `useDocumentTitle(t('plans'))`). Add a new key to `public/locales/en-US/pageTitles.json` if one does not exist for the page.
- **Templates must follow correct heading hierarchy.** The first heading on a page template must be an `<h1>`. Use the MUI `Typography` `component` prop to set the HTML element independently of the visual style — e.g. `<Typography variant="h2" component="h1">` — so that the design can differ from the DOM order. Never skip heading levels.
- **All implemented code must be fully accessible (a11y).** Follow these rules:
  - Visual order must match DOM/content order so screen reader flow matches the visual layout.
  - All interactive elements (buttons, links, inputs) must be focusable and have a visible focus indicator.
  - Interactive elements without visible text labels must have `aria-label` or `aria-labelledby`.
  - Images and icons that convey meaning must have descriptive `alt` text (or `aria-label` for SVG). Purely decorative images/icons must use `alt=""` (or `aria-hidden="true"` for SVG/icon components).
  - Use semantic HTML elements or MUI components with appropriate roles — e.g., headings for structure, `<nav>` for navigation, `<main>` for primary content.
  - Dynamic content changes (modals, alerts, status messages) should use appropriate ARIA live region attributes when needed.

All user-facing text and dynamic content will eventually come from an API. Any text or element that is not immediately available when the page renders must show an **MUI `<Skeleton />`** placeholder until the data is loaded.

### Pattern

Use the nullish coalescing operator (`??`) to conditionally render a `Skeleton` when data is not yet available:

```tsx
<Typography variant="h1">
  {t('title') ?? <Skeleton sx={{ maxWidth: '21rem' }} />}
</Typography>

<Typography variant="body1">
  {t('description') ?? <MultilineSkelly lines={3} lastLineWidth="75%" />}
</Typography>

<Chip label={t('contentType') ?? <Skeleton width="3.5rem" />} />
```

For multiline text that spans several lines, use `<MultilineSkelly>` from `src/components/MultilineSkelly` instead of stacking multiple `<Skeleton>` elements. It accepts `lines` (number or responsive breakpoint map) and `lastLineWidth` (width of the final shorter line, also accepts a responsive breakpoint map). When a component uses several `MultilineSkelly` instances with responsive values, define a typed `const SKELETON_MAP: Record<string, MultilineSkellyProps>` at the top of the file and spread its entries into each `<MultilineSkelly>` — see `src/features/YourProfile/components/YourMapExplained/index.tsx` for the pattern.

For non-text elements (images, videos, embedded players, etc.) that load asynchronously, overlay or conditionally render a `<Skeleton variant="rectangular" />` that matches the element's dimensions, and hide it once the content has loaded.

### Minimizing Layout Shift

Skeletons must be sized to **minimize cumulative layout shift (CLS)** across all breakpoints. For text skeletons, match the width of the English translation as closely as possible using **whole `rem` values** (no decimals). For example, if the English text renders at roughly `18.3rem`, use `18rem` or `19rem` — never `18.25rem`. Use responsive `sx` widths when the text wraps differently at various breakpoints.

### Loading Story (required)

Every template **must** include a `Loading` story that displays all skeletons. Use `parameters: { noTranslations: true }` to simulate missing data:

```tsx
export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
```

## Implementing Designs from Figma

When reading a Figma file or design context to build UI:

- **Use MUI components** for all layout and UI elements. Do not use raw HTML elements when an MUI equivalent exists.
- **Avoid hard-coded widths and heights** wherever possible. Use MUI's layout primitives (`Stack`, `Grid`, `Container`, `Box` with flex) to let content flow naturally.
- **All measurements must be in rem**, rounded to the nearest `.25rem` (e.g., `1.25rem`, `2.5rem`, `0.75rem`). Never use `px`.
- **Do not implement hidden layers.** If a layer is hidden/invisible in the Figma design, skip it entirely — do not render it with `display: none` or `visibility: hidden`.

## Before Submitting

- Run `npm run lint` and fix all errors
- Run `npm run test` and ensure all tests pass
- Run `npm run test:update-snapshots` if you added or changed Storybook stories
- Verify new components have Storybook stories and snapshot coverage
- Verify every new custom hook (`src/hooks/`) has a co-located unit test file
- Verify every new utility function (`src/utils/`) has a co-located unit test file
