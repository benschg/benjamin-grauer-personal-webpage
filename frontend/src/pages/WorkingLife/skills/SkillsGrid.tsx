import { Grid } from '@mui/material';
import CoreSkillsCard from './CoreSkillsCard';
import LanguagesCard from './LanguagesCard';
import GallupStrengthsCard from './GallupStrengthsCard';
import MethodsAchievementsCard from './MethodsAchievementsCard';
import TechnicalToolsCard from './TechnicalToolsCard';
import ProgrammingCard from './ProgrammingCard';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CoreSkillsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LanguagesCard monochrome={true} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <GallupStrengthsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MethodsAchievementsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TechnicalToolsCard />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProgrammingCard />
      </Grid>
    </Grid>
  );
};

export default SkillsGrid;
