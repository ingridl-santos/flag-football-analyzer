import { ReactNode } from 'react';

import { Stack, StackProps } from '@mui/material';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';

import Footer, { FooterProps } from '../../components/Footer';
import Header, { HeaderProps } from '../../components/Header';
import SkipLink from '../../components/SkipLink';

export interface LayoutTemplateProps extends StackProps {
  slotProps: {
    header: HeaderProps;
    footer?: FooterProps;
  };
  children: ReactNode;
}

export default function LayoutTemplate({
  slotProps,
  children,
  ...rest
}: LayoutTemplateProps) {
  const { t } = useTranslation('common');

  return (
    <Stack
      direction="column"
      {...rest}
      sx={{
        minHeight: '100vh',
        ...rest.sx,
      }}
    >
      <SkipLink href="#main">
        {t('skipToMainContent')}
      </SkipLink>

      <Header {...slotProps.header} />

      <Stack
        id="main"
        component="main"
        direction="column"
        sx={{ flexGrow: 1 }}
      >
        <Container maxWidth="xl" sx={{ paddingY: '2rem' }}>
          {children}
        </Container>
      </Stack>

      <Footer {...slotProps.footer} />
    </Stack>
  );
}
