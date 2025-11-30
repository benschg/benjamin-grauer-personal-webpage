import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Read the CV CSS file
    const cssPath = join(process.cwd(), 'src', 'components', 'cv', 'styles', 'cv.css');
    const css = await readFile(cssPath, 'utf-8');

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  } catch (error) {
    console.error('Error loading CV styles:', error);
    return NextResponse.json({ error: 'Failed to load CV styles' }, { status: 500 });
  }
}
