import BaseSkillCard from './BaseSkillCard';
import { toolsAndPlatforms } from './data/toolsAndPlatformsData';

const ToolsAndPlatformsCard = () => {
  return <BaseSkillCard title="Tools & Platforms" skills={toolsAndPlatforms} />;
};

export default ToolsAndPlatformsCard;
