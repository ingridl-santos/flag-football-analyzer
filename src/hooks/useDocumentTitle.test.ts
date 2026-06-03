import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import useDocumentTitle from './useDocumentTitle';

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('sets document.title to "appName" when no title is provided', () => {
    renderHook(() => useDocumentTitle());

    expect(document.title).toBe('appName');
  });

  it('sets document.title to "documentTitle" when a string title is provided', () => {
    renderHook(() => useDocumentTitle('gameFootage'));

    expect(document.title).toBe('documentTitle');
  });

  it('sets document.title to "documentTitle" when a function title is provided', () => {
    renderHook(() => useDocumentTitle(() => 'home'));

    expect(document.title).toBe('documentTitle');
  });

  it('updates document.title when title changes', () => {
    const { rerender } = renderHook(
      ({ title }: { title?: string }) => useDocumentTitle(title),
      { initialProps: { title: undefined } as { title?: string } },
    );

    expect(document.title).toBe('appName');

    rerender({ title: 'gameFootage' });

    expect(document.title).toBe('documentTitle');
  });

  it('resets to "appName" when title changes to undefined', () => {
    const { rerender } = renderHook(
      ({ title }: { title?: string }) => useDocumentTitle(title),
      { initialProps: { title: 'gameFootage' } as { title?: string } },
    );

    expect(document.title).toBe('documentTitle');

    rerender({ title: undefined });

    expect(document.title).toBe('appName');
  });
});
