import { NextResponse } from 'next/server';
import type { Browser } from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';

interface PdfGenerationRequest {
  html: string;
  css: string;
  theme: 'dark' | 'light';
  filename?: string;
  baseUrl?: string;
  attachments?: string[]; // Array of PDF paths to append (e.g., ['/working-life/documents/Certificates.pdf'])
}

// Check if running in production/Vercel environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Self-hosted Chromium binary - must match @sparticuz/chromium-min version
// Hosted in public folder for faster downloads than GitHub
const CHROMIUM_PATH = '/chromium-v141.0.0-pack.tar';

async function launchBrowser(baseUrl: string): Promise<Browser> {
  if (isProduction) {
    // Production: Use puppeteer-core with remote chromium for serverless
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');

    // Construct full URL to self-hosted Chromium binary
    const chromiumUrl = `${baseUrl}${CHROMIUM_PATH}`;

    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 794, height: 1123 }, // A4 at 96 DPI
      executablePath: await chromium.default.executablePath(chromiumUrl),
      headless: true,
    });
  } else {
    // Development: Use full puppeteer with bundled Chromium
    const puppeteer = await import('puppeteer');

    return puppeteer.default.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      defaultViewport: { width: 794, height: 1123 }, // A4 at 96 DPI
      headless: true,
    });
  }
}

// Convert relative image URLs to absolute URLs or base64 data URLs
async function fixImageUrls(html: string, baseUrl: string): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');

  // Find all image src attributes
  const imgRegex = /src="\/([^"]+)"/g;
  let result = html;
  const matches = [...html.matchAll(imgRegex)];

  for (const match of matches) {
    const imagePath = match[1];
    const fullPath = path.join(process.cwd(), 'public', imagePath);

    try {
      // Try to read the file and convert to base64
      const imageBuffer = await fs.readFile(fullPath);
      const ext = path.extname(imagePath).toLowerCase();
      let mimeType = 'image/jpeg';

      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      else if (ext === '.gif') mimeType = 'image/gif';

      const base64 = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;

      result = result.replace(`src="/${imagePath}"`, `src="${dataUrl}"`);
    } catch (error) {
      // If file read fails, fall back to absolute URL
      console.warn(`Could not read image ${imagePath}, using absolute URL`);
      result = result.replace(`src="/${imagePath}"`, `src="${baseUrl}/${imagePath}"`);
    }
  }

  return result;
}

// Merge multiple PDFs into one
async function mergePdfs(mainPdf: Uint8Array, attachmentPaths: string[]): Promise<Uint8Array> {
  const fs = await import('fs/promises');
  const path = await import('path');

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();

  // Load and add the main CV PDF
  const mainDoc = await PDFDocument.load(mainPdf);
  const mainPages = await mergedPdf.copyPages(mainDoc, mainDoc.getPageIndices());
  mainPages.forEach((page) => mergedPdf.addPage(page));

  // Load and add each attachment PDF
  for (const attachmentPath of attachmentPaths) {
    try {
      // Remove leading slash and resolve path from public folder
      const relativePath = attachmentPath.startsWith('/') ? attachmentPath.slice(1) : attachmentPath;
      const fullPath = path.join(process.cwd(), 'public', relativePath);

      const attachmentBytes = await fs.readFile(fullPath);
      const attachmentDoc = await PDFDocument.load(attachmentBytes);
      const attachmentPages = await mergedPdf.copyPages(attachmentDoc, attachmentDoc.getPageIndices());
      attachmentPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err) {
      console.warn(`Could not load attachment PDF ${attachmentPath}:`, err);
      // Continue with other attachments even if one fails
    }
  }

  return mergedPdf.save();
}

// Fix MUI SVG icons - they render with currentColor which doesn't work in static HTML
// Also remove any problematic inline styles
function fixSvgIcons(html: string, theme: 'dark' | 'light'): string {
  const iconColor = theme === 'dark' ? '#b0b0b0' : '#666666';
  const accentColor = '#89665d';

  // Fix SVG fill="currentColor" - replace with actual color
  let fixed = html.replace(/fill="currentColor"/g, `fill="${iconColor}"`);

  // Fix SVG with no fill - add explicit fill
  fixed = fixed.replace(/<svg([^>]*)(?!fill=)>/g, `<svg$1 fill="${iconColor}">`);

  // Make sure SVGs have explicit dimensions if missing
  fixed = fixed.replace(
    /<svg([^>]*?)(?:width="[^"]*")?([^>]*?)(?:height="[^"]*")?([^>]*)>/g,
    (match) => {
      if (!match.includes('width=')) {
        return match.replace('<svg', '<svg width="16" height="16"');
      }
      return match;
    }
  );

  // Fix color for accent elements (links, etc)
  fixed = fixed.replace(/color:\s*var\(--cv-accent\)/g, `color: ${accentColor}`);

  return fixed;
}

export async function POST(request: Request) {
  try {
    const params: PdfGenerationRequest = await request.json();

    if (!params.html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Get base URL from request or use provided one
    const url = new URL(request.url);
    const baseUrl = params.baseUrl || `${url.protocol}//${url.host}`;

    // Fix relative image URLs to base64 data URLs
    let fixedHtml = await fixImageUrls(params.html, baseUrl);

    // Fix SVG icons for PDF rendering
    fixedHtml = fixSvgIcons(fixedHtml, params.theme);

    // Theme-specific colors
    const themeColors =
      params.theme === 'dark'
        ? {
            bgPage: '#343a40',
            bgSidebar: '#2a2e32',
            accent: '#89665d',
            textPrimary: '#ffffff',
            textSecondary: '#e0e0e0',
            textMuted: '#b0b0b0',
            highlightBg: 'rgba(137, 102, 93, 0.15)',
            skillBg: 'rgba(137, 102, 93, 0.2)',
          }
        : {
            bgPage: '#ffffff',
            bgSidebar: '#f5f0ee',
            accent: '#89665d',
            textPrimary: '#1a1a1a',
            textSecondary: '#333333',
            textMuted: '#666666',
            highlightBg: 'rgba(137, 102, 93, 0.1)',
            skillBg: 'rgba(137, 102, 93, 0.15)',
          };

    // Build full HTML document - CSS order matters: base CSS first, then PDF overrides
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Base CV styles */
    ${params.css || ''}
  </style>
  <style>
    /* PDF-specific overrides - these MUST come after base styles */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Force CSS variables to be set for PDF rendering */
    :root, .cv-document-wrapper, .cv-document-wrapper[data-theme='${params.theme}'] {
      --cv-page-width: 210mm !important;
      --cv-page-height: 297mm !important;
      --cv-page-padding: 15mm !important;
      --cv-content-height: calc(297mm - 30mm - 8mm) !important;
      --cv-bg-page: ${themeColors.bgPage} !important;
      --cv-bg-sidebar: ${themeColors.bgSidebar} !important;
      --cv-accent: ${themeColors.accent} !important;
      --cv-text-primary: ${themeColors.textPrimary} !important;
      --cv-text-secondary: ${themeColors.textSecondary} !important;
      --cv-text-muted: ${themeColors.textMuted} !important;
      --cv-highlight-bg: ${themeColors.highlightBg} !important;
      --cv-skill-bg: ${themeColors.skillBg} !important;
    }

    /* Ensure SVG icons are visible with proper color */
    svg {
      display: inline-block !important;
      vertical-align: middle !important;
      fill: ${themeColors.textMuted} !important;
    }

    svg path {
      fill: inherit !important;
    }

    /* Fix document wrapper for PDF - remove screen preview styles */
    .cv-document-wrapper {
      display: block !important;
      padding: 0 !important;
      gap: 0 !important;
      background: none !important;
      min-height: auto !important;
    }

    /* Fix page dimensions for PDF */
    .cv-page {
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      min-height: 297mm !important;
      box-shadow: none !important;
      border: none !important;
      page-break-after: always !important;
      page-break-inside: avoid !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
      overflow: hidden !important;
    }

    .cv-page:last-child {
      page-break-after: auto !important;
    }

    /* Fix two-column layout */
    .cv-two-column {
      display: flex !important;
      flex-direction: row !important;
      height: calc(297mm - 8mm) !important;
      max-height: calc(297mm - 8mm) !important;
      overflow: hidden !important;
    }

    /* Fix sidebar - exact width with padding included */
    .cv-sidebar {
      width: 55mm !important;
      min-width: 55mm !important;
      max-width: 55mm !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
      box-sizing: border-box !important;
      padding: 10mm 8mm !important;
    }

    /* Fix main content area */
    .cv-main-content {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
      padding: 12mm 15mm 8mm 12mm !important;
    }

    /* Hide editing mode and no-print elements */
    .cv-editing-banner,
    .cv-no-print {
      display: none !important;
    }

    /* Page footer */
    .cv-page-footer {
      height: 8mm !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 15mm !important;
    }

    .cv-footer-contact {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      font-size: 0.7rem !important;
      color: ${themeColors.textMuted} !important;
    }

    .cv-footer-separator {
      color: ${themeColors.accent} !important;
      opacity: 0.5 !important;
    }

    .cv-footer-item {
      display: flex !important;
      align-items: center !important;
    }

    /* Page content */
    .cv-page-content {
      flex: 1 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }
  </style>
</head>
<body>
  ${fixedHtml}
</body>
</html>
    `.trim();

    // Launch Puppeteer (uses different strategy for dev vs prod)
    const browser = await launchBrowser(baseUrl);

    const page = await browser.newPage();

    // Set content and wait for fonts and images to load
    await page.setContent(fullHtml, {
      waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Wait for all images to load
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    // Additional wait to ensure everything is rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate PDF
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

    // If attachments are provided, merge them with the CV PDF
    let finalPdf: Uint8Array = pdfBuffer;
    if (params.attachments && params.attachments.length > 0) {
      finalPdf = await mergePdfs(pdfBuffer, params.attachments);
    }

    // Return PDF - convert Uint8Array to Buffer for NextResponse
    return new NextResponse(Buffer.from(finalPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${params.filename || 'Benjamin_Grauer_CV.pdf'}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// Configure for long-running function
export const maxDuration = 60; // 60 seconds max for Vercel Pro, 10 for hobby
