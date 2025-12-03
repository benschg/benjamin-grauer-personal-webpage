'use client';

import { Box, Typography } from '@mui/material';
import { SkillsGrid } from './skills';
import { skillsSectionContent } from './content';

const SkillsSection = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          mb: 1,
          color: 'text.primary',
        }}
      >
        {skillsSectionContent.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.875rem',
          color: 'text.secondary',
          mb: 3,
          fontStyle: 'italic',
        }}
      >
        {skillsSectionContent.instruction}
      </Typography>
      <SkillsGrid />
    </Box>
  );
};

export default SkillsSection;
