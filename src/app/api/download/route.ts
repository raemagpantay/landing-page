import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/game-download-links';

type FileVersion = 'demo' | 'paid';

export async function GET(request: NextRequest) {
  try {
    const requestedVersion = request.nextUrl.searchParams.get('version');
    const version: FileVersion = requestedVersion === 'paid' ? 'paid' : 'demo';

    return NextResponse.redirect(getDownloadUrl(version));
  } catch (error) {
    console.error('Error generating download URL:', error);
    const message = error instanceof Error ? error.message : 'Failed to download file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
