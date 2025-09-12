import BaseSkillCard from './BaseSkillCard';
import { frameworksAndTechnologies } from './data/frameworksAndTechnologiesData';

const FrameworksAndTechnologiesCard = () => {
  return <BaseSkillCard title="Frameworks & Technologies" skills={frameworksAndTechnologies} />;
};

export default FrameworksAndTechnologiesCard;
