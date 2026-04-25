# Component Standards

## File Structure

Each component lives in its own folder under `src/components/`:

```
src/components/MyComponent/
├── index.tsx                    # Component implementation (default export)
└── MyComponent.stories.tsx      # Storybook stories
```

The component is always the **default export** from `index.tsx`. This allows clean imports:

```typescript
import MyComponent from '../../components/MyComponent';
```

## Component Definition

Components are defined as **named function declarations** or **arrow functions** with a default export. This is enforced by ESLint (`react/function-component-definition`).

```typescript
// Function declaration (preferred for top-level components)
export default function MyComponent({ title, onClick }: MyComponentProps) {
  return <div>{title}</div>;
}

// Arrow function (also acceptable)
const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return <div>{title}</div>;
};
export default MyComponent;
```

## Props Interface

Define a named props interface, exported alongside the component. When wrapping an MUI component, extend its props type:

```typescript
import { Box, BoxProps } from '@mui/material';

export interface MyComponentProps extends BoxProps {
  customProp: string;
}

export default function MyComponent({ customProp, ...rest }: MyComponentProps) {
  return <Box {...rest}>{customProp}</Box>;
}
```

## Internationalization in Components

Never hard-code user-facing strings. Use `useTranslation()` from `react-i18next`:

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();           // Uses 'common' namespace by default
  // or
  const { t } = useTranslation('errors');   // Specify a namespace

  return <Typography>{t('myKey')}</Typography>;
}
```

For translations containing HTML, use the `<Trans>` component:

```typescript
import { Trans, useTranslation } from 'react-i18next';

<Trans t={t} i18nKey="landing.subtitle" />
```

See [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) for full details.

## Styling Patterns

### sx Prop (Preferred for One-Off Styles)

Use MUI's `sx` prop for component-specific styles. Access the theme via callback:

```typescript
<AppBar
  sx={{ backgroundColor: (theme) => theme.palette.common.white }}
>
```

### styled() (For Reusable Styled Variants)

Use MUI's `styled()` for creating reusable styled variants of MUI components:

```typescript
import { Button, styled } from '@mui/material';

const HeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: '1.125rem',
  fontWeight: 700,
  textTransform: 'none',
})) as typeof Button;
```

Note the `as typeof Button` cast — this preserves the component's polymorphic `component` prop type.

See `src/features/Layout/components/Header/index.tsx` for the canonical example.

### Responsive Styles

Use `useMediaQuery` for conditional rendering based on breakpoints:

```typescript
import { useMediaQuery } from '@mui/material';

const isTablet = useMediaQuery((theme) => theme.breakpoints.down('lg'));
```

Use the `sx` prop's breakpoint object syntax for responsive CSS:

```typescript
sx={{
  gap: {
    lg: '5rem',
    md: '3rem',
    xs: '1rem',
  },
}}
```

## Skeleton Loading Pattern

Use MUI `<Skeleton>` components to show loading states while data is being fetched, rather than spinners or blank content:

```typescript
{typeof user.name === 'undefined'
  ? <Skeleton width="5rem" />
  : t('greetingUsername', { username: user.name })}
```

For text that spans multiple lines, stack `<Skeleton>` elements at the appropriate widths rather than using a single full-width skeleton, to better match the expected layout.

## Navigation

Use `react-router-dom`'s `Link` component (aliased as `RouterLink`) and the `toNamedRoute` helper for type-safe navigation:

```typescript
import { Link as RouterLink } from 'react-router-dom';
import { toNamedRoute } from '../../router/router';
import { ROUTES } from '../../router/routeDefinitions';

<Button component={RouterLink} to={toNamedRoute(ROUTES.home)}>
  Go Home
</Button>
```

For programmatic navigation:

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate(toNamedRoute(ROUTES.home));
```

## Accessibility

Accessibility is enforced by ESLint (`eslint-plugin-jsx-a11y` recommended rules) and validated in Storybook (`@storybook/addon-a11y` running WCAG 2.0/2.1 A/AA/AAA checks).

Key patterns:

- **Images**: Always include an `alt` attribute. Use `alt=""` for decorative images.
- **Skip links**: The `SkipLink` component (`src/features/Layout/components/SkipLink`) provides keyboard users a way to bypass navigation to `#main-content`. It is included in `LayoutTemplate`.
- **Focus styles**: Global focus-visible styles are defined in `src/theme/components/CssBaseline.ts` using CSS custom properties (dashed outline). Never remove focus indicators.
- **Semantic HTML**: Use `component="h1"`, `component="main"`, `component="footer"` props on MUI components to render correct HTML elements.
- **Heading hierarchy**: The first heading in every page template must be an `<h1>`. Use the `component` prop to set the HTML element independently of the visual `variant` — e.g. `<Typography variant="h2" component="h1">` — so designs can differ from DOM order. Never skip heading levels.
- **Keyboard navigation**: All interactive elements must be keyboard-accessible. MUI components handle this by default. The theme disables ripple effects (`disableRipple: true`) but preserves focus behavior.

## Canonical Component Examples

| Component | File | Demonstrates |
|---|---|---|
| Header | `src/features/Layout/components/Header/index.tsx` | Arrow function component, MUI layout primitives, icon usage |
| Footer | `src/features/Layout/components/Footer/index.tsx` | Conditional rendering, props interface, MUI Stack layout |
| SkipLink | `src/features/Layout/components/SkipLink/index.tsx` | Accessibility-focused component, skip-to-content link |
