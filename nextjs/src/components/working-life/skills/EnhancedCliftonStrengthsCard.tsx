'use client';

import { Card, CardContent, Typography, Chip, Box, Collapse, Tooltip } from '@mui/material';
import { getContrastColor } from '@/utils/colorUtils';
import {
  Psychology,
  Groups,
  Campaign,
  Assignment,
  ExpandMore,
  Star,
  OpenInNew,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cliftonStrengths } from '../content';

const domainIcons = {
  'Strategic Thinking': <Psychology sx={{ fontSize: 20 }} />,
  'Relationship Building': <Groups sx={{ fontSize: 20 }} />,
  Influencing: <Campaign sx={{ fontSize: 20 }} />,
  Executing: <Assignment sx={{ fontSize: 20 }} />,
};

const EnhancedCliftonStrengthsCard = () => {
  const [expandedStrength, setExpandedStrength] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [hoveredStrength, setHoveredStrength] = useState<string | null>(null);

  const domains = [
    'All',
    ...Array.from(new Set(cliftonStrengths.map((strength) => strength.domain))),
  ];

  const filteredStrengths =
    selectedDomain === 'All'
      ? cliftonStrengths
      : cliftonStrengths.filter((strength) => strength.domain === selectedDomain);

  // Add rank numbers to the strength names
  const numberedStrengths = filteredStrengths.map((strength) => {
    const originalIndex = cliftonStrengths.findIndex((s) => s.name === strength.name);
    return {
      ...strength,
      rank: originalIndex + 1,
    };
  });

  const getDomainIcon = (domain: string) => {
    return domainIcons[domain as keyof typeof domainIcons] || <Star sx={{ fontSize: 20 }} />;
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Star /> CliftonStrengths Top 5
          </Typography>
          <Tooltip title="Learn more about CliftonStrengths">
            <Box
              component="a"
              href="https://www.gallup.com/cliftonstrengths/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.3s ease',
              }}
            >
              <OpenInNew sx={{ fontSize: 20 }} />
            </Box>
          </Tooltip>
        </Box>

        {/* Domain Filter */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {domains.map((domain) => (
            <Chip
              key={domain}
              label={domain}
              onClick={() => setSelectedDomain(domain)}
              variant={selectedDomain === domain ? 'filled' : 'outlined'}
              icon={domain !== 'All' ? getDomainIcon(domain) : undefined}
              sx={{
                borderColor: 'primary.main',
                backgroundColor: selectedDomain === domain ? 'primary.main' : 'transparent',
                color: selectedDomain === domain ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>

        {/* Strengths List */}
        <Box sx={{ position: 'relative' }}>
          {numberedStrengths.map((strength, index) => {
            const isExpanded = expandedStrength === strength.name;
            const isHovered = hoveredStrength === strength.name;

            return (
              <motion.div
                key={strength.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredStrength(strength.name)}
                onHoverEnd={() => setHoveredStrength(null)}
              >
                <Box
                  onClick={() => setExpandedStrength(isExpanded ? null : strength.name)}
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
                      isHovered || isExpanded ? strength.color : 'rgba(255, 255, 255, 0.1)',
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
                      backgroundColor: strength.color,
                      transition: 'width 0.3s ease',
                    },
                  }}
                >
                  {/* Strength Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Rank Circle */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: `${strength.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: strength.color,
                          border: `2px solid ${strength.color}`,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                        }}
                      >
                        {strength.rank}
                      </Box>

                      {/* Name and Domain */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {strength.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getDomainIcon(strength.domain)}
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                            }}
                          >
                            {strength.domain}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Expand Arrow */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {strength.externalUrl && !isExpanded && (
                        <Tooltip title="Learn more">
                          <Box
                            component="a"
                            href={strength.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: 'text.secondary',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': { color: strength.color },
                              transition: 'color 0.3s ease',
                            }}
                          >
                            <OpenInNew sx={{ fontSize: 16 }} />
                          </Box>
                        </Tooltip>
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
                        {strength.description}
                      </Typography>

                      {/* Key Talents */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary',
                          }}
                        >
                          Key Talents:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {strength.keyTalents.map((talent) => (
                            <motion.div
                              key={talent}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Chip
                                label={talent}
                                size="small"
                                sx={{
                                  backgroundColor: `${strength.color}20`,
                                  color: 'text.primary',
                                  border: `1px solid ${strength.color}`,
                                  fontSize: '0.75rem',
                                  '&:hover': {
                                    backgroundColor: strength.color,
                                    color: getContrastColor(strength.color),
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      </Box>

                      {/* External Link */}
                      {strength.externalUrl && (
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                          <Box
                            component="a"
                            href={strength.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 2,
                              py: 1,
                              borderRadius: 2,
                              backgroundColor: `${strength.color}20`,
                              color: strength.color,
                              border: `1px solid ${strength.color}`,
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: strength.color,
                                color: getContrastColor(strength.color),
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Learn More <OpenInNew sx={{ fontSize: 16 }} />
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

        {/* Summary Stats */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(137, 102, 93, 0.05)',
            border: '1px solid rgba(137, 102, 93, 0.2)',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {Object.entries(
            cliftonStrengths.reduce(
              (acc, strength) => {
                acc[strength.domain] = (acc[strength.domain] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            )
          ).map(([domain, count]) => (
            <Box key={domain} sx={{ textAlign: 'center' }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}
              >
                {getDomainIcon(domain)}
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  {count}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {domain}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedCliftonStrengthsCard;
