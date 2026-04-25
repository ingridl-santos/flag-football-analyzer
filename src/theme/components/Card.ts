import { Components, Theme } from '@mui/material';

const Card: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }),
  },
};

export default Card;
