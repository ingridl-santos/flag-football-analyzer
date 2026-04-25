import { useState } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { parseYoutubeUrl } from '../../../../utils/parseYoutubeUrl';

export interface YouTubeUrlInputProps {
  onSubmit: (videoId: string) => void;
}

export default function YouTubeUrlInput({ onSubmit }: YouTubeUrlInputProps) {
  const { t } = useTranslation('gameFootage');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const videoId = parseYoutubeUrl(url);

    if (!videoId) {
      setError(true);

      return;
    }

    onSubmit(videoId);
    setUrl('');
    setError(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);

    if (error) setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Stack sx={{ flexDirection: 'row', gap: '0.75rem', alignItems: 'flex-start' }}>
      <TextField
        label={t('youtubeUrlLabel') ?? 'YouTube URL'}
        placeholder={t('youtubeUrlPlaceholder') ?? 'https://youtube.com/watch?v=...'}
        value={url}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        error={error}
        helperText={error ? (t('youtubeUrlInvalid') ?? 'Please enter a valid YouTube URL') : ' '}
        size="small"
        sx={{ flexGrow: 1 }}
        inputProps={{ 'aria-label': t('youtubeUrlLabel') ?? 'YouTube URL' }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
      >
        {t('youtubeUrlLoad') ?? 'Load'}
      </Button>
    </Stack>
  );
}
