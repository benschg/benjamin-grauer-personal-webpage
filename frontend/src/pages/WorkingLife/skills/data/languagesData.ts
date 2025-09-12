export interface Language {
  name: string;
  level: string;
  countryCode: string;
  country: string;
}

export const languages: Language[] = [
  {
    name: 'German',
    level: 'Native',
    countryCode: 'CH',
    country: 'Switzerland',
  },
  {
    name: 'English',
    level: 'Proficient',
    countryCode: 'GB',
    country: 'United Kingdom',
  },
  {
    name: 'French',
    level: 'Casual',
    countryCode: 'FR',
    country: 'France',
  },
];
