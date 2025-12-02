'use client';

import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import {
  CalendarToday,
  Star,
  CheckCircle,
  Schedule,
  Archive,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Project } from '@/data/portfolioData';

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
    Creative: '#FF6B9D',
  };
  return colors[category] || '#89665d';
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const categoryColor = getCategoryColor(project.category);
  const projectLink =
    project.id === 'arts-and-crafts-gallery'
      ? '/portfolio/arts-and-crafts'
      : `/portfolio/${project.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        component={Link}
        href={projectLink}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
          border: '1px solid rgba(137, 102, 93, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            borderColor: categoryColor,
            '& .project-image': {
              transform: 'scale(1.05)',
            },
            '& .view-project-btn': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: categoryColor,
            borderRadius: '4px 4px 0 0',
            zIndex: 2,
          },
        }}
      >
        {project.featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: '#ffd700',
              borderRadius: '50%',
              p: 0.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <Star sx={{ fontSize: 20, color: '#343A40' }} />
          </Box>
        )}

        <CardMedia
          component="div"
          className="project-image"
          sx={{
            height: 200,
            backgroundColor: 'rgba(0,0,0,0.3)',
            backgroundImage: project.images?.thumbnail
              ? `url(${project.images.thumbnail})`
              : 'linear-gradient(135deg, rgba(137, 102, 93, 0.2) 0%, rgba(137, 102, 93, 0.4) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!project.images?.thumbnail && (
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 700,
                textAlign: 'center',
                px: 2,
              }}
            >
              {project.title}
            </Typography>
          )}

          <Box
            className="view-project-btn"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: categoryColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            View Project <ArrowForward sx={{ fontSize: 16 }} />
          </Box>
        </CardMedia>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label={project.category}
              size="small"
              sx={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}`,
                fontSize: '0.7rem',
                height: 22,
                fontWeight: 600,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                {project.year}
              </Typography>
            </Box>
            {getStatusIcon(project.status)}
          </Box>

          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.875rem',
              color: 'primary.main',
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            {project.role}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.6,
              flexGrow: 1,
            }}
          >
            {project.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {project.technologies.slice(0, 4).map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            ))}
            {project.technologies.length > 4 && (
              <Chip
                label={`+${project.technologies.length - 4}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(137, 102, 93, 0.2)',
                  color: 'primary.main',
                  fontSize: '0.7rem',
                  height: 20,
                  fontWeight: 600,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
