export interface TagSuggestions {
  auto: string[];
  more: string[];
}

const TAXONOMY: Record<string, {
  getDurationTags: (duration: number) => string[];
  more: string[];
}> = {
  Pass: {
    getDurationTags: (d) => {
      if (d < 4) return ['Quick Pass'];
      if (d > 7) return ['Deep Pass'];
      return [];
    },
    more: [
      'Touchdown', 'Completion', 'Incompletion', 'Interception', 'Sack', 'Flag Pull',
      'Screen Pass', 'Slant', 'Out Route', 'Post Route', 'Go Route', 'Crossing Route', 'Rollout Pass', 'QB Scramble',
      'Shotgun', 'Spread', 'Trips Formation', 'Empty Backfield', 'I-Formation',
      'Red Zone', 'Two-Minute Drill', 'Two-Point Attempt', 'Opening Drive',
    ],
  },

  Run: {
    getDurationTags: (d) => {
      if (d < 3) return ['Quick Run'];
      if (d > 6) return ['Explosive Run'];
      return [];
    },
    more: [
      'Touchdown', 'Big Gain', 'Loss of Yards', 'Flag Pull',
      'Inside Run', 'Outside Run', 'Sweep', 'Reverse', 'QB Run', 'Option Run',
      'Shotgun', 'I-Formation', 'Single Back', 'Wildcat',
      'Red Zone', 'Goal Line', 'Two-Minute Drill', 'Two-Point Attempt',
    ],
  },

  Defense: {
    getDurationTags: (d) => {
      if (d < 3) return ['Quick Stop'];
      if (d > 8) return ['Sustained Drive Allowed'];
      return [];
    },
    more: [
      'Flag Pull', 'Interception', 'Pick Six', 'Sack', 'Forced Incompletion', 'Touchdown Allowed',
      'Blitz', 'Zone Coverage', 'Man Coverage', 'Press Coverage',
      'Cover 2', 'Cover 3', 'Cover 4', 'Man to Man', 'Nickel', 'Prevent Defense',
      'Red Zone Defense', 'Goal Line Stand', 'Two-Minute Defense',
    ],
  },
};

export function suggestTags(playType: string, duration: number): TagSuggestions {
  const entry = TAXONOMY[playType];

  if (!entry) return { auto: [], more: [] };

  return { auto: entry.getDurationTags(duration), more: entry.more };
}
