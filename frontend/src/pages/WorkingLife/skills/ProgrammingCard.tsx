import BaseSkillCard from './BaseSkillCard';
import { programmingSkills } from './data/programmingData';

const ProgrammingCard = () => {
  return <BaseSkillCard title="Programming" skills={programmingSkills} />;
};

export default ProgrammingCard;
