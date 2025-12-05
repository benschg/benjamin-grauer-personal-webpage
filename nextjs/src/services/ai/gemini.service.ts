import { DEFAULT_GEMINI_MODEL } from '@/config/gemini.config';
import type { GeminiModelId } from '@/config/gemini.config';
import type { CVVersionContent } from '@/types/database.types';
import {
  type CVDataSourceSelection,
  aggregateCVData,
  formatDataForPrompt,
} from './cvDataAggregator';

export interface UploadedFileData {
  name: string;
  content: string;
  type: string;
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

export interface GeneratedCVContent extends CVVersionContent {
  tagline: string;
  profile: string;
  slogan?: string;
}

export interface CVGenerationResult {
  content: GeneratedCVContent;
  companyResearch: CompanyResearch;
  model: string;
  promptVersion: string;
}

export interface CVGenerationParams {
  currentTagline: string;
  currentProfile: string;
  currentSlogan?: string;
  company?: string;
  jobTitle: string;
  jobPosting?: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  dataSourceSelection?: CVDataSourceSelection;
  uploadedFile?: UploadedFileData;
  customInstructions?: string;
  modelId?: GeminiModelId;
}

export const generateCustomizedCV = async (
  params: CVGenerationParams
): Promise<CVGenerationResult> => {
  // Build job posting context on client side (for text files)
  let jobPosting = params.jobPosting || '';

  // If we have an uploaded text file, include its content
  if (params.uploadedFile) {
    if (params.uploadedFile.type.startsWith('text/') || params.uploadedFile.name.endsWith('.txt')) {
      jobPosting += `\n\n[Additional file: ${params.uploadedFile.name}]\nFile contents:\n${params.uploadedFile.content}`;
    } else {
      // For non-text files, just note the filename (PDFs/images would need multimodal)
      jobPosting += `\n\n[Additional file provided: ${params.uploadedFile.name}]`;
    }
  }

  // Aggregate profile data based on selection (includes whatLookingFor from careerAspirationsData)
  let profileData = '';
  if (params.dataSourceSelection) {
    const aggregatedData = aggregateCVData(params.dataSourceSelection);
    profileData = formatDataForPrompt(aggregatedData);
  }

  // Call the Next.js API route
  const response = await fetch('/api/generate-cv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentTagline: params.currentTagline,
      currentProfile: params.currentProfile,
      currentSlogan: params.currentSlogan,
      company: params.company,
      jobTitle: params.jobTitle,
      jobPosting,
      jobPostingUrl: params.jobPostingUrl,
      companyWebsite: params.companyWebsite,
      profileData,
      customInstructions: params.customInstructions,
      modelId: params.modelId || DEFAULT_GEMINI_MODEL,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate CV');
  }

  return response.json();
};

// Check if Gemini API is configured
// The actual check happens server-side in the API route
// We return true here to allow the UI to attempt the request
export const isGeminiConfigured = (): boolean => {
  return true;
};

// Regenerate a single CV item
export interface RegenerateCVItemParams {
  itemType: 'tagline' | 'profile' | 'slogan' | 'workExperienceBullet' | 'skill' | 'keyAchievement' | 'keyCompetenceTitle' | 'keyCompetenceDescription' | 'keyCompetence';
  currentValue: string;
  context: {
    companyName?: string;
    jobTitle?: string;
    jobPosting?: string;
    companyResearch?: CompanyResearch;
    // For work experience bullets
    workExperienceTitle?: string;
    workExperienceCompany?: string;
    // For skills
    skillCategory?: string;
    // For key competences
    competenceTitle?: string;
    competenceDescription?: string;
  };
  customInstructions?: string;
  modelId?: GeminiModelId;
}

export interface RegenerateCVItemResult {
  newValue: string;
  model: string;
}

export const regenerateCVItem = async (
  params: RegenerateCVItemParams
): Promise<RegenerateCVItemResult> => {
  const response = await fetch('/api/regenerate-cv-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      itemType: params.itemType,
      currentValue: params.currentValue,
      context: params.context,
      customInstructions: params.customInstructions,
      modelId: params.modelId || DEFAULT_GEMINI_MODEL,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to regenerate item');
  }

  return response.json();
};
