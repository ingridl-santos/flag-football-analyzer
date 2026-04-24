import { Components } from '@mui/material';

const CssBaseline: Components['MuiCssBaseline'] = {
  styleOverrides: {
    html: {
      overflowY: 'scroll',

      // We don't want to apply a hidden overflowX in Storybook
      // because it breaks the Storybook UI
      '&:not(:has(#storybook-root))': {
        overflowX: 'hidden',
      },

      '&, body': {
        minHeight: '100dvh',
      },
    },

    ':root': {
      '--focus-outline-color': 'currentColor',
      '--focus-outline-offset': '0.125rem',
      '--focus-outline-style': 'dashed',
      '--focus-outline-width': '0.125rem',
    },

    [`*:focus-visible,
    .Mui-focusVisible,
    .MuiInputBase-root.Mui-focused:not(.MuiOutlinedInput-root, .MuiInput-underline),
    .MuiButtonBase-root.Mui-focusVisible,
    .MuiTableRow-root.MuiTableRow-clickable:focus-visible`]: {
      outlineColor: 'var(--variant-outlinedColor, --focus-outline-color)',
      outlineOffset: 'var(--focus-outline-offset)',
      outlineStyle: 'var(--focus-outline-style)',
      outlineWidth: 'var(--focus-outline-width)',
    },
  },
};

export default CssBaseline;
