import { TypographyVariantsOptions } from '@mui/material';

import breakpoints from './breakpoints';

import '@fontsource/roboto/300-italic.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500-italic.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700-italic.css';
import '@fontsource/roboto/700.css';

const typography: TypographyVariantsOptions = {
  allVariants: {
    fontFamily: 'Roboto',
  },
  h1: {
    fontSize: '3.25rem',
    [breakpoints.down('md')]: {
      fontSize: '2.25rem',
    },
    fontWeight: 300,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 300,
  },
  h3: {
    fontSize: '1.5rem',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  h5: {
    fontSize: '1rem',
  },
  h6: {
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  subtitle1: {
    fontSize: '1.375rem',
  },
  subtitle2: {
    fontSize: '1.125rem',
    fontWeight: 'normal',
  },
};

export default typography;
