import Link from '@mui/material/Link';
import { ReactNode } from 'react';

export interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

const SkipLink = ({ href, children }: SkipLinkProps) => (
  <Link
    href={href}
    sx={{
      position: 'absolute',
      top: '-100%',
      left: 0,
      zIndex: 'tooltip',
      paddingX: '1.5rem',
      paddingY: '0.5rem',
      backgroundColor: (theme) => theme.palette.primary.main,
      color: (theme) => theme.palette.primary.contrastText,
      fontWeight: 700,
      borderRadius: '0 0 0.25rem 0',
      '&:focus': {
        top: 0,
      },
    }}
  >
    {children}
  </Link>
);

export default SkipLink;
