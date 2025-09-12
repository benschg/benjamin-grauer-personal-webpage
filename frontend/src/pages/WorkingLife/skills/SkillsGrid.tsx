import { Grid } from '@mui/material';
import ProgrammingLanguagesCard from './ProgrammingLanguagesCard';
import FrameworksCard from './FrameworksCard';
import ToolsAndPlatformsCard from './ToolsAndPlatformsCard';
import SoftSkillsCard from './SoftSkillsCard';
import DomainExpertiseCard from './DomainExpertiseCard';
import LanguagesCard from './LanguagesCard';
import GallupStrengthsCard from './GallupStrengthsCard';

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
        <FrameworksCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProgrammingLanguagesCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DomainExpertiseCard />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <GallupStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LanguagesCard monochrome={true} />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
