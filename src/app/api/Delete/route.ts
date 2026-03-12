import { NextResponse } from 'next/server';

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        'Delete is disabled in Google Drive mode. Manage files directly in the configured Google Drive folders.',
    },
    { status: 400 }
  );
}
