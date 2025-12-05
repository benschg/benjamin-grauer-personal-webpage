/**
 * CV Configuration
 * Central configuration for CV generation and editing
 */

/**
 * Character limits for CV sections
 */
export const CV_CHARACTER_LIMITS = {
  tagline: 80,
  slogan: 100,
  profile: 500,
  keyCompetenceTitle: 40,
  keyCompetenceDescription: 150,
} as const;

/**
 * Type for CV section keys with character limits
 */
export type CVSectionWithLimit = keyof typeof CV_CHARACTER_LIMITS;
