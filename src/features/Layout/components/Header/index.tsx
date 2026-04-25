import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import { Box, Container, Stack, Typography } from '@mui/material';

export interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <Box
    component="header"
    sx={{
      backgroundColor: 'background.paper',
      borderBottom: '2px solid',
      borderColor: 'primary.main',
      paddingY: '1rem',
    }}
  >
    <Container maxWidth="xl">
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
        <SportsFootballIcon color="primary" />

        <Typography variant="h5" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Header;
