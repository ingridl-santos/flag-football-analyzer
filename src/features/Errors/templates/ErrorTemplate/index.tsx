import { Container } from '@mui/material';

import ErrorPanel from '../../../../components/ErrorPanel';

export default function ErrorTemplate() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10rem',
        paddingBottom: '10rem',
        maxWidth: '22.5rem',
      }}
    >
      <ErrorPanel />
    </Container>
  );
}
