import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultilineSkelly from '../MultilineSkelly';

export interface ErrorPanelProps {
  image?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function ErrorPanel({
  image,
  actionText,
  onActionClick,
}: ErrorPanelProps) {
  const { t } = useTranslation('errors');

  return (
    <Stack
      sx={{
        maxWidth: '22.5rem',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <Box
        component="img"
        src={image ?? '/assets/errors/generic.svg'}
        alt=""
        sx={{
          width: '8rem',
          height: '8rem',
        }}
      />

      <Typography
        component="h1"
        variant="h5"
      >
        {t('generic.title') ?? <Skeleton sx={{ width: '11rem' }} />}
      </Typography>

      <Typography component="div">
        {t('generic.description') ?? <MultilineSkelly lines={2} lastLineWidth="17rem" centered />}
      </Typography>

      {
        onActionClick && actionText && (
          <Button
            onClick={onActionClick}
          >
            {actionText}
          </Button>
        )
      }
    </Stack>
  );
}
