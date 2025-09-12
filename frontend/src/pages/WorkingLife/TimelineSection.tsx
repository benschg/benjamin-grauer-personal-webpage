import { useState } from 'react';
import { Box, Typography, Paper, Chip, Stack, Fade, Collapse, FormControl, Select, MenuItem, CardMedia } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Work, School, Star, Build, Assignment, Person, ExpandMore, ExpandLess } from '@mui/icons-material';
import type { TimelineEventType } from './types/TimelineTypes';
import { timelineEvents } from './data/timelineData';

const TimelineSection = () => {
  const [selectedFilter, setSelectedFilter] = useState<TimelineEventType | 'all'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filterOptions = [
    { value: 'all', label: 'All', count: timelineEvents.length },
    { value: 'work', label: 'Work', count: timelineEvents.filter(e => e.type === 'work').length },
    { value: 'education', label: 'Education', count: timelineEvents.filter(e => e.type === 'education').length },
    { value: 'project', label: 'Projects', count: timelineEvents.filter(e => e.type === 'project').length },
    { value: 'certification', label: 'Certifications', count: timelineEvents.filter(e => e.type === 'certification').length },
    { value: 'personal', label: 'Personal', count: timelineEvents.filter(e => e.type === 'personal').length },
  ] as const;

  const filteredEvents = selectedFilter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.type === selectedFilter);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (type: TimelineEventType) => {
    switch (type) {
      case 'education':
        return <School />;
      case 'achievement':
        return <Star />;
      case 'project':
        return <Build />;
      case 'certification':
        return <Assignment />;
      case 'personal':
        return <Person />;
      default:
        return <Work />;
    }
  };

  const getColor = (type: TimelineEventType): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'education':
        return 'secondary';
      case 'achievement':
        return 'warning';
      case 'project':
        return 'info';
      case 'certification':
        return 'success';
      case 'personal':
        return 'error';
      default:
        return 'primary';
    }
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
        Career Timeline
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
            onChange={(e) => setSelectedFilter(e.target.value as TimelineEventType | 'all')}
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
      <Fade in={true} timeout={500}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.5,
                          }}
                        >
                          {event.description}
                        </Typography>
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
                      <Box sx={{ ml: 1 }}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </Box>
                    </Box>

                    {/* Expandable Details */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        {event.skills && event.skills.length > 0 && (
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
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
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
                        {event.achievements && event.achievements.length > 0 && (
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
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Fade>
    </Box>
  );
};

export default TimelineSection;