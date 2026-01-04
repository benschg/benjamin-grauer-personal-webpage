import { NextRequest, NextResponse } from 'next/server';
import type { Browser } from 'puppeteer-core';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  MOTIVATION_LETTER_RATE_LIMIT,
} from '@/lib/rate-limiter';
import { csrfProtection } from '@/lib/csrf';

interface MotivationLetter {
  subject: string;
  greeting: string;
  opening: string;
  body: string;
  closing: string;
  signoff: string;
}

interface MotivationLetterPdfRequest {
  letter: MotivationLetter;
  candidateName: string;
  theme?: 'dark' | 'light';
}

// Check if running in production/Vercel environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Chromium binary from official @sparticuz/chromium GitHub releases
const CHROMIUM_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v141.0.0/chromium-v141.0.0-pack.x64.tar';

async function launchBrowser(): Promise<Browser> {
  if (isProduction) {
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');

    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.default.executablePath(CHROMIUM_URL),
      headless: true,
    });
  } else {
    const puppeteer = await import('puppeteer');

    return puppeteer.default.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      defaultViewport: { width: 794, height: 1123 },
      headless: true,
    });
  }
}

function generateLetterHtml(letter: MotivationLetter, candidateName: string, theme: 'dark' | 'light'): string {
  const colors = theme === 'dark'
    ? {
        bg: '#343a40',
        text: '#ffffff',
        textSecondary: '#e0e0e0',
        accent: '#89665d',
      }
    : {
        bg: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#333333',
        accent: '#89665d',
      };

  // Sanitize user-provided content to prevent XSS in PDF
  const sanitizeText = (text: string): string => {
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Format body paragraphs - split on double newlines, sanitize each
  const bodyParagraphs = letter.body
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin: 0 0 1em 0; line-height: 1.6;">${sanitizeText(p)}</p>`)
    .join('');

  const safeCandidateName = sanitizeText(candidateName);
  const safeGreeting = sanitizeText(letter.greeting);
  const safeOpening = sanitizeText(letter.opening);
  const safeClosing = sanitizeText(letter.closing);
  const safeSignoff = sanitizeText(letter.signoff);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Quicksand', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: ${colors.text};
      background: ${colors.bg};
    }

    .letter-container {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 25mm 20mm 25mm;
      box-sizing: border-box;
    }

    .header {
      margin-bottom: 2em;
      border-bottom: 2px solid ${colors.accent};
      padding-bottom: 1em;
    }

    .candidate-name {
      font-size: 18pt;
      font-weight: 600;
      color: ${colors.accent};
      margin: 0 0 0.25em 0;
    }

    .date {
      font-size: 10pt;
      color: ${colors.textSecondary};
      margin-bottom: 2em;
    }

    .greeting {
      font-weight: 500;
      margin-bottom: 1.5em;
    }

    .body-section {
      margin-bottom: 1.5em;
    }

    .body-section p {
      text-align: justify;
    }

    .closing {
      margin-bottom: 2em;
    }

    .signoff {
      margin-bottom: 0.5em;
    }

    .signature {
      font-weight: 600;
      color: ${colors.accent};
    }
  </style>
</head>
<body>
  <div class="letter-container">
    <div class="header">
      <div class="candidate-name">${safeCandidateName}</div>
    </div>

    <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

    <div class="greeting">${safeGreeting}</div>

    <div class="body-section">
      <p style="margin: 0 0 1em 0; line-height: 1.6;">${safeOpening}</p>
      ${bodyParagraphs}
      <p style="margin: 0 0 1em 0; line-height: 1.6;">${safeClosing}</p>
    </div>

    <div class="signoff">${safeSignoff}</div>
    <div class="signature">${safeCandidateName}</div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) return csrfError;

  // Check rate limit first
  const clientId = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(clientId, MOTIVATION_LETTER_RATE_LIMIT);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    const resetMinutes = Math.ceil(rateLimitResult.resetIn / 60000);
    return NextResponse.json(
      {
        error: `Rate limit exceeded. You can generate ${MOTIVATION_LETTER_RATE_LIMIT.maxRequests} motivation letter PDFs per hour. Please try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`,
      },
      {
        status: 429,
        headers: rateLimitHeaders,
      }
    );
  }

  try {
    const params: MotivationLetterPdfRequest = await request.json();

    if (!params.letter) {
      return NextResponse.json({ error: 'Letter content is required' }, { status: 400, headers: rateLimitHeaders });
    }

    if (!params.candidateName) {
      return NextResponse.json({ error: 'Candidate name is required' }, { status: 400, headers: rateLimitHeaders });
    }

    const theme = params.theme || 'light';
    const html = generateLetterHtml(params.letter, params.candidateName, theme);

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 794, height: 1123 });

    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Additional wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Generate filename from subject
    const filename = `motivation-letter-${params.letter.subject
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50)}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error('Error generating motivation letter PDF:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: rateLimitHeaders });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500, headers: rateLimitHeaders });
  }
}

export const maxDuration = 60;
