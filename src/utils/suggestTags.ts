export interface TagSuggestions {
  /** Tags inferred purely from duration + play type. Shown highlighted as auto-detected. */
  auto: string[];
  /** Full list of contextually relevant suggestions for manual selection. */
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
      // Results
      'Touchdown', 'Completion', 'Incompletion', 'Interception', 'Sack', 'Flag Pull',
      // Refinements
      'Screen Pass', 'Slant', 'Out Route', 'Post Route', 'Go Route', 'Crossing Route', 'Rollout Pass', 'QB Scramble',
      // Formations
      'Shotgun', 'Spread', 'Trips Formation', 'Empty Backfield', 'I-Formation',
      // Situational
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
      // Results
      'Touchdown', 'Big Gain', 'Loss of Yards', 'Flag Pull',
      // Refinements
      'Inside Run', 'Outside Run', 'Sweep', 'Reverse', 'QB Run', 'Option Run',
      // Formations
      'Shotgun', 'I-Formation', 'Single Back', 'Wildcat',
      // Situational
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
      // Results
      'Flag Pull', 'Interception', 'Pick Six', 'Sack', 'Forced Incompletion', 'Touchdown Allowed',
      // Refinements
      'Blitz', 'Zone Coverage', 'Man Coverage', 'Press Coverage',
      // Formations
      'Cover 2', 'Cover 3', 'Cover 4', 'Man to Man', 'Nickel', 'Prevent Defense',
      // Situational
      'Red Zone Defense', 'Goal Line Stand', 'Two-Minute Defense',
    ],
  },
};

export function suggestTags(playType: string, duration: number): TagSuggestions {
  const entry = TAXONOMY[playType];

  if (!entry) return { auto: [], more: [] };

  return { auto: entry.getDurationTags(duration), more: entry.more };
}
