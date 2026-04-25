import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { suggestTags } from '../../../../utils/suggestTags';

export interface TagSuggestionsProps {
  playType: string;
  duration: number;
  existingTags: string[];
  onAddTag: (tag: string) => void;
}

const VISIBLE_MORE = 4;

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

  const visibleMore = availableMore.slice(0, VISIBLE_MORE);
  const hiddenMore = availableMore.slice(VISIBLE_MORE);

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

        {visibleMore.map((tag) => (
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

      {hiddenMore.length > 0 && (
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
            '&::before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon fontSize="small" />}
            sx={{
              minHeight: 'unset',
              padding: 0,
              width: 'fit-content',
              '& .MuiAccordionSummary-content': { margin: 0 },
              '& .MuiAccordionSummary-expandIconWrapper': { marginLeft: '0.125rem' },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('tagSuggestionsShowMore', { count: hiddenMore.length })
                ?? <Skeleton width="5rem" />}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ padding: 0, paddingTop: '0.25rem' }}>
            <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.25rem' }}>
              {hiddenMore.map((tag) => (
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
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
