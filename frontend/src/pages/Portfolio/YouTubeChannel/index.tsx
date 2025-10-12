import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, PlayArrow, YouTube } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';

const categoryColor = '#E91E63'; // 3D Graphics color

// Option 1: Use channel ID (fetches latest 15 videos from entire channel)
const CHANNEL_ID = 'UCbQQZ-l8i8fVEI8gGQO6CqA'; // @benschg channel ID

// Option 2: Use playlist ID (fetches from specific playlist)
const PLAYLIST_ID = 'PLQfp_fHFd7QuM3X2Ve3cI3Qwaee3NmlmE'; // Your 3D animations playlist

interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
}

const YouTubeChannelDetail = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Choose between channel or playlist RSS feed
        const rssUrl = PLAYLIST_ID
          ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`
          : `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

        console.log('Fetching from:', rssUrl);

        // Use a CORS proxy to fetch the RSS feed from the client
        // Add timestamp to prevent caching
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const cacheBuster = `&_=${Date.now()}`;
        const response = await fetch(proxyUrl + encodeURIComponent(rssUrl) + cacheBuster, {
          cache: 'no-store', // Prevent browser caching
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }

        const data = await response.json();
        const xmlText = data.contents;

        console.log('Received XML length:', xmlText?.length);

        // Parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          console.error('XML parsing error:', parserError.textContent);
          throw new Error('Failed to parse RSS feed');
        }

        const entries = xmlDoc.querySelectorAll('entry');
        console.log('Found entries:', entries.length);

        const fetchedVideos: Video[] = Array.from(entries).map((entry) => {
          const videoId = entry.querySelector('videoId, yt\\:videoId')?.textContent || '';
          const title = entry.querySelector('title')?.textContent || 'Untitled';
          const description =
            entry.querySelector('media\\:description, description')?.textContent || '';
          const publishedAt = entry.querySelector('published')?.textContent || '';

          console.log('Parsed video:', { videoId, title: title.substring(0, 30) });

          return {
            id: videoId,
            videoId,
            title,
            description,
            publishedAt,
          };
        });

        setVideos(fetchedVideos);

        if (fetchedVideos.length === 0) {
          setError('No videos found. Please check the channel or playlist ID.');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(`Failed to load videos: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
                  href="https://www.youtube.com/@benschg"
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
              Recent Videos
            </Typography>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: categoryColor }} />
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {/* Videos Grid */}
            {!loading && !error && (
              <Grid container spacing={3}>
                {videos.map((video, index) => (
                <Grid key={video.id} size={{ xs: 12, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card
                      component="a"
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        height: '100%',
                        background:
                          'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                        border: '1px solid rgba(137, 102, 93, 0.3)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'block',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          borderColor: categoryColor,
                          '& .play-button': {
                            transform: 'translate(-50%, -50%) scale(1.1)',
                            backgroundColor: '#FF0000',
                          },
                        },
                      }}
                    >
                      {/* YouTube Thumbnail */}
                      <Box sx={{ position: 'relative', height: 240 }}>
                        <CardMedia
                          component="img"
                          image={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                          alt={video.title}
                          sx={{
                            height: 240,
                            objectFit: 'cover',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                          }}
                        />

                        {/* Play Button Overlay */}
                        <Box
                          className="play-button"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: categoryColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 48, color: 'white', ml: 0.5 }} />
                        </Box>
                      </Box>

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
            )}
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
