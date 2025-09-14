import { Card, CardContent, Typography, Box, LinearProgress, Chip, Tooltip, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Code,
  Web,
  Storage,
  CloudQueue,
  DesktopMac,
  Architecture,
  Memory,
  Speed,
  Language,
  Star
} from '@mui/icons-material';

interface Framework {
  name: string;
  proficiency: number; // 0-100
  experience: string;
  category: 'Frontend' | 'Backend' | 'Desktop' | '3D/Graphics' | 'DevOps' | 'High Performance' | 'Runtime';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  keyFeatures?: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  isFavorite?: boolean;
}

// Function to determine if text should be dark or light based on background color
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const frameworks: Framework[] = [
  {
    name: 'React',
    proficiency: 90,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Single Page Apps', 'Component Libraries', 'Hooks', 'State Management'],
    color: '#61DAFB',
    description: 'Modern frontend development with React ecosystem and component-based architecture',
    lastUsed: 'Currently using',
    keyFeatures: ['Hooks', 'Context API', 'Redux', 'React Router'],
    complexity: 'Advanced',
    isFavorite: true,
  },
  {
    name: '.NET',
    proficiency: 95,
    experience: '15+ years',
    category: 'Backend',
    primaryProjects: ['Enterprise Apps', 'Web APIs', 'Desktop Applications', '.Net-3D'],
    color: '#512BD4',
    description: 'Enterprise application development with .NET framework and C# programming',
    lastUsed: 'Currently using',
    keyFeatures: ['ASP.NET Core', 'Entity Framework', 'Web API', 'Blazor'],
    complexity: 'Expert',
    isFavorite: true,
  },
  {
    name: 'Angular',
    proficiency: 80,
    experience: '5+ years',
    category: 'Frontend',
    primaryProjects: ['Web Applications', 'TypeScript', 'RxJS', 'Material Design'],
    color: '#DD0031',
    description: 'Component-based web applications with TypeScript and Angular ecosystem',
    lastUsed: '2023',
    keyFeatures: ['TypeScript', 'RxJS', 'Angular CLI', 'Material'],
    complexity: 'Advanced',
  },
  {
    name: 'Three.js & WebGL',
    proficiency: 85,
    experience: '6+ years',
    category: '3D/Graphics',
    primaryProjects: ['3D Visualizations', 'WebGL Shaders', 'Interactive Graphics', 'Browser 3D'],
    color: '#000000',
    description: '3D web graphics, interactive visualizations, and browser-based 3D applications',
    lastUsed: 'Currently using',
    keyFeatures: ['WebGL Shaders', 'PBR Rendering', '3D Physics', 'VR/AR'],
    complexity: 'Expert',
    isFavorite: true,
  },
  {
    name: 'Qt/WPF',
    proficiency: 88,
    experience: '12+ years',
    category: 'Desktop',
    primaryProjects: ['Desktop Applications', 'Medical Simulation UI', 'Cross-platform UI', 'Custom Controls'],
    color: '#41CD52',
    description: 'Cross-platform desktop application UI development with Qt and WPF',
    lastUsed: 'Currently using',
    keyFeatures: ['MVVM', 'Custom Controls', 'Data Binding', 'Cross-platform'],
    complexity: 'Expert',
    isFavorite: true,
  },
  {
    name: 'CUDA/GPU Computing',
    proficiency: 82,
    experience: '8+ years',
    category: 'High Performance',
    primaryProjects: ['Volume Rendering', 'Real-time Graphics', 'Medical Imaging', 'Scientific Computing'],
    color: '#76B900',
    description: 'High-performance GPU computing and parallel processing for graphics and scientific applications',
    lastUsed: '2023',
    keyFeatures: ['Parallel Computing', 'Memory Optimization', 'Kernel Programming', 'Graphics Pipeline'],
    complexity: 'Expert',
  },
  {
    name: 'Node.js',
    proficiency: 85,
    experience: '8+ years',
    category: 'Runtime',
    primaryProjects: ['REST APIs', 'Microservices', 'Real-time Applications', 'Cloud Functions'],
    color: '#339933',
    description: 'Server-side JavaScript runtime for building scalable network applications',
    lastUsed: 'Currently using',
    keyFeatures: ['Express.js', 'Socket.io', 'PM2', 'NPM Ecosystem'],
    complexity: 'Advanced',
  },
  {
    name: 'Docker',
    proficiency: 78,
    experience: '5+ years',
    category: 'DevOps',
    primaryProjects: ['Container Deployment', 'Microservices Architecture', 'Development Environments', 'CI/CD'],
    color: '#2496ED',
    description: 'Application containerization and deployment using Docker and orchestration tools',
    lastUsed: 'Currently using',
    keyFeatures: ['Containerization', 'Multi-stage Builds', 'Docker Compose', 'Orchestration'],
    complexity: 'Intermediate',
  },
];

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

  const categories = ['All', 'Frontend', 'Backend', 'Desktop', '3D/Graphics', 'DevOps', 'High Performance', 'Runtime'];

  const filteredFrameworks = selectedCategory === 'All'
    ? frameworks
    : frameworks.filter(fw => fw.category === selectedCategory);

  const sortedFrameworks = [...filteredFrameworks].sort((a, b) => {
    // Sort by favorites first, then by proficiency
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.proficiency - a.proficiency;
  });

  return (
    <Card
      sx={{
        p: 2,
        background: 'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
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

        {/* Frameworks Grid */}
        <Grid container spacing={2}>
          {sortedFrameworks.map((framework, index) => (
            <Grid size={{ xs: 12, lg: 6 }} key={framework.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredFramework(framework.name)}
                onHoverEnd={() => setHoveredFramework(null)}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: hoveredFramework === framework.name
                      ? 'rgba(137, 102, 93, 0.1)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: hoveredFramework === framework.name
                      ? framework.color
                      : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Framework Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: framework.color,
                        }}
                      >
                        {framework.name}
                      </Typography>
                      {framework.isFavorite && (
                        <Star sx={{ fontSize: 18, color: '#ffd700' }} />
                      )}
                      <Tooltip title={framework.category}>
                        <Box sx={{ color: 'text.secondary' }}>
                          {getCategoryIcon(framework.category)}
                        </Box>
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <Chip
                        label={framework.experience}
                        size="small"
                        sx={{
                          backgroundColor: framework.color,
                          color: getContrastColor(framework.color),
                          fontSize: '0.7rem',
                          height: '20px',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={framework.complexity}
                        size="small"
                        sx={{
                          backgroundColor: getComplexityColor(framework.complexity),
                          color: 'white',
                          fontSize: '0.65rem',
                          height: '18px',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Status Indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {framework.lastUsed === 'Currently using' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                        <Typography variant="caption" sx={{ color: '#4caf50', fontSize: '0.7rem' }}>
                          Active
                        </Typography>
                      </Box>
                    )}
                    {framework.lastUsed && framework.lastUsed !== 'Currently using' && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                        Last used: {framework.lastUsed}
                      </Typography>
                    )}
                  </Box>

                  {/* Proficiency Bar */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Proficiency
                      </Typography>
                      <Typography variant="caption" sx={{ color: framework.color, fontWeight: 600 }}>
                        {framework.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={framework.proficiency}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: framework.color,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      mb: 1.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {framework.description}
                  </Typography>

                  {/* Key Features & Projects */}
                  {hoveredFramework === framework.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {framework.keyFeatures && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            Key Features:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                            {framework.keyFeatures.map((feature) => (
                              <Chip
                                key={feature}
                                label={feature}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: '18px',
                                  borderColor: framework.color,
                                  color: 'text.primary',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                          Primary Projects:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                          {framework.primaryProjects.map((project) => (
                            <Chip
                              key={project}
                              label={project}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.65rem',
                                height: '18px',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color: 'text.secondary',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

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
                {frameworks.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Technologies
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworks.filter(f => f.isFavorite).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Specialties
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworks.filter(f => f.lastUsed === 'Currently using').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Tech
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {Math.round(frameworks.reduce((sum, f) => sum + f.proficiency, 0) / frameworks.length)}%
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