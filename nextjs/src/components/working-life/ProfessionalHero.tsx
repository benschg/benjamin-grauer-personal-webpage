'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import workingLifeContent from '@/data/working-life-content.json';
import { sharedProfile } from '@/data/shared-profile';

const ProfessionalHero = () => {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 900,
                mb: 3,
                color: 'text.primary',
              }}
            >
              {workingLifeContent.hero.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 500,
                mb: 2,
                color: 'primary.main',
              }}
            >
              {sharedProfile.tagline}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'text.secondary',
              }}
            >
              {workingLifeContent.hero.description.split('\n\n').map((paragraph, index) => (
                <span key={index}>
                  {paragraph}
                  {index < workingLifeContent.hero.description.split('\n\n').length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </span>
              ))}
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
          >
            <Box
              component="img"
              src="/Benjamin_Grauer_ProfilePic_2_Transparent_1024.webp"
              alt="Benjamin Grauer Profile Picture"
              sx={{
                width: { xs: 200, sm: 250, md: 300 },
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                padding: '20px 20px 0px 20px',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfessionalHero;
