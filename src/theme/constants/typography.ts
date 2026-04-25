import { TypographyVariantsOptions } from '@mui/material';

import breakpoints from './breakpoints';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

const typography: TypographyVariantsOptions = {
  allVariants: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  h1: {
    fontSize: '2rem',
    [breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
};

export default typography;
