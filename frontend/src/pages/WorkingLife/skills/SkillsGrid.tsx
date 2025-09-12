import { Grid } from '@mui/material';
import ProgrammingLanguagesCard from './ProgrammingLanguagesCard';
import FrameworksAndTechnologiesCard from './FrameworksAndTechnologiesCard';
import ToolsAndPlatformsCard from './ToolsAndPlatformsCard';
import SoftSkillsCard from './SoftSkillsCard';
import DomainExpertiseCard from './DomainExpertiseCard';
import LanguagesCard from './LanguagesCard';
import CliftonStrengthsCard from './CliftonStrengthsCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SoftSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ToolsAndPlatformsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FrameworksAndTechnologiesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProgrammingLanguagesCard />
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
