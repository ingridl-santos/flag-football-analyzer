import GitHubIcon from '@mui/icons-material/GitHub';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';

export interface FooterProps {
  appTitle: string;
  githubUrl?: string;
}

const Footer = ({ appTitle, githubUrl }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '2px solid',
        borderColor: 'primary.main',
        paddingY: '1rem',
      }}
    >
      <Container maxWidth="xl">
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <SportsFootballIcon color="primary" fontSize="small" />

            <Typography variant="body2" color="text.secondary">
              {appTitle}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {`© ${year} ${appTitle}`}
          </Typography>

          {githubUrl && (
            <IconButton
              component="a"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              size="small"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
