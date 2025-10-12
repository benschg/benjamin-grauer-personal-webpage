import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { ArrowBack, PlayArrow, YouTube } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';

// Video data from the YouTube channel
const videos = [
  {
    id: 'abstract-particles',
    title: 'Abstract Particles',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
    thumbnail: '/portfolio/youtube/abstract-particles.jpg',
    description: 'Abstract particle animation exploring dynamic motion',
  },
  {
    id: 'scales-blender',
    title: 'Scales with Blender',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_2',
    thumbnail: '/portfolio/youtube/scales-blender.jpg',
    description: 'Procedural scale patterns created in Blender',
  },
  {
    id: 'diving-reel',
    title: 'Diving Reel by Benjamin',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_3',
    thumbnail: '/portfolio/youtube/diving-reel.jpg',
    description: '3D model and animation of a diving reel',
  },
  {
    id: 'explosive-fluid',
    title: 'Explosive Fluid Simulation',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_4',
    thumbnail: '/portfolio/youtube/explosive-fluid.jpg',
    description: 'Explosive fluid simulation using Blender MantaFlow',
  },
  {
    id: 'strange-sphere',
    title: 'The Strange Sphere in Red Space',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_5',
    thumbnail: '/portfolio/youtube/strange-sphere.jpg',
    description: 'Abstract spherical animation in a red environment',
  },
  {
    id: 'disco-ball',
    title: 'Disco-ball',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_6',
    thumbnail: '/portfolio/youtube/disco-ball.jpg',
    description: 'An endlessly looping animation using Blender',
  },
  {
    id: 'cylinder-madness',
    title: 'Cylinder Madness',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_7',
    thumbnail: '/portfolio/youtube/cylinder-madness.jpg',
    description: 'Experimental animation with cylindrical forms',
  },
  {
    id: 'crazy-wave',
    title: 'The Crazy Wave Animation',
    embedUrl: 'https://www.youtube.com/embed/VIDEO_ID_8',
    thumbnail: '/portfolio/youtube/crazy-wave.jpg',
    description: 'Based on Ducky 3D\'s learning video',
  },
];

const categoryColor = '#E91E63'; // 3D Graphics color

const YouTubeChannelDetail = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/portfolio')}
              sx={{
                mb: 4,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'rgba(137, 102, 93, 0.1)',
                },
              }}
            >
              Back to Portfolio
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box
              sx={{
                mb: 6,
                p: 4,
                borderRadius: 2,
                background:
                  'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                border: '2px solid rgba(137, 102, 93, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: categoryColor,
                  borderRadius: '4px 4px 0 0',
                },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                3D Animations YouTube Channel
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  label="3D Graphics"
                  sx={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}`,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="2018-2024"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.secondary',
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.1rem',
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Creator & Animator
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                A creative YouTube channel featuring a collection of 3D animations, fluid simulations,
                and experimental visual effects created using Blender. The channel demonstrates
                various animation techniques including particle systems, fluid dynamics, abstract
                designs, and looping animations.
              </Typography>

              {/* Channel Links */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<YouTube />}
                  href="https://www.youtube.com/@benjamingrauer"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: '#FF0000',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#CC0000',
                    },
                  }}
                >
                  View Channel
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Videos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                mb: 4,
                color: 'text.primary',
              }}
            >
              Featured Videos
            </Typography>

            <Grid container spacing={3}>
              {videos.map((video, index) => (
                <Grid key={video.id} size={{ xs: 12, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background:
                          'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                        border: '1px solid rgba(137, 102, 93, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          borderColor: categoryColor,
                        },
                      }}
                    >
                      {/* Video Thumbnail/Embed Placeholder */}
                      <CardMedia
                        sx={{
                          height: 240,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: categoryColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                      </CardMedia>

                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {video.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.6,
                          }}
                        >
                          {video.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Technologies & Techniques
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Blender', 'MantaFlow', '3D Animation', 'Fluid Simulation', 'Particle Systems'].map(
                  (tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'text.primary',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: `${categoryColor}20`,
                          borderColor: categoryColor,
                        },
                      }}
                    />
                  )
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default YouTubeChannelDetail;
