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
    bgcolor="background.paper"
    borderBottom={2}
    borderColor="primary.main"
    py={2}
  >
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" gap={1}>
        <SportsFootballIcon color="primary" />

        <Typography variant="h5" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Header;
