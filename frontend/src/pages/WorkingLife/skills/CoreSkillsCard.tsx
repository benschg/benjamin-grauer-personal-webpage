import BaseSkillCard from './BaseSkillCard';
import { coreSkills } from './data/coreSkillsData';

const CoreSkillsCard = () => {
  return <BaseSkillCard title="Core Skills" skills={coreSkills} />;
};

export default CoreSkillsCard;
