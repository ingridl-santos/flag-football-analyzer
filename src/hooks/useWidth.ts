import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export default function useWidth(): Breakpoint {
  const theme = useTheme();
  const xlMatches = useMediaQuery(theme.breakpoints.only('xl'));
  const lgMatches = useMediaQuery(theme.breakpoints.only('lg'));
  const mdMatches = useMediaQuery(theme.breakpoints.only('md'));
  const smMatches = useMediaQuery(theme.breakpoints.only('sm'));
  const xsMatches = useMediaQuery(theme.breakpoints.only('xs'));

  if (xlMatches) return 'xl';
  if (lgMatches) return 'lg';
  if (mdMatches) return 'md';
  if (smMatches) return 'sm';
  if (xsMatches) return 'xs';
  return 'xs';
}
