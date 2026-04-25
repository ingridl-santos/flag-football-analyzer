import { type Segment } from '../redux/SegmentSlice';

const CSV_HEADER = 'id,start,end,duration,playType,tags';

export function segmentsToCsv(segments: Segment[]): string {
  const rows = segments.map((s) => {
    const tags = (s.tags ?? []).join('|');
    const playType = s.playType ?? '';

    return `${s.id},${s.start},${s.end},${s.duration},${playType},${tags}`;
  });

  return [CSV_HEADER, ...rows].join('\n');
}

export function segmentsToJson(segments: Segment[]): string {
  return JSON.stringify({ segments }, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
