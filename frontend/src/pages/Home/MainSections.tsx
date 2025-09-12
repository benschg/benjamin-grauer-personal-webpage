import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const MainSections = () => {
  const sections = [
    {
      title: "Working Life",
      description:
        "Professional experience in software development, project management, and technical leadership. Explore my career journey and achievements.",
      link: "/working-life",
      buttonText: "Learn More",
    },
    {
      title: "Personal Life",
      description:
        "Beyond work, I'm a father, triathlete, and someone passionate about sustainable technology and making the world better.",
      link: "/personal-life",
      buttonText: "Learn More",
    },
    {
      title: "Portfolio",
      description:
        "A showcase of my projects spanning 3D animations, software development, web design, and creative endeavors.",
      link: "/portfolio",
      buttonText: "View Projects",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2, md: 3 },
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {sections.map((section, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  p: 1.5,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.3rem", md: "1.5rem" },
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: "text.secondary",
                      lineHeight: 1.5,
                      fontSize: "0.9rem",
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
                      fontSize: "0.9rem",
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
