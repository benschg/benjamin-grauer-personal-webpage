import BaseSkillCard from './BaseSkillCard';
import { methodsAchievements } from './data/methodsAchievementsData';

const MethodsAchievementsCard = () => {
  return <BaseSkillCard title="Methods & Achievements" skills={methodsAchievements} />;
};

export default MethodsAchievementsCard;
