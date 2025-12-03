import {
  GitHub,
  LinkedIn,
  Language,
  SportsEsports,
  YouTube,
  DirectionsRun,
  Watch,
} from '@mui/icons-material';
import type { SocialLink } from './SocialLink';

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'http://github.com/benschg', icon: GitHub },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benjamin-grauer', icon: LinkedIn },
  { name: 'Website', url: 'https://benjamingrauer.com', icon: Language },
  {
    name: 'Steam',
    url: 'https://steamcommunity.com/profiles/76561197970355967',
    icon: SportsEsports,
  },
  { name: 'YouTube', url: 'https://www.youtube.com/@benschg', icon: YouTube },
];

export const fitnessLinks: SocialLink[] = [
  { name: 'Strava', url: 'https://www.strava.com/athletes/3896765', icon: DirectionsRun },
  { name: 'Garmin', url: 'https://connect.garmin.com/modern/profile/benschg', icon: Watch },
];
