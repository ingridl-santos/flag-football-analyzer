import { ReactNode } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  alpha,
  Box,
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  Chip,
  CommonColors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Palette,
  Paper,
  Skeleton,
  Stack,
  StackProps,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableRowProps,
  TypeAction,
  TypeText,
  Typography,
} from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { theme } from '.';

// Inline color swatch
const Swatch = ({ color }: { color?: string }) => (
  <Box
    sx={{
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '0.25rem',
      backgroundColor: color ?? 'transparent',
      border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
      display: 'inline-block',
    }}
  />
);

// Only the palette colors defined in this project
const colorOptions = ['primary', 'secondary'] as const;
type ThemeColor = typeof colorOptions[number];

const colorArgType = {
  control: 'select' as const,
  options: colorOptions,
};

interface ThemeStoryArgs {
  color?: ThemeColor;
  disabled?: boolean;
}

const meta: Meta<ThemeStoryArgs> = {
  title: 'Theme / Theme',
};

export default meta;
type Story = StoryObj<ThemeStoryArgs>;

// ---------------------------------------------------------------------------
// Shared layout helpers
// ---------------------------------------------------------------------------

const Section = styled(Stack)<StackProps>(() => ({
  padding: '2rem',
  gap: '1.5rem',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
  borderRadius: '0.75rem',
}));

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const typographyVariants = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'subtitle1', 'subtitle2',
  'body1', 'body2',
  'caption', 'overline',
] as const;

const TypographyStory = ({ color }: ThemeStoryArgs) => {
  const getFontSizeLabel = (tv: typeof typographyVariants[number]) => {
    if (tv === 'h1') return '52 / 36 (responsive)';
    const raw = theme.typography[tv].fontSize?.toString();
    if (!raw) return '-';
    if (raw.includes('rem')) return `${Number(raw.replace('rem', '')) * 16}px`;
    return raw;
  };

  return (
    <Stack sx={{ gap: '2rem', width: '60rem', padding: '2rem' }}>
      <Section>
        <Typography variant="h5">Preview</Typography>

        <Stack sx={{ flexDirection: 'row', alignItems: 'center', columnGap: '1.5rem' }}>
          <Typography variant="h1" color={color}>Aa</Typography>

          <Typography variant="h3" color={color}>Aa</Typography>

          <Typography color={color}>
            No subscriptions. No lock-in. Just usable football intelligence.
          </Typography>
        </Stack>
      </Section>

      <Section>
        <Typography variant="h5">All Variants</Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '12rem' }}>Variant</TableCell>

              <TableCell sx={{ width: '12rem' }}>Font size</TableCell>

              <TableCell>Sample</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {typographyVariants.map((tv) => (
              <TableRow key={tv}>
                <TableCell>
                  <Typography variant="body2">{tv}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{getFontSizeLabel(tv)}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant={tv} color={color}>Flag Football Analyzer</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </Stack>
  );
};

export const TypographyStyles: Story = {
  argTypes: { color: colorArgType },
  render: (args) => <TypographyStory {...args} />,
  name: 'Typography',
};

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const ColorTable = ({ variant, children }: { variant: keyof Palette; children: ReactNode }) => (
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: '10rem' }}>{`${variant}/`}</TableCell>

        <TableCell sx={{ width: '5rem' }}>Swatch</TableCell>

        <TableCell>Notes</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>{children}</TableBody>
  </Table>
);

const ColorSection = ({ variant, children }: { variant: keyof Palette; children: ReactNode }) => (
  <Section>
    <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
      {variant}
    </Typography>

    <ColorTable variant={variant}>{children}</ColorTable>
  </Section>
);

const ColorTableRow = (
  {
    name, color, description, ...rest
  }:
  { name: string; color?: string; description?: string } & TableRowProps,
) => (
  <TableRow {...rest}>
    <TableCell sx={{ wordWrap: 'break-word' }}>{name}</TableCell>

    <TableCell><Swatch color={color} /></TableCell>

    <TableCell>{description ?? '-'}</TableCell>
  </TableRow>
);

const colorShades = ['main', 'dark', 'light', 'contrastText'] as const;

