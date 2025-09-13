import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  CardMedia,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  company?: string;
  location?: string;
  description: string;
  type: string;
  skills?: string[];
  achievements?: string[];
  image?: string;
  distance?: string;
  time?: string;
  achievement?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface GenericTimelineProps {
  title: string;
  events: TimelineEvent[];
  getIcon: (type: string) => ReactNode;
  getColor: (type: string) => 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  filterOptions: FilterOption[];
  showCompany?: boolean;
  showSkills?: boolean;
  showAchievements?: boolean;
  showDistance?: boolean;
  showTime?: boolean;
  showAchievement?: boolean;
}

const GenericTimeline = ({
  title,
  events,
  getIcon,
  getColor,
  filterOptions,
  showCompany = true,
  showSkills = true,
  showAchievements = true,
  showDistance = false,
  showTime = false,
  showAchievement = false,
}: GenericTimelineProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredEvents =
    selectedFilter === 'all' ? events : events.filter((event) => event.type === selectedFilter);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Animation variants for timeline cards
  const cardVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 3,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {/* Filter Dropdown */}
      <Box sx={{ mb: 4, maxWidth: 300 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 2,
            color: 'text.secondary',
          }}
        >
          Filter by Category:
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label} ({option.count})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Timeline */}
      <div>
        <Timeline
          position="alternate"
          sx={{
            '@media (max-width: 600px)': {
              '& .MuiTimelineItem-root': {
                '&::before': {
                  display: 'none',
                },
                '& .MuiTimelineOppositeContent-root': {
                  display: 'none',
                },
                '& .MuiTimelineContent-root': {
                  paddingLeft: 2,
                  paddingRight: 2,
                },
              },
            },
          }}
        >
          {filteredEvents.map((event, index) => {
            const isExpanded = expandedItems.has(event.id);
            return (
              <TimelineItem key={event.id}>
                <TimelineSeparator>
                  <TimelineDot color={getColor(event.type)} sx={{ cursor: 'pointer' }}>
                    {getIcon(event.type)}
                  </TimelineDot>
                  {index < filteredEvents.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        backgroundColor: 'background.paper',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.shadows[4],
                        },
                      }}
                      onClick={() => toggleExpanded(event.id)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              color: 'primary.main',
                            }}
                          >
                            {event.year}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              mb: 0.5,
                              color: 'text.primary',
                            }}
                          >
                            {event.title}
                          </Typography>
                          {showCompany && event.company && (
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                mb: 1,
                                color: 'text.secondary',
                              }}
                            >
                              {event.company}
                            </Typography>
                          )}
                          {event.location && (
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                mb: 1,
                                color: 'text.secondary',
                              }}
                            >
                              {event.location}
                            </Typography>
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.5,
                            }}
                          >
                            {event.description}
                          </Typography>

                          {/* Sports-specific fields */}
                          {showDistance && event.distance && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                mt: 1,
                              }}
                            >
                              Distance: {event.distance}
                            </Typography>
                          )}
                          {showTime && event.time && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                mt: 0.5,
                              }}
                            >
                              Time: {event.time}
                            </Typography>
                          )}
                          {showAchievement && event.achievement && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'success.main',
                                fontWeight: 600,
                                mt: 1,
                                fontStyle: 'italic',
                              }}
                            >
                              🏆 {event.achievement}
                            </Typography>
                          )}

                          {event.image && (
                            <Box sx={{ mt: 2 }}>
                              <CardMedia
                                component="img"
                                sx={{
                                  height: 120,
                                  objectFit: 'contain',
                                  objectPosition: index % 2 === 0 ? 'left' : 'right',
                                  borderRadius: 1,
                                  backgroundColor: 'transparent',
                                }}
                                image={event.image}
                                alt={event.title}
                              />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ ml: 1 }}>{isExpanded ? <ExpandLess /> : <ExpandMore />}</Box>
                      </Box>

                      {/* Expandable Details */}
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          {showSkills && event.skills && event.skills.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  color: 'text.primary',
                                }}
                              >
                                Skills:
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ flexWrap: 'wrap', gap: 0.5 }}
                              >
                                {event.skills.map((skill, skillIndex) => (
                                  <Chip
                                    key={skillIndex}
                                    label={skill}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                          {showAchievements &&
                            event.achievements &&
                            event.achievements.length > 0 && (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    color: 'text.primary',
                                  }}
                                >
                                  Key Achievements:
                                </Typography>
                                {event.achievements.map((achievement, achIndex) => (
                                  <Typography
                                    key={achIndex}
                                    variant="body2"
                                    sx={{
                                      color: 'text.secondary',
                                      mb: 0.5,
                                      '&::before': {
                                        content: '"• "',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                      },
                                    }}
                                  >
                                    {achievement}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                        </Box>
                      </Collapse>
                    </Paper>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    </Box>
  );
};

export default GenericTimeline;
