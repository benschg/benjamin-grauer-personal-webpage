import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';

const MainSections = () => {
  const sections = [
    {
      title: 'Working Life',
      description:
        'Professional experience in software development, project management, and technical leadership. Explore my career journey and achievements.',
      link: '/working-life',
      buttonText: 'Learn More',
      image: '/welcome/work_01.webp',
      imageAlt: 'Benjamin Grauer - Professional',
    },
    {
      title: 'Personal Life',
      description:
        "Beyond work, I'm a father, triathlete, and someone passionate about sustainable technology and making the world better.",
      link: '/personal-life',
      buttonText: 'Learn More',
      image: '/welcome/personal_01.webp',
      imageAlt: 'Benjamin Grauer - Personal',
    },
    {
      title: 'Portfolio',
      description:
        'A showcase of my projects spanning 3D animations, software development, web design, and creative endeavors.',
      link: '/portfolio',
      buttonText: 'View Projects',
      image: '/welcome/portfolio_01.webp',
      imageAlt: 'Benjamin Grauer - Portfolio',
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 3 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={3} sx={{ justifyContent: 'center', justifyItems: 'center' }}>
          {sections.map((section, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <Card
                onClick={() => (window.location.href = section.link)}
                sx={{
                  height: '100%',
                  minHeight: '350px',
                  maxWidth: '360px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifySelf: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                {/* Profile Image */}
                <CardMedia
                  component="img"
                  sx={{
                    height: 400,
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    backgroundColor: 'background.paper',
                  }}
                  image={section.image}
                  alt={section.imageAlt}
                />

                <CardContent sx={{ flexGrow: 1, px: 2 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.3rem', md: '1.5rem' },
                      mb: 2,
                      mt: 1,
                      color: 'text.primary',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      lineHeight: 1.5,
                      fontSize: '0.9rem',
                    }}
                  >
                    {section.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1 }}>
                  <Button
                    variant="contained"
                    href={section.link}
                    color="primary"
                    sx={{
                      fontSize: '0.9rem',
                    }}
                  >
                    {section.buttonText}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainSections;
