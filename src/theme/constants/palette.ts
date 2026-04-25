import { PaletteOptions, SimplePaletteColorOptions } from '@mui/material';
import { Palette } from '@mui/material/styles';

export type ThemeColor = {
  [K in keyof Palette]: Palette[K] extends SimplePaletteColorOptions ? K : never;
}[keyof Palette];

const palette: PaletteOptions = {
  mode: 'light',
  // PRIMARY BRAND
  primary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  // SECONDARY
  secondary: {
    main: '#6B7280',
    light: '#9CA3AF',
    dark: '#4B5563',
    contrastText: '#FFFFFF',
  },
  // NEUTRALS
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // BACKGROUNDS
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF',
  },
  // TEXT
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  // BORDERS / DIVIDERS
  divider: '#E5E7EB',
  // SEMANTIC
  success: {
    main: '#16A34A',
    light: '#22C55E',
    dark: '#15803D',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
    light: '#EF4444',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
};

export default palette;
