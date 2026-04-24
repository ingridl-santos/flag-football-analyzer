import { Components } from '@mui/material';

// See https://mui.com/material-ui/react-use-media-query/#client-side-only-rendering
const UseMediaQuery: Components['MuiUseMediaQuery'] = {
  defaultProps: {
    noSsr: true,
  },
};

export default UseMediaQuery;
