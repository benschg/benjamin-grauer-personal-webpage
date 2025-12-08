import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  AI_RATE_LIMIT,
} from '@/lib/rate-limiter';

// Maximum length for custom instructions to prevent abuse
const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 1000;

// Sanitize custom instructions to prevent prompt injection attacks
function sanitizeCustomInstructions(instructions: string | undefined): string {
  if (!instructions) return '';

  // Truncate to max length
  let sanitized = instructions.slice(0, MAX_CUSTOM_INSTRUCTIONS_LENGTH);

  // Remove potential prompt injection patterns
  const dangerousPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
    /disregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
    /forget\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
    /override\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
    /you\s+are\s+now\s+(a|an)\s+/gi,
    /your\s+new\s+(role|purpose|instructions?)\s+(is|are)/gi,
    /system\s*:\s*/gi,
    /\[\[system\]\]/gi,
    /<<system>>/gi,
  ];

  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '[REMOVED]');
  }

  return sanitized.trim();
}

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

interface RegenerateItemRequest {
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
  modelId?: string;
}

// Available models
const ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-3-pro-preview',
];

const DEFAULT_MODEL = 'gemini-2.5-flash';

// Helper to parse text response
function cleanAIResponse(text: string): string {
  // Remove markdown code blocks if present
  const cleanedText = text
    .replace(/```(?:json|text)?\s*/g, '')
    .replace(/```/g, '')
    .trim();

  // Remove quotes if the entire response is wrapped in quotes
  if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
    return cleanedText.slice(1, -1);
  }

  return cleanedText;
}

