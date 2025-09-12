import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { SocialLinksGroup } from '../social';
import { socialLinks, fitnessLinks } from '../social/SocialLinksData';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        mt: 'auto',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: '1rem',
                color: 'white',
              }}
            >
              Contact
            </Typography>
            <Box sx={{ color: 'white' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                📍 Blüemliquartier – 8048 Zürich
              </Typography>
              <Typography variant="body2">✉️ benjamin@benjamingrauer.ch</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: '1rem',
                color: 'white',
              }}
            >
              Social & Professional
            </Typography>
            <SocialLinksGroup links={socialLinks} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: '1rem',
                color: 'white',
              }}
            >
              Fitness
            </Typography>
            <SocialLinksGroup links={fitnessLinks} />
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="#"
              sx={{
                color: 'white',
                fontSize: '0.9rem',
                textDecoration: 'none',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              Friends
            </Link>
            <Link
              href="#"
              sx={{
                color: 'white',
                fontSize: '0.9rem',
                textDecoration: 'none',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              Attribution
            </Link>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
            }}
          >
            © 2024 Benjamin Grauer. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
