import BaseSkillCard from './BaseSkillCard';
import { softSkills } from './data/softSkillsData';

const SoftSkillsCard = () => {
  return <BaseSkillCard title="Soft Skills" skills={softSkills} />;
};

export default SoftSkillsCard;
