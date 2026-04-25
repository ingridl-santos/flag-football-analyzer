# Styling and Theme

## Overview

The application uses **Material UI (MUI) v7** with a custom theme defined in `src/theme/index.ts`. All styling goes through MUI's theming system — no standalone CSS files for component styling.

## Theme Structure

```
src/theme/
├── index.ts                    # createTheme() — combines all theme parts
├── theme.stories.tsx           # Storybook stories showcasing the full theme
├── constants/
│   ├── palette.ts              # Custom color palette (primary, semantic, grey scale)
│   ├── typography.ts           # Typography variants and font configuration
│   ├── breakpoints.ts          # Breakpoint definitions
│   └── spacing.ts              # Reference spacing scale (xs–xl in px)
└── components/
    ├── AppBar.ts               # elevation 0, static position, inherit color
    ├── Button.ts               # Custom `underlined` variant for nav links; borderRadius 0.5rem
    ├── ButtonBase.ts           # Disables ripple globally
    ├── ButtonGroup.ts
    ├── Card.ts                 # Border-based cards (1px divider border, no shadow)
    ├── Container.ts            # Sets default maxWidth to 'xl'
    ├── CssBaseline.ts          # Global focus-visible styles and overflow rules
    ├── Paper.ts                # borderRadius 0.75rem; backgroundImage 'none'
    ├── Skeleton.ts             # Sets default animation to 'wave'
    └── UseMediaQuery.ts        # Enables SSR-safe media queries
```

`shape.borderRadius` is set to `8` in `createTheme()`, which MUI uses as the base for all components that derive their border-radius from the theme.

## Custom Color Palette

Defined in `src/theme/constants/palette.ts`. The palette uses a modern, accessible colour system aligned with the Tailwind CSS colour scale.

### Primary & Secondary

| Token | Value | Usage |
|---|---|---|
| `primary.main` | `#2563EB` (Blue) | Brand accent — buttons, links, active states |
| `primary.dark` | `#1D4ED8` (Dark Blue) | Hover / emphasis variant |
| `primary.light` | `#3B82F6` (Light Blue) | Decorative tints |
| `primary.contrastText` | `#FFFFFF` | Text on primary backgrounds |
| `secondary.main` | `#6B7280` (Mid-grey) | Secondary UI elements |
| `secondary.dark` | `#4B5563` | Emphasis variant |
| `secondary.light` | `#9CA3AF` | Decorative — do not use as text |
| `secondary.contrastText` | `#FFFFFF` | Text on secondary backgrounds |

### Backgrounds & Text

| Token | Value | Usage |
|---|---|---|
| `background.default` | `#F9FAFB` | Page background (subtle grey) |
| `background.paper` | `#FFFFFF` | Card / surface background |
| `text.primary` | `#111827` | Body text |
| `text.secondary` | `#6B7280` | Muted / supporting text |
| `text.disabled` | `#9CA3AF` | Disabled state text |
| `divider` | `#E5E7EB` | Dividers and card borders |

### Grey Scale

A full `grey` scale (50–900) is available via `theme.palette.grey`. It mirrors the Tailwind CSS neutral scale:

```typescript
theme.palette.grey[100] // #F3F4F6
theme.palette.grey[700] // #374151
```

### Semantic Colors

`success`, `warning`, `error`, and `info` are all fully defined with `main`, `light`, `dark`, and `contrastText` shades:

| Token | `main` |
|---|---|
| `success` | `#16A34A` |
| `warning` | `#D97706` |
| `error` | `#DC2626` |
| `info` | `#2563EB` |

Access any theme color in components via the `sx` callback:

```typescript
sx={{ color: (theme) => theme.palette.primary.dark }}
sx={{ borderColor: (theme) => theme.palette.divider }}
sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
```

## Typography

Defined in `src/theme/constants/typography.ts`:

- **Font family**: `"Inter", "Roboto", sans-serif` (Inter loaded via `@fontsource/inter` — weights 400/500/600; Roboto as fallback via `@fontsource/roboto` — weights 400/500)
- **Responsive heading**: `h1` changes from 2rem to 1.5rem below the `md` breakpoint

| Variant | Size | Weight |
|---|---|---|
| h1 | 2rem (1.5rem mobile) | 600 |
| h2 | 1.5rem | 600 |
| h3 | 1.25rem | 600 |
| h4 | 1.125rem | 600 |
| h5 | 1rem | 600 |
| h6 | 0.875rem | 600 |
| subtitle1 | 1rem | 500 |
| subtitle2 | 0.875rem | 500 |
| body1 | 0.875rem | 400 |
| body2 | 0.75rem | 400 |
| button | 0.875rem | 500 |
| caption | 0.75rem | 400 |

`button` has `textTransform: 'none'` globally — no uppercase transforms.

## Spacing Reference

`src/theme/constants/spacing.ts` exports a named reference scale:

| Name | Value |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

These correspond to `theme.spacing(0.5, 1, 2, 3, 4)`. Always use `rem` strings in `sx` and `style` props rather than importing this constant — it exists as a human-readable reference.

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

- **Button**: Adds a custom `underlined` variant for active navigation links (animated underline on `aria-current="page"`); `borderRadius: 0.5rem`
- **ButtonBase**: `disableRipple: true` — ripple disabled globally
- **ButtonGroup**: Group variant configuration
- **Card**: `border: 1px solid divider`, `boxShadow: none` — flat, border-based cards
- **Container**: `maxWidth: 'xl'` — default container width
- **CssBaseline**: Enforces `overflow-y: scroll`, hides `overflow-x` outside Storybook, and sets focus-visible CSS custom properties:
  - `--focus-outline-color: currentColor`
  - `--focus-outline-offset: 0.125rem`
  - `--focus-outline-style: dashed`
  - `--focus-outline-width: 0.125rem`
- **Paper**: `borderRadius: 0.75rem`; `backgroundImage: 'none'` (prevents MUI's gradient on elevated surfaces)
- **Skeleton**: Default `animation: 'wave'`
- **UseMediaQuery**: SSR-safe media query defaults

## Styling Approach

### 1. sx Prop (Default Choice)

For component-specific styles, use the `sx` prop. Access theme values via callback:

```typescript
<Box
  sx={{
    backgroundColor: (theme) => theme.palette.background.default,
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
