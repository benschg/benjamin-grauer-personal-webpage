import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// Types
interface CompanyResearch {
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

interface WorkExperienceEntry {
  company: string;
  title: string;
  period: string;
  bullets: string[];
}

interface SkillCategory {
  category: string;
  skills: string[];
}

interface GeneratedCVContent {
  tagline: string;
  profile: string;
  slogan?: string;
  workExperience?: WorkExperienceEntry[];
  skills?: SkillCategory[];
  keyAchievements?: string[];
  education?: string;
}

interface CVGenerationRequest {
  currentTagline: string;
  currentProfile: string;
  currentSlogan?: string;
  company?: string;
  jobTitle: string;
  jobPosting?: string;
  jobPostingUrl?: string;
  companyWebsite?: string;
  profileData?: string;
  customInstructions?: string;
  modelId?: string;
}

// Prompt templates
const PROMPT_VERSION = '1.0';

const COMPANY_RESEARCH_PROMPT = `You are a professional researcher helping to understand a company for a job application.

Target Position: {jobTitle}
{companyLine}

Analyze the following information and extract key details about the company and role.

{jobPostingSection}

Please provide a JSON response with the following structure:
{
  "company": {
    "name": "Company name",
    "industry": "Industry/sector",
    "culture": ["Key culture points"],
    "values": ["Company values mentioned or implied"],
    "techStack": ["Technologies mentioned"]
  },
  "role": {
    "title": "Job title",
    "level": "Junior/Mid/Senior/Lead/Principal",
    "keyResponsibilities": ["Main responsibilities"],
    "requiredSkills": ["Must-have skills"],
    "preferredSkills": ["Nice-to-have skills"],
    "keywords": ["Important keywords from the posting"]
  },
  "insights": {
    "whatTheyValue": "Brief summary of what the company seems to value in candidates",
    "toneGuidance": "Suggested tone for application materials"
  }
}

Respond ONLY with valid JSON, no additional text.`;

const CV_CUSTOMIZATION_PROMPT = `You are an expert CV writer helping to tailor a comprehensive professional CV for a specific job application.

Current CV Content:
- Tagline: {currentTagline}
- Profile Summary: {currentProfile}
- Slogan: {currentSlogan}

Target Company & Role Research:
{companyResearch}

{whatLookingForSection}

Candidate's Full Profile Data:
{profileData}

Job Posting:
{jobPosting}

{customInstructions}

Generate a COMPLETE customized CV with all sections tailored for this specific role. Use the candidate's profile data to create compelling, achievement-focused content.

Guidelines:
1. Align all content with the company's values and culture
2. Incorporate relevant keywords naturally (not keyword stuffing)
3. Highlight skills and experience most relevant to the role
4. Emphasize achievements and expertise that match job requirements
5. Reflect the candidate's career aspirations if provided
6. Maintain authenticity and professionalism
7. Keep the candidate's genuine voice and personality

Section Requirements:

1. TAGLINE: Maximum 100 characters, punchy and memorable

2. PROFILE: 150-250 words, compelling narrative that positions the candidate as ideal for this role

3. SLOGAN: Maximum 50 characters (optional, can be empty string)

4. WORK EXPERIENCE: For each relevant position from the profile data:
   - Include company name, job title, and time period exactly as provided
   - Write 3-5 achievement-focused bullet points tailored to highlight relevance to the target role
   - Start each bullet with a strong action verb
   - Include quantifiable results where possible
   - Prioritize experiences most relevant to the target role

5. SKILLS: Group skills into categories relevant to the role:
   - Prioritize skills mentioned in the job posting
   - Group by logical categories (e.g., "Programming Languages", "Cloud & DevOps", "Leadership")
   - Include 4-8 skills per category
   - Create 3-5 skill categories

6. KEY ACHIEVEMENTS: Select 3-5 top achievements from the profile that are most relevant to the target role:
   - Make them specific and quantifiable
   - Focus on impact and results
   - Align with what the company values

7. EDUCATION: Brief summary of education credentials (1-2 sentences)

Respond with valid JSON only:
{
  "tagline": "Your customized tagline",
  "profile": "Your customized profile summary",
  "slogan": "Your customized slogan or empty string",
  "workExperience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "period": "Start - End",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "skills": [
    {
      "category": "Category Name",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  "keyAchievements": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "education": "Education summary"
}

Respond ONLY with valid JSON, no additional text.`;

// Available models
const ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-3-pro-preview',
];

