import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface ErrorPanelProps {
  image?: string;
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function ErrorPanel({
  image,
  title,
  description,
  actionText,
  onActionClick,
}: ErrorPanelProps) {
  const { t } = useTranslation('errors');

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={3}
      sx={{
        maxWidth: '22.5rem',
        textAlign: 'center',
      }}
    >
      <img
        src={image ?? '/assets/errors/generic.svg'}
        alt=""
        style={{
          width: '8rem',
          height: '8rem',
        }}
      />

      <Typography
        component="h1"
        variant="h5"
      >
        { title ?? t('generic.title') }
      </Typography>

      <Typography>
        { description ?? t('generic.description') }
      </Typography>

      {
        onActionClick && actionText && (
          <Button
            onClick={onActionClick}
          >
            { actionText }
          </Button>
        )
      }
    </Stack>
  );
}
