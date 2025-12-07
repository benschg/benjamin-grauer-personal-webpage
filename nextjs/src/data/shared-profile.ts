// Public information (safe for GitHub)
const publicProfile = {
  name: 'Benjamin Grauer',
  tagline: 'Bridging Creative Vision & Technical Execution by Empowering Teams',
  linkedin: 'linkedin.com/in/benjamin-grauer',
  website: 'benjamingrauer.ch',
  photo: '/Benjamin_Grauer_ProfilePic_Transparent_1024.webp',
};

// Private information loaded from environment variables
// These are only available when NEXT_PUBLIC_ prefixed env vars are set
export const sharedProfile = {
  ...publicProfile,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'benjamin@benjamingrauer.ch',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  location: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Zürich, Switzerland',
};
