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
  Palette 
} from '@mui/icons-material';

const CareerAspirationsSection = () => {
  const aspirations = [
    {
      title: 'Empower People',
      description: 'Creating tools and solutions that enable others to achieve their potential',
      icon: People,
    },
    {
      title: 'Creativity',
      description: 'Bringing innovative ideas to life through technology and design',
      icon: Lightbulb,
    },
    {
      title: 'Project Management',
      description: 'Leading teams and projects to successful outcomes',
      icon: ManageAccounts,
    },
    {
      title: 'Playful Approach',
      description: 'Making problem-solving engaging and enjoyable',
      icon: SportsEsports,
    },
    {
      title: '3D Graphics',
      description: 'Creating immersive visual experiences and interactive content',
      icon: ThreeDRotation,
    },
    {
      title: 'Cloud & Machine Learning',
      description: 'Leveraging modern technologies for scalable solutions',
      icon: Cloud,
    },
    {
      title: 'Hands-on Programming',
      description: 'Staying close to the code and implementation details',
      icon: Code,
    },
    {
      title: 'Deployment',
      description: 'Ensuring smooth delivery and operations of software products',
      icon: Rocket,
    },
    {
      title: 'UX Design',
      description: 'Creating user-centered designs that delight and engage',
      icon: Palette,
    },
  ];

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
        What I Am Looking For
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
        I'm passionate about combining technical excellence with human-centered design. 
        Here are the areas where I thrive and what I'm looking for in my next role:
      </Typography>
      <Grid container spacing={3}>
        {aspirations.map((aspiration, index) => {
          const IconComponent = aspiration.icon;
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