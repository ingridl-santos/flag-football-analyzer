# Testing Standards

## Overview

The project uses **Vitest v4** as the test runner with **happy-dom** as the DOM implementation and **@testing-library/react** for component testing. Tests are configured in `vitest.config.ts`.

## Test Configuration

From `vitest.config.ts`:

- **Environment**: `happy-dom` (lightweight, fast DOM)
- **Globals**: Enabled (`describe`, `it`, `expect`, `vi` available without imports)
- **Test file pattern**: `src/**/*.{test,spec}.{js,jsx,ts,tsx}`
- **Excluded**: `src/**/*.stories.{js,jsx,ts,tsx}`
- **Timeout**: 10,000ms per test
- **Setup files**:
  - `src/config/setupTests.ts` — Registers `@testing-library/jest-dom` matchers, mocks `Element.scrollTo`
  - `src/config/setupPortableStories.ts` — Sets up Storybook portable stories, mocks (i18n, canvas, ResizeObserver, matchMedia), suppresses console output in snapshot tests

## Test File Naming and Location

| Test Type | Location | Naming |
|---|---|---|
| Unit tests | Co-located with source file | `FileName.test.ts` or `FileName.test.tsx` |
| Snapshot tests | `src/__tests__/` | `snapshots.test.ts` (automated) |

Unit tests are placed next to the file they test:

```
src/services/
├── ApiClient.ts
└── ApiClient.test.ts
```

## Writing Unit Tests

Pattern for unit tests:

```typescript
import { vi } from 'vitest';

// Mock dependencies
vi.mock('axios');

describe('MyService', () => {
  beforeEach(() => {
    // Reset state between tests
  });

  it('does something expected', () => {
    // Arrange
    // Act
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Key testing imports

```typescript
import { describe, it, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

Since globals are enabled, you can omit the vitest imports (they're available automatically), but explicit imports are also fine.

## Mocking

### Mocking modules with vi.mock

```typescript
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockAxios = vi.mocked(axios);

// In tests:
expect(mockAxios.create).toHaveBeenCalledWith({ ... });
```

### Mocking i18n

A shared i18n mock exists at `src/__mocks__/i18n.ts`. It initializes i18next with empty resources and overrides the `t` function to return translation keys directly. This is automatically used in snapshot tests via `setupPortableStories.ts`.

For unit tests that need i18n, mock it explicitly:

```typescript
vi.mock('../../i18n', async () => {
  const { default: mockI18n } = await import('../../__mocks__/i18n');
  return { default: mockI18n };
});
```

### Mocking DOM APIs

The setup file `src/config/setupPortableStories.ts` mocks several DOM APIs not available in happy-dom:

- `Element.prototype.scrollTo`
- `window.matchMedia`
- `ResizeObserver`
- `HTMLCanvasElement.prototype.getContext`
- `HTMLCanvasElement.prototype.toDataURL`

## Snapshot Testing

Snapshot tests are **automated via Storybook portable stories** in `src/__tests__/snapshots.test.ts`. This file:

1. Discovers all `*.stories.tsx` files using `import.meta.glob`
2. Composes stories using `composeStories` from `@storybook/react-vite`
3. Runs each story and captures the DOM output
4. Normalizes dynamic IDs (MUI `mui-p-XXX` and React `:rXX:` IDs) for stable snapshots
5. Saves snapshots to `src/__tests__/__snapshots__/<StoryTitle>/<StoryName>.snapshot`

**You do not write snapshot tests manually.** Creating a Storybook story automatically includes it in snapshot testing.

### Updating Snapshots

When component output changes intentionally:

```sh
npm run test:update-snapshots
```

This deletes all existing snapshots and regenerates them.

### Disabling Snapshots for a Story

Add the `storyshots.disable` parameter:

```typescript
export const MyStory: Story = {
  parameters: {
    storyshots: {
      disable: true,
    },
  },
};
```

## Running Tests

| Command | Description |
|---|---|
| `npm run test` | Single test run |
| `npm run test:watch` | Watch mode (re-runs on changes) |
| `npm run test:coverage` | Run with V8 coverage |
| `npm run test:coverage:html` | Run with HTML coverage report |
| `npm run test:update-snapshots` | Delete and regenerate all snapshots |

## Conventions

- Use `describe` / `it` structure for unit tests
- Use `beforeEach` to reset mocks and state
- Prefer `@testing-library/react` queries (`screen.getByTestId`, `screen.getByRole`) over direct DOM access
- Use `vi.mock()` at the top level of the test file (not inside `describe` or `it`)
- Test files are co-located with their source files (not in `__tests__/` subdirectories, except for snapshots)
- The `@testing-library/jest-dom` matchers (e.g., `toBeInTheDocument()`, `toHaveAttribute()`) are globally available
- **Every custom hook and every utility function must have a co-located unit test file.** This is a hard requirement — there are no exceptions.

## Testing Custom Hooks

Custom hooks live in `src/hooks/` and must each have a co-located `HookName.test.ts`. Use `renderHook` from `@testing-library/react` to invoke them:

```typescript
import { renderHook } from '@testing-library/react';
import useMyHook from './useMyHook';

describe('useMyHook', () => {
  it('returns the expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBe('expected');
  });
});
```

Mock any MUI or external dependencies with `vi.mock()` before the `describe` block.

## Testing Utility Functions

Utility functions live in `src/utils/` and must each have a co-located `utilName.test.ts`. These are typically pure functions and straightforward to test:

```typescript
import { myUtil } from './myUtil';

describe('myUtil', () => {
  it('handles the base case', () => {
    expect(myUtil('input')).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(myUtil('')).toBe('');
  });
});
```
