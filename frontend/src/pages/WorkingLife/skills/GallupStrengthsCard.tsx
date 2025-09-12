import BaseSkillCard from './BaseSkillCard';
import { gallupStrengths } from './data/gallupStrengthsData';

const GallupStrengthsCard = () => {
  // Add rank numbers to the strength names
  const numberedStrengths = gallupStrengths.map((strength, index) => ({
    ...strength,
    name: `${index + 1}. ${strength.name}`,
  }));

  return (
    <BaseSkillCard
      title="CliftonStrengths Top 5"
      skills={numberedStrengths}
      titleLink="https://www.gallup.com/cliftonstrengths/"
    />
  );
};

export default GallupStrengthsCard;
