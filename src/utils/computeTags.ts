export const PLAY_TYPES = ['Pass', 'Run', 'Defense'] as const;
export type PlayType = (typeof PLAY_TYPES)[number];

export function computeTags(playType: string, duration: number): string[] {
  const tags: string[] = [];

  if (playType === 'Pass') {
    tags.push('offense', 'air');
  } else if (playType === 'Run') {
    tags.push('offense', 'rush');
  } else if (playType === 'Defense') {
    tags.push('defense');
  }

  if (duration < 3) {
    tags.push('quick');
  }

  return tags;
}
