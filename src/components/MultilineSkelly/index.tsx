import { useMemo } from 'react';

import { Breakpoint, Skeleton, Stack } from '@mui/material';

import useWidth from '../../hooks/useWidth';
import { resolveResponsive } from '../../utils/responsive';

type ResponsiveValue<T> = Partial<Record<Breakpoint, T>>;

export interface MultilineSkellyProps {
  centered?: boolean | ResponsiveValue<boolean>;
  lines?: number | ResponsiveValue<number>;
  lastLineWidth?: string | ResponsiveValue<string>;
}

export default function MultilineSkelly({
  centered,
  lines = 1,
  lastLineWidth,
}: MultilineSkellyProps) {
  const breakpoint = useWidth();

  const linesToShow = useMemo(
    () => (typeof lines === 'number' ? lines : resolveResponsive(lines, breakpoint) ?? 1),
    [breakpoint, lines],
  );

  const isCentered = useMemo(
    () => (typeof centered === 'boolean' ? centered : resolveResponsive(centered ?? {}, breakpoint) ?? false),
    [breakpoint, centered],
  );

  const skeletons = Array.from({ length: linesToShow }).map((_, index) => (
    <Skeleton
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      sx={{
        width: '100%',
        maxWidth: index === linesToShow - 1 ? lastLineWidth : undefined,
      }}
    />
  ));

  if (isCentered) {
    return (
      <Stack
        sx={{ alignItems: 'center', width: '100%' }}
      >
        {skeletons}
      </Stack>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{skeletons}</>;
}
