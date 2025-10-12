import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { portfolioProjects } from './data/portfolioData';

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
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = portfolioProjects.find((p) => p.id === projectId);

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
            onClick={() => navigate('/portfolio')}
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
                  </CardContent>
                </Card>

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
