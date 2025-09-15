import { Card, CardContent, Typography, Box, Chip, Tooltip, Grid, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExpandMore, Build, Star } from '@mui/icons-material';
import { getContrastColor } from '../../../utils/colorUtils';

// Import tool-specific brand icons from react-icons
import { SiJira, SiBlender } from 'react-icons/si';
import { FaTools, FaWindows, FaDatabase, FaInfinity, FaCloud } from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';

interface Tool {
  name: string;
  description: string;
  category: string;
  experience: string;
  projects: string[];
  color: string;
  icon?: string;
  proficiency?: number;
  lastUsed?: string;
  keyFeatures?: string[];
  isFavorite?: boolean;
}

const tools: Tool[] = [
  {
    name: 'Cloud Platforms',
    description:
      'Multi-cloud infrastructure management and deployment across major cloud providers.',
    category: 'Cloud',
    experience: '7+ years',
    projects: [
      'AWS (3+ years at Verity)',
      'Azure (5+ years)',
      'GCP (Google Cloud Platform)',
      'Cloud Architecture & IoT',
    ],
    color: '#FF9900',
    icon: 'cloud',
    proficiency: 85,
    lastUsed: 'Currently using',
    keyFeatures: [
      'AWS EC2/Lambda',
      'Azure DevOps',
      'Google Cloud Functions',
      'Infrastructure as Code',
    ],
    isFavorite: true,
  },
  {
    name: 'DevOps & CI/CD Tools',
    description:
      'Infrastructure automation, continuous integration, and deployment pipeline management.',
    category: 'DevOps',
    experience: '7+ years',
    projects: [
      'Jenkins (7 years)',
      'Azure DevOps (2 years)',
      'GitHub Actions',
      'Vercel Deployment',
    ],
    color: '#326CE5',
    icon: 'devops',
    proficiency: 88,
    lastUsed: 'Currently using',
    keyFeatures: ['Jenkins Pipelines', 'GitHub Actions', 'Azure DevOps', 'Automated Deployment'],
    isFavorite: true,
  },
  {
    name: 'Development Administration',
    description: 'Expert-level administration of development tools and source control systems.',
    category: 'Administration',
    experience: '15+ years',
    projects: [
      'Jira/Confluence/Bitbucket Admin',
      'GitHub/GitLab/BitBucket (expert)',
      'Azure Active Directory',
      'Team Workflow Setup',
    ],
    color: '#0078D4',
    icon: 'admin',
    proficiency: 92,
    lastUsed: 'Currently using',
    keyFeatures: ['Jira Administration', 'Git Management', 'Team Workflows', 'Access Control'],
    isFavorite: true,
  },
  {
    name: '3D & Creative Tools',
    description:
      'Professional 3D modeling, rendering, and creative software for visualization projects.',
    category: 'Creative',
    experience: '10+ years',
    projects: ['Blender/Maya', 'Unity/Unreal Engine', 'DaVinci Resolve', 'Custom 3D Pipelines'],
    color: '#E65100',
    icon: '3d',
    proficiency: 80,
    lastUsed: 'Currently using',
    keyFeatures: ['3D Modeling', 'Game Engines', 'Video Editing', 'Rendering Pipelines'],
  },
  {
    name: 'Systems Management',
    description: 'Cross-platform system administration and infrastructure management.',
    category: 'Systems',
    experience: '15+ years',
    projects: [
      'Windows/Active Directory',
      'Linux Server infrastructure',
      'macOS/OSX Administration',
      'Network Configuration',
    ],
    color: '#D32F2F',
    icon: 'systems',
    proficiency: 85,
    lastUsed: 'Currently using',
    keyFeatures: [
      'Windows Server',
      'Linux Administration',
      'Network Management',
      'Security Configuration',
    ],
  },
  {
    name: 'Development Tools',
    description: 'Modern IDEs and development environments with containerization.',
    category: 'IDE',
    experience: '18+ years',
    projects: [
      'VS Code (3 years)',
      'Visual Studio (15 years)',
      'Docker (2 years)',
      'Development Workflow',
    ],
    color: '#4285F4',
    icon: 'ide',
    proficiency: 95,
    lastUsed: 'Currently using',
    keyFeatures: ['Visual Studio', 'VS Code', 'Docker Containers', 'Development Environments'],
    isFavorite: true,
  },
  {
    name: 'Data Analytics & BI',
    description: 'Business intelligence, data visualization, and analytics reporting tools.',
    category: 'Analytics',
    experience: '8+ years',
    projects: [
      'Power BI',
      'SQL & Document DBs',
      'Data Analytics Dashboards',
      'Performance Metrics',
    ],
    color: '#F2C811',
    icon: 'analytics',
    proficiency: 75,
    lastUsed: 'Currently using',
    keyFeatures: ['Power BI', 'Data Visualization', 'SQL Databases', 'Business Intelligence'],
  },
  {
    name: 'Productivity Tools',
    description: 'Comprehensive productivity and collaboration tools for business communication.',
    category: 'Productivity',
    experience: '12+ years',
    projects: [
      'Microsoft Office Suite (6 years)',
      'Google Workspace (12 years)',
      'Business Presentations',
      'Documentation Systems',
    ],
    color: '#34A853',
    icon: 'productivity',
    proficiency: 90,
    lastUsed: 'Currently using',
    keyFeatures: ['Office Suite', 'Google Workspace', 'Documentation', 'Collaboration'],
  },
];

