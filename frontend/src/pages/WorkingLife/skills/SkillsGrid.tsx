import { Grid } from '@mui/material';
import SkillCard from './SkillCard';
import GallupStrengthsCard from './GallupStrengthsCard';
import { skillCategories } from './data/skillsData';

const SkillsGrid = () => {
  return (
    <Grid container spacing={3}>
      {skillCategories.map((category, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={index}>
          {category.title === 'Gallup Top 5 Strengths' ? (
            <GallupStrengthsCard />
          ) : (
            <SkillCard category={category} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default SkillsGrid;