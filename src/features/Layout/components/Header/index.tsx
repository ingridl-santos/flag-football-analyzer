import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
      <Stack direction="row" alignItems="center" gap="0.5rem">
        <SportsFootballIcon color="primary" />

        <Typography variant="h5" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Header;