const getToolIcon = (iconName?: string) => {
  const iconStyle = { fontSize: 20 };

  switch (iconName) {
    case 'cloud':
      return <FaCloud style={iconStyle} />; // Generic cloud icon for multi-cloud
    case 'devops':
      return <FaInfinity style={iconStyle} />; // DevOps infinity loop icon
    case 'admin':
      return <SiJira style={iconStyle} />; // Jira for administration
    case '3d':
      return <SiBlender style={iconStyle} />; // Blender for 3D tools
    case 'systems':
      return <FaWindows style={iconStyle} />; // Windows for systems
    case 'ide':
      return <VscCode style={iconStyle} />; // VS Code for IDE
    case 'analytics':
      return <FaDatabase style={iconStyle} />; // Database icon for BI/analytics
    case 'productivity':
      return <FaTools style={iconStyle} />; // Tools for productivity
    default:
      return <FaTools style={iconStyle} />;
  }
};

const EnhancedToolsAndPlatformsCard = () => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Cloud',
    'DevOps',
    'Administration',
    'Creative',
    'Systems',
    'IDE',
    'Analytics',
    'Productivity',
  ];

  const filteredTools =
    selectedCategory === 'All' ? tools : tools.filter((tool) => tool.category === selectedCategory);

  const sortedTools = [...filteredTools].sort((a, b) => {
    // Sort by favorites first, then by proficiency
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return (b.proficiency || 0) - (a.proficiency || 0);
  });

  return (
    <Card
      sx={{
        p: 2,
        background:
          'linear-gradient(135deg, rgba(52, 58, 64, 0.9) 0%, rgba(52, 58, 64, 0.95) 100%)',
        border: '2px solid rgba(137, 102, 93, 0.3)',
        height: '100%',
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
          <Build /> Tools & Platforms
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
                fontSize: '0.75rem',
                height: '28px',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>

        {/* Tools List */}
        <Box sx={{ mb: 3 }}>
          {sortedTools.map((tool, index) => {
            const isExpanded = hoveredTool === tool.name;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Box
                  onClick={() => setHoveredTool(isExpanded ? null : tool.name)}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: isExpanded
                      ? 'rgba(137, 102, 93, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isExpanded ? tool.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(137, 102, 93, 0.05)',
                      borderColor: tool.color,
                    },
                  }}
                >
                  {/* Compact Tool Header */}
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      {/* Name & Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <Tooltip title={`${tool.name} - ${tool.category}`}>
                          <Box sx={{ color: tool.color, flexShrink: 0 }}>
                            {getToolIcon(tool.icon)}
                          </Box>
                        </Tooltip>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: tool.color,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tool.name}
                        </Typography>
                        {tool.isFavorite && (
                          <Star sx={{ fontSize: 16, color: '#ffd700', flexShrink: 0 }} />
                        )}
                      </Box>

                      {/* Status Indicator */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tool.lastUsed === 'Currently using' && (
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
                        label={tool.experience}
                        size="small"
                        sx={{
                          backgroundColor: tool.color,
                          color: getContrastColor(tool.color),
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
                        {tool.description}
                      </Typography>

                      <Grid container spacing={2}>
                        {/* Key Features */}
                        {tool.keyFeatures && (
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
                              {tool.keyFeatures.map((feature) => (
                                <Chip
                                  key={feature}
                                  label={feature}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    borderColor: tool.color,
                                    color: 'text.primary',
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                        )}

                        {/* Key Projects */}
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
                            Key Projects:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {tool.projects.map((project) => (
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
                        {tool.lastUsed && tool.lastUsed !== 'Currently using' && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                          >
                            Last used: {tool.lastUsed}
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
                {tools.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Tools/Platforms
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                18+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Years Max
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {tools.filter((t) => t.lastUsed === 'Currently using').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Tools
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {tools.filter((t) => t.isFavorite).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Core Tools
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedToolsAndPlatformsCard;
