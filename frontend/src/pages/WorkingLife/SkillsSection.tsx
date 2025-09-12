import { Box, Typography } from '@mui/material';
import SkillsGrid from './skills/SkillsGrid';

const SkillsSection = () => {

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
        Skills & Expertise
      </Typography>
      <SkillsGrid />
    </Box>
  );
};

export default SkillsSection;