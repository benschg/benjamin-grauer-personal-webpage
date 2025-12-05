import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const imagePath = path.join(process.cwd(), 'src', 'assets', 'bendalf-the-gray.jpg');
    const imageBuffer = await readFile(imagePath);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Prevent hotlinking
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Image not found', { status: 404 });
  }
}
