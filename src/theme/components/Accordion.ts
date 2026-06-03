import { Components } from '@mui/material';

const Accordion: Components['MuiAccordion'] = {
  defaultProps: {
    disableGutters: true,
    elevation: 0,
  },
  styleOverrides: {
    root: {
      backgroundColor: 'transparent',
      border: 'none',
      '&::before': {
        display: 'none',
      },
    },
  },
};

export default Accordion;
