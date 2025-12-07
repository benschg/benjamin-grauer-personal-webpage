'use client';

import { Box, Typography, Container, Paper, Grid, IconButton } from '@mui/material';
import { LocationOn, Email, GitHub } from '@mui/icons-material';
import { sharedProfile } from '@/data/shared-profile';
import StravaIcon from '@/components/icons/StravaIcon';
import SteamIcon from '@/components/icons/SteamIcon';

const PersonalHero = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/personal-life/hero-background-ai.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 900,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Personal Life
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                mb: 3,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontStyle: 'italic',
              }}
            >
              Beyond the Professional World
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Life is about balance, growth, and pursuing passions that fuel the soul. From extreme
              sports to quiet moments with family, every experience shapes who we are.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Get in Touch
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Zürich, Switzerland
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#555' }}>
                  benjamin@benjamingrauer.ch
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <IconButton
                  href={sharedProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#333' }}
                >
                  <GitHub />
                </IconButton>
                <IconButton
                  href={sharedProfile.strava}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#fc4c02' }}
                >
                  <StravaIcon />
                </IconButton>
                <IconButton
                  href={sharedProfile.steam}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#1b2838' }}
                >
                  <SteamIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 8,
          fontSize: '0.6rem',
          opacity: 0.5,
          zIndex: 1,
        }}
      >
        Background image AI-enhanced
      </Typography>
    </Box>
  );
};

export default PersonalHero;
