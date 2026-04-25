import { createFFmpeg, fetchFile, type FFmpeg } from '@ffmpeg/ffmpeg';
import { zipSync } from 'fflate';
import { useCallback, useRef, useState } from 'react';

import { type Segment } from '../redux/SegmentSlice';
import { segmentsToCsv, segmentsToJson } from '../utils/exportSegments';

export interface UseVideoExportResult {
  exportZip: (file: File, segments: Segment[]) => Promise<void>;
  isExporting: boolean;
  exportProgress: number;
  exportError: string | null;
}

/**
 * Lazily loads FFmpeg.wasm (single-threaded, no SharedArrayBuffer required)
 * and returns an `exportZip` function that cuts a local video file at each
 * segment's start/end times and bundles the clips — plus CSV + JSON metadata —
 * into a downloadable ZIP archive.
 *
 * The FFmpeg instance is cached across calls so subsequent exports skip the
 * ~30 MB WASM load.
 */
export function useVideoExport(): UseVideoExportResult {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const loadFFmpeg = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegRef.current?.isLoaded()) return ffmpegRef.current;

    const instance = createFFmpeg({
      // Served by Vite's copyFFmpegCore plugin from @ffmpeg/core-st/dist/
      corePath: '/vendor/ffmpeg/ffmpeg-core.js',
      log: false,
    });

    await instance.load();
    ffmpegRef.current = instance;
    return instance;
  }, []);

  const exportZip = useCallback(async (file: File, segments: Segment[]) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      const ffmpeg = await loadFFmpeg();

      await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

      const zipFiles: Record<string, Uint8Array> = {};

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const padded = String(i + 1).padStart(3, '0');
        const outName = `segment_${padded}.mp4`;

        // -ss before -i = fast input seek to nearest keyframe
        // -t = duration to capture (segment.duration = end - start)
        // -c copy = stream copy, no re-encode (fast, keyframe-aligned)
        // -avoid_negative_ts make_zero = reset output timestamps to start at 0
        await ffmpeg.run(
          '-ss', String(segment.start),
          '-i', 'input.mp4',
          '-t', String(segment.duration),
          '-c', 'copy',
          '-avoid_negative_ts', 'make_zero',
          outName,
        );

        const data = ffmpeg.FS('readFile', outName);

        zipFiles[`cuts/${outName}`] = data;
        ffmpeg.FS('unlink', outName);

        setExportProgress((i + 1) / segments.length);
      }

      ffmpeg.FS('unlink', 'input.mp4');

      zipFiles['segments.csv'] = new TextEncoder().encode(segmentsToCsv(segments));
      zipFiles['segments.json'] = new TextEncoder().encode(segmentsToJson(segments));

      // level: 0 = store without compression (video is already compressed)
      const zipData = zipSync(zipFiles, { level: 0 });
      const blob = new Blob([zipData.buffer as ArrayBuffer], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'segments.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [loadFFmpeg]);

  return { exportZip, isExporting, exportProgress, exportError };
}
