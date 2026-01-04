import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { validateUrl } from '@/lib/url-validator';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  AI_RATE_LIMIT,
} from '@/lib/rate-limiter';
import { csrfProtection } from '@/lib/csrf';

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

interface KeyCompetence {
  title: string;
  description: string;
}

interface MotivationLetter {
  subject: string;
  greeting: string;
  opening: string;
  body: string;
  closing: string;
  signoff: string;
}

interface GeneratedCVContent {
  tagline: string;
  profile: string;
  slogan?: string;
  workExperience?: WorkExperienceEntry[];
  skills?: SkillCategory[];
  keyCompetences?: KeyCompetence[];
  keyAchievements?: string[]; // Legacy, kept for backwards compatibility
  education?: string;
  motivationLetter?: MotivationLetter;
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

// Maximum length for custom instructions to prevent abuse
const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 2000;
// Maximum length for fetched content
const MAX_FETCHED_CONTENT_LENGTH = 15000;

// Dangerous patterns for prompt injection detection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /disregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /forget\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /override\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /you\s+are\s+now\s+(a|an)\s+/gi,
  /your\s+new\s+(role|purpose|instructions?)\s+(is|are)/gi,
  /system\s*:\s*/gi,
  /\[\[system\]\]/gi,
  /<<system>>/gi,
  /assistant\s*:\s*/gi,
  /human\s*:\s*/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
];

// Sanitize text to prevent prompt injection attacks
function sanitizeForPromptInjection(text: string | undefined, maxLength: number): string {
  if (!text) return '';

  // Truncate to max length
  let sanitized = text.slice(0, maxLength);

  // Remove potential prompt injection patterns
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REMOVED]');
  }

  return sanitized.trim();
}

// Sanitize custom instructions to prevent prompt injection attacks
function sanitizeCustomInstructions(instructions: string | undefined): string {
  return sanitizeForPromptInjection(instructions, MAX_CUSTOM_INSTRUCTIONS_LENGTH);
}

// Sanitize fetched content to prevent prompt injection attacks
function sanitizeFetchedContent(content: string | undefined): string {
  return sanitizeForPromptInjection(content, MAX_FETCHED_CONTENT_LENGTH);
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
8. AVOID REPETITION: Do NOT repeat the same phrases, terms, or concepts across sections. Each section should bring fresh perspective and varied vocabulary. If you mention something in the tagline, use different wording in the profile. Vary action verbs across work experience bullets.

Section Requirements:

1. TAGLINE: Maximum 100 characters, punchy and memorable

2. PROFILE: 100-170 words, compelling narrative that positions the candidate as ideal for this role (keep it concise and impactful)

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

6. KEY COMPETENCES: Create exactly 3 key competences that highlight unique value for the target role:
   - Each competence needs a SHORT, PUNCHY TITLE (2-4 words max, like "Servant Leadership", "Value-Stream Optimization", "Technical Vision")
   - Each competence needs a DESCRIPTION (1-2 sentences explaining this competence)
   - DO NOT just enumerate achievements - create meaningful competence areas
   - Titles should be professional, memorable, and differentiate the candidate
   - Descriptions should explain how this competence benefits the company
   - Align with what the company values and the role requirements

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
  "keyCompetences": [
    {
      "title": "Short Punchy Title",
      "description": "Brief description explaining this competence and its value."
    }
  ],
  "education": "Education summary"
}

Respond ONLY with valid JSON, no additional text.`;

const MOTIVATION_LETTER_PROMPT = `You are an expert cover letter writer helping to create a compelling motivation letter for a job application.

Candidate's Customized CV:
- Tagline: {tagline}
- Profile Summary: {profile}

Target Company & Role Research:
{companyResearch}

Candidate's Full Profile Data:
{profileData}

Job Posting:
{jobPosting}

{customInstructions}

Write a professional, personalized motivation letter (cover letter) that complements the CV. The letter should:

1. Be tailored specifically to the company and role
2. Highlight the most relevant experiences and skills for this position
3. Show genuine enthusiasm for the company and role
4. Connect the candidate's career aspirations to the opportunity
5. Be CONCISE - the entire letter (opening + body + closing) should be 200-250 words maximum to fit on one A4 page
6. Use a professional but warm tone matching the company culture
7. Avoid generic phrases - be specific and authentic
8. AVOID REPETITION: Use different phrasing than the CV tagline and profile. Don't copy sentences from the CV - rephrase and expand on ideas with fresh wording. Vary vocabulary throughout the letter (don't repeat the same adjectives or phrases).

