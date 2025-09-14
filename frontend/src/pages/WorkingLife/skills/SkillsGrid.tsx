import { Grid } from '@mui/material';
import EnhancedProgrammingLanguagesCard from './EnhancedProgrammingLanguagesCard';
import EnhancedFrameworksAndTechnologiesCard from './EnhancedFrameworksAndTechnologiesCard';
import ToolsAndPlatformsCard from './ToolsAndPlatformsCard';
import SoftSkillsCard from './SoftSkillsCard';
import DomainExpertiseCard from './DomainExpertiseCard';
import LanguagesCard from './LanguagesCard';
import CliftonStrengthsCard from './CliftonStrengthsCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      {/* Enhanced Programming Languages Card - Full Width */}
      <Grid size={{ xs: 12 }}>
        <EnhancedProgrammingLanguagesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SoftSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ToolsAndPlatformsCard />
      </Grid>
      {/* Enhanced Frameworks & Technologies Card - Full Width */}
      <Grid size={{ xs: 12 }}>
        <EnhancedFrameworksAndTechnologiesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DomainExpertiseCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CliftonStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LanguagesCard monochrome={true} />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
