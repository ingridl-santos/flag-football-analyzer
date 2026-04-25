import { describe, expect, it } from 'vitest';

import { suggestTags } from './suggestTags';

describe('suggestTags', () => {
  describe('unknown or empty play type', () => {
    it('returns empty arrays for empty string', () => {
      const result = suggestTags('', 5);

      expect(result.auto).toEqual([]);
      expect(result.more).toEqual([]);
    });

    it('returns empty arrays for unrecognised play type', () => {
      const result = suggestTags('Kick', 5);

      expect(result.auto).toEqual([]);
      expect(result.more).toEqual([]);
    });
  });

  describe('Pass', () => {
    it('auto-infers Quick Pass for duration < 4s', () => {
      expect(suggestTags('Pass', 3).auto).toContain('Quick Pass');
      expect(suggestTags('Pass', 0).auto).toContain('Quick Pass');
    });

    it('auto-infers Deep Pass for duration > 7s', () => {
      expect(suggestTags('Pass', 8).auto).toContain('Deep Pass');
      expect(suggestTags('Pass', 20).auto).toContain('Deep Pass');
    });

    it('returns no auto tags for mid-range duration', () => {
      expect(suggestTags('Pass', 5).auto).toEqual([]);
      expect(suggestTags('Pass', 4).auto).toEqual([]);
      expect(suggestTags('Pass', 7).auto).toEqual([]);
    });

    it('includes pass results in more', () => {
      const { more } = suggestTags('Pass', 5);

      expect(more).toContain('Touchdown');
      expect(more).toContain('Completion');
      expect(more).toContain('Incompletion');
      expect(more).toContain('Interception');
      expect(more).toContain('Sack');
      expect(more).toContain('Flag Pull');
    });

    it('includes pass refinements in more', () => {
      const { more } = suggestTags('Pass', 5);

      expect(more).toContain('Screen Pass');
      expect(more).toContain('Slant');
      expect(more).toContain('QB Scramble');
    });

    it('includes pass formations in more', () => {
      const { more } = suggestTags('Pass', 5);

      expect(more).toContain('Shotgun');
      expect(more).toContain('Spread');
    });

    it('includes pass situational in more', () => {
      const { more } = suggestTags('Pass', 5);

      expect(more).toContain('Red Zone');
      expect(more).toContain('Two-Minute Drill');
    });

    it('does not duplicate auto tags in more', () => {
      const { auto, more } = suggestTags('Pass', 3);

      for (const tag of auto) {
        expect(more).not.toContain(tag);
      }
    });
  });

  describe('Run', () => {
    it('auto-infers Quick Run for duration < 3s', () => {
      expect(suggestTags('Run', 2).auto).toContain('Quick Run');
      expect(suggestTags('Run', 0).auto).toContain('Quick Run');
    });

    it('auto-infers Explosive Run for duration > 6s', () => {
      expect(suggestTags('Run', 7).auto).toContain('Explosive Run');
      expect(suggestTags('Run', 15).auto).toContain('Explosive Run');
    });

    it('returns no auto tags for mid-range duration', () => {
      expect(suggestTags('Run', 4).auto).toEqual([]);
      expect(suggestTags('Run', 3).auto).toEqual([]);
      expect(suggestTags('Run', 6).auto).toEqual([]);
    });

    it('includes run results, refinements, formations, situational in more', () => {
      const { more } = suggestTags('Run', 4);

      expect(more).toContain('Touchdown');
      expect(more).toContain('Inside Run');
      expect(more).toContain('I-Formation');
      expect(more).toContain('Goal Line');
    });
  });

  describe('Defense', () => {
    it('auto-infers Quick Stop for duration < 3s', () => {
      expect(suggestTags('Defense', 2).auto).toContain('Quick Stop');
      expect(suggestTags('Defense', 0).auto).toContain('Quick Stop');
    });

    it('auto-infers Sustained Drive Allowed for duration > 8s', () => {
      expect(suggestTags('Defense', 9).auto).toContain('Sustained Drive Allowed');
    });

    it('returns no auto tags for mid-range duration', () => {
      expect(suggestTags('Defense', 5).auto).toEqual([]);
      expect(suggestTags('Defense', 3).auto).toEqual([]);
      expect(suggestTags('Defense', 8).auto).toEqual([]);
    });

    it('includes all defense-specific results', () => {
      const { more } = suggestTags('Defense', 5);

      expect(more).toContain('Flag Pull');
      expect(more).toContain('Interception');
      expect(more).toContain('Pick Six');
      expect(more).toContain('Sack');
      expect(more).toContain('Forced Incompletion');
      expect(more).toContain('Touchdown Allowed');
    });

    it('includes defense refinements and formations', () => {
      const { more } = suggestTags('Defense', 5);

      expect(more).toContain('Blitz');
      expect(more).toContain('Zone Coverage');
      expect(more).toContain('Cover 2');
      expect(more).toContain('Prevent Defense');
      expect(more).toContain('Goal Line Stand');
    });
  });
});
