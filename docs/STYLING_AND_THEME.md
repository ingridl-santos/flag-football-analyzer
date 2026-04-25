# Styling and Theme

## Overview

The application uses **Material UI (MUI) v5** with a custom theme defined in `src/theme/index.ts`. All styling goes through MUI's theming system — no standalone CSS files for component styling.

## Theme Structure

```
src/theme/
├── index.ts                    # createTheme() — combines all theme parts
├── theme.stories.tsx           # Storybook stories showcasing the full theme
├── constants/
│   ├── palette.ts              # Custom color palette
│   ├── typography.ts           # Typography variants and font configuration
│   └── breakpoints.ts          # Breakpoint definitions
└── components/
    ├── Button.ts               # Custom `underlined` variant for nav links
    ├── ButtonBase.ts           # Disables ripple globally
    ├── ButtonGroup.ts
    ├── Container.ts            # Sets default maxWidth to 'xl'
    ├── CssBaseline.ts          # Global focus-visible styles and overflow rules
    ├── Paper.ts                # Sets default border-radius to 0.75rem
    ├── Skeleton.ts             # Sets default animation to 'wave'
    └── UseMediaQuery.ts        # Enables SSR-safe media queries
```

## Custom Color Palette

The theme uses a flag-football-branded palette defined in `src/theme/constants/palette.ts`:

| Token | Value | Usage |
|---|---|---|
| `primary.main` | `#C9A227` (Gold) | Brand accent — buttons, borders, highlights |
| `primary.dark` | `#7A5C00` (Dark Gold) | AA-compliant text on white (6.25:1) |
| `primary.light` | `#DDB94E` (Light Gold) | Decorative only — never use as text color |
| `primary.contrastText` | `#121212` (Near-black) | Text on Gold backgrounds (8.68:1, AAA) |
| `secondary.main` | `#616161` (Mid-grey) | Secondary UI — AA on white (6.19:1) |
| `secondary.dark` | `#373737` (Dark grey) | AAA on all backgrounds |
| `secondary.light` | `#C0C0C0` (Silver) | Decorative only — never use as text color |
| `secondary.contrastText` | `#FFFFFF` (White) | Text on mid-grey (6.19:1, AA) |
| `background.default` | `#F5F5F5` | Page background |
| `background.paper` | `#FFFFFF` | Card / surface background |
| `text.primary` | `#121212` | Body text on default background (17.94:1, AAA) |
| `text.secondary` | `#4A4A4A` | Secondary text on default background (8.14:1, AAA) |

Access theme colors in components via the `sx` callback:

```typescript
sx={{ color: (theme) => theme.palette.primary.dark }}
```

## Typography

Defined in `src/theme/constants/typography.ts`:

- **Font family**: Roboto (loaded via `@fontsource/roboto` package, weights 300/400/500/700 + italic)
- **Responsive heading**: `h1` changes from 3.25rem to 2.25rem below the `md` breakpoint

| Variant | Size | Weight |
|---|---|---|
| h1 | 3.25rem (2.25rem mobile) | 300 |
| h2 | 2rem | 300 |
| h3 | 1.5rem | (default) |
| h4 | 1.25rem | 700 |
| h5 | 1rem | (default) |
| h6 | 0.75rem | 500 |
| subtitle1 | 1.375rem | (default) |
| subtitle2 | 1.125rem | normal |

## Breakpoints

Breakpoints use MUI's default values (created via `createBreakpoints({})` in `src/theme/constants/breakpoints.ts`):

| Name | Value |
|---|---|
| xs | 0px |
| sm | 600px |
| md | 900px |
| lg | 1200px |
| xl | 1536px |

## Component Overrides

Global MUI component defaults are configured in `src/theme/components/`:

- **Button**: Adds a custom `underlined` variant used for active navigation links (animated underline on `aria-current="page"`)
- **ButtonBase**: `disableRipple: true` — all buttons have ripple disabled globally
- **ButtonGroup**: Group variant configuration
- **Container**: `maxWidth: 'xl'` — default container width
- **CssBaseline**: Enforces `overflow-y: scroll`, hides `overflow-x` outside Storybook, and sets focus-visible CSS custom properties:
  - `--focus-outline-color: currentColor`
  - `--focus-outline-offset: 0.125rem`
  - `--focus-outline-style: dashed`
  - `--focus-outline-width: 0.125rem`
- **Paper**: Default `border-radius: 0.75rem`
- **Skeleton**: Default `animation: 'wave'`
- **UseMediaQuery**: SSR-safe media query defaults

## Styling Approach

### 1. sx Prop (Default Choice)

For component-specific styles, use the `sx` prop. Access theme values via callback:

```typescript
<Box
  sx={{
    backgroundColor: (theme) => theme.palette.common.white,
    padding: '1rem',
    gap: { lg: '5rem', md: '3rem', xs: '1rem' },  // Responsive
  }}
>
```

### 2. styled() (For Reusable Variants)

When you need a styled variant used in multiple places within a component:

```typescript
import { Button, styled } from '@mui/material';

const HeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: '1.125rem',
})) as typeof Button;
```

### 3. Component Overrides (For Global Defaults)

To change the default behavior of an MUI component globally, add a file in `src/theme/components/`:

```typescript
// src/theme/components/MyComponent.ts
import { Components } from '@mui/material';

const MyComponent: Components['MuiMyComponent'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: {
      borderRadius: '0.5rem',
    },
  },
};

export default MyComponent;
```

Then register it in `src/theme/index.ts`.

## CSS Units

The codebase uses `rem` units for sizing (not `px`), ensuring consistent scaling with the user's font size settings. This is an accessibility best practice.

## SCSS

SCSS is available (via the `sass` package) for cases where CSS-in-JS is insufficient, but it is rarely used. The Stylelint configuration (`stylelint-config-standard-scss`) is in place for any `.css` or `.scss` files in `src/`.
