import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Upload is disabled in Google Drive mode. Update files directly in the configured Google Drive folders.',
    },
    { status: 400 }
  );
}
