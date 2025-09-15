import { Card, CardContent, Typography, Box, LinearProgress, Chip, Tooltip, Grid, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, DataObject, Web, ExpandMore } from '@mui/icons-material';

// Import programming language brand icons from react-icons
import {
  SiSharp,
  SiTypescript,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiC,
  SiMysql
} from 'react-icons/si';

interface ProgrammingLanguage {
  name: string;
  logo?: string;
  proficiency: number; // 0-100
  experience: string;
  category: 'Frontend' | 'Backend' | 'Systems' | 'Database' | 'Web';
  primaryProjects: string[];
  color: string;
  description: string;
  lastUsed?: string;
  frameworks?: string[];
  icon?: string;
}

// Function to determine if text should be dark or light based on background color
const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return dark text for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const programmingLanguages: ProgrammingLanguage[] = [
  {
    name: 'C#',
    proficiency: 95,
    experience: '15+ years',
    category: 'Backend',
    primaryProjects: ['VirtaMed Simulators', 'Enterprise Applications', '.NET APIs'],
    color: '#239120', // Original green
    description: 'Primary language for enterprise development',
    lastUsed: 'Currently using',
    frameworks: ['.NET Core', 'ASP.NET', 'WPF', 'Unity'],
    icon: 'csharp',
  },
  {
    name: 'TypeScript',
    proficiency: 85,
    experience: '6+ years',
    category: 'Frontend',
    primaryProjects: ['Verity Web Apps', 'React Applications', 'Cloud Dashboards'],
    color: '#3178C6', // Original TypeScript blue
    description: 'Modern web development with type safety',
    lastUsed: 'Currently using',
    frameworks: ['React', 'Angular', 'Node.js'],
    icon: 'typescript',
  },
  {
    name: 'C++',
    proficiency: 85,
    experience: '12+ years',
    category: 'Systems',
    primaryProjects: ['3D Graphics', 'Game Engines', 'Performance Critical Apps'],
    color: '#00599C', // Original C++ blue
    description: 'High-performance systems and graphics',
    lastUsed: '2023',
    frameworks: ['OpenGL', 'CUDA', 'Qt'],
    icon: 'cplusplus',
  },
  {
    name: 'Python',
    proficiency: 80,
    experience: '8+ years',
    category: 'Backend',
    primaryProjects: ['Automation', 'Data Processing', 'Cloud Functions'],
    color: '#3776AB', // Original Python blue
    description: 'Scripting and backend services',
    lastUsed: 'Currently using',
    frameworks: ['FastAPI', 'Django', 'NumPy'],
    icon: 'python',
  },
  {
    name: 'JavaScript',
    proficiency: 90,
    experience: '10+ years',
    category: 'Frontend',
    primaryProjects: ['Web Applications', 'Node.js Services', 'Frontend Development'],
    color: '#F7DF1E', // Original JS yellow
    description: 'Full-stack web development',
    lastUsed: 'Currently using',
    frameworks: ['React', 'Vue', 'Express'],
    icon: 'javascript',
  },
  {
    name: 'SQL',
    proficiency: 85,
    experience: '15+ years',
    category: 'Database',
    primaryProjects: ['Database Design', 'Query Optimization', 'Data Architecture'],
    color: '#336791', // Original SQL blue
    description: 'Database management and optimization',
    lastUsed: 'Currently using',
    frameworks: ['PostgreSQL', 'MySQL', 'SQL Server'],
    icon: 'sql',
  },
  {
    name: 'HTML/CSS',
    proficiency: 90,
    experience: '12+ years',
    category: 'Web',
    primaryProjects: ['Responsive Design', 'Web Components', 'UI Development'],
    color: '#E34F26', // Original HTML orange
    description: 'Modern web markup and styling',
    lastUsed: 'Currently using',
    frameworks: ['Tailwind', 'Material-UI', 'SASS'],
    icon: 'html',
  },
  {
    name: 'C',
    proficiency: 70,
    experience: '10+ years',
    category: 'Systems',
    primaryProjects: ['Embedded Systems', 'Low-level Programming'],
    color: '#A8B9CC', // Original C gray
    description: 'Systems programming',
    lastUsed: '2022',
    icon: 'c',
  },
];

const getLanguageIcon = (iconName?: string) => {
  const iconStyle = { fontSize: 20 };

  switch (iconName) {
    case 'csharp':
      return <SiSharp style={iconStyle} />; // Official C# icon
    case 'typescript':
      return <SiTypescript style={iconStyle} />; // Official TypeScript icon
    case 'cplusplus':
      return <SiCplusplus style={iconStyle} />; // Official C++ icon
    case 'python':
      return <SiPython style={iconStyle} />; // Official Python icon
    case 'javascript':
      return <SiJavascript style={iconStyle} />; // Official JavaScript icon
    case 'sql':
      return <SiMysql style={iconStyle} />; // SQL database icon
    case 'html':
      return <SiHtml5 style={iconStyle} />; // HTML5 icon (will use for HTML/CSS)
    case 'c':
      return <SiC style={iconStyle} />; // Official C icon
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
    case 'Database':
      return <DataObject sx={{ fontSize: 20 }} />;
    default:
      return <Code sx={{ fontSize: 20 }} />;
  }
};

const EnhancedProgrammingLanguagesCard = () => {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Systems', 'Database', 'Web'];

  const filteredLanguages = selectedCategory === 'All'
    ? programmingLanguages
    : programmingLanguages.filter(lang => lang.category === selectedCategory);

  const sortedLanguages = [...filteredLanguages].sort((a, b) => b.proficiency - a.proficiency);

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
          <Code /> Programming Languages
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

        {/* Languages List */}
        <Box sx={{ mb: 3 }}>
          {sortedLanguages.map((language, index) => {
            const isExpanded = hoveredLanguage === language.name;
            return (
              <motion.div
                key={language.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Box
                  onClick={() => setHoveredLanguage(isExpanded ? null : language.name)}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: isExpanded
                      ? 'rgba(137, 102, 93, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isExpanded
                      ? language.color
                      : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(137, 102, 93, 0.05)',
                      borderColor: language.color,
                    },
                  }}
                >
                  {/* Compact Language Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      {/* Name & Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <Tooltip title={`${language.name} - ${language.category}`}>
                          <Box sx={{ color: language.color, flexShrink: 0 }}>
                            {getLanguageIcon(language.icon)}
                          </Box>
                        </Tooltip>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: language.color,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {language.name}
                        </Typography>
                      </Box>

                      {/* Status Indicator */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {language.lastUsed === 'Currently using' && (
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
                        label={language.experience}
                        size="small"
                        sx={{
                          backgroundColor: language.color,
                          color: getContrastColor(language.color),
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
                        {language.description}
                      </Typography>

                      {/* Proficiency Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                            Proficiency
                          </Typography>
                          <Typography variant="caption" sx={{ color: language.color, fontWeight: 600 }}>
                            {language.proficiency}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={language.proficiency}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: language.color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        {/* Frameworks */}
                        {language.frameworks && (
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
                              Frameworks:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {language.frameworks.map((framework) => (
                                <Chip
                                  key={framework}
                                  label={framework}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    borderColor: language.color,
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
                            {language.primaryProjects.map((project) => (
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
                        {language.lastUsed && language.lastUsed !== 'Currently using' && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            Last used: {language.lastUsed}
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
                {programmingLanguages.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Languages
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                15+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Years Experience
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {programmingLanguages.filter(l => l.lastUsed === 'Currently using').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Languages
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                100+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Projects Delivered
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedProgrammingLanguagesCard;