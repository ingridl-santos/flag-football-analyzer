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
      paddingX: 3,
      paddingY: 1,
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      fontWeight: 'bold',
      borderRadius: '0 0 4px 0',
      '&:focus': {
        top: 0,
      },
    }}
  >
    {children}
  </Link>
);

export default SkipLink;
