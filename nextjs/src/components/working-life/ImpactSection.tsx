'use client';

import { Box, Card, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { SectionTitle } from '@/components/common';
import { impactSectionContent } from './content';

interface ImpactSectionProps {
  id?: string;
}

const ImpactSection = ({ id = 'impact' }: ImpactSectionProps) => {
  return (
    <Box sx={{ mb: 6 }}>
      <SectionTitle id={id} title={impactSectionContent.title} sx={{ mb: 2 }} />
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
          {impactSectionContent.description}
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
          {impactSectionContent.highlightsTitle}
        </Typography>
        <List>
          {impactSectionContent.highlights.map((highlight, index) => (
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
