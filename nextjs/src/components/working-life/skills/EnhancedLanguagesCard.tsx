'use client';

import { Card, CardContent, Typography, Chip, Box, Collapse, LinearProgress } from '@mui/material';
import { getContrastColor } from '@/utils/colorUtils';
import { Language, ExpandMore, School, WorkspacePremium } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { languages } from '../content';

const EnhancedLanguagesCard = () => {
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  const getProficiencyLevel = (level: string) => {
    switch (level) {
      case 'Native':
        return 100;
      case 'Proficient':
        return 100;
      case 'Conversational':
        return 40;
      case 'Basic':
        return 30;
      default:
        return 0;
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Native':
        return '#4CAF50';
      case 'Proficient':
        return '#2196F3';
      case 'Conversational':
        return '#FF9800';
      case 'Basic':
        return '#9E9E9E';
      default:
        return '#89665d';
    }
  };

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
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Language /> Languages
        </Typography>

        {/* Languages List */}
        <Box sx={{ position: 'relative' }}>
          {languages.map((language, index) => {
            const isExpanded = expandedLanguage === language.name;
            const isHovered = hoveredLanguage === language.name;

            return (
              <motion.div
                key={language.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredLanguage(language.name)}
                onHoverEnd={() => setHoveredLanguage(null)}
              >
                <Box
                  onClick={() => setExpandedLanguage(isExpanded ? null : language.name)}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      isHovered || isExpanded
                        ? 'rgba(137, 102, 93, 0.1)'
                        : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor:
                      isHovered || isExpanded ? language.color : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: isExpanded ? '100%' : '0%',
                      height: '2px',
                      backgroundColor: language.color,
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  {/* Language Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Flag Icon */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 30,
                          '& svg': {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          },
                        }}
                      >
                        {language.icon}
                      </Box>

                      {/* Name and Proficiency */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {language.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={language.proficiencyLevel}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: `${getProficiencyColor(language.proficiencyLevel)}20`,
                              color: getProficiencyColor(language.proficiencyLevel),
                              border: `1px solid ${getProficiencyColor(language.proficiencyLevel)}`,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                            }}
                          >
                            {language.experience}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Proficiency Bar & Expand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Mini Proficiency Bar */}
                      {!isExpanded && (
                        <Box sx={{ width: 80, display: { xs: 'none', sm: 'block' } }}>
                          <LinearProgress
                            variant="determinate"
                            value={getProficiencyLevel(language.proficiencyLevel)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProficiencyColor(language.proficiencyLevel),
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      )}

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
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9rem',
                          color: 'text.secondary',
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {language.description}
                      </Typography>

                      {/* Proficiency Bar (Expanded) */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Proficiency Level
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: getProficiencyColor(language.proficiencyLevel),
                              fontWeight: 600,
                            }}
                          >
                            {language.proficiencyLevel}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getProficiencyLevel(language.proficiencyLevel)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProficiencyColor(language.proficiencyLevel),
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>

                      {/* Usage Contexts */}
                      {language.contexts && (
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              mb: 2,
                              color: 'text.primary',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <School sx={{ fontSize: 16 }} /> Usage Contexts:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {language.contexts.map((context) => (
                              <motion.div
                                key={context}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Chip
                                  label={context}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${language.color}20`,
                                    color: 'text.primary',
                                    border: `1px solid ${language.color}`,
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                      backgroundColor: language.color,
                                      color: getContrastColor(language.color),
                                    },
                                    transition: 'all 0.3s ease',
                                  }}
                                />
                              </motion.div>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Certifications */}
                      {language.certifications && language.certifications.length > 0 && (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              mb: 2,
                              color: 'text.primary',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <WorkspacePremium sx={{ fontSize: 16 }} /> Certifications:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {language.certifications.map((cert) => (
                              <Chip
                                key={cert}
                                label={cert}
                                size="small"
                                icon={<WorkspacePremium sx={{ fontSize: 14 }} />}
                                sx={{
                                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                  color: 'text.primary',
                                  border: '1px solid #ffd700',
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedLanguagesCard;
