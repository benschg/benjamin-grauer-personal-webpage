import {
  GitHub,
  LinkedIn,
  Language,
  YouTube,
  Watch,
} from '@mui/icons-material';
import type { SocialLink } from './SocialLink';
import StravaIcon from '@/components/icons/StravaIcon';
import SteamIcon from '@/components/icons/SteamIcon';

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'http://github.com/benschg', icon: GitHub },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benjamin-grauer', icon: LinkedIn },
  { name: 'Website', url: 'https://benjamingrauer.com', icon: Language },
  {
    name: 'Steam',
    url: 'https://steamcommunity.com/profiles/76561197970355967',
    icon: SteamIcon,
  },
  { name: 'YouTube', url: 'https://www.youtube.com/@benschg', icon: YouTube },
];

export const fitnessLinks: SocialLink[] = [
  { name: 'Strava', url: 'https://www.strava.com/athletes/3896765', icon: StravaIcon },
  { name: 'Garmin', url: 'https://connect.garmin.com/modern/profile/benschg', icon: Watch },
];
