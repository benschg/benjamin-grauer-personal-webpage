import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import {
  ExpandMore,
  GitHub,
  Launch,
  Description,
  Group,
  CalendarToday,
  Star,
  CheckCircle,
  Schedule,
  Archive,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Project } from '../data/portfolioData';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />;
    case 'In Progress':
      return <Schedule sx={{ fontSize: 16, color: '#FF9800' }} />;
    case 'Archived':
      return <Archive sx={{ fontSize: 16, color: '#9E9E9E' }} />;
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
  };
  return colors[category] || '#89665d';
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const categoryColor = getCategoryColor(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
          border: '1px solid rgba(137, 102, 93, 0.3)',
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            borderColor: categoryColor,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: categoryColor,
            borderRadius: '4px 4px 0 0',
          },
        }}
      >
        {project.featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#ffd700',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Star sx={{ fontSize: 20, color: '#343A40' }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  flex: 1,
                  mr: 2,
                }}
              >
                {project.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {getStatusIcon(project.status)}
              </Box>
            </Box>

            {/* Category and Year */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={project.category}
                size="small"
                sx={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}`,
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {project.year}
                </Typography>
              </Box>
              {project.teamSize && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Group sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {project.teamSize}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Role */}
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.85rem',
              color: 'primary.main',
              fontWeight: 600,
              mb: 2,
            }}
          >
            {project.role}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.85rem',
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {project.description}
          </Typography>

          {/* Technologies */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {project.technologies.slice(0, expanded ? undefined : 5).map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.primary',
                    fontSize: '0.7rem',
                    height: 22,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              ))}
              {!expanded && project.technologies.length > 5 && (
                <Chip
                  label={`+${project.technologies.length - 5}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(137, 102, 93, 0.2)',
                    color: 'primary.main',
                    fontSize: '0.7rem',
                    height: 22,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Highlights (always visible if featured) */}
          {project.featured && project.highlights && !expanded && (
            <Box sx={{ mb: 2 }}>
              {project.highlights.slice(0, 2).map((highlight, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    '&::before': {
                      content: '"• "',
                      color: categoryColor,
                    },
                  }}
                >
                  {highlight}
                </Typography>
              ))}
            </Box>
          )}

          {/* Expandable Content */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {/* Long Description */}
              {project.longDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  {project.longDescription}
                </Typography>
              )}

              {/* Features */}
              {project.features && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    Key Features:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {project.features.map((feature, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          mb: 0.5,
                          '&::before': {
                            content: '"▸ "',
                            color: categoryColor,
                          },
                        }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {/* All Highlights */}
              {project.highlights && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    Achievements:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {project.highlights.map((highlight, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          mb: 0.5,
                          '&::before': {
                            content: '"★ "',
                            color: '#ffd700',
                          },
                        }}
                      >
                        {highlight}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Impact */}
              {project.impact && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: `${categoryColor}10`,
                    border: `1px solid ${categoryColor}30`,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.8rem',
                      color: 'text.primary',
                      fontStyle: 'italic',
                    }}
                  >
                    Impact: {project.impact}
                  </Typography>
                </Box>
              )}

              {/* Arts & Crafts Gallery Link */}
              {project.id === 'arts-and-crafts-gallery' && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Box
                    component="a"
                    href="/portfolio/arts-and-crafts"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${categoryColor}`,
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: categoryColor,
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    View Full Gallery →
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>

          {/* Actions */}
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {project.links?.github && (
                <IconButton
                  size="small"
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#fff' },
                  }}
                >
                  <GitHub sx={{ fontSize: 20 }} />
                </IconButton>
              )}
              {project.links?.live && (
                <IconButton
                  size="small"
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#fff' },
                  }}
                >
                  <Launch sx={{ fontSize: 20 }} />
                </IconButton>
              )}
              {project.links?.documentation && (
                <IconButton
                  size="small"
                  href={project.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: '#fff' },
                  }}
                >
                  <Description sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </Box>

            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: 'text.secondary',
                '&:hover': { color: categoryColor },
              }}
            >
              <ExpandMore />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
