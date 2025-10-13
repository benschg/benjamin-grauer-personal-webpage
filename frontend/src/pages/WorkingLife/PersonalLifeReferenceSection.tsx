import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { ArrowForward, FamilyRestroom, DirectionsRun, Flight, Hiking } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PersonalLifeReferenceSection = () => {
  const navigate = useNavigate();

  const highlights = [
    {
      icon: <FamilyRestroom sx={{ fontSize: 28 }} />,
      title: 'Family & Life',
      description: 'Devoted husband and father',
      color: '#FF6B9D',
    },
    {
      icon: <DirectionsRun sx={{ fontSize: 28 }} />,
      title: 'Sports & Fitness',
      description: 'Triathlon & winter swimming',
      color: '#4CAF50',
    },
    {
      icon: <Flight sx={{ fontSize: 28 }} />,
      title: 'Adventures',
      description: 'Travel, diving & hiking',
      color: '#2196F3',
    },
    {
      icon: <Hiking sx={{ fontSize: 28 }} />,
      title: 'Hobbies',
      description: '3D design, cooking & reading',
      color: '#FF9800',
    },
  ];

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(180deg, rgba(137, 102, 93, 0.05) 0%, rgba(137, 102, 93, 0.15) 100%)',
        borderRadius: 4,
        mt: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Beyond the Professional
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 4,
            textAlign: 'center',
            maxWidth: 700,
            mx: 'auto',
            px: 2,
          }}
        >
          There's more to me than just work! Discover my passions, hobbies, and what drives me outside
          of the professional realm.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4, px: 2 }}>
          {highlights.map((highlight, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${highlight.color}15 0%, ${highlight.color}05 100%)`,
                    border: `2px solid ${highlight.color}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 8px 24px ${highlight.color}40`,
                      borderColor: highlight.color,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: `${highlight.color}20`,
                        color: highlight.color,
                        mb: 2,
                      }}
                    >
                      {highlight.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1rem',
                      }}
                    >
                      {highlight.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {highlight.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/personal-life')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(137, 102, 93, 0.1)',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(137, 102, 93, 0.3)',
                },
              }}
            >
              Explore Personal Life
            </Button>
          </motion.div>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            Discover the person behind the professional
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PersonalLifeReferenceSection;