const DEFAULT_MODEL = 'gemini-2.5-flash';

// Helper to parse JSON from AI response
function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = jsonMatch[1]?.trim() || text.trim();
  return JSON.parse(jsonStr);
}

// Helper to fetch web page content
async function fetchWebPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CVGenerator/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML to text conversion
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // Limit content length
    const maxLength = 15000;
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '... [content truncated]'
      : textContent;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return `[Note: Could not fetch content from ${url}]`;
  }
}

// Build job posting context
async function buildJobPostingContext(params: CVGenerationRequest): Promise<string> {
  let context = params.jobPosting || '';

  if (params.jobPostingUrl) {
    const pageContent = await fetchWebPage(params.jobPostingUrl);
    context += `\n\n=== JOB POSTING FROM URL (${params.jobPostingUrl}) ===\n${pageContent}`;
  }

  if (params.companyWebsite) {
    const pageContent = await fetchWebPage(params.companyWebsite);
    context += `\n\n=== COMPANY WEBSITE (${params.companyWebsite}) ===\n${pageContent}`;
  }

  return context;
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const params: CVGenerationRequest = await request.json();

    // Validate input
    if (!params.jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
    }

    if (!params.currentTagline || !params.currentProfile) {
      return NextResponse.json({ error: 'Current CV content is required' }, { status: 400 });
    }

    // Validate and set model
    const modelId =
      params.modelId && ALLOWED_MODELS.includes(params.modelId) ? params.modelId : DEFAULT_MODEL;

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    // Build context
    const jobPostingContext = await buildJobPostingContext(params);

    // Step 1: Research the company
    const researchPrompt = COMPANY_RESEARCH_PROMPT.replace('{jobTitle}', params.jobTitle)
      .replace(
        '{companyLine}',
        params.company ? `Target Company: ${params.company}` : ''
      )
      .replace(
        '{jobPostingSection}',
        jobPostingContext
          ? `Job Posting / Additional Context:\n${jobPostingContext}`
          : 'No additional job posting provided. Use the company name and job title to infer typical requirements.'
      );
    const researchResult = await model.generateContent(researchPrompt);
    const researchText = researchResult.response.text();
    const companyResearch = parseJsonResponse<CompanyResearch>(researchText);

    // Override with user-provided values if available
    if (params.company) {
      companyResearch.company.name = params.company;
    }
    if (params.jobTitle) {
      companyResearch.role.title = params.jobTitle;
    }

    // Step 2: Generate customized CV content
    // Note: "What I'm Looking For" is now included in profileData via careerAspirationsData
    let cvPrompt = CV_CUSTOMIZATION_PROMPT.replace('{currentTagline}', params.currentTagline)
      .replace('{currentProfile}', params.currentProfile)
      .replace('{currentSlogan}', params.currentSlogan || 'None')
      .replace('{companyResearch}', JSON.stringify(companyResearch, null, 2))
      .replace('{jobPosting}', jobPostingContext)
      .replace('{profileData}', params.profileData || '(No additional profile data provided)')
      .replace('{whatLookingForSection}', ''); // Removed: now part of profileData

    if (params.customInstructions) {
      cvPrompt = cvPrompt.replace(
        '{customInstructions}',
        `Additional Instructions from User:\n${params.customInstructions}`
      );
    } else {
      cvPrompt = cvPrompt.replace('{customInstructions}', '');
    }

    const cvResult = await model.generateContent(cvPrompt);
    const cvText = cvResult.response.text();
    const content = parseJsonResponse<GeneratedCVContent>(cvText);

    return NextResponse.json({
      content,
      companyResearch,
      model: modelId,
      promptVersion: PROMPT_VERSION,
    });
  } catch (error) {
    console.error('Error generating CV:', error);

    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json({ error: 'API quota exceeded. Please try again later.' }, { status: 429 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
