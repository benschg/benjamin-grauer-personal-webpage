import type { ComponentType } from 'react';
import {
  FamilyRestroom,
  Pool,
  DirectionsRun,
  ViewInAr as View3D,
  MenuBook,
  Pool as DivingIcon,
  Flight,
  Restaurant,
  Hiking,
} from '@mui/icons-material';

export interface Interest {
  id: string;
  title: string;
  description: string;
  icon: ComponentType;
  image: string;
  quote?: string;
}

// Shared highlights for CV sidebar and PersonalLifeReferenceSection
export const personalHighlights = [
  { title: 'Family & Life', description: 'Devoted husband and father', color: '#FF6B9D' },
  { title: 'Sports & Fitness', description: 'Triathlon & winter swimming', color: '#4CAF50' },
  { title: 'Adventures', description: 'Travel, diving & hiking', color: '#2196F3' },
  { title: 'Hobbies', description: '3D animations, cooking, reading, crafting & video games', color: '#FF9800' },
];

// "About Me" summary for CV sidebar (derived from personalHighlights)
export const cvAboutMe = personalHighlights.map(({ title, description }) => ({ title, description }));

export const interests: Interest[] = [
  {
    id: 'family',
    title: 'Family Man',
    description:
      'Being a devoted husband and father is my top priority. Family time creates the foundation for everything else in life.',
    icon: FamilyRestroom,
    image: '/personal-life/interest-family.jpg',
  },
  {
    id: 'winter-swimming',
    title: 'Winter Swimming',
    description:
      'The invigorating challenge of cold water swimming builds mental resilience and physical strength.',
    icon: Pool,
    image: '/personal-life/interest-winter-swimming.webp',
  },
  {
    id: 'triathlon',
    title: 'Triathlon',
    description:
      'Triathlon is a vent for me. Doing a tough training in the morning is probably the best way to start my day.',
    icon: DirectionsRun,
    image: '/personal-life/sports-inferno-triathlon.webp',
  },
  {
    id: '3d-design',
    title: '3D & Design',
    description:
      'Creating and visualizing in three dimensions combines technical skills with artistic expression.',
    icon: View3D,
    image: '/personal-life/interest-3d-design.webp',
  },
  {
    id: 'reading',
    title: 'Reading Science Fiction',
    description:
      'Science fiction books expand the imagination and explore possibilities beyond our current reality.',
    icon: MenuBook,
    image: '/personal-life/interest-reading.webp',
  },
  {
    id: 'diving',
    title: 'Diving',
    description:
      'Exploring underwater worlds brings peace and wonder, discovering life beneath the surface.',
    icon: DivingIcon,
    image: '/personal-life/interest-diving.webp',
  },
  {
    id: 'traveling',
    title: 'Traveling',
    description:
      'Experiencing different cultures and landscapes broadens perspectives and creates lasting memories.',
    icon: Flight,
    image: '/personal-life/interest-travel.webp',
  },
  {
    id: 'cooking',
    title: 'Cooking',
    description: 'Creating delicious meals brings joy and nourishment to family and friends.',
    icon: Restaurant,
    image: '/personal-life/interest-cooking.webp',
  },
  {
    id: 'hiking',
    title: 'Hiking and Winter Sports',
    description:
      'Mountain adventures and winter activities connect me with nature and provide physical challenges.',
    icon: Hiking,
    image: '/personal-life/interest-hiking.webp',
  },
];