const secondaryDescriptions: Record<typeof colorShades[number], string> = {
  main: 'Mid-grey #616161 — AA on white (6.19:1) ✓',
  dark: 'Dark grey #373737 — AAA on all backgrounds ✓',
  light: 'Silver #C0C0C0 — decorative only',
  contrastText: 'White on #616161 = 6.19:1 AA ✓',
};

const secondaryShadeDescription = (shade: typeof colorShades[number]) => secondaryDescriptions[shade];
const actionShades = ['active', 'hover', 'selected', 'disabledBackground', 'focus', 'disabled'] as const;

export const Colors: Story = {
  render: () => (
    <Stack sx={{ padding: '2rem', width: '60rem', gap: '1.5rem' }}>
      <ColorSection variant="primary">
        <ColorTableRow name="main" color={theme.palette.primary.main} description="Gold #C9A227 — brand accent" />

        <ColorTableRow
          name="dark"
          color={theme.palette.primary.dark}
          description="Dark Gold #7A5C00 — AA text on white (6.25:1) ✓"
        />

        <ColorTableRow
          name="light"
          color={theme.palette.primary.light}
          description="Light Gold #DDB94E — decorative only, do not use as text"
        />

        <ColorTableRow
          name="contrastText"
          color={theme.palette.primary.contrastText}
          description="Near-black #121212 on Gold = 8.68:1 AAA ✓"
        />

        <ColorTableRow
          name="hover"
          color={alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)}
          description={`primary.main at action.hoverOpacity (${theme.palette.action.hoverOpacity})`}
        />

        <ColorTableRow
          name="selected"
          color={alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)}
          description={`primary.main at action.selectedOpacity (${theme.palette.action.selectedOpacity})`}
        />
      </ColorSection>

      <ColorSection variant="secondary">
        {colorShades.map((shade) => (
          <ColorTableRow
            key={shade}
            name={shade}
            color={theme.palette.secondary[shade]}
            description={secondaryShadeDescription(shade)}
          />
        ))}
      </ColorSection>

      <ColorSection variant="background">
        <ColorTableRow name="default" color={theme.palette.background.default} description="#F5F5F5 — page background" />

        <ColorTableRow name="paper" color={theme.palette.background.paper} description="#FFFFFF — card / surface background" />
      </ColorSection>

      <ColorSection variant="text">
        {Object.keys(theme.palette.text)
          .sort((a, b) => ['primary', 'secondary', 'disabled'].indexOf(a) - ['primary', 'secondary', 'disabled'].indexOf(b))
          .map((shade) => (
            <ColorTableRow
              key={shade}
              name={shade}
              color={theme.palette.text[shade as keyof TypeText]}
            />
          ))}
      </ColorSection>

      <ColorSection variant="action">
        {actionShades.map((shade) => (
          <ColorTableRow
            key={shade}
            name={shade}
            color={theme.palette.action[shade as keyof TypeAction].toString()}
          />
        ))}
      </ColorSection>

      <ColorSection variant="common">
        {(['white', 'black'] as const).map((shade) => (
          <ColorTableRow
            key={shade}
            name={shade}
            color={theme.palette.common[shade as keyof CommonColors]}
          />
        ))}
      </ColorSection>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Button — all variants including the custom `underlined` nav variant
// ---------------------------------------------------------------------------

