'use client';

import { Grid } from '@mui/material';
import EnhancedDomainExpertiseCard from './EnhancedDomainExpertiseCard';
import EnhancedSoftSkillsCard from './EnhancedSoftSkillsCard';
import EnhancedCliftonStrengthsCard from './EnhancedCliftonStrengthsCard';
import EnhancedFrameworksAndTechnologiesCard from './EnhancedFrameworksAndTechnologiesCard';
import EnhancedToolsAndPlatformsCard from './EnhancedToolsAndPlatformsCard';
import EnhancedProgrammingLanguagesCard from './EnhancedProgrammingLanguagesCard';
import EnhancedLanguagesCard from './EnhancedLanguagesCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        <EnhancedDomainExpertiseCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedSoftSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedCliftonStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedFrameworksAndTechnologiesCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedToolsAndPlatformsCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedProgrammingLanguagesCard />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <EnhancedLanguagesCard />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
