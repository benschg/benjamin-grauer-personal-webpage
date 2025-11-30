'use client';

import { useState, type JSX } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Badge,
} from '@mui/material';
import {
  ViewModule,
  ViewList,
  Star,
  Code,
  SportsEsports,
  Brush,
  LocalHospital,
  Memory,
  GitHub,
} from '@mui/icons-material';
import { Header, Footer } from '@/components/common';
import { ProjectCard } from '@/components/portfolio';
import { portfolioProjects, getCategories, filterProjects } from '@/data/portfolioData';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, JSX.Element> = {
  All: <Star sx={{ fontSize: 18 }} />,
  'Web Development': <Code sx={{ fontSize: 18 }} />,
  'Game Development': <SportsEsports sx={{ fontSize: 18 }} />,
  '3D Graphics': <Brush sx={{ fontSize: 18 }} />,
  'Medical Software': <LocalHospital sx={{ fontSize: 18 }} />,
  'IoT & Hardware': <Memory sx={{ fontSize: 18 }} />,
  'Open Source': <GitHub sx={{ fontSize: 18 }} />,
  Creative: <Brush sx={{ fontSize: 18 }} />,
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

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const categories = ['All', ...getCategories()];

  let filteredProjects =
    selectedCategory === 'All'
      ? portfolioProjects
      : filterProjects(portfolioProjects, selectedCategory);

  if (showFeaturedOnly) {
    filteredProjects = filteredProjects.filter((p) => p.featured);
  }

  filteredProjects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year.localeCompare(a.year);
  });

  const projectCounts = categories.reduce(
    (acc, cat) => {
      if (cat === 'All') {
        acc[cat] = portfolioProjects.length;
      } else {
        acc[cat] = portfolioProjects.filter((p) => p.category === cat).length;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#343A40' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #89665d 0%, #bf9b93 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Portfolio
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                A showcase of my projects spanning medical software, game development, web
                applications, and open-source contributions
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              {categories.map((category) => (
                <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    badgeContent={projectCounts[category]}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor:
                          selectedCategory === category ? 'primary.main' : 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    <Chip
                      label={category}
                      icon={categoryIcons[category]}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      sx={{
                        borderColor:
                          category === 'All' ? 'primary.main' : getCategoryColor(category),
                        backgroundColor:
                          selectedCategory === category
                            ? category === 'All'
                              ? 'primary.main'
                              : getCategoryColor(category)
                            : 'transparent',
                        color: selectedCategory === category ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor:
                            selectedCategory === category
                              ? category === 'All'
                                ? 'primary.main'
                                : getCategoryColor(category)
                              : category === 'All'
                                ? 'rgba(137, 102, 93, 0.2)'
                                : `${getCategoryColor(category)}20`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Badge>
                </motion.div>
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  label="Featured Only"
                  icon={<Star sx={{ fontSize: 16 }} />}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  variant={showFeaturedOnly ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: '#ffd700',
                    backgroundColor: showFeaturedOnly ? '#ffd700' : 'transparent',
                    color: showFeaturedOnly ? '#343A40' : 'text.primary',
                    '&:hover': {
                      backgroundColor: showFeaturedOnly ? '#ffd700' : 'rgba(255, 215, 0, 0.2)',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'text.secondary',
                    borderColor: 'rgba(255,255,255,0.2)',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(137, 102, 93, 0.2)',
                    },
                  },
                }}
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewModule sx={{ fontSize: 20 }} />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewList sx={{ fontSize: 20 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Fade in timeout={500}>
            <Grid container spacing={3}>
              {filteredProjects.map((project, index) => (
                <Grid
                  key={project.id}
                  size={{
                    xs: 12,
                    sm: viewMode === 'list' ? 12 : 6,
                    md: viewMode === 'list' ? 12 : 6,
                    lg: viewMode === 'list' ? 12 : 4,
                  }}
                >
                  <ProjectCard project={project} index={index} />
                </Grid>
              ))}
            </Grid>
          </Fade>

          {filteredProjects.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                No projects found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Try adjusting your filters
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
