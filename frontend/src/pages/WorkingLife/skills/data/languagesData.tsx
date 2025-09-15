import type { DetailedSkill } from '../BaseSkillCard';
import { SwissFlag, BritishFlag, FrenchFlag } from '../../../../components/FlagComponents';

export const languages: DetailedSkill[] = [
  {
    name: 'German (Native)',
    description: 'Native fluency in German with professional and academic experience.',
    category: 'Native',
    experience: 'Lifetime',
    icon: <SwissFlag />,
    color: '#DC143C',
  },
  {
    name: 'English (Proficient)',
    description: 'Professional proficiency in English for business and technical communication.',
    category: 'Proficient',
    experience: '15+ years',
    icon: <BritishFlag />,
    color: '#012169',
  },
  {
    name: 'French (Casual)',
    description: 'Conversational French for everyday communication and travel.',
    category: 'Casual',
    experience: '8+ years',
    icon: <FrenchFlag />,
    color: '#0055A4',
  },
];
