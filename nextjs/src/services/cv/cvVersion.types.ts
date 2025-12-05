import { Timestamp } from 'firebase/firestore';

export interface CVWorkExperienceEntry {
  company: string;
  title: string;
  period: string;
  bullets: string[]; // 3-5 achievement-focused bullets tailored to job
}

export interface CVSkillCategory {
  category: string;
  skills: string[]; // Skills prioritized for the role
}

export interface CVKeyCompetence {
  title: string; // Short, punchy title (2-4 words)
  description: string; // Brief explanation of the competence
}

export interface MotivationLetter {
  subject: string; // Email subject line
  greeting: string; // e.g., "Dear Hiring Manager,"
  opening: string; // Opening paragraph
  body: string; // Main body (2-3 paragraphs)
  closing: string; // Closing paragraph
  signoff: string; // e.g., "Best regards,"
}

export interface CVVersionContent {
  // Header section
  tagline: string;
  profile: string;
  slogan?: string;

  // Work experience - customized bullet points
  workExperience?: CVWorkExperienceEntry[];

  // Skills - prioritized and grouped
  skills?: CVSkillCategory[];

  // Key competences - 3-5 with title and description
  keyCompetences?: CVKeyCompetence[];

  // Legacy: Key achievements as strings (deprecated, use keyCompetences)
  keyAchievements?: string[];

  // Education summary (optional customization)
  education?: string;

  // Motivation letter for the job application
  motivationLetter?: MotivationLetter;
}

export interface CVJobContext {
  company: string;
  position: string;
  jobPosting: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  uploadedFileName?: string;
  customInstructions?: string;
}

export interface CVLLMMetadata {
  model: string;
  promptVersion: string;
  generatedAt: Timestamp;
}

export interface CVVersion {
  id: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDefault: boolean;
  jobContext?: CVJobContext;
  content: CVVersionContent;
  llmMetadata?: CVLLMMetadata;
}

export interface CreateCVVersionInput {
  name: string;
  content: CVVersionContent;
  jobContext?: CVJobContext;
  llmMetadata?: Omit<CVLLMMetadata, 'generatedAt'>;
  isDefault?: boolean;
}

export interface UpdateCVVersionInput {
  name?: string;
  content?: Partial<CVVersionContent>;
  jobContext?: CVJobContext;
  isDefault?: boolean;
}
