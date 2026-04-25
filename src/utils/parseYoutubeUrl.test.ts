import { describe, expect, it } from 'vitest';

import { parseYoutubeUrl } from './parseYoutubeUrl';

const VIDEO_ID = 'dQw4w9WgXcQ';

describe('parseYoutubeUrl', () => {
  it('parses a standard watch URL', () => {
    expect(parseYoutubeUrl(`https://www.youtube.com/watch?v=${VIDEO_ID}`)).toBe(VIDEO_ID);
  });

  it('parses a watch URL without www', () => {
    expect(parseYoutubeUrl(`https://youtube.com/watch?v=${VIDEO_ID}`)).toBe(VIDEO_ID);
  });

  it('parses a short youtu.be URL', () => {
    expect(parseYoutubeUrl(`https://youtu.be/${VIDEO_ID}`)).toBe(VIDEO_ID);
  });

  it('parses a shorts URL', () => {
    expect(parseYoutubeUrl(`https://www.youtube.com/shorts/${VIDEO_ID}`)).toBe(VIDEO_ID);
  });

  it('parses an embed URL', () => {
    expect(parseYoutubeUrl(`https://www.youtube.com/embed/${VIDEO_ID}`)).toBe(VIDEO_ID);
  });

  it('parses a watch URL with extra query params', () => {
    expect(parseYoutubeUrl(`https://www.youtube.com/watch?t=42&v=${VIDEO_ID}&list=PL123`)).toBe(VIDEO_ID);
  });

  it('returns null for a non-YouTube URL', () => {
    expect(parseYoutubeUrl('https://vimeo.com/123456789')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseYoutubeUrl('')).toBeNull();
  });

  it('returns null for plain text', () => {
    expect(parseYoutubeUrl('not a url')).toBeNull();
  });
});
