import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Segment } from '../redux/SegmentSlice';

// --- module mocks ---------------------------------------------------------

const mockFFmpegInstance = {
  isLoaded: vi.fn(() => false),
  load: vi.fn(() => Promise.resolve()),
  run: vi.fn(() => Promise.resolve()),
  FS: vi.fn((method: string) => {
    if (method === 'readFile') return new Uint8Array([1, 2, 3]);
    return undefined;
  }),
  setProgress: vi.fn(),
};

vi.mock('@ffmpeg/ffmpeg', () => ({
  createFFmpeg: vi.fn(() => mockFFmpegInstance),
  fetchFile: vi.fn(() => Promise.resolve(new Uint8Array([0]))),
}));

vi.mock('fflate', () => ({
  zipSync: vi.fn(() => new Uint8Array([80, 75, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
}));

// ---------------------------------------------------------------------------

import { useVideoExport } from './useVideoExport';

const SEGMENTS: Segment[] = [
  { id: 'seg-1', start: 0, end: 10, duration: 10, playType: 'Pass', tags: [] },
  { id: 'seg-2', start: 20, end: 35, duration: 15, playType: 'Run', tags: ['rush'] },
];

describe('useVideoExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFFmpegInstance.isLoaded.mockReturnValue(false);
    mockFFmpegInstance.load.mockResolvedValue(undefined);
    mockFFmpegInstance.run.mockResolvedValue(undefined);
    mockFFmpegInstance.FS.mockImplementation((method: string) => {
      if (method === 'readFile') return new Uint8Array([1, 2, 3]);
      return undefined;
    });

    // happy-dom doesn't support Blob object URLs — stub just these two APIs.
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useVideoExport());

    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportProgress).toBe(0);
    expect(result.current.exportError).toBeNull();
    expect(typeof result.current.exportZip).toBe('function');
  });

  it('sets isExporting to true while running and false after', async () => {
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    expect(result.current.isExporting).toBe(false);
  });

  it('loads FFmpeg and writes the input file', async () => {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    expect(createFFmpeg).toHaveBeenCalledWith(
      expect.objectContaining({ corePath: '/vendor/ffmpeg/ffmpeg-core.js' }),
    );
    expect(mockFFmpegInstance.load).toHaveBeenCalled();
    expect(fetchFile).toHaveBeenCalledWith(file);
    expect(mockFFmpegInstance.FS).toHaveBeenCalledWith(
      'writeFile',
      'input.mp4',
      expect.any(Uint8Array),
    );
  });

  it('runs FFmpeg once per segment with the correct args', async () => {
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    expect(mockFFmpegInstance.run).toHaveBeenCalledTimes(SEGMENTS.length);
    expect(mockFFmpegInstance.run).toHaveBeenCalledWith(
      '-ss', '0',
      '-i', 'input.mp4',
      '-t', '10',
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      'segment_001.mp4',
    );
    expect(mockFFmpegInstance.run).toHaveBeenCalledWith(
      '-ss', '20',
      '-i', 'input.mp4',
      '-t', '15',
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      'segment_002.mp4',
    );
  });

  it('sets exportProgress to 1 after all segments are processed', async () => {
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    await waitFor(() => expect(result.current.exportProgress).toBe(1));
  });

  it('sets exportError on FFmpeg failure', async () => {
    mockFFmpegInstance.run.mockRejectedValueOnce(new Error('WASM crash'));
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    expect(result.current.exportError).toBe('WASM crash');
    expect(result.current.isExporting).toBe(false);
  });

  it('reuses the cached FFmpeg instance on subsequent calls', async () => {
    // After the ffmpegRef is populated, isLoaded() returns true → skip re-create
    mockFFmpegInstance.isLoaded.mockReturnValue(true);
    const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, [SEGMENTS[0]]);
    });
    await act(async () => {
      await result.current.exportZip(file, [SEGMENTS[1]]);
    });

    // createFFmpeg is called once; the instance is reused the second time
    expect(createFFmpeg).toHaveBeenCalledTimes(1);
  });

  it('triggers a ZIP download with a blob URL', async () => {
    const { zipSync } = await import('fflate');
    const { result } = renderHook(() => useVideoExport());
    const file = new File(['video'], 'game.mp4', { type: 'video/mp4' });

    await act(async () => {
      await result.current.exportZip(file, SEGMENTS);
    });

    expect(zipSync).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });
});
