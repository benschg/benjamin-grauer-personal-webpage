import type { DetailedSkill } from '../BaseSkillCard';

export interface GallupStrength extends DetailedSkill {
  domain: string;
  keyTalents: string[];
  gallupUrl: string;
}

const getDomainColor = (domain: string) => {
  switch (domain) {
    case 'Strategic Thinking':
      return '#4285F4'; // Blue
    case 'Relationship Building':
      return '#34A853'; // Green
    case 'Influencing':
      return '#FBBC05'; // Yellow
    case 'Executing':
      return '#EA4335'; // Red
    default:
      return '#89665d'; // Primary color
  }
};

export const gallupStrengths: GallupStrength[] = [
  {
    name: 'Individualization',
    description:
      'People exceptionally talented in the Individualization theme are intrigued with the unique qualities of each person. They have a gift for figuring out how different people can work together productively.',
    category: 'Relationship Building',
    domain: 'Relationship Building',
    projects: ['Focus on Uniqueness', 'Customized Approach', 'Team Building'],
    keyTalents: ['Focus on Uniqueness', 'Customized Approach', 'Team Building'],
    color: getDomainColor('Relationship Building'),
    externalUrl: 'https://www.gallup.com/cliftonstrengths/en/252272/individualization-theme.aspx',
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252272/individualization-theme.aspx',
  },
  {
    name: 'Ideation',
    description:
      'People exceptionally talented in the Ideation theme are fascinated by ideas. They are able to find connections between seemingly disparate phenomena.',
    category: 'Strategic Thinking',
    domain: 'Strategic Thinking',
    projects: ['Innovation', 'Creative Connections', 'Problem Solving'],
    keyTalents: ['Innovation', 'Creative Connections', 'Problem Solving'],
    color: getDomainColor('Strategic Thinking'),
    externalUrl: 'https://www.gallup.com/cliftonstrengths/en/252260/ideation-theme.aspx',
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252260/ideation-theme.aspx',
  },
  {
    name: 'Learner',
    description:
      'People exceptionally talented in the Learner theme have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites them.',
    category: 'Strategic Thinking',
    domain: 'Strategic Thinking',
    projects: ['Continuous Improvement', 'Process Focus', 'Knowledge Acquisition'],
    keyTalents: ['Continuous Improvement', 'Process Focus', 'Knowledge Acquisition'],
    color: getDomainColor('Strategic Thinking'),
    externalUrl: 'https://www.gallup.com/cliftonstrengths/en/252293/learner-theme.aspx',
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252293/learner-theme.aspx',
  },
  {
    name: 'Input',
    description:
      'People exceptionally talented in the Input theme have a need to collect and archive. They may accumulate information, ideas, artifacts or even relationships.',
    category: 'Strategic Thinking',
    domain: 'Strategic Thinking',
    projects: ['Information Gathering', 'Resourcefulness', 'Curiosity'],
    keyTalents: ['Information Gathering', 'Resourcefulness', 'Curiosity'],
    color: getDomainColor('Strategic Thinking'),
    externalUrl: 'https://www.gallup.com/cliftonstrengths/en/252278/input-theme.aspx',
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252278/input-theme.aspx',
  },
  {
    name: 'Positivity',
    description:
      'People exceptionally talented in the Positivity theme have contagious enthusiasm. They are upbeat and can get others excited about what they are going to do.',
    category: 'Relationship Building',
    domain: 'Relationship Building',
    projects: ['Enthusiasm', 'Optimism', 'Team Energy'],
    keyTalents: ['Enthusiasm', 'Optimism', 'Team Energy'],
    color: getDomainColor('Relationship Building'),
    externalUrl: 'https://www.gallup.com/cliftonstrengths/en/252305/positivity-theme.aspx',
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252305/positivity-theme.aspx',
  },
];
