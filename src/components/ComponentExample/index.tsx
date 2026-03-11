import { useId } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface ComponentExampleProps {
  src?: string;
  alt?: string;
  border?: boolean;
  borderColor?: string;
  borderWidth?: string;
  size?: string;
}

// eslint-disable-next-line max-len, @typescript-eslint/quotes
const defaultImage = `data:image/svg+xml,%3Csvg viewBox='0 0 512 512' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h512v512H0z' fill='%23999' id='path2'/%3E%3Cpath d='M256 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 352c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C367.3 421.4 314.7 448 256 448Z' fill='%23fff' id='path4'/%3E%3C/svg%3E`;

export default function ComponentExample({
  src = defaultImage,
  alt = '',
  border,
  borderColor,
  borderWidth,
  size = '1rem',
}: ComponentExampleProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const exampleId = useId();
  const secondExampleId = useId();

  return (
    <Box
      id={exampleId}
      data-testid="ComponentExample-test-id"
    >
      <img
        id={secondExampleId}
        data-testid="ExampleImg-test-id"
        style={{
          display: 'block',
          borderRadius: '100%',
          boxSizing: 'border-box',
          borderStyle: border ? 'solid' : 'none',
          borderColor: borderColor ?? theme.palette.common.white,
          borderWidth: borderWidth ?? '0.25rem',
          width: size,
          height: size,
        }}
        src={src || defaultImage}
        alt={alt}
      />

      <Typography>
        { t('exampleString') }
      </Typography>
    </Box>
  );
}
