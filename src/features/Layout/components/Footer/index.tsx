import GitHubIcon from '@mui/icons-material/GitHub';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface FooterProps {
  appTitle: string;
  githubUrl?: string;
}

const Footer = ({ appTitle, githubUrl }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      bgcolor="background.paper"
      borderTop={2}
      borderColor="primary.main"
      py={2}
    >
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1}>
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
