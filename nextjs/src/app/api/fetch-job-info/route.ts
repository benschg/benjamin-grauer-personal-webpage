import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { validateUrl } from '@/lib/url-validator';

interface JobInfoRequest {
  url: string;
}

interface JobInfoResponse {
  company: string;
  jobTitle: string;
  companyWebsite?: string;
  jobPostingText?: string;
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

// Helper to convert HTML to readable text while preserving structure
function htmlToText(html: string): string {
  let text = html;

  // Remove script, style, and other non-content tags
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
  text = text.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
  text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  text = text.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Convert headers to text with line break after
  text = text.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n$1\n');

  // Convert paragraphs to single line break
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Convert divs - only add break after closing
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<div[^>]*>/gi, '');

  // Convert line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // Convert list items to bullet points
  text = text.replace(/<li[^>]*>/gi, '• ');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<\/?[uo]l[^>]*>/gi, '');

  // Convert bold/strong to **text**
  text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');

  // Convert italic/em to *text*
  text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&rsquo;/g, "'");
  text = text.replace(/&lsquo;/g, "'");
  text = text.replace(/&rdquo;/g, '"');
  text = text.replace(/&ldquo;/g, '"');
  text = text.replace(/&ndash;/g, '–');
  text = text.replace(/&mdash;/g, '—');
  text = text.replace(/&bull;/g, '•');
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // Clean up whitespace
  text = text.replace(/[ \t]+/g, ' '); // Collapse horizontal whitespace to single space
  text = text.replace(/ \n/g, '\n'); // Remove trailing spaces before newlines
  text = text.replace(/\n /g, '\n'); // Remove leading spaces after newlines
  text = text.replace(/\n{2,}/g, '\n'); // Collapse multiple newlines to single

  // Clean up lines - remove empty lines and trim each line
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines.join('\n');
}

// Helper to fetch web page content
async function fetchWebPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`WEBSITE_RATE_LIMIT: The job posting website is rate limiting requests. Try again in a few minutes or paste the job description manually.`);
      }
      if (response.status === 403) {
        throw new Error(`WEBSITE_BLOCKED: The job posting website blocked the request. This site may require login or block automated access. Please paste the job description manually.`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Convert HTML to readable text with preserved formatting
    const textContent = htmlToText(html);

    // Limit content length for the extraction call (shorter than full CV generation)
    const maxLength = 8000;
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '... [content truncated]'
      : textContent;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    if (error instanceof Error && (error.message.startsWith('WEBSITE_') || error.message.startsWith('HTTP'))) {
      throw error;
    }
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

    // Validate URL to prevent SSRF attacks
    const urlValidation = validateUrl(params.url);
    if (!urlValidation.isValid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    // Initialize Gemini with a fast model for this simple extraction
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Fetch the job posting content
    const pageContent = await fetchWebPage(params.url);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = EXTRACT_JOB_INFO_PROMPT.replace('{url}', params.url).replace(
      '{content}',
      pageContent
    );

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jobInfo = parseJsonResponse<JobInfoResponse>(responseText);

    // Include the raw page content for the job posting text field
    return NextResponse.json({
      ...jobInfo,
      jobPostingText: pageContent,
    });
  } catch (error) {
    console.error('Error fetching job info:', error);

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Quota/rate limit errors
      if (message.includes('429') || message.includes('quota') || message.includes('rate limit') || message.includes('resource_exhausted')) {
        return NextResponse.json(
          { error: 'Gemini API quota exceeded. The free tier has limited requests per minute. Please wait a minute and try again, or check your Google Cloud Console for quota details.' },
          { status: 429 }
        );
      }

      // Authentication errors
      if (message.includes('401') || message.includes('api key') || message.includes('invalid_api_key')) {
        return NextResponse.json(
          { error: 'Gemini API key is invalid or expired. Please check your GEMINI_API_KEY environment variable.' },
          { status: 500 }
        );
      }

      // Website rate limit (not Gemini)
      if (message.includes('website_rate_limit')) {
        return NextResponse.json(
          { error: 'The job posting website is rate limiting requests. Try again in a few minutes or paste the job description manually.' },
          { status: 429 }
        );
      }

      // Website blocked access
      if (message.includes('website_blocked')) {
        return NextResponse.json(
          { error: 'The job posting website blocked the request. This site may require login or block automated access. Please paste the job description manually.' },
          { status: 403 }
        );
      }

      // URL fetch errors
      if (message.includes('could not fetch')) {
        return NextResponse.json(
          { error: 'Could not fetch the job posting URL. The page may be blocked, require login, or the URL may be invalid.' },
          { status: 400 }
        );
      }

      // JSON parsing errors (AI response issues)
      if (message.includes('json') || message.includes('unexpected token')) {
        return NextResponse.json(
          { error: 'Failed to parse job information from the page. The AI could not extract structured data. Try a different job posting URL.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred while fetching job info.' }, { status: 500 });
  }
}
