import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Container,
  ContainerProps,
  IconButton,
  Link,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import AppLogo from '../../../../components/AppLogo';

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecorationColor: theme.palette.text.secondary,
  textAlign: 'center',
  '&:has(.MuiSkeleton-root)': {
    textDecoration: 'none',
  },
}));

export type FooterProps = Omit<ContainerProps, 'component' | 'children'> & {
  githubUrl?: string;
};

export default function Footer({ githubUrl, ...rest }: FooterProps) {
  const { t } = useTranslation('common');

  return (
    <Container
      component="footer"
      maxWidth="xl"
      {...rest}
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: '2px solid',
        borderColor: (theme) => theme.palette.primary.main,
        paddingY: '1.5rem',
        ...rest.sx,
      }}
    >
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <AppLogo width="1.5rem" height="1.5rem" aria-hidden="true" />

          <Typography variant="body2" color="text.secondary">
            {t('appTitle') ?? <Skeleton width="10rem" />}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {t('footer.copyright', { year: new Date().getFullYear() })
            ?? <Skeleton width="14rem" />}
        </Typography>

        {githubUrl && (
          <FooterLink
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <IconButton
              component="span"
              aria-label={t('footer.viewOnGitHub') ?? 'View on GitHub'}
              size="small"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>

            <Typography variant="body2">
              {t('footer.viewOnGitHub') ?? <Skeleton width="7rem" />}
            </Typography>
          </FooterLink>
        )}
      </Stack>
    </Container>
  );
}
