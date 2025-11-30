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

export interface CVVersionContent {
  // Header section
  tagline: string;
  profile: string;
  slogan?: string;

  // Work experience - customized bullet points
  workExperience?: CVWorkExperienceEntry[];

  // Skills - prioritized and grouped
  skills?: CVSkillCategory[];

  // Key achievements - top 3-5 most relevant
  keyAchievements?: string[];

  // Education summary (optional customization)
  education?: string;
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
