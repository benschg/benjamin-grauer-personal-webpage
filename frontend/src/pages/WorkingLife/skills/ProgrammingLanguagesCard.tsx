import BaseSkillCard from './BaseSkillCard';
import { programmingLanguages } from './data/programmingData';

const ProgrammingLanguagesCard = () => {
  return <BaseSkillCard title="Programming Languages" skills={programmingLanguages} />;
};

export default ProgrammingLanguagesCard;