export const ButtonStory: Story = {
  name: 'Button',
  argTypes: {
    color: colorArgType,
    disabled: { control: 'boolean' },
  },
  args: { disabled: false },
  render: ({ color, disabled }) => (
    <Stack sx={{ padding: '2rem', gap: '2rem', width: '40rem' }}>
      <Section>
        <Typography variant="h5">Contained · Outlined · Text</Typography>

        <Stack sx={{ flexDirection: 'row', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" color={color as ButtonProps['color']} disabled={disabled} endIcon={<ChevronRightIcon />}>
            Contained
          </Button>

          <Button variant="outlined" color={color as ButtonProps['color']} disabled={disabled}>
            Outlined
          </Button>

          <Button variant="text" color={color as ButtonProps['color']} disabled={disabled}>
            Text
          </Button>
        </Stack>
      </Section>

      <Section>
        <Typography variant="h5">Custom: underlined</Typography>

        <Typography variant="body2" color="text.secondary">
          Used for navigation items. Shows an animated underline when
          when aria-current=&quot;page&quot; is set.
        </Typography>

        <Stack sx={{ flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
          <Button variant="underlined" color={color as ButtonProps['color']} disabled={disabled}>
            Inactive
          </Button>

          <Button variant="underlined" aria-current="page" color={color as ButtonProps['color']} disabled={disabled}>
            Active page
          </Button>
        </Stack>
      </Section>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

export const ButtonGroupStory: Story = {
  name: 'ButtonGroup',
  argTypes: {
    color: colorArgType,
    disabled: { control: 'boolean' },
  },
  args: { disabled: false },
  render: ({ color, disabled }) => (
    <Stack sx={{ padding: '2rem', gap: '2rem', width: '40rem' }}>
      <Section>
        <Typography variant="h5">Contained · Outlined · Text</Typography>

        <Stack sx={{ gap: '1rem' }}>
          {(['contained', 'outlined', 'text'] as const).map((variant) => (
            <ButtonGroup key={variant} variant={variant} color={color as ButtonGroupProps['color']} disabled={disabled}>
              <Button>Offense</Button>

              <Button>Defense</Button>

              <Button>Special</Button>
            </ButtonGroup>
          ))}
        </Stack>
      </Section>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Paper — custom border-radius (0.75rem)
// ---------------------------------------------------------------------------

export const PaperStory: Story = {
  name: 'Paper',
  render: () => (
    <Stack
      sx={{
        padding: '2rem', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap',
      }}
    >
      {([0, 1, 2, 4, 8, 16, 24] as const).map((elevation) => (
        <Paper key={elevation} elevation={elevation} sx={{ padding: '1.5rem 2rem' }}>
          <Typography variant="body2" color="text.secondary">elevation</Typography>

          <Typography variant="h5">{elevation}</Typography>
        </Paper>
      ))}
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Skeleton — wave animation (default override)
// ---------------------------------------------------------------------------

export const SkeletonStory: Story = {
  name: 'Skeleton',
  render: () => (
    <Stack sx={{ padding: '2rem', gap: '1.5rem', width: '24rem' }}>
      <Section>
        <Typography variant="h5">Wave animation (default)</Typography>

        <Stack sx={{ flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
          <Skeleton variant="circular" width="3rem" height="3rem" />

          <Stack sx={{ gap: '0.5rem', flex: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

            <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: '60%' }} />
          </Stack>
        </Stack>

        <Skeleton variant="rounded" width="100%" height="8rem" />
      </Section>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Chip — default color: primary
// ---------------------------------------------------------------------------

export const ChipStory: Story = {
  name: 'Chip',
  argTypes: { color: colorArgType },
  render: ({ color }) => (
    <Stack sx={{ padding: '2rem', gap: '2rem', width: '40rem' }}>
      <Section>
        <Typography variant="h5">Filled · Outlined</Typography>

        <Stack sx={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label="Offense" color={color ?? 'primary'} />

          <Chip label="Air" color={color ?? 'primary'} variant="outlined" />

          <Chip label="Quick" color={color ?? 'primary'} onDelete={() => {}} />
        </Stack>
      </Section>

      <Section>
        <Typography variant="h5">Size: small</Typography>

        <Stack sx={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label="Offense" size="small" color={color ?? 'primary'} />

          <Chip label="Air" size="small" color={color ?? 'primary'} variant="outlined" />

          <Chip label="Quick" size="small" color={color ?? 'primary'} onDelete={() => {}} />
        </Stack>
      </Section>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Dialog — rounded corners (0.5rem), DialogTitle defaults to h2 variant
// ---------------------------------------------------------------------------

export const DialogStory: Story = {
  name: 'Dialog',
  render: () => (
    <Stack sx={{ padding: '2rem', gap: '2rem', width: '40rem' }}>
      <Section>
        <Typography variant="h5">Dialog (static, open)</Typography>

        <Dialog
          open
          hideBackdrop
          disablePortal
          disableScrollLock
          disableEnforceFocus
          PaperProps={{ sx: { position: 'relative' } }}
        >
          <DialogTitle>
            Delete segment?
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2">
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined">Cancel</Button>

            <Button variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Section>
    </Stack>
  ),
};