Structure:
- SUBJECT: A compelling email subject line (e.g., "Application: [Role] - [Candidate's key differentiator]")
- GREETING: Professional greeting (use hiring manager's name if known, otherwise "Dear Hiring Team,")
- OPENING: Hook the reader - mention the role and your key value proposition (1-2 sentences)
- BODY: Connect your experience to their needs. Use specific examples. Show you understand their challenges and can contribute to their success (2 short paragraphs)
- CLOSING: Express enthusiasm, mention next steps, thank them (1-2 sentences)
- SIGNOFF: Professional closing (e.g., "Best regards," or "Sincerely,")

Respond with valid JSON only:
{
  "subject": "Application: [Role] at [Company] - [Key differentiator]",
  "greeting": "Dear [Name/Hiring Team],",
  "opening": "Opening paragraph text...",
  "body": "Main body paragraphs (can include line breaks with \\n\\n for paragraph separation)...",
  "closing": "Closing paragraph text...",
  "signoff": "Best regards,"
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
  // Sanitize user-provided job posting text for prompt injection
  let context = sanitizeFetchedContent(params.jobPosting);

  if (params.jobPostingUrl) {
    // Validate URL to prevent SSRF attacks
    const validation = validateUrl(params.jobPostingUrl);
    if (validation.isValid) {
      const pageContent = await fetchWebPage(params.jobPostingUrl);
      // Sanitize fetched content for prompt injection
      const sanitizedContent = sanitizeFetchedContent(pageContent);
      context += `\n\n=== JOB POSTING FROM URL (${params.jobPostingUrl}) ===\n${sanitizedContent}`;
    } else {
      context += `\n\n=== JOB POSTING URL SKIPPED: ${validation.error} ===`;
    }
  }

  if (params.companyWebsite) {
    // Validate URL to prevent SSRF attacks
    const validation = validateUrl(params.companyWebsite);
    if (validation.isValid) {
      const pageContent = await fetchWebPage(params.companyWebsite);
      // Sanitize fetched content for prompt injection
      const sanitizedContent = sanitizeFetchedContent(pageContent);
      context += `\n\n=== COMPANY WEBSITE (${params.companyWebsite}) ===\n${sanitizedContent}`;
    } else {
      context += `\n\n=== COMPANY WEBSITE URL SKIPPED: ${validation.error} ===`;
    }
  }

  return context;
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) return csrfError;

  // Check rate limit first
  const clientId = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(clientId, AI_RATE_LIMIT);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    const resetMinutes = Math.ceil(rateLimitResult.resetIn / 60000);
    return NextResponse.json(
      {
        error: `Rate limit exceeded. You can make ${AI_RATE_LIMIT.maxRequests} AI generation requests per hour. Please try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`,
      },
      {
        status: 429,
        headers: rateLimitHeaders,
      }
    );
  }

  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: rateLimitHeaders });
    }

    // Check admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: rateLimitHeaders });
    }

    const params: CVGenerationRequest = await request.json();

    // Validate input
    if (!params.jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400, headers: rateLimitHeaders });
    }

    if (!params.currentTagline || !params.currentProfile) {
      return NextResponse.json({ error: 'Current CV content is required' }, { status: 400, headers: rateLimitHeaders });
    }

    // Validate and set model
    const modelId =
      params.modelId && ALLOWED_MODELS.includes(params.modelId) ? params.modelId : DEFAULT_MODEL;

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500, headers: rateLimitHeaders });
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

    // Sanitize custom instructions to prevent prompt injection
    const sanitizedInstructions = sanitizeCustomInstructions(params.customInstructions);

    if (sanitizedInstructions) {
      cvPrompt = cvPrompt.replace(
        '{customInstructions}',
        `Additional Instructions from User:\n${sanitizedInstructions}`
      );
    } else {
      cvPrompt = cvPrompt.replace('{customInstructions}', '');
    }

    const cvResult = await model.generateContent(cvPrompt);
    const cvText = cvResult.response.text();
    const content = parseJsonResponse<GeneratedCVContent>(cvText);

    // Step 3: Generate motivation letter
    let motivationPrompt = MOTIVATION_LETTER_PROMPT
      .replace('{tagline}', content.tagline)
      .replace('{profile}', content.profile)
      .replace('{companyResearch}', JSON.stringify(companyResearch, null, 2))
      .replace('{jobPosting}', jobPostingContext)
      .replace('{profileData}', params.profileData || '(No additional profile data provided)');

    if (sanitizedInstructions) {
      motivationPrompt = motivationPrompt.replace(
        '{customInstructions}',
        `Additional Instructions from User:\n${sanitizedInstructions}`
      );
    } else {
      motivationPrompt = motivationPrompt.replace('{customInstructions}', '');
    }

    const motivationResult = await model.generateContent(motivationPrompt);
    const motivationText = motivationResult.response.text();
    const motivationLetter = parseJsonResponse<MotivationLetter>(motivationText);
    content.motivationLetter = motivationLetter;

    return NextResponse.json({
      content,
      companyResearch,
      model: modelId,
      promptVersion: PROMPT_VERSION,
    }, { headers: rateLimitHeaders });
  } catch (error) {
    // Log detailed error server-side for debugging
    console.error('Error generating CV:', error);

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Handle known error types with user-friendly messages
      if (message.includes('429') || message.includes('quota') || message.includes('rate limit') || message.includes('resource_exhausted')) {
        return NextResponse.json(
          { error: 'AI service quota exceeded. Please try again later.' },
          { status: 429, headers: rateLimitHeaders }
        );
      }

      if (message.includes('api key') || message.includes('authentication') || message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500, headers: rateLimitHeaders }
        );
      }

      if (message.includes('timeout') || message.includes('deadline')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504, headers: rateLimitHeaders }
        );
      }
    }

    // Return generic error message to prevent information leakage
    return NextResponse.json(
      { error: 'An error occurred while generating the CV. Please try again.' },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
