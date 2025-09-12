import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  Collapse,
  Link,
  IconButton,
} from '@mui/material';
import { OpenInNew, ExpandLess } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface DetailedSkill {
  name: string;
  description?: string;
  category?: string;
  experience?: string;
  projects?: string[];
  color?: string;
  externalUrl?: string;
  icon?: ReactNode;
}

export interface BaseSkillCardProps {
  title: string;
  skills: string[] | DetailedSkill[];
  defaultColor?: string;
  titleLink?: string;
  monochrome?: boolean;
}

const BaseSkillCard = ({
  title,
  skills,
  defaultColor = '#89665d',
  titleLink,
  monochrome = false,
}: BaseSkillCardProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isSingleColumn, setIsSingleColumn] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect if device supports touch
  useEffect(() => {
    const handleTouchStart = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouchStart, { once: true });
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  // Detect single-column layout (mobile)
  useEffect(() => {
    const checkLayout = () => {
      setIsSingleColumn(window.innerWidth < 900); // Adjust breakpoint as needed
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
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

  const handleSkillInteraction = (skillName: string) => {
    if (isTouch) {
      setExpandedItem(expandedItem === skillName ? null : skillName);
    }
  };

  const handleSkillHover = (skillName: string) => {
    if (!isTouch) {
      setExpandedItem(skillName);
    }
  };

  const handleContainerEnter = () => {
    if (!isTouch && leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleContainerLeave = () => {
    if (!isTouch) {
      // Use a small delay to prevent flickering when moving between card and expanded content
      leaveTimeoutRef.current = setTimeout(() => {
        setExpandedItem(null);
      }, 100);
    }
  };

  const isDetailedSkill = (skill: string | DetailedSkill): skill is DetailedSkill => {
    return typeof skill === 'object' && skill !== null;
  };

  const getSkillName = (skill: string | DetailedSkill): string => {
    return isDetailedSkill(skill) ? skill.name : skill;
  };

  const getSkillColor = (skill: string | DetailedSkill): string => {
    return isDetailedSkill(skill) ? skill.color || defaultColor : defaultColor;
  };

  const hasDetailedSkills = skills.some((skill) => isDetailedSkill(skill));

  const renderSkillLabel = (skill: string | DetailedSkill) => {
    if (!isDetailedSkill(skill) || !skill.icon) {
      return getSkillName(skill);
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 20, height: 15, display: 'flex', alignItems: 'center' }}>
          {skill.icon}
        </Box>
        <span>{skill.name}</span>
      </Box>
    );
  };

  const hasExpandedItem = expandedItem !== null;

  return (
    <Card
      ref={componentRef}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
      sx={{
        height: '100%',
        p: 2,
        position: 'relative',
        overflow: 'visible',
        border: '2px solid transparent',
        ...(hasExpandedItem && {
          borderColor:
            expandedItem && hasDetailedSkills
              ? getSkillColor(
                  skills.find((skill) => isDetailedSkill(skill) && skill.name === expandedItem) ||
                    ''
                )
              : 'primary.main',
          zIndex: 10,
        }),
        transition: 'all 0.3s ease',
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
              mr: titleLink ? 1 : 0,
            }}
          >
            {title}
          </Typography>
          {titleLink && (
            <Link
              href={titleLink}
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
          )}
        </Box>

        {/* Skills chips */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', gap: 1, mb: hasDetailedSkills ? 2 : 0 }}
        >
          {skills.map((skill, skillIndex) => {
            const skillName = getSkillName(skill);
            const skillColor = getSkillColor(skill);
            const hasIcon = isDetailedSkill(skill) && !!skill.icon;

            return (
              <Chip
                key={skillIndex}
                label={renderSkillLabel(skill)}
                onClick={() => hasDetailedSkills && isTouch && handleSkillInteraction(skillName)}
                onMouseEnter={() => hasDetailedSkills && handleSkillHover(skillName)}
                variant="outlined"
                sx={{
                  borderColor: expandedItem === skillName ? skillColor : 'primary.main',
                  cursor: hasDetailedSkills ? 'pointer' : 'default',
                  backgroundColor: expandedItem === skillName ? skillColor : 'transparent',
                  color: expandedItem === skillName ? 'white' : 'text.primary',
                  '& svg': hasIcon
                    ? {
                        filter: monochrome
                          ? 'grayscale(100%) contrast(120%) brightness(0.8)'
                          : 'none',
                        transition: 'filter 0.3s ease',
                      }
                    : {},
                  '&:hover': {
                    backgroundColor: `${skillColor} !important`,
                    color: 'white !important',
                    borderColor: `${skillColor} !important`,
                    transform: hasDetailedSkills ? 'translateY(-1px)' : 'none',
                    '& svg': hasIcon
                      ? {
                          filter: 'none !important',
                        }
                      : {},
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: expandedItem === skillName ? 2 : 1,
                  transform: expandedItem === skillName ? 'translateY(-1px)' : 'none',
                }}
              />
            );
          })}
        </Stack>

        {/* Expandable details for detailed skills */}
        {hasDetailedSkills && (
          <Box
            onMouseEnter={handleContainerEnter}
            onMouseLeave={handleContainerLeave}
            sx={{
              ...(isSingleColumn
                ? {
                    // Mobile: inline expansion
                    mt: hasDetailedSkills ? 2 : 0,
                  }
                : {
                    // Desktop: overlay expansion
                    position: 'absolute',
                    top: 'calc(100% - 2px)',
                    left: -2,
                    right: -2,
                    zIndex: 1,
                  }),
            }}
          >
            {skills.map((skill, index) => {
              if (!isDetailedSkill(skill)) return null;

              const isExpanded = expandedItem === skill.name;
              return (
                <Box key={index}>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        border: isSingleColumn ? '1px solid' : '2px solid',
                        borderColor: skill.color || defaultColor,
                        borderTop: isSingleColumn ? '1px solid' : 'none',
                        borderRadius: isSingleColumn ? 1 : '0 0 4px 4px',
                        p: 2,
                        pt: isSingleColumn ? 2 : 3,
                        mt: isSingleColumn ? 1 : 0,
                        backgroundColor: '#343A40',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <span>{skill.name}</span>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {skill.externalUrl && (
                              <Link
                                href={skill.externalUrl}
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
                            )}
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
                      </Typography>

                      {skill.category && (
                        <Chip
                          label={skill.category}
                          size="small"
                          sx={{
                            backgroundColor: skill.color || defaultColor,
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px',
                            mb: 1,
                          }}
                        />
                      )}

                      {skill.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mb: 1,
                            lineHeight: 1.4,
                            fontSize: '0.85rem',
                          }}
                        >
                          {skill.description}
                        </Typography>
                      )}

                      {skill.experience && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            mb: 1,
                          }}
                        >
                          Experience: {skill.experience}
                        </Typography>
                      )}

                      {skill.projects && skill.projects.length > 0 && (
                        <>
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
                          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {skill.projects.map((project, projectIndex) => (
                              <Chip
                                key={projectIndex}
                                label={project}
                                variant="outlined"
                                size="small"
                                sx={{
                                  fontSize: '0.7rem',
                                  height: '24px',
                                  borderColor: skill.color || defaultColor,
                                  color: 'text.primary',
                                  '&:hover': {
                                    backgroundColor: skill.color || defaultColor,
                                    color: 'white',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseSkillCard;
