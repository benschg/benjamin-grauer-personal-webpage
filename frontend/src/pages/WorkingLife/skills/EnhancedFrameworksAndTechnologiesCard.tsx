import { Card, CardContent, Typography, Box, Chip, Tooltip, Grid, Collapse } from '@mui/material';
import { getContrastColor } from '../../../utils/colorUtils';
import { motion } from 'framer-motion';
import { useState } from 'react';
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

// Import technology brand icons from react-icons
import { FaReact, FaAngular, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiDotnet, SiThreedotjs, SiBlender, SiQt, SiNvidia } from 'react-icons/si';

interface Framework {
  name: string;
  proficiency: number; // 0-100
  experience: string;
  category:
    | 'Frontend'
    | 'Backend'
    | 'Desktop'
    | '3D/Graphics'
    | 'DevOps'
    | 'High Performance'
    | 'Runtime';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  keyFeatures?: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  isFavorite?: boolean;
  icon?: string;
}

const frameworks: Framework[] = [
  {
    name: 'React',
    proficiency: 90,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Single Page Apps', 'Component Libraries', 'Hooks', 'State Management'],
    color: '#61DAFB',
    description:
      'Modern frontend development with React ecosystem and component-based architecture',
    lastUsed: 'Currently using',
    keyFeatures: ['Hooks', 'Context API', 'Redux', 'React Router'],
    complexity: 'Advanced',
    isFavorite: true,
    icon: 'react',
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
    icon: 'dotnet',
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
    icon: 'angular',
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
    icon: 'threejs',
  },
  {
    name: 'Blender',
    proficiency: 75,
    experience: '5+ years',
    category: '3D/Graphics',
    primaryProjects: ['3D Modeling', 'Animation', 'Rendering', 'Asset Creation'],
    color: '#E87D0D',
    description:
      'Professional 3D creation suite for modeling, animation, rendering, and visual effects',
    lastUsed: 'Currently using',
    keyFeatures: ['Modeling', 'Sculpting', 'Animation', 'Cycles Rendering'],
    complexity: 'Advanced',
    icon: 'blender',
  },
  {
    name: 'Qt/WPF',
    proficiency: 88,
    experience: '12+ years',
    category: 'Desktop',
    primaryProjects: [
      'Desktop Applications',
      'Medical Simulation UI',
      'Cross-platform UI',
      'Custom Controls',
    ],
    color: '#41CD52',
    description: 'Cross-platform desktop application UI development with Qt and WPF',
    lastUsed: 'Currently using',
    keyFeatures: ['MVVM', 'Custom Controls', 'Data Binding', 'Cross-platform'],
    complexity: 'Expert',
    isFavorite: true,
    icon: 'desktop',
  },
  {
    name: 'CUDA/GPU Computing',
    proficiency: 82,
    experience: '8+ years',
    category: 'High Performance',
    primaryProjects: [
      'Volume Rendering',
      'Real-time Graphics',
      'Medical Imaging',
      'Scientific Computing',
    ],
    color: '#76B900',
    description:
      'High-performance GPU computing and parallel processing for graphics and scientific applications',
    lastUsed: '2023',
    keyFeatures: [
      'Parallel Computing',
      'Memory Optimization',
      'Kernel Programming',
      'Graphics Pipeline',
    ],
    complexity: 'Expert',
    icon: 'gpu',
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
    icon: 'nodejs',
  },
  {
    name: 'Docker',
    proficiency: 78,
    experience: '5+ years',
    category: 'DevOps',
    primaryProjects: [
      'Container Deployment',
      'Microservices Architecture',
      'Development Environments',
      'CI/CD',
    ],
    color: '#2496ED',
    description: 'Application containerization and deployment using Docker and orchestration tools',
    lastUsed: 'Currently using',
    keyFeatures: ['Containerization', 'Multi-stage Builds', 'Docker Compose', 'Orchestration'],
    complexity: 'Intermediate',
    icon: 'docker',
  },
];

const getFrameworkIcon = (iconName?: string) => {
  const iconStyle = { fontSize: 20 };

  switch (iconName) {
    case 'react':
      return <FaReact style={iconStyle} />; // Official React icon
    case 'dotnet':
      return <SiDotnet style={iconStyle} />; // Official .NET icon
    case 'angular':
      return <FaAngular style={iconStyle} />; // Official Angular icon
    case 'threejs':
      return <SiThreedotjs style={iconStyle} />; // Official Three.js icon
    case 'blender':
      return <SiBlender style={iconStyle} />; // Official Blender icon
    case 'desktop':
      return <SiQt style={iconStyle} />; // Official Qt icon
    case 'gpu':
      return <SiNvidia style={iconStyle} />; // NVIDIA/CUDA icon
    case 'nodejs':
      return <FaNodeJs style={iconStyle} />; // Official Node.js icon
    case 'docker':
      return <FaDocker style={iconStyle} />; // Official Docker icon
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
      ? frameworks
      : frameworks.filter((fw) => fw.category === selectedCategory);

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
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
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
                        {framework.isFavorite && (
                          <Star sx={{ fontSize: 16, color: '#ffd700', flexShrink: 0 }} />
                        )}
                      </Box>

                      {/* Status Indicator */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      </Box>
                    </Box>

                    {/* Experience & Expand Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

                      <Grid container spacing={2}>
                        {/* Key Features */}
                        {framework.keyFeatures && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                mb: 1,
                                color: 'text.primary',
                              }}
                            >
                              Key Features:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {framework.keyFeatures.map((feature) => (
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
                            </Box>
                          </Grid>
                        )}

                        {/* Primary Projects */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              mb: 1,
                              color: 'text.primary',
                            }}
                          >
                            Primary Projects:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {framework.primaryProjects.map((project) => (
                              <Chip
                                key={project}
                                label={project}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: '20px',
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                  color: 'text.secondary',
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>

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
                {frameworks.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Technologies
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworks.filter((f) => f.isFavorite).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Specialties
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {frameworks.filter((f) => f.lastUsed === 'Currently using').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Tech
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {Math.round(
                  frameworks.reduce((sum, f) => sum + f.proficiency, 0) / frameworks.length
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
