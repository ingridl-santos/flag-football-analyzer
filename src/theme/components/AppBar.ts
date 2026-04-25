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
      borderRadius: 0,
    },
  },
};

export default AppBar;
