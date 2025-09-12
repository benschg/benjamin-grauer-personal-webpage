import BaseSkillCard from './BaseSkillCard';
import { technicalTools } from './data/technicalToolsData';

const TechnicalToolsCard = () => {
  return <BaseSkillCard title="Technical Tools" skills={technicalTools} />;
};

export default TechnicalToolsCard;
