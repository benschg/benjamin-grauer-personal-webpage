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

export interface CVDataSourceSelection {
  successes: boolean;
  whatLookingFor: boolean;
  workExperience: boolean;
  technicalSkills: boolean;
  frameworksAndTech: boolean;
  toolsAndPlatforms: boolean;
  softSkills: boolean;
  cliftonStrengths: boolean;
  domainExpertise: boolean;
  recommendations: boolean;
}

export interface CompanyResearch {
  company: {
    name: string;
    industry: string;
    culture: string[];
    values: string[];
    techStack: string[];
  };
  role: {
    title: string;
    level: string;
    keyResponsibilities: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
  };
  insights: {
    whatTheyValue: string;
    toneGuidance: string;
  };
}

export interface CVJobContext {
  company: string;
  position: string;
  jobPosting: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  uploadedFileName?: string;
  customInstructions?: string;
  dataSourceSelection?: CVDataSourceSelection;
  companyResearch?: CompanyResearch;
}

export interface CVLLMMetadata {
  model: string;
  promptVersion: string;
  generatedAt: string;
}

export interface CVVersion {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_default: boolean;
  content: CVVersionContent;
  job_context?: CVJobContext;
  llm_metadata?: CVLLMMetadata;
}

export interface CreateCVVersionInput {
  name: string;
  content: CVVersionContent;
  job_context?: CVJobContext;
  llm_metadata?: Omit<CVLLMMetadata, 'generatedAt'>;
  is_default?: boolean;
}

export interface UpdateCVVersionInput {
  name?: string;
  content?: Partial<CVVersionContent>;
  job_context?: CVJobContext;
  is_default?: boolean;
}

// Database schema type for Supabase
export interface Database {
  public: {
    Tables: {
      cv_versions: {
        Row: CVVersion;
        Insert: Omit<CVVersion, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CVVersion, 'id' | 'created_at'>>;
      };
    };
  };
}
