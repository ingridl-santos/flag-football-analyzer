import { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SkipLink from '../../components/SkipLink';

export interface LayoutTemplateProps {
  title: string;
  githubUrl?: string;
  children: ReactNode;
}

const LayoutTemplate = ({ title, githubUrl, children }: LayoutTemplateProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <SkipLink />

    <Header title={title} />

    <Box id="main-content" component="main" sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{ paddingY: '2rem' }}>
        {children}
      </Container>
    </Box>

    <Footer appTitle={title} githubUrl={githubUrl} />
  </Box>
);

export default LayoutTemplate;
