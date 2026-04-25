import { type SelectChangeEvent, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { PLAY_TYPES } from '../../../../utils/computeTags';

export interface PlayTypeSelectorProps {
  segmentId: string;
  value: string;
  onChange: (id: string, playType: string) => void;
}

export default function PlayTypeSelector({ segmentId, value, onChange }: PlayTypeSelectorProps) {
  const { t } = useTranslation('gameFootage');
  const labelId = `play-type-label-${segmentId}`;

  const handleChange = (e: SelectChangeEvent) => {
    onChange(segmentId, e.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: '9rem' }}>
      <InputLabel id={labelId}>
        {t('playType') ?? <Skeleton width="5rem" />}
      </InputLabel>

      <Select
        labelId={labelId}
        value={value}
        label={t('playType') ?? ''}
        onChange={handleChange}
      >
        <MenuItem value="">
          {t('playTypeNone') ?? <Skeleton width="3rem" />}
        </MenuItem>

        {PLAY_TYPES.map((pt) => (
          <MenuItem key={pt} value={pt}>
            {t(`playTypes.${pt}`) ?? <Skeleton width="4rem" />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
