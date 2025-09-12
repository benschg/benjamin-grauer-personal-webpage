import type { ComponentType } from 'react';
import type { DetailedSkill } from '../BaseSkillCard';
import * as Flags from 'country-flag-icons/react/3x2';

interface FlagProps {
  style?: React.CSSProperties;
  title?: string;
  className?: string;
}

const createFlagIcon = (CountryFlag: ComponentType<FlagProps>) => (
  <CountryFlag
    style={{
      width: '100%',
      height: '100%',
      borderRadius: '2px',
    }}
  />
);

export const languages: DetailedSkill[] = [
  {
    name: 'German (Native)',
    description: 'Native fluency in German with professional and academic experience.',
    category: 'Native',
    experience: 'Lifetime',
    icon: createFlagIcon(Flags.CH),
    color: '#DC143C',
  },
  {
    name: 'English (Proficient)',
    description: 'Professional proficiency in English for business and technical communication.',
    category: 'Proficient',
    experience: '15+ years',
    icon: createFlagIcon(Flags.GB),
    color: '#012169',
  },
  {
    name: 'French (Casual)',
    description: 'Conversational French for everyday communication and travel.',
    category: 'Casual',
    experience: '8+ years',
    icon: createFlagIcon(Flags.FR),
    color: '#0055A4',
  },
];
