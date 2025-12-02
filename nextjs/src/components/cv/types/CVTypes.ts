// Section types for sidebar (left) and main content (right)
export type CVSidebarSectionType =
  | 'successes'
  | 'qualifications'
  | 'skills'
  | 'languages'
  | 'education'
  | 'courses'
  | 'portfolio'
  | 'volunteer'
  | 'hobbies'
  | 'aboutMe';

// Sliced section config for splitting content across pages
export interface CVSlicedSection {
  type: 'experience';
  start: number;
  end?: number; // undefined means to the end
  showTitle?: boolean; // Show section title (default: true for first slice)
}

export type CVMainSectionType =
  | 'header' // Name and Claim
  | 'slogan'
  | 'profile'
  | 'usp' // USP, competences, skills
  | 'functions' // Functions I was in
  | 'experience' // Work contracts (all)
  | 'sideProjects' // Side projects I am proud of
  | 'references' // Professional references
  | CVSlicedSection; // Sliced section for pagination

export interface CVSectionConfig {
  id: string;
  type: CVSidebarSectionType | CVMainSectionType;
  enabled: boolean;
  order: number;
  location: 'sidebar' | 'main';
}

// Header data (Name and Claim)
export interface CVHeaderData {
  name: string;
  title: string; // The claim/tagline
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: string;
}

// Main content sections
export interface CVExperienceEntry {
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  skills?: string[];
}

export interface CVFunctionEntry {
  title: string;
  description?: string;
}

export interface CVSideProjectEntry {
  name: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface CVReferenceEntry {
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface CVUSPEntry {
  title: string;
  description: string;
}

// Sidebar sections
export interface CVSuccessEntry {
  value: string;
  label: string;
}

export interface CVQualificationEntry {
  title: string;
  institution?: string;
  year?: string;
}

export interface CVEducationEntry {
  institution: string;
  degree: string;
  period: string;
  description?: string;
  grade?: string;
}

export interface CVCourseEntry {
  name: string;
  provider?: string;
  year?: string;
}

export interface CVPortfolioEntry {
  name: string;
  link?: string;
}

export interface CVVolunteerEntry {
  organization: string;
  role: string;
  period?: string;
  description?: string;
}

export interface CVLanguage {
  name: string;
  level: string;
}

// Legacy interfaces for backwards compatibility
export interface CVSkillCategory {
  name: string;
  skills: string[];
}

export interface CVHighlight {
  label: string;
  value: string;
}

export interface CVAboutMeEntry {
  title: string;
  description: string;
}

// Sidebar data structure
export interface CVSidebarData {
  successes: CVSuccessEntry[];
  qualifications: CVQualificationEntry[];
  skills: string[];
  languages: CVLanguage[];
  education: CVEducationEntry[];
  courses: CVCourseEntry[];
  portfolio: CVPortfolioEntry[];
  volunteer: CVVolunteerEntry[];
  hobbies: string[];
  aboutMe: CVAboutMeEntry[];
}

// Main content data structure
export interface CVMainData {
  header: CVHeaderData;
  slogan: string;
  profile: string;
  usp: CVUSPEntry[];
  functions: CVFunctionEntry[];
  experience: CVExperienceEntry[];
  sideProjects: CVSideProjectEntry[];
  references: CVReferenceEntry[];
}

// Complete CV data
export interface CVData {
  sidebar: CVSidebarData;
  main: CVMainData;
}

// Page layout definition - which sections appear on each page
export interface CVPageLayout {
  sidebar: CVSidebarSectionType[];
  main: CVMainSectionType[];
}
