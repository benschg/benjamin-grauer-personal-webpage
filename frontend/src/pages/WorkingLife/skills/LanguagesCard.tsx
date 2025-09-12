import BaseSkillCard from './BaseSkillCard';
import { languages } from './data/languagesData';

interface LanguagesCardProps {
  monochrome?: boolean;
}

const LanguagesCard = ({ monochrome = false }: LanguagesCardProps) => {
  return <BaseSkillCard title="Languages" skills={languages} monochrome={monochrome} />;
};

export default LanguagesCard;
