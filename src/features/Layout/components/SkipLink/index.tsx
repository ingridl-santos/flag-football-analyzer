import Link from '@mui/material/Link';

const SkipLink = () => (
  <Link
    href="#main-content"
    sx={{
      position: 'absolute',
      top: '-100%',
      left: 0,
      zIndex: 'tooltip',
      px: 3,
      py: 1,
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      fontWeight: 'bold',
      borderRadius: '0 0 4px 0',
      '&:focus': {
        top: 0,
      },
    }}
  >
    Skip to main content
  </Link>
);

export default SkipLink;
