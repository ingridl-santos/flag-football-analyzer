import { Components, Theme } from '@mui/material';

const Toolbar: Components<Theme>['MuiToolbar'] = {
  defaultProps: {
    disableGutters: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '4rem',
      height: 'auto',
      [theme.breakpoints.up('md')]: {
        height: '4rem',
      },
    }),
  },
};

export default Toolbar;
