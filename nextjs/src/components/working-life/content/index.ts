/**
 * Working Life page content exports.
 * Import all text configurations from this barrel file.
 */

// Section UI content
export {
  skillsSectionContent,
  timelineSectionContent,
  recommendationsSectionContent,
  documentsSectionContent,
  careerAspirationsSectionContent,
  impactSectionContent,
  professionalHeroContent,
  portfolioReferenceSectionContent,
  personalLifeReferenceSectionContent,
} from './section-content';

// Data collections
export { recommendations, type Recommendation } from './recommendations';
export { careerAspirations, careerAspirationsIntro, type CareerAspiration } from './careerAspirationsData';
export { softSkills, type SoftSkill } from './softSkillsData';
export { domainExpertise, type DomainExpertise } from './domainExpertiseData';
export { frameworksAndTechnologies } from './frameworksAndTechnologiesData';
export { programmingLanguages } from './programmingLanguagesData';
export { toolsAndPlatforms } from './toolsAndPlatformsData';
export { cliftonStrengths } from './cliftonStrengthsData';
export { languages } from './languagesData';
export { timelineEvents, type TimelineEvent } from './timelineData';
export {
  documents,
  type Document,
  REFERENCES_PDF_PATH,
  CERTIFICATES_PDF_PATH,
  FULL_CV_PDF_PATH,
} from './documents';

// Re-export skill types from central types file
export type {
  FrameworkTechnology,
  ProgrammingLanguage,
  ToolPlatform,
  CliftonStrength,
  Language,
} from '@/types/skills';
