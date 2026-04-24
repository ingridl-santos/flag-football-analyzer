import { Components, Theme } from '@mui/material';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    underlined: true;
  }
}

const Button: Components<Theme>['MuiButton'] = {
  variants: [
    {
      props: { variant: 'underlined' },
      style: ({ theme }) => (
        {
          textTransform: 'none',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '0.25rem',
            right: '0.25rem',
            bottom: '0.25rem',
            height: '0.125rem',
            backgroundColor: theme.palette.primary.dark,
            borderRadius: '1rem',
            opacity: 0,
            transform: 'scaleX(0)',
            transition: 'all 0.1s ease',
          },
          '&[aria-current="page"]::after': {
            opacity: 1,
            transform: 'scaleX(1)',
            transition: 'all 0.1s ease',
          },
        }),
    },
  ],
  styleOverrides: {
    root: {
      borderRadius: '0.5rem',
    },
    sizeMedium: {
      lineHeight: '1.5rem',
    },
  },
};

export default Button;
