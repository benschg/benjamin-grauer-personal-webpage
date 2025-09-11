import { Box, Typography, Grid, Card, CardContent, Chip, Stack } from '@mui/material';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Core Skills',
      skills: ['Team Building', 'Project Management', 'Creative Learning', 'Prototyping', '3D Graphics'],
    },
    {
      title: 'Languages',
      skills: ['German (Native)', 'English (Proficient)', 'French (Casual)'],
    },
    {
      title: 'Gallup Top 5 Strengths',
      skills: ['Individualization', 'Ideation', 'Learner', 'Input', 'Positivity'],
    },
    {
      title: 'Methods & Achievements',
      skills: ['Scrum', 'Agile', 'Team Building', 'Technical Leadership', 'Product Development'],
    },
    {
      title: 'Technical Tools',
      skills: ['Development Tools', 'DevOps Engineering', 'Cloud Development', '3D & Graphics', 'Systems Management'],
    },
    {
      title: 'Programming',
      skills: ['Full-Stack Development', 'Cloud & Machine Learning', 'UX Design', 'Deployment', 'Hands-on Programming'],
    },
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 3,
          color: 'text.primary',
        }}
      >
        Skills & Expertise
      </Typography>
      <Grid container spacing={3}>
        {skillCategories.map((category, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              sx={{
                height: '100%',
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {category.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {category.skills.map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.main',
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SkillsSection;