import BaseSkillCard from './BaseSkillCard';
import { frameworksAndTechnologies } from './data/frameworksData';

const FrameworksCard = () => {
  return <BaseSkillCard title="Frameworks & Technologies" skills={frameworksAndTechnologies} />;
};

export default FrameworksCard;
