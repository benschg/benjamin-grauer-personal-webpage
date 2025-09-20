import type { DetailedSkill } from '../BaseSkillCard';
import { SwissFlag, BritishFlag, FrenchFlag } from '../../../../components/FlagComponents';

export interface Language extends DetailedSkill {
  proficiencyLevel: 'Native' | 'Proficient' | 'Conversational' | 'Basic';
  contexts: string[];
  certifications?: string[];
}

export const languages: Language[] = [
  {
    name: 'German',
    description:
      'Native fluency in German with professional and academic experience. Primary language for technical documentation and business communication in DACH region.',
    category: 'Native',
    proficiencyLevel: 'Native',
    experience: 'Lifetime',
    icon: <SwissFlag />,
    color: '#DC143C',
    contexts: [
      'Technical Documentation',
      'Business Communication',
      'Software Development',
      'Customer Support',
      'Academic Writing',
    ],
    projects: [
      'Native Speaker',
      'Swiss German Dialect',
      'Technical Writing',
      'Business Presentations',
    ],
  },
  {
    name: 'English',
    description:
      'Professional proficiency in English for international business communication, software development, and technical documentation. Daily working language in global teams.',
    category: 'Proficient',
    proficiencyLevel: 'Proficient',
    experience: '15+ years',
    icon: <BritishFlag />,
    color: '#012169',
    contexts: [
      'Software Development',
      'International Business',
      'Technical Documentation',
      'Conference Presentations',
      'Team Collaboration',
    ],
    projects: [
      'International Projects',
      'API Documentation',
      'Technical Presentations',
      'Global Team Communication',
    ],
    certifications: ['Cambridge Certificate'],
  },
  {
    name: 'French',
    description:
      'Conversational French for everyday communication, business interactions, and travel. Living in French-speaking Switzerland provides daily practice opportunities.',
    category: 'Conversational',
    proficiencyLevel: 'Conversational',
    experience: '8+ years',
    icon: <FrenchFlag />,
    color: '#0055A4',
    contexts: [
      'Daily Communication',
      'Business Meetings',
      'Travel & Tourism',
      'Local Interactions',
      'Basic Documentation',
    ],
    projects: [
      'Swiss French Environment',
      'Client Communication',
      'Local Networking',
      'Cultural Integration',
    ],
  },
];
