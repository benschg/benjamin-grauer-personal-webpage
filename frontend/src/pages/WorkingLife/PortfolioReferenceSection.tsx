import { Box, Typography, Button, Card, CardContent, Grid, Chip } from '@mui/material';
import { ArrowForward, Star, Code, Brush } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PortfolioReferenceSection = () => {
  const navigate = useNavigate();

  const highlights = [
    {
      icon: <Code sx={{ fontSize: 28 }} />,
      title: 'Medical Software',
      count: '5+ Projects',
      color: '#F44336',
    },
    {
      icon: <Brush sx={{ fontSize: 28 }} />,
      title: 'Game Development',
      count: '10+ Games',
      color: '#9C27B0',
    },
    {
      icon: <Star sx={{ fontSize: 28 }} />,
      title: 'Web Applications',
      count: '15+ Sites',
      color: '#2196F3',
    },
  ];

  return (
    <Box sx={{ py: 6 }}>
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
          See My Work in Action
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 4,
            textAlign: 'center',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          From medical software to game development, explore the projects that showcase my skills
          and passion for creating innovative solutions.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {highlights.map((highlight, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
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
                      }}
                    >
                      {highlight.title}
                    </Typography>
                    <Chip
                      label={highlight.count}
                      size="small"
                      sx={{
                        backgroundColor: `${highlight.color}30`,
                        color: highlight.color,
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/portfolio')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #89665d 0%, #bf9b93 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #a07a6f 0%, #d4afa6 100%)',
                  boxShadow: '0 8px 24px rgba(137, 102, 93, 0.4)',
                },
              }}
            >
              Explore Portfolio
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
            Discover 30+ projects across medical software, games, web development, and more
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default PortfolioReferenceSection;
