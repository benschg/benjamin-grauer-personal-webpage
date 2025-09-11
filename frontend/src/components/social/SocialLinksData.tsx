import {
  GitHub,
  LinkedIn,
  SportsEsports,
  YouTube,
  DirectionsRun,
  Watch,
} from '@mui/icons-material';
import type { SocialLink } from './SocialLink';

export const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "#", icon: GitHub },
  { name: "LinkedIn", url: "#", icon: LinkedIn },
  { name: "Steam", url: "#", icon: SportsEsports },
  { name: "YouTube", url: "#", icon: YouTube },
];

export const fitnessLinks: SocialLink[] = [
  { name: "Strava", url: "#", icon: DirectionsRun },
  { name: "Garmin", url: "#", icon: Watch },
];