'use client';

import { Box, Container, Grid, Typography, Divider, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { SocialLinksGroup, socialLinks, fitnessLinks } from '../social';
import { sharedProfile } from '../../data/shared-profile';

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
              {sharedProfile.location && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  📍 {sharedProfile.location}
                </Typography>
              )}
              {sharedProfile.email && (
                <Typography variant="body2">✉️ {sharedProfile.email}</Typography>
              )}
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
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
            }}
          >
            © 2025 Benjamin Grauer. All rights reserved.
          </Typography>
          <MuiLink
            component={Link}
            href="/privacy-policy"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              '&:hover': {
                color: 'white',
                textDecoration: 'underline',
              },
            }}
          >
            Privacy Policy
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
