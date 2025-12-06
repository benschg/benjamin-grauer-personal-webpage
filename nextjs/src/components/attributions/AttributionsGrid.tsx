'use client';

import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { OpenInNew, Code } from '@mui/icons-material';
import { attributions } from '@/data/attributionsData';

const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <Box
        sx={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Code sx={{ fontSize: 64, color: 'grey.400' }} />
      </Box>
    );
  }

  return (
    <CardMedia
      component="img"
      sx={{
        height: 160,
        objectFit: 'contain',
        backgroundColor: '#f5f5f5',
        p: 2,
      }}
      image={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};

const AttributionsGrid = () => {
  if (attributions.length === 0) {
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
          Open Source Attributions
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: '1.1rem',
          }}
        >
          No attributions added yet.
        </Typography>
      </Box>
    );
  }

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
        Open Source Attributions
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
        Thank you to all the amazing open source projects that made this website possible
      </Typography>

      <Grid container spacing={3}>
        {attributions.map((attribution) => (
          <Grid key={attribution.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
              <ImageWithFallback src={attribution.image} alt={attribution.name} />

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {attribution.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {attribution.description}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  href={attribution.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNew />}
                  sx={{ textTransform: 'none' }}
                >
                  Visit Project
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AttributionsGrid;
