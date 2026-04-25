import { Box, BoxProps, Link, LinkProps, Theme, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbProps extends BoxProps {
  active?: boolean;
  icon?: ReactNode;
  to?: string;
  LinkProps?: Omit<LinkProps, 'children' | 'sx'>;
}

const baseStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: (theme: Theme) => theme.palette.text.primary,

  '.MuiSvgIcon-root': {
    fontSize: 'inherit',
  },
} as const;

const linkStyles = {
  ...baseStyles,
  '.MuiSvgIcon-root': {
    ...baseStyles['.MuiSvgIcon-root'],
    color: (theme: Theme) => theme.palette.action.active,
  },
} as const;

export default function Breadcrumb({
  active,
  icon,
  children,
  to,
  LinkProps: linkProps,
  ...rest
}: BreadcrumbProps) {
  if (!active && to) {
    return (
      <Box {...rest}>
        <Link
          underline="hover"
          component={RouterLink}
          to={to}
          sx={linkStyles}
        >
          {icon}

          {children}
        </Link>
      </Box>
    );
  }

  if (!active && linkProps?.href) {
    return (
      <Box {...rest}>
        <Link
          underline="hover"
          {...linkProps}
          sx={linkStyles}
        >
          {icon}

          {children}
        </Link>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <Typography sx={baseStyles}>
        {icon}

        {children}
      </Typography>
    </Box>
  );
};
