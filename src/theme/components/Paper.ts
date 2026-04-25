import { Components } from '@mui/material';

const Paper: Components['MuiPaper'] = {
  styleOverrides: {
    root: {
      backgroundImage: 'none',
      borderRadius: '0.75rem',
    },
  },
};

export default Paper;
