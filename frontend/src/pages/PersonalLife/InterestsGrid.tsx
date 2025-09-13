import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Paper } from '@mui/material';
import { interests } from './data/interestsData';

const InterestsGrid = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 1,
          color: 'text.primary',
        }}
      >
        My Interests
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 4,
          fontSize: '1.1rem',
          fontStyle: 'italic',
        }}
      >
        "Naturally there is much more about me than sports"
      </Typography>

      <Grid container spacing={3}>
        {interests.map((interest) => (
          <Grid key={interest.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 200,
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                }}
                image={interest.image}
                alt={interest.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      mr: 2,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {React.createElement(interest.icon)}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                    }}
                  >
                    {interest.title}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {interest.description}
                </Typography>

                {interest.quote && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: 'primary.light',
                      borderLeft: 4,
                      borderColor: 'primary.main',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        color: 'primary.dark',
                        fontWeight: 500,
                      }}
                    >
                      "{interest.quote}"
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InterestsGrid;
