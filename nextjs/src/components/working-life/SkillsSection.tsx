'use client';

import { Box, Typography } from '@mui/material';
import { SectionTitle } from '@/components/common';
import { SkillsGrid } from './skills';
import { skillsSectionContent } from './content';

interface SkillsSectionProps {
  id?: string;
}

const SkillsSection = ({ id = 'skills' }: SkillsSectionProps) => {
  return (
    <Box sx={{ mb: 6 }}>
      <SectionTitle id={id} title={skillsSectionContent.title} sx={{ mb: 1 }} />
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
