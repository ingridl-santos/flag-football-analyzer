import { ReactNode, useEffect, useRef } from 'react';

import { Box, Breadcrumbs, Stack, StackProps } from '@mui/material';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Breadcrumb from '../../../../components/Breadcrumb';
import { BreadcrumbItem } from '../../../../redux/BreadcrumbSlice';
import Footer, { FooterProps } from '../../components/Footer';
import Header, { HeaderProps } from '../../components/Header';
import SkipLink from '../../components/SkipLink';

export interface LayoutTemplateProps extends StackProps {
  slotProps: {
    header: HeaderProps;
    footer?: FooterProps;
  };
  breadcrumbsItems?: BreadcrumbItem[];
  children: ReactNode;
}

export default function LayoutTemplate({
  slotProps,
  breadcrumbsItems,
  children,
  ...rest
}: LayoutTemplateProps) {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  const hasBreadcrumbs = breadcrumbsItems && breadcrumbsItems.length > 0;

  return (
    <Stack
      {...rest}
      sx={{
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        ...rest.sx,
      }}
    >
      <SkipLink href="#main">
        {t('skipToMainContent')}
      </SkipLink>

      <Header {...slotProps.header} />

      <Stack
        ref={scrollableRef}
        sx={{
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {hasBreadcrumbs && (
          <Box
            sx={{
              paddingY: '0.75rem',
              paddingX: '2.25rem',
              borderBottom: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              backgroundColor: (theme) => theme.palette.background.default,
              width: '100%',
              zIndex: 5,
            }}
          >
            <Breadcrumbs aria-label={t('breadcrumbs')}>
              {breadcrumbsItems.map((item, index) => {
                const isLast = index === breadcrumbsItems.length - 1;
                return (
                  <Breadcrumb
                    key={item.label}
                    active={isLast}
                    to={!isLast ? item.to : undefined}
                  >
                    {item.label}
                  </Breadcrumb>
                );
              })}
            </Breadcrumbs>
          </Box>
        )}

        <Stack
          id="main"
          component="main"
          tabIndex={-1}
          sx={{ flexDirection: 'column', flexGrow: 1 }}
        >
          <Container maxWidth="xl" sx={{ paddingY: '2rem' }}>
            {children}
          </Container>
        </Stack>

        <Footer {...slotProps.footer} />
      </Stack>
    </Stack>
  );
}
