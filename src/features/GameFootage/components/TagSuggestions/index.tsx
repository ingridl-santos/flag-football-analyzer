import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { suggestTags } from '../../../../utils/suggestTags';

export interface TagSuggestionsProps {
  playType: string;
  duration: number;
  existingTags: string[];
  onAddTag: (tag: string) => void;
}

export default function TagSuggestions({
  playType,
  duration,
  existingTags,
  onAddTag,
}: TagSuggestionsProps) {
  const { t } = useTranslation('gameFootage');

  if (!playType) return null;

  const { auto, more } = suggestTags(playType, duration);

  const availableAuto = auto.filter((tag) => !existingTags.includes(tag));
  const availableMore = more.filter((tag) => !existingTags.includes(tag));

  if (availableAuto.length === 0 && availableMore.length === 0) return null;

  return (
    <Stack sx={{ gap: '0.25rem', paddingTop: '0.5rem' }}>
      <Typography variant="caption" color="text.secondary">
        {t('tagSuggestions') ?? <Skeleton width="4rem" />}
      </Typography>

      <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.25rem' }}>
        {availableAuto.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            icon={<AutoAwesomeIcon />}
            onClick={() => onAddTag(tag)}
            aria-label={t('addTagSuggestion', { tag }) ?? `Add ${tag}`}
          />
        ))}

        {availableMore.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            variant="outlined"
            onClick={() => onAddTag(tag)}
            aria-label={t('addTagSuggestion', { tag }) ?? `Add ${tag}`}
          />
        ))}
      </Stack>
    </Stack>
  );
}
