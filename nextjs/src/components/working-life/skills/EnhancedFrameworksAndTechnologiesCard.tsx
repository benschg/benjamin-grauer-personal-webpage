'use client';

import { Card, CardContent, Typography, Box, Chip, Tooltip, Grid, Collapse } from '@mui/material';
import { getContrastColor } from '@/utils/colorUtils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { frameworksAndTechnologies } from '../content';
import {
  Code,
  Web,
  CloudQueue,
  DesktopMac,
  Architecture,
  Memory,
  Speed,
  Language,
  Star,
  ExpandMore,
} from '@mui/icons-material';

const getFrameworkIcon = (iconName?: string) => {
  const iconStyle = { fontSize: 20 };

  switch (iconName) {
    case 'react':
      return <Code sx={iconStyle} />;
    case 'dotnet':
      return <Code sx={iconStyle} />;
    case 'angular':
      return <Code sx={iconStyle} />;
    case 'threejs':
      return <Architecture sx={iconStyle} />;
    case 'blender':
      return <Architecture sx={iconStyle} />;
    case 'desktop':
      return <DesktopMac sx={iconStyle} />;
    case 'gpu':
      return <Speed sx={iconStyle} />;
    case 'nodejs':
      return <Code sx={iconStyle} />;
    case 'docker':
      return <CloudQueue sx={iconStyle} />;
    default:
      return getCategoryIcon('default');
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Frontend':
      return <Web sx={{ fontSize: 20 }} />;
    case 'Backend':
      return <Code sx={{ fontSize: 20 }} />;
    case 'Desktop':
      return <DesktopMac sx={{ fontSize: 20 }} />;
    case '3D/Graphics':
      return <Architecture sx={{ fontSize: 20 }} />;
    case 'DevOps':
      return <CloudQueue sx={{ fontSize: 20 }} />;
    case 'High Performance':
      return <Speed sx={{ fontSize: 20 }} />;
    case 'Runtime':
      return <Memory sx={{ fontSize: 20 }} />;
    default:
      return <Code sx={{ fontSize: 20 }} />;
  }
};

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'Beginner':
      return '#4caf50';
    case 'Intermediate':
      return '#ff9800';
    case 'Advanced':
      return '#2196f3';
    case 'Expert':
      return '#9c27b0';
    default:
      return '#757575';
  }
};

const EnhancedFrameworksAndTechnologiesCard = () => {
  const [hoveredFramework, setHoveredFramework] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Desktop',
    '3D/Graphics',
    'DevOps',
    'High Performance',
    'Runtime',
  ];

  const filteredFrameworks =
    selectedCategory === 'All'
      ? frameworksAndTechnologies
      : frameworksAndTechnologies.filter((fw) => fw.category === selectedCategory);

  const sortedFrameworks = [...filteredFrameworks];

  return (
    <Card
      sx={{
        p: 2,
        background:
          'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
        border: '2px solid rgba(137, 102, 93, 0.3)',
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.3rem',
            fontWeight: 700,
            mb: 2,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Language /> Frameworks & Technologies
        </Typography>

        {/* Category Filter */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              sx={{
                borderColor: 'primary.main',
                backgroundColor: selectedCategory === category ? 'primary.main' : 'transparent',
                color: selectedCategory === category ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>

        {/* Frameworks List */}
        <Box sx={{ mb: 3 }}>
          {sortedFrameworks.map((framework, index) => {
            const isExpanded = hoveredFramework === framework.name;
            return (
              <motion.div
                key={framework.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Box
                  onClick={() => setHoveredFramework(isExpanded ? null : framework.name)}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: isExpanded
                      ? 'rgba(137, 102, 93, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isExpanded ? framework.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(137, 102, 93, 0.05)',
                      borderColor: framework.color,
                    },
                  }}
                >
                  {/* Compact Framework Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        flex: '1 1 auto',
                        minWidth: 0,
                      }}
                    >
                      {/* Name & Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <Tooltip title={`${framework.name} - ${framework.category}`}>
                          <Box sx={{ color: framework.color, flexShrink: 0 }}>
                            {getFrameworkIcon(framework.icon)}
                          </Box>
                        </Tooltip>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: framework.color,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {framework.name}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Additional Info - wraps to next line on small screens */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexShrink: 0,
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'flex-end', sm: 'flex-end' },
                      }}
                    >
                      {framework.isFavorite && (
                        <Star sx={{ fontSize: 16, color: '#ffd700', flexShrink: 0 }} />
                      )}
                      {/* Status Indicator */}
                      {framework.lastUsed === 'Currently using' && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                              '100%': { opacity: 1 },
                            },
                          }}
                        />
                      )}
                      <Chip
                        label={framework.experience}
                        size="small"
                        sx={{
                          backgroundColor: framework.color,
                          color: getContrastColor(framework.color),
                          fontSize: '0.7rem',
                          height: '22px',
                          fontWeight: 600,
                        }}
                      />
                      <Box
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <ExpandMore sx={{ color: 'text.secondary' }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Expandable Content */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.85rem',
                          color: 'text.secondary',
                          mb: 2,
                          lineHeight: 1.5,
                        }}
                      >
                        {framework.description}
                      </Typography>

                      {/* Experience & Applications */}
                      {(framework.keyFeatures || framework.primaryProjects) && (
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                mb: 1,
                                color: 'text.primary',
                              }}
                            >
                              Experience & Applications:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {framework.keyFeatures?.map((feature) => (
                                <Chip
                                  key={feature}
                                  label={feature}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    borderColor: framework.color,
                                    color: 'text.primary',
                                  }}
                                />
                              ))}
                              {framework.primaryProjects.map((project) => (
                                <Chip
                                  key={project}
                                  label={project}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    borderColor: framework.color,
                                    color: 'text.primary',
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      )}

                      {/* Additional Info */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip
                          label={framework.complexity}
                          size="small"
                          sx={{
                            backgroundColor: getComplexityColor(framework.complexity),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '22px',
                            fontWeight: 500,
                          }}
                        />
                        {framework.lastUsed && framework.lastUsed !== 'Currently using' && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                          >
                            Last used: {framework.lastUsed}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(137, 102, 93, 0.05)',
            border: '1px solid rgba(137, 102, 93, 0.2)',
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworksAndTechnologies.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Technologies
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworksAndTechnologies.filter((f) => f.isFavorite).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Specialties
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworksAndTechnologies.filter((f) => f.lastUsed === 'Currently using').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Tech
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {Math.round(
                  frameworksAndTechnologies.reduce((sum, f) => sum + (f.proficiency || 0), 0) /
                    frameworksAndTechnologies.length
                )}
                %
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Avg. Proficiency
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedFrameworksAndTechnologiesCard;
