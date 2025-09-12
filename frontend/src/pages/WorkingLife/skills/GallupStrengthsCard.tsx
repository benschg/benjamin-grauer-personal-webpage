import { Card, CardContent, Typography, Chip, Stack, Box, Link, Collapse, IconButton } from '@mui/material';
import { OpenInNew, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';

interface GallupStrength {
  name: string;
  description: string;
  domain: string;
  keyTalents: string[];
  gallupUrl: string;
}

const GallupStrengthsCard = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Detect if device supports touch
  useEffect(() => {
    const handleTouchStart = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouchStart, { once: true });
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  // Handle outside clicks for touch devices
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isTouch && componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setExpandedItem(null);
      }
    };

    if (isTouch) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTouch]);

  const handleStrengthInteraction = (strengthName: string) => {
    if (isTouch) {
      // Touch: toggle on click
      setExpandedItem(expandedItem === strengthName ? null : strengthName);
    } else {
      // Desktop: expand on hover
      setExpandedItem(strengthName);
    }
  };

  const handleStrengthHover = (strengthName: string) => {
    if (!isTouch) {
      setExpandedItem(strengthName);
    }
  };

  const handleContainerEnter = () => {
    if (!isTouch) {
      // Show the last expanded item or default to first strength
      if (!expandedItem) {
        setExpandedItem(gallupStrengths[0].name);
      }
    }
  };

  const handleContainerLeave = () => {
    if (!isTouch) {
      setExpandedItem(null);
    }
  };

  const gallupStrengths: GallupStrength[] = [
    {
      name: 'Individualization',
      description: 'People exceptionally talented in the Individualization theme are intrigued with the unique qualities of each person. They have a gift for figuring out how different people can work together productively.',
      domain: 'Relationship Building',
      keyTalents: ['Focus on Uniqueness', 'Customized Approach', 'Team Building'],
      gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252272/individualization-theme.aspx'
    },
    {
      name: 'Ideation',
      description: 'People exceptionally talented in the Ideation theme are fascinated by ideas. They are able to find connections between seemingly disparate phenomena.',
      domain: 'Strategic Thinking',
      keyTalents: ['Innovation', 'Creative Connections', 'Problem Solving'],
      gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252260/ideation-theme.aspx'
    },
    {
      name: 'Learner',
      description: 'People exceptionally talented in the Learner theme have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites them.',
      domain: 'Strategic Thinking',
      keyTalents: ['Continuous Improvement', 'Process Focus', 'Knowledge Acquisition'],
      gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252293/learner-theme.aspx'
    },
    {
      name: 'Input',
      description: 'People exceptionally talented in the Input theme have a need to collect and archive. They may accumulate information, ideas, artifacts or even relationships.',
      domain: 'Strategic Thinking',
      keyTalents: ['Information Gathering', 'Resourcefulness', 'Curiosity'],
      gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252278/input-theme.aspx'
    },
    {
      name: 'Positivity',
      description: 'People exceptionally talented in the Positivity theme have contagious enthusiasm. They are upbeat and can get others excited about what they are going to do.',
      domain: 'Relationship Building',
      keyTalents: ['Enthusiasm', 'Optimism', 'Team Energy'],
      gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252305/positivity-theme.aspx'
    }
  ];

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'Strategic Thinking':
        return '#4285F4'; // Blue
      case 'Relationship Building':
        return '#34A853'; // Green
      case 'Influencing':
        return '#FBBC05'; // Yellow
      case 'Executing':
        return '#EA4335'; // Red
      default:
        return '#89665d'; // Primary color
    }
  };

  return (
    <Card
      ref={componentRef}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
      sx={{
        height: '100%',
        p: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'primary.main',
              mr: 1,
            }}
          >
            CliftonStrengths Top 5
          </Typography>
          <Link
            href="https://www.gallup.com/cliftonstrengths/"
            target="_blank"
            rel="noopener"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <OpenInNew sx={{ fontSize: '1rem' }} />
          </Link>
        </Box>

        {/* Compact strength chips display */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {gallupStrengths.map((strength, index) => (
            <Chip
              key={index}
              label={`${index + 1}. ${strength.name}`}
              onClick={() => handleStrengthInteraction(strength.name)}
              onMouseEnter={() => handleStrengthHover(strength.name)}
              sx={{
                backgroundColor: expandedItem === strength.name ? getDomainColor(strength.domain) : 'transparent',
                color: expandedItem === strength.name ? 'white' : 'text.primary',
                border: '1px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: getDomainColor(strength.domain),
                  color: 'white',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
                boxShadow: expandedItem === strength.name ? 2 : 1,
                transform: expandedItem === strength.name ? 'translateY(-1px)' : 'none',
              }}
            />
          ))}
        </Stack>


        {/* Expandable details */}
        <Stack spacing={1}>
          {gallupStrengths.map((strength, index) => {
            const isExpanded = expandedItem === strength.name;
            return (
              <Box key={index}>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: getDomainColor(strength.domain),
                      borderRadius: 1,
                      p: 2,
                      backgroundColor: 'action.hover',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            mr: 1,
                            color: 'text.primary',
                          }}
                        >
                          {strength.name}
                        </Typography>
                        <Chip
                          label={strength.domain}
                          size="small"
                          sx={{
                            backgroundColor: getDomainColor(strength.domain),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link
                          href={strength.gallupUrl}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                            textDecoration: 'none',
                            mr: 1,
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          <OpenInNew sx={{ fontSize: '0.9rem' }} />
                        </Link>
                        {isTouch && (
                          <IconButton
                            onClick={() => setExpandedItem(null)}
                            size="small"
                            sx={{ color: 'text.secondary' }}
                          >
                            <ExpandLess sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        lineHeight: 1.4,
                        fontSize: '0.85rem',
                      }}
                    >
                      {strength.description}
                    </Typography>
                    
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                      }}
                    >
                      Key Talents:
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {strength.keyTalents.map((talent, talentIndex) => (
                        <Chip
                          key={talentIndex}
                          label={talent}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: '24px',
                            borderColor: getDomainColor(strength.domain),
                            color: 'text.primary',
                            '&:hover': {
                              backgroundColor: getDomainColor(strength.domain),
                              color: 'white',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GallupStrengthsCard;