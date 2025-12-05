import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

interface JobInfoRequest {
  url: string;
}

interface JobInfoResponse {
  company: string;
  jobTitle: string;
  companyWebsite?: string;
}

const EXTRACT_JOB_INFO_PROMPT = `You are a job posting analyzer. Extract the company name and job title from the following job posting content.

Job Posting URL: {url}

Job Posting Content:
{content}

Extract and return a JSON object with:
- company: The company name (just the company name, not "at Company" or similar)
- jobTitle: The job title/position name
- companyWebsite: The company's main website URL if you can determine it (not the job posting URL)

Respond ONLY with valid JSON, no additional text:
{
  "company": "Company Name",
  "jobTitle": "Job Title",
  "companyWebsite": "https://company.com or null if unknown"
}`;

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

    // Limit content length for the extraction call (shorter than full CV generation)
    const maxLength = 8000;
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '... [content truncated]'
      : textContent;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw new Error(`Could not fetch content from URL`);
  }
}

// Helper to parse JSON from AI response
function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = jsonMatch[1]?.trim() || text.trim();
  return JSON.parse(jsonStr);
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

    const params: JobInfoRequest = await request.json();

    if (!params.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Initialize Gemini with a fast model for this simple extraction
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Fetch the job posting content
    const pageContent = await fetchWebPage(params.url);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = EXTRACT_JOB_INFO_PROMPT.replace('{url}', params.url).replace(
      '{content}',
      pageContent
    );

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jobInfo = parseJsonResponse<JobInfoResponse>(responseText);

    return NextResponse.json(jobInfo);
  } catch (error) {
    console.error('Error fetching job info:', error);

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
