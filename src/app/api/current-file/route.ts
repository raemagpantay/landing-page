import { NextRequest, NextResponse } from 'next/server';
import { DEMO_GDRIVE_URL, PAID_GDRIVE_URL } from '@/lib/game-download-links';

type FileVersion = 'demo' | 'paid';

function getVersionFileName(version: FileVersion): string {
  return version === 'paid' ? 'Paid Version (Google Drive)' : 'Demo Version (Google Drive)';
}

export async function GET(request: NextRequest) {
  try {
    const requestedVersion = request.nextUrl.searchParams.get('version');

    if (requestedVersion === 'demo' || requestedVersion === 'paid') {
      return NextResponse.json(
        {
          fileName: getVersionFileName(requestedVersion),
          version: requestedVersion,
          demoFile: requestedVersion === 'demo' ? getVersionFileName('demo') : getVersionFileName('demo'),
          paidFile: requestedVersion === 'paid' ? getVersionFileName('paid') : getVersionFileName('paid'),
          demoUrl: DEMO_GDRIVE_URL,
          paidUrl: PAID_GDRIVE_URL,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        fileName: getVersionFileName('demo'),
        version: 'demo',
        demoFile: getVersionFileName('demo'),
        paidFile: getVersionFileName('paid'),
        demoUrl: DEMO_GDRIVE_URL,
        paidUrl: PAID_GDRIVE_URL,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting current file:', error);
    const message = error instanceof Error ? error.message : 'Failed to get current file information';
    return NextResponse.json(
      {
        error: message,
        fileName: null,
        version: 'demo',
        demoFile: null,
        paidFile: null,
      },
      { status: 500 }
    );
  }
}
