import { SimplePaletteColorOptions, PaletteOptions } from '@mui/material';
import { Palette } from '@mui/material/styles';

export type ThemeColor = {
  [K in keyof Palette]: Palette[K] extends SimplePaletteColorOptions ? K : never;
}[keyof Palette];

const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#C9A227', // Gold — brand accent, used as button/component background
    dark: '#7A5C00', // Dark Gold — AA-compliant text on white (6.25:1) and #F5F5F5 (5.73:1)
    light: '#DDB94E', // Light Gold — decorative only; never use as text color
    contrastText: '#121212', // Near-black on Gold = 8.68:1 — AAA ✓ (replaces white which was 2.42:1 ✗)
  },
  secondary: {
    main: '#616161', // Mid-grey — AA on white (6.19:1) and #F5F5F5 (5.68:1) ✓
    dark: '#373737', // Dark grey — AAA on all backgrounds
    light: '#C0C0C0', // Silver — decorative only; never use as text color
    contrastText: '#FFFFFF', // White on #616161 = 6.19:1 — AA ✓
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#121212', // Near-black on #F5F5F5 = 17.94:1 — AAA ✓
    secondary: '#4A4A4A', // Dark grey on #F5F5F5 = 8.14:1 — AAA ✓
  },
};

export default palette;