// Prompt templates for different item types
function getPromptForItemType(request: RegenerateItemRequest): string {
  const { itemType, currentValue, context, customInstructions } = request;

  // Sanitize custom instructions before use
  const sanitizedInstructions = sanitizeCustomInstructions(customInstructions);

  const companyContext = context.companyName && context.jobTitle
    ? `\n\nTarget Company: ${context.companyName}\nTarget Role: ${context.jobTitle}`
    : '';

  const jobPostingContext = context.jobPosting
    ? `\n\nJob Posting Context:\n${context.jobPosting.substring(0, 2000)}`
    : '';

  const researchContext = context.companyResearch
    ? `\n\nCompany Research:\n${JSON.stringify(context.companyResearch, null, 2)}`
    : '';

  const customInstructionsText = sanitizedInstructions
    ? `\n\nAdditional Instructions:\n${sanitizedInstructions}`
    : '';

  switch (itemType) {
    case 'tagline':
      return `You are an expert CV writer. Generate a new professional tagline for a CV.${companyContext}${researchContext}

Current tagline: "${currentValue}"

Generate ONE alternative tagline that is:
- Maximum ${CV_CHARACTER_LIMITS.tagline} characters
- Professional and impactful
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Different from the current tagline but maintains the candidate's essence${jobPostingContext}${customInstructionsText}

Respond with ONLY the new tagline text, no additional formatting or explanation.`;

    case 'profile':
      return `You are an expert CV writer. Generate a new profile summary for a CV.${companyContext}${researchContext}

Current profile: "${currentValue}"

Generate ONE alternative profile summary that is:
- Maximum ${CV_CHARACTER_LIMITS.profile} characters
- Compelling and professional
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Highlights relevant skills and achievements
- Different from the current profile but maintains the candidate's voice${jobPostingContext}${customInstructionsText}

Respond with ONLY the new profile text, no additional formatting or explanation.`;

    case 'slogan':
      return `You are an expert CV writer. Generate a new professional slogan for a CV.${companyContext}${researchContext}

Current slogan: "${currentValue}"

Generate ONE alternative slogan that is:
- Maximum ${CV_CHARACTER_LIMITS.slogan} characters
- Memorable and impactful
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Different from the current slogan${jobPostingContext}${customInstructionsText}

Respond with ONLY the new slogan text, no additional formatting or explanation.`;

    case 'workExperienceBullet':
      return `You are an expert CV writer. Generate a new achievement bullet point for a work experience entry.${companyContext}${researchContext}

Work Experience Role: ${context.workExperienceTitle || 'Not specified'} at ${context.workExperienceCompany || 'Not specified'}

Current bullet: "${currentValue}"

Generate ONE alternative achievement bullet that is:
- Starts with a strong action verb
- Includes quantifiable results where possible
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Highlights relevant skills and impact
- Different from the current bullet but maintains factual accuracy${jobPostingContext}${customInstructionsText}

Respond with ONLY the new bullet point text (without the bullet symbol), no additional formatting or explanation.`;

    case 'keyAchievement':
      return `You are an expert CV writer. Generate a new key achievement for a CV.${companyContext}${researchContext}

Current achievement: "${currentValue}"

Generate ONE alternative key achievement that is:
- Specific and quantifiable
- Demonstrates significant impact
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Different from the current achievement but maintains factual accuracy${jobPostingContext}${customInstructionsText}

Respond with ONLY the new achievement text, no additional formatting or explanation.`;

    case 'skill':
      return `You are an expert CV writer. Suggest a new skill to add or replace in a CV skills section.${companyContext}${researchContext}

Skill Category: ${context.skillCategory || 'General'}
Current skill: "${currentValue}"

Generate ONE alternative skill that is:
- Relevant to the category "${context.skillCategory || 'General'}"
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Professional and specific
- Different from the current skill${jobPostingContext}${customInstructionsText}

Respond with ONLY the new skill text, no additional formatting or explanation.`;

    case 'keyCompetenceTitle':
      return `You are an expert CV writer. Generate a new key competence title for a CV.${companyContext}${researchContext}${jobPostingContext}
${sanitizedInstructions ? `\n**PRIORITY INSTRUCTION - The user specifically wants:** ${sanitizedInstructions}\nMake sure your generated title directly addresses this request.\n` : ''}
Current title: "${currentValue}"
${context.competenceDescription ? `Current description: "${context.competenceDescription}"` : ''}

Generate ONE alternative key competence title that is:
- Maximum ${CV_CHARACTER_LIMITS.keyCompetenceTitle} characters
- Short and punchy (2-4 words)
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Professional and impactful
- Different from the current title

Respond with ONLY the new title text, no additional formatting or explanation.`;

    case 'keyCompetenceDescription':
      return `You are an expert CV writer. Generate a new key competence description for a CV.${companyContext}${researchContext}${jobPostingContext}
${sanitizedInstructions ? `\n**PRIORITY INSTRUCTION - The user specifically wants:** ${sanitizedInstructions}\nMake sure your generated description directly addresses this request.\n` : ''}
${context.competenceTitle ? `Competence title: "${context.competenceTitle}"` : ''}
Current description: "${currentValue}"

Generate ONE alternative key competence description that is:
- Maximum ${CV_CHARACTER_LIMITS.keyCompetenceDescription} characters
- Brief and impactful explanation of the competence
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Different from the current description but maintains the competence theme

Respond with ONLY the new description text, no additional formatting or explanation.`;

    case 'keyCompetence':
      return `You are an expert CV writer. Generate a new key competence (title and description) for a CV.${companyContext}${researchContext}${jobPostingContext}
${sanitizedInstructions ? `\n**PRIORITY INSTRUCTION - The user specifically wants:** ${sanitizedInstructions}\nMake sure your generated competence directly addresses this request.\n` : ''}
Current title: "${context.competenceTitle || currentValue}"
Current description: "${context.competenceDescription || ''}"

Generate ONE alternative key competence with both title and description that is:
- Title: Maximum ${CV_CHARACTER_LIMITS.keyCompetenceTitle} characters, short and punchy (2-4 words)
- Description: Maximum ${CV_CHARACTER_LIMITS.keyCompetenceDescription} characters, brief and impactful
- Tailored to the target role${context.companyName ? ' and company' : ''}
- Professional and impactful
- Different from the current competence but maintains relevance

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{"title": "New Title", "description": "New description text"}`;

    default:
      throw new Error(`Unsupported item type: ${itemType}`);
  }
}

export async function POST(request: Request) {
  // Check rate limit first
  const clientId = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientId, AI_RATE_LIMIT);
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

    const params: RegenerateItemRequest = await request.json();

    // Validate input
    if (!params.itemType || !params.currentValue) {
      return NextResponse.json(
        { error: 'Item type and current value are required' },
        { status: 400, headers: rateLimitHeaders }
      );
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

    // Generate the prompt
    const prompt = getPromptForItemType(params);

    // Generate new content
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    const cleanedText = cleanAIResponse(generatedText);

    return NextResponse.json({
      newValue: cleanedText,
      model: modelId,
    }, { headers: rateLimitHeaders });
  } catch (error) {
    console.error('Error regenerating CV item:', error);

    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429, headers: rateLimitHeaders }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500, headers: rateLimitHeaders });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500, headers: rateLimitHeaders });
  }
}
