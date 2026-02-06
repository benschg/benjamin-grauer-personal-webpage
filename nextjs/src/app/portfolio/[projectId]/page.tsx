'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  GitHub,
  Launch,
  Description,
  CalendarToday,
  Group,
  CheckCircle,
  Schedule,
  Archive,
  PlayArrow,
  YouTube,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { portfolioProjects } from '@/data/portfolioData';

// YouTube video interface
interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
}

// YouTube playlist ID for 3D animations
const PLAYLIST_ID = 'PLQfp_fHFd7QuM3X2Ve3cI3Qwaee3NmlmE';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle sx={{ fontSize: 20, color: '#4CAF50' }} />;
    case 'In Progress':
      return <Schedule sx={{ fontSize: 20, color: '#FF9800' }} />;
    case 'Archived':
      return <Archive sx={{ fontSize: 20, color: '#9E9E9E' }} />;
    default:
      return null;
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Web Development': '#2196F3',
    'Game Development': '#9C27B0',
    '3D Graphics': '#E91E63',
    'Medical Software': '#F44336',
    'IoT & Hardware': '#4CAF50',
    'Open Source': '#FF9800',
    Creative: '#FF6B9D',
  };
  return colors[category] || '#89665d';
};

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const project = portfolioProjects.find((p) => p.id === projectId);

  // YouTube videos state (only for 3d-animations-youtube project)
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);

  const isYouTubeProject = projectId === '3d-animations-youtube';

  // Fetch YouTube videos for the 3D animations project
  useEffect(() => {
    if (!isYouTubeProject) return;

    const fetchVideos = async () => {
      try {
        setVideosLoading(true);
        setVideosError(null);

        const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const cacheBuster = `&_=${Date.now()}`;
        const response = await fetch(proxyUrl + encodeURIComponent(rssUrl) + cacheBuster, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }

        const data = await response.json();
        const xmlText = data.contents;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Failed to parse RSS feed');
        }

        const entries = xmlDoc.querySelectorAll('entry');
        const fetchedVideos: Video[] = Array.from(entries).map((entry) => {
          const videoId = entry.querySelector('videoId, yt\\:videoId')?.textContent || '';
          const title = entry.querySelector('title')?.textContent || 'Untitled';
          const description =
            entry.querySelector('media\\:description, description')?.textContent || '';
          const publishedAt = entry.querySelector('published')?.textContent || '';

          return { id: videoId, videoId, title, description, publishedAt };
        });

        setVideos(fetchedVideos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setVideosError(`Failed to load videos: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideos();
  }, [isYouTubeProject]);

  if (!project) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
        <Header />
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
            Project Not Found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => router.push('/portfolio')}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Back to Portfolio
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  const categoryColor = getCategoryColor(project.category);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/portfolio')}
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
              {/* Title and Meta */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                {project.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  label={project.category}
                  sx={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}`,
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {project.year}
                  </Typography>
                </Box>
                {project.teamSize && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Group sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Team of {project.teamSize}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getStatusIcon(project.status)}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {project.status}
                  </Typography>
                </Box>
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
                {project.role}
              </Typography>

              {/* Links */}
              {(project.links?.github || project.links?.live || project.links?.documentation) && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  {project.links.github && (
                    <Button
                      variant="outlined"
                      startIcon={<GitHub />}
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: categoryColor,
                          backgroundColor: `${categoryColor}20`,
                        },
                      }}
                    >
                      View Code
                    </Button>
                  )}
                  {project.links.live && (
                    <Button
                      variant="outlined"
                      startIcon={<Launch />}
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: categoryColor,
                          backgroundColor: `${categoryColor}20`,
                        },
                      }}
                    >
                      Live Site
                    </Button>
                  )}
                  {project.links.documentation && (
                    <Button
                      variant="outlined"
                      startIcon={<Description />}
                      href={project.links.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: categoryColor,
                          backgroundColor: `${categoryColor}20`,
                        },
                      }}
                    >
                      Documentation
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Description */}
                <Card
                  sx={{
                    mb: 4,
                    background:
                      'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                    border: '1px solid rgba(137, 102, 93, 0.3)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Overview
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}
                    >
                      {project.description}
                    </Typography>
                    {project.longDescription && (
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.8 }}
                      >
                        {project.longDescription}
                      </Typography>
                    )}
                    {project.credits?.design && (
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mt: 2, fontStyle: 'italic' }}
                      >
                        Design by{' '}
                        <Box
                          component="a"
                          href={project.credits.design.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {project.credits.design.name}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* YouTube Videos Section - only for 3d-animations-youtube project */}
                {isYouTubeProject && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{ color: 'text.primary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <YouTube sx={{ color: '#FF0000' }} /> Videos from Channel
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<YouTube />}
                        href="https://www.youtube.com/@benschg"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          backgroundColor: '#FF0000',
                          color: 'white',
                          '&:hover': { backgroundColor: '#CC0000' },
                        }}
                      >
                        View Channel
                      </Button>
                    </Box>

                    {videosLoading && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: categoryColor }} />
                      </Box>
                    )}

                    {videosError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {videosError}
                      </Alert>
                    )}

                    {!videosLoading && !videosError && videos.length > 0 && (
                      <Grid container spacing={2}>
                        {videos.map((video, index) => (
                          <Grid key={video.id} size={{ xs: 12, sm: 6 }}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                            >
                              <Card
                                component="a"
                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  height: '100%',
                                  background: 'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
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
                                <Box sx={{ position: 'relative', height: 180 }}>
                                  <CardMedia
                                    component="img"
                                    image={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                    alt={video.title}
                                    sx={{
                                      height: 180,
                                      objectFit: 'cover',
                                      backgroundColor: 'rgba(0,0,0,0.5)',
                                    }}
                                  />
                                  <Box
                                    className="play-button"
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      width: 60,
                                      height: 60,
                                      borderRadius: '50%',
                                      backgroundColor: categoryColor,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      transition: 'all 0.3s ease',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                    }}
                                  >
                                    <PlayArrow sx={{ fontSize: 36, color: 'white', ml: 0.5 }} />
                                  </Box>
                                </Box>
                                <CardContent sx={{ p: 2 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      color: 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {video.title}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <Card
                    sx={{
                      mb: 4,
                      background:
                        'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                      border: '1px solid rgba(137, 102, 93, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                      >
                        Key Features
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, m: 0 }}>
                        {project.features.map((feature, idx) => (
                          <Typography
                            key={idx}
                            component="li"
                            variant="body1"
                            sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.6 }}
                          >
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <Card
                    sx={{
                      mb: 4,
                      background:
                        'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                      border: '1px solid rgba(137, 102, 93, 0.3)',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
                      >
                        Achievements
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {project.highlights.map((highlight, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Typography sx={{ color: '#ffd700', fontSize: '1.2rem' }}>★</Typography>
                            <Typography
                              variant="body1"
                              sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                            >
                              {highlight}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Impact */}
                {project.impact && (
                  <Card
                    sx={{
                      mb: 4,
                      background: `linear-gradient(135deg, ${categoryColor}15 0%, ${categoryColor}20 100%)`,
                      border: `1px solid ${categoryColor}40`,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, color: categoryColor, fontWeight: 600 }}
                      >
                        Impact
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.primary', lineHeight: 1.8, fontStyle: 'italic' }}
                      >
                        {project.impact}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Technologies */}
                <Card
                  sx={{
                    mb: 4,
                    background:
                      'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                    border: '1px solid rgba(137, 102, 93, 0.3)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
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
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Project Info */}
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
                    border: '1px solid rgba(137, 102, 93, 0.3)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Project Info
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Duration
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                          {project.duration || project.year}
                        </Typography>
                      </Box>
                      {project.teamSize && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Team Size
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.primary' }}>
                            {project.teamSize} people
                          </Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Status
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(project.status)}
                          <Typography variant="body1" sx={{ color: 'text.primary' }}>
                            {project.status}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ProjectDetail;
