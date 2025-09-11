import { Box, Container, Typography, Grid } from '@mui/material';

const ProfessionalHero = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
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
              Working Life
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
              Software Development & Management Professional
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                lineHeight: 1.7,
                mb: 3,
                color: 'text.secondary',
              }}
            >
              Ever since I discovered programming, I felt the urge to play, craft, create. 
              I grew with VirtaMed, trained medical residents around the world, and led multiple 
              technical teams to deliver innovative solutions.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'text.secondary',
              }}
            >
              My passion lies in empowering people through technology, combining creativity 
              with technical excellence to solve complex problems and build meaningful products.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfessionalHero;