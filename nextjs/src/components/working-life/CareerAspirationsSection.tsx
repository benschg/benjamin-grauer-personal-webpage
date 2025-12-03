'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  People,
  Lightbulb,
  ManageAccounts,
  SportsEsports,
  ThreeDRotation,
  Cloud,
  Code,
  Rocket,
  Palette,
} from '@mui/icons-material';
import { careerAspirations, careerAspirationsIntro, careerAspirationsSectionContent } from './content';

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  People,
  Lightbulb,
  ManageAccounts,
  SportsEsports,
  ThreeDRotation,
  Cloud,
  Code,
  Rocket,
  Palette,
};

const CareerAspirationsSection = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 2,
          color: 'text.primary',
        }}
      >
        {careerAspirationsSectionContent.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1rem',
          lineHeight: 1.7,
          mb: 4,
          color: 'text.secondary',
        }}
      >
        {careerAspirationsIntro}
      </Typography>
      <Grid container spacing={3}>
        {careerAspirations.map((aspiration, index) => {
          const IconComponent = iconMap[aspiration.icon] || People;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 2,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <IconComponent
                    sx={{
                      fontSize: '2.5rem',
                      color: 'primary.main',
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    {aspiration.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.5,
                    }}
                  >
                    {aspiration.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CareerAspirationsSection;
