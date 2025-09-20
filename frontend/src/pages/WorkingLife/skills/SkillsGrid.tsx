import { Grid } from '@mui/material';
import EnhancedProgrammingLanguagesCard from './EnhancedProgrammingLanguagesCard';
import EnhancedFrameworksAndTechnologiesCard from './EnhancedFrameworksAndTechnologiesCard';
import EnhancedToolsAndPlatformsCard from './EnhancedToolsAndPlatformsCard';
import EnhancedSoftSkillsCard from './EnhancedSoftSkillsCard';
import EnhancedDomainExpertiseCard from './EnhancedDomainExpertiseCard';
import EnhancedLanguagesCard from './EnhancedLanguagesCard';
import EnhancedCliftonStrengthsCard from './EnhancedCliftonStrengthsCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        <EnhancedDomainExpertiseCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedSoftSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedCliftonStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedFrameworksAndTechnologiesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedToolsAndPlatformsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedProgrammingLanguagesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedLanguagesCard />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
