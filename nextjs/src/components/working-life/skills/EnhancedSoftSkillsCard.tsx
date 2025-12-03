'use client';

import { Card, CardContent, Typography, Chip, Box, Grid, Collapse, Tooltip } from '@mui/material';
import { getContrastColor } from '@/utils/colorUtils';
import {
  Groups,
  Psychology,
  Refresh,
  EmojiObjects,
  Business,
  ExpandMore,
  StarRate,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { softSkills } from '../content';

const categoryIcons: Record<string, React.ReactNode> = {
  Leadership: <Groups sx={{ fontSize: 20 }} />,
  Methodology: <Refresh sx={{ fontSize: 20 }} />,
  Management: <Business sx={{ fontSize: 20 }} />,
  Innovation: <EmojiObjects sx={{ fontSize: 20 }} />,
  Strategic: <Psychology sx={{ fontSize: 20 }} />,
};

const EnhancedSoftSkillsCard = () => {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    ...Array.from(new Set(softSkills.map((skill) => skill.category || 'Other'))),
  ];

  const filteredSkills =
    selectedCategory === 'All'
      ? softSkills
      : softSkills.filter((skill) => skill.category === selectedCategory);

  const sortedSkills = [...filteredSkills];

  const getCategoryIcon = (category?: string) => {
    return categoryIcons[category || ''] || <StarRate sx={{ fontSize: 20 }} />;
  };

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
          <Groups /> Soft Skills & Leadership
        </Typography>

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

        <Box sx={{ mb: 3 }}>
          {sortedSkills.map((skill, index) => {
            const isExpanded = expandedSkill === skill.name;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Box
                  onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: isExpanded
                      ? 'rgba(137, 102, 93, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: isExpanded ? skill.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(137, 102, 93, 0.05)',
                      borderColor: skill.color,
                    },
                  }}
                >
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
                        gap: 1,
                        minWidth: 0,
                        flex: '1 1 auto',
                      }}
                    >
                      <Tooltip title={`${skill.name} - ${skill.category}`}>
                        <Box sx={{ color: skill.color, flexShrink: 0 }}>
                          {getCategoryIcon(skill.category)}
                        </Box>
                      </Tooltip>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: skill.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {skill.name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1,
                        flexShrink: 0,
                      }}
                    >
                      <Chip
                        label={skill.category}
                        size="small"
                        sx={{
                          backgroundColor: `${skill.color}20`,
                          color: skill.color,
                          fontSize: '0.6rem',
                          height: '18px',
                        }}
                      />
                    </Box>

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
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Chip
                          label={skill.category}
                          size="small"
                          sx={{
                            backgroundColor: `${skill.color}20`,
                            color: skill.color,
                            fontSize: '0.6rem',
                            height: '18px',
                          }}
                        />
                      </Box>
                      <Chip
                        label={skill.experience}
                        size="small"
                        sx={{
                          backgroundColor: skill.color,
                          color: getContrastColor(skill.color || '#89665d'),
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

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.85rem',
                          color: 'text.secondary',
                          mb: 2,
                          lineHeight: 1.5,
                        }}
                      >
                        {skill.description}
                      </Typography>

                      {skill.projects && skill.projects.length > 0 && (
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
                              Key Projects & Achievements:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {skill.projects.map((project, projectIndex) => (
                                <Chip
                                  key={projectIndex}
                                  label={project}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    borderColor: skill.color,
                                    color: 'text.primary',
                                    '&:hover': {
                                      backgroundColor: `${skill.color}20`,
                                      borderColor: skill.color,
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              </motion.div>
            );
          })}
        </Box>

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
                {softSkills.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Core Skills
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
                20+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Team Size Led
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                50+
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Projects Managed
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedSoftSkillsCard;
