import { Card, CardContent, Typography, Box, Chip, Tooltip, Grid, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, DataObject, Web, ExpandMore } from '@mui/icons-material';
import { programmingLanguages } from './data/programmingLanguagesData';
import { getContrastColor } from '../../../utils/colorUtils';

// Import programming language brand icons from react-icons
import {
  SiSharp,
  SiTypescript,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiC,
  SiMysql,
} from 'react-icons/si';

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

  // Keep the original order from the data file

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
          <Code />
          Proficient Coding Languages
        </Typography>

        {/* Languages List */}
        <Box sx={{ mb: 3 }}>
          {programmingLanguages.map((language, index) => {
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
                    borderColor: isExpanded ? language.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(137, 102, 93, 0.05)',
                      borderColor: language.color,
                    },
                  }}
                >
                  {/* Compact Language Header */}
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
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
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                          >
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
            <Grid size={{ xs: 6, sm: 4 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {programmingLanguages.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Languages
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                100+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Projects Delivered
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                500K+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Lines of code written
              </Typography>
            </Grid>{' '}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedProgrammingLanguagesCard;
