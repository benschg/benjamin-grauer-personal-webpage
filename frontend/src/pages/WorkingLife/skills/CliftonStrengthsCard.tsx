import BaseSkillCard from './BaseSkillCard';
import { cliftonStrengths } from './data/cliftonStrengthsData';

const CliftonStrengthsCard = () => {
  // Add rank numbers to the strength names
  const numberedStrengths = cliftonStrengths.map((strength, index) => ({
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

export default CliftonStrengthsCard;
