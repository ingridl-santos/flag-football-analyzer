import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  AppBarProps,
  Button,
  Container,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import AppLogo from '../../../../components/AppLogo';
import { ROUTES } from '../../../../router/routeDefinitions';
import { toNamedRoute } from '../../../../router/router';
import type { MenuEntry } from '../../types/MenuEntry';

export interface HeaderProps extends AppBarProps {
  title: string;
  menuEntries: Array<MenuEntry>;
  onMenuButtonClick: () => void;
}

export default function Header({
  title,
  menuEntries,
  onMenuButtonClick,
  ...rest
}: HeaderProps) {
  const { t } = useTranslation('common');

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <AppBar
      {...rest}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '2px solid',
        borderColor: 'primary.main',
        ...rest.sx,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Stack direction="row" alignItems="inherit" gap="1rem">
            <Stack direction="row" gap="0.5rem" sx={{ alignItems: 'center' }}>
              {(isMobile || isTablet) && Boolean(menuEntries.length) && (
                <IconButton
                  aria-label={t('header.openMenu')}
                  color="inherit"
                  onClick={onMenuButtonClick}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Button
                component={RouterLink}
                color="inherit"
                to={toNamedRoute(ROUTES.gameFootage)}
                sx={{ minWidth: 'unset', paddingX: 0, gap: '0.5rem' }}
                aria-label={title ?? undefined}
              >
                <AppLogo width="1.5rem" height="1.5rem" />

                <Typography variant="h5" component="span" fontWeight="bold">
                  {title ?? <Skeleton width="12rem" />}
                </Typography>
              </Button>
            </Stack>

            {isDesktop && Boolean(menuEntries.length) && (
              <Stack direction="row" gap="0.5rem">
                {menuEntries.map((entry) => (
                  <Button
                    key={entry.id}
                    color="inherit"
                    variant="underlined"
                    aria-current={entry.active ? 'page' : undefined}
                    component={entry.to ? RouterLink : Link}
                    to={entry.to ? entry.to : undefined}
                    href={entry.href ? entry.href : undefined}
                    disabled={entry.disabled}
                  >
                    {entry.label ?? <Skeleton width="4rem" />}
                  </Button>
                ))}
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
