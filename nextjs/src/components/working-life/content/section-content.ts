/**
 * Text content configuration for Working Life page sections.
 * Centralizes all hardcoded strings from components for easy maintenance.
 */

// ============================================================================
// Skills Section
// ============================================================================
export const skillsSectionContent = {
  title: 'Skills & Expertise',
  instruction: 'Hover over skills to see detailed experience and projects. Click on mobile devices.',
} as const;

// ============================================================================
// Timeline Section
// ============================================================================
export const timelineSectionContent = {
  title: 'Career Timeline',
  filters: {
    all: 'All',
    work: 'Work',
    education: 'Education',
    project: 'Projects',
    certification: 'Certifications',
    personal: 'Personal',
  },
} as const;

// ============================================================================
// Recommendations Section
// ============================================================================
export const recommendationsSectionContent = {
  title: 'Professional Recommendations',
  subtitle: 'What colleagues say about working with me (recommendations from LinkedIn)',
  pagination: (current: number, total: number, count: number) =>
    `Page ${current} of ${total} • ${count} recommendations`,
  cta: {
    text: 'Want to work together?',
    linkText: 'Connect with me on LinkedIn',
    linkUrl: 'https://www.linkedin.com/in/benjamin-grauer/',
  },
} as const;

// ============================================================================
// Documents Section
// ============================================================================
export const documentsSectionContent = {
  title: 'CV Documents',
  customizeTitle: 'Need a tailored version?',
  customizeDescription: 'Customize my CV for your specific requirements and export as PDF.',
  customizeButton: 'Customize CV',
} as const;

// ============================================================================
// Career Aspirations Section
// ============================================================================
export const careerAspirationsSectionContent = {
  title: 'What I Am Looking For',
} as const;

// ============================================================================
// Impact Section
// ============================================================================
export const impactSectionContent = {
  title: 'My Impact',
  description:
    "During my work at three scaling companies I've built my skills and strengths as an engineer and a leader. I grew with empathy, building connections and honoring talent and accepting the weakness both in myself and the people around me.",
  highlightsTitle: 'Experience Highlights',
  highlights: [
    'Transformed 15 teams across 2 companies into lean, agile organizations',
    'Hired and built 100+ person diverse engineering teams (dev-ops, 3D artists, UI/UX, web, and more)',
    'Delivered 40+ client projects across healthcare, logistics, and manufacturing industries',
    'Trained 200+ medical professionals at hospitals and international conferences',
    'Led migration of 30 CLI tools into one unified web platform',
  ],
} as const;

// ============================================================================
// Professional Hero Section
// ============================================================================
export const professionalHeroContent = {
  title: 'Working Life',
  subtitle:
    'Building Software & Teams that Thrive | Empowering People to Excel | Driving Innovation | 3D Specialist',
  description: `From training hundreds of surgeons on bleeding-edge medical simulators to architecting cloud solutions that revolutionized warehouse automation, I've spent 15+ years turning "what if" into "what's next." My approach is simple: Build teams where empathy meets excellence. Where diverse talents converge to create something bigger than the sum of its parts. I've grown organizations from startup to well-oiled machine, always believing that the best solutions come from people who are empowered to challenge, create, and care.

Whether it's 3D graphics, cloud architecture, or team dynamics, I bring the same curiosity and passion that hooked me when I first discovered programming. Because at the end of the day, it's not just about the code. It's about the impact we make together.`,
  profileImageAlt: 'Benjamin Grauer Profile Picture',
} as const;

// ============================================================================
// Portfolio Reference Section
// ============================================================================
export const portfolioReferenceSectionContent = {
  title: 'See My Work in Action',
  subtitle:
    'From medical software to game development, explore the projects that showcase my skills and passion for creating innovative solutions.',
  buttonText: 'Explore Portfolio',
  tagline: 'Discover my projects across medical software, games, web development, and more',
} as const;

// ============================================================================
// Personal Life Reference Section
// ============================================================================
export const personalLifeReferenceSectionContent = {
  title: 'Beyond the Professional',
  subtitle:
    "There's more to me than just work! Discover my passions, hobbies, and what drives me outside of the professional realm.",
  buttonText: 'Explore Personal Life',
  tagline: 'Discover the person behind the professional',
} as const;

