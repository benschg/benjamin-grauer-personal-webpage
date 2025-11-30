'use client';

import { Box, Typography, Card, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import workingLifeContent from '@/data/working-life-content.json';

const ImpactSection = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 2,
          color: 'text.primary',
        }}
      >
        {workingLifeContent.impact.title}
      </Typography>
      <Card
        sx={{
          p: 3,
          backgroundColor: 'rgba(137, 102, 93, 0.05)',
          border: '1px solid rgba(137, 102, 93, 0.2)',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.7,
            mb: 3,
            color: 'text.secondary',
          }}
        >
          {workingLifeContent.impact.description}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            mb: 2,
            color: 'primary.main',
          }}
        >
          Experience Highlights
        </Typography>
        <List>
          {workingLifeContent.impact.highlights.map((highlight, index) => (
            <ListItem key={index} sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary={highlight}
                primaryTypographyProps={{
                  sx: { fontSize: '0.95rem', color: 'text.primary' },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default ImpactSection;
