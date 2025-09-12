import BaseSkillCard from './BaseSkillCard';
import { domainExpertise } from './data/domainExpertiseData';

const DomainExpertiseCard = () => {
  return <BaseSkillCard title="Domain Expertise" skills={domainExpertise} />;
};

export default DomainExpertiseCard;
