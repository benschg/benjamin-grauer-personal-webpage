import BaseSkillCard from './BaseSkillCard';
import { programmingLanguages } from './data/programmingLanguagesData';

const ProgrammingLanguagesCard = () => {
  return <BaseSkillCard title="Programming Languages" skills={programmingLanguages} />;
};

export default ProgrammingLanguagesCard;
