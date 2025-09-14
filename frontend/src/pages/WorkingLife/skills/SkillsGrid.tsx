import { Grid } from '@mui/material';
import EnhancedProgrammingLanguagesCard from './EnhancedProgrammingLanguagesCard';
import EnhancedFrameworksAndTechnologiesCard from './EnhancedFrameworksAndTechnologiesCard';
import EnhancedToolsAndPlatformsCard from './EnhancedToolsAndPlatformsCard';
import SoftSkillsCard from './SoftSkillsCard';
import EnhancedDomainExpertiseCard from './EnhancedDomainExpertiseCard';
import LanguagesCard from './LanguagesCard';
import CliftonStrengthsCard from './CliftonStrengthsCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SoftSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CliftonStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedProgrammingLanguagesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedFrameworksAndTechnologiesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedToolsAndPlatformsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <EnhancedDomainExpertiseCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LanguagesCard monochrome={true} />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
