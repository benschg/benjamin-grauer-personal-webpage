import { Box, Typography, Paper } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Work, School, Star } from '@mui/icons-material';

const TimelineSection = () => {
  const timelineEvents = [
    {
      year: '2023',
      title: 'Head of Frameworks',
      company: 'Verity',
      description: 'Leading framework development and technical architecture',
      type: 'work',
    },
    {
      year: '2021-2023',
      title: 'Head of Software',
      company: '9T Labs',
      description: 'Led software development for innovative manufacturing solutions',
      type: 'work',
    },
    {
      year: '2017-2021',
      title: 'Head of Data Services',
      company: 'VirtaMed',
      description: 'Managed data services and technical teams for medical training solutions',
      type: 'work',
    },
    {
      year: '2011-2017',
      title: 'Engineering Manager',
      company: 'VirtaMed',
      description: 'Grew with the company, trained medical residents worldwide',
      type: 'work',
    },
    {
      year: '2010',
      title: 'Masters in Information Technology',
      company: 'ETH Zürich',
      description: 'Advanced studies in computer science and information systems',
      type: 'education',
    },
    {
      year: '2001-2010',
      title: 'Various Technical Roles',
      company: 'Multiple Companies',
      description: 'Built foundational experience in software development',
      type: 'work',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <School />;
      case 'achievement':
        return <Star />;
      default:
        return <Work />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'secondary';
      case 'achievement':
        return 'warning';
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
      <Timeline position="alternate">
        {timelineEvents.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={getColor(event.type) as any}>
                {getIcon(event.type)}
              </TimelineDot>
              {index < timelineEvents.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
              >
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
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default TimelineSection;