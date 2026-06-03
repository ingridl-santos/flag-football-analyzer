import { Components } from '@mui/material';

const AccordionSummary: Components['MuiAccordionSummary'] = {
  styleOverrides: {
    content: {
      // MUI sets a non-zero margin on expand/collapse transitions; override to
      // keep compact inline Accordions flush with surrounding content.
      margin: 0,
    },
  },
};

export default AccordionSummary;
