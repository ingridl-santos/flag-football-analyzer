import ContentCutIcon from '@mui/icons-material/ContentCut';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { AnalysisMode } from '../../../../redux/AnalysisSlice';

export interface ModeToggleProps {
  videoLoaded: boolean;
  mode: AnalysisMode;
  onModeChange?: (mode: AnalysisMode) => void;
}

export default function ModeToggle({ videoLoaded, mode, onModeChange }: ModeToggleProps) {
  const { t } = useTranslation('gameFootage');

  if (!videoLoaded) return null;

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={(_, newMode: AnalysisMode | null) => {
        if (newMode !== null) onModeChange?.(newMode);
      }}
      aria-label={t('modeToggleAriaLabel') ?? 'Analysis mode'}
      size="small"
    >
      <ToggleButton value="cut">
        <ContentCutIcon sx={{ marginRight: '0.5rem', fontSize: '1rem' }} aria-hidden="true" />

        {t('cutMode') ?? <Skeleton width="2rem" />}
      </ToggleButton>

      <ToggleButton value="tag">
        <LocalOfferIcon sx={{ marginRight: '0.5rem', fontSize: '1rem' }} aria-hidden="true" />

        {t('tagMode') ?? <Skeleton width="2rem" />}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
