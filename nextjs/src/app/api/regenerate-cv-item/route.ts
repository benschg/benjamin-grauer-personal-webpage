import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { CV_CHARACTER_LIMITS } from '@/config/cv.config';

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
  itemType: 'tagline' | 'profile' | 'slogan' | 'workExperienceBullet' | 'skill' | 'keyAchievement';
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

  const companyContext = context.companyName && context.jobTitle
    ? `\n\nTarget Company: ${context.companyName}\nTarget Role: ${context.jobTitle}`
    : '';

  const jobPostingContext = context.jobPosting
    ? `\n\nJob Posting Context:\n${context.jobPosting.substring(0, 2000)}`
    : '';

  const researchContext = context.companyResearch
    ? `\n\nCompany Research:\n${JSON.stringify(context.companyResearch, null, 2)}`
    : '';

  const customInstructionsText = customInstructions
    ? `\n\nAdditional Instructions:\n${customInstructions}`
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

    default:
      throw new Error(`Unsupported item type: ${itemType}`);
  }
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

    const params: RegenerateItemRequest = await request.json();

    // Validate input
    if (!params.itemType || !params.currentValue) {
      return NextResponse.json(
        { error: 'Item type and current value are required' },
        { status: 400 }
      );
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

    // Generate the prompt
    const prompt = getPromptForItemType(params);

    // Generate new content
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    const cleanedText = cleanAIResponse(generatedText);

    return NextResponse.json({
      newValue: cleanedText,
      model: modelId,
    });
  } catch (error) {
    console.error('Error regenerating CV item:', error);

    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
