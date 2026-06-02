import { type Segment } from '../redux/SegmentSlice';

const CSV_HEADER = 'clipName,id,start,end,duration,playType,tags';

/** Returns the canonical zero-padded segment label for a 0-based index, e.g. `segment_001`. */
export function formatSegmentId(index: number): string {
  return `segment_${String(index + 1).padStart(3, '0')}`;
}

/**
 * Escapes a single CSV field per RFC 4180: wraps in double-quotes if the value
 * contains a comma, double-quote, or newline, and doubles any internal quotes.
 */
function csvField(value: string): string {
  if (/[,"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function segmentsToCsv(segments: Segment[]): string {
  const rows = segments.map((s, i) => {
    const label = formatSegmentId(i);
    const tags = csvField((s.tags ?? []).join('|'));
    const playType = csvField(s.playType ?? '');

    return `${label},${s.id},${s.start},${s.end},${s.duration},${playType},${tags}`;
  });

  return [CSV_HEADER, ...rows].join('\n');
}

export function segmentsToJson(segments: Segment[]): string {
  const labeled = segments.map((s, i) => ({
    ...s,
    clipName: formatSegmentId(i),
  }));

  return JSON.stringify({ segments: labeled }, null, 2);
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
