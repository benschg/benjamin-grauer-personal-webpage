export interface GallupStrength {
  name: string;
  description: string;
  domain: string;
  keyTalents: string[];
  gallupUrl: string;
}

export const gallupStrengths: GallupStrength[] = [
  {
    name: 'Individualization',
    description:
      'People exceptionally talented in the Individualization theme are intrigued with the unique qualities of each person. They have a gift for figuring out how different people can work together productively.',
    domain: 'Relationship Building',
    keyTalents: ['Focus on Uniqueness', 'Customized Approach', 'Team Building'],
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252272/individualization-theme.aspx',
  },
  {
    name: 'Ideation',
    description:
      'People exceptionally talented in the Ideation theme are fascinated by ideas. They are able to find connections between seemingly disparate phenomena.',
    domain: 'Strategic Thinking',
    keyTalents: ['Innovation', 'Creative Connections', 'Problem Solving'],
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252260/ideation-theme.aspx',
  },
  {
    name: 'Learner',
    description:
      'People exceptionally talented in the Learner theme have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites them.',
    domain: 'Strategic Thinking',
    keyTalents: ['Continuous Improvement', 'Process Focus', 'Knowledge Acquisition'],
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252293/learner-theme.aspx',
  },
  {
    name: 'Input',
    description:
      'People exceptionally talented in the Input theme have a need to collect and archive. They may accumulate information, ideas, artifacts or even relationships.',
    domain: 'Strategic Thinking',
    keyTalents: ['Information Gathering', 'Resourcefulness', 'Curiosity'],
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252278/input-theme.aspx',
  },
  {
    name: 'Positivity',
    description:
      'People exceptionally talented in the Positivity theme have contagious enthusiasm. They are upbeat and can get others excited about what they are going to do.',
    domain: 'Relationship Building',
    keyTalents: ['Enthusiasm', 'Optimism', 'Team Energy'],
    gallupUrl: 'https://www.gallup.com/cliftonstrengths/en/252305/positivity-theme.aspx',
  },
];
