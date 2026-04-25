import { Components } from '@mui/material';

const AppBar: Components['MuiAppBar'] = {
  defaultProps: {
    elevation: 0,
    position: 'static',
    color: 'inherit',
  },
  styleOverrides: {
    root: {
      justifyContent: 'center',
      height: 'auto',
    },
  },
};

export default AppBar;
