import type { ArgTypes } from '@storybook/react-vite';
import { theme } from '../src/theme';
import { ThemeColor } from '../src/theme/constants/palette';

export const colorArgType: Partial<ArgTypes<{ color?: ThemeColor }>>['color'] = {
  control: 'select',
  options: [
    ...Object.entries(theme.palette)
      .filter(([_, value]) => Boolean((value as { main?: unknown }).main))
      .map(([key]) => key as ThemeColor),
    undefined,
  ],
};
