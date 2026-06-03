# Internationalization (i18n)

## Overview

The application uses **i18next v25** with **react-i18next v16** for internationalization. Translations are loaded at runtime as JSON files via HTTP backend.

## Configuration

i18next is initialized in `src/i18n.ts` with options from `src/i18nOptions.ts`:

- **Default language**: `en-US`
- **Supported languages**: `['en-US', 'pt-BR']`
- **Default namespace**: `common`
- **Backend**: HTTP backend loading from `/locales/{{lng}}/{{ns}}.json`
- **Missing keys**: Returns the key string by default (no custom parseMissingKeyHandler configured)

## Translation File Structure

Translation files are organized by namespace in `public/locales/`:

```
public/locales/
├── en-US/
│   ├── common.json          # Shared strings (app title, nav, header/footer)
│   ├── errors.json          # Error page strings
│   ├── pageTitles.json      # Browser tab title strings
│   ├── home.json            # Home feature strings
│   └── gameFootage.json     # Game Footage feature strings
└── pt-BR/
    ├── common.json
    ├── errors.json
    ├── gameFootage.json
    └── pageTitles.json
```

### Existing Namespaces

| Namespace | File | Content |
|---|---|---|
| `common` | `common.json` | Shared UI strings: app title, nav labels, header/footer copy, skip link |
| `errors` | `errors.json` | Error page titles and messages |
| `pageTitles` | `pageTitles.json` | Browser tab titles (`appName`, `documentTitle`, per-page keys) |
| `home` | `home.json` | Home page headline, description, highlights copy |
| `gameFootage` | `gameFootage.json` | Game footage page: upload, playback, segments, export, tag suggestions |
## Using Translations in Components

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  // Default namespace (common)
  const { t } = useTranslation();
  return <Typography>{t('loginSignup')}</Typography>;
}
```

### Specific Namespace

```typescript
const { t } = useTranslation('errors');
return <Typography>{t('notFound.title')}</Typography>;
```

### Multiple Namespaces

```typescript
const { t } = useTranslation(['home', 'common']);
return (
  <>
    <Typography>{t('welcomeMessage', { name })}</Typography>
    <Button>{t('common:subscriptions')}</Button>
  </>
);
```

### Interpolation

```json
{
  "greetingUsername": "Hi, {{username}}"
}
```

```typescript
t('greetingUsername', { username: user.name })
```

### HTML in Translations (Trans Component)

For translations containing HTML tags, use the `<Trans>` component:

```typescript
import { Trans, useTranslation } from 'react-i18next';

const { t } = useTranslation('assessment');

<Trans components={{ sup: <sup />, b: <b /> }} shouldUnescape>
  {page.title}
</Trans>
```

The `transKeepBasicHtmlNodesFor` config allows `sup`, `b`, `i`, and `br` tags in translations.

### Pluralization and Context

```json
{
  "contentDuration": "{{count}} min",
  "contentDuration_minAndSeconds": "{{count}} min {{seconds}} sec"
}
```

```typescript
t('contentDuration', { context, count: 5, seconds: 30 })
```

## Adding a New Namespace

1. Create the JSON file in `public/locales/en-US/myNamespace.json`
2. Add a matching file in `public/locales/pt-BR/myNamespace.json` (even if empty for now)
3. Use it in components: `const { t } = useTranslation('myNamespace');`
4. i18next HTTP backend will load it automatically — no registration needed

## Language Detection

The `i18next-browser-languagedetector` package is installed but not currently active. The app always uses the `fallbackLng` value (`en-US`). To enable automatic language detection, register the detector plugin in `src/i18n.ts`.

## Adding a New Language

1. Create a new directory: `public/locales/fr-FR/`
2. Copy all JSON files from `en-US/` and translate them
3. Add the locale to `supportedLngs` in `src/i18nOptions.ts`:
   ```typescript
   supportedLngs: ['en-US', 'pt-BR', 'fr-FR'],
   ```

## Testing with i18n

A shared mock is provided at `src/__mocks__/i18n.ts`. It overrides the `t` function to return translation keys directly, avoiding HTTP requests during tests.

In snapshot tests, this mock is automatically applied via `src/config/setupPortableStories.ts`. For unit tests, mock it explicitly:

```typescript
vi.mock('../../i18n', async () => {
  const { default: mockI18n } = await import('../../__mocks__/i18n');
  return { default: mockI18n };
});
```

## Skeleton Fallback Pattern

Stories that need to simulate unloaded translations use the `noTranslations` parameter (see [STORYBOOK_STANDARDS.md](STORYBOOK_STANDARDS.md)). This swaps in an empty i18n instance (`.storybook/i18nEmpty.ts`) that returns `undefined` for all keys, making the `??` pattern effective for skeleton stories:

```typescript
{t('landing.title') ?? <Skeleton sx={{ maxWidth: '15rem' }} />}
```

In the live app, i18next returns the key string for missing translations by default. If you need true loading skeletons in the app (before translations load), configure `parseMissingKeyHandler` in `src/i18nOptions.ts` to return `undefined`.
