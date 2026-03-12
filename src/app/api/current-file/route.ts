import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory where zip files are stored
const uploadsDir = path.join(process.cwd(), 'public/uploads');
const metadataPath = path.join(uploadsDir, 'metadata.json');

type FileVersion = 'demo' | 'paid';

type UploadMetadata = {
  currentFile: string | null;
  demoFile: string | null;
  paidFile: string | null;
};

function normalizeMetadata(raw: unknown): UploadMetadata {
  const data = (raw || {}) as {
    currentFile?: string | null;
    demoFile?: string | null;
    paidFile?: string | null;
  };

  const demoFile = data.demoFile ?? data.currentFile ?? null;
  const paidFile = data.paidFile ?? null;

  return {
    currentFile: demoFile,
    demoFile,
    paidFile,
  };
}

function ensureMetadataFile(): UploadMetadata {
  if (!fs.existsSync(metadataPath)) {
    const initial: UploadMetadata = { currentFile: null, demoFile: null, paidFile: null };
    fs.writeFileSync(metadataPath, JSON.stringify(initial));
    return initial;
  }

  const parsed = JSON.parse(fs.readFileSync(metadataPath, 'utf-8')) as unknown;
  const normalized = normalizeMetadata(parsed);
  fs.writeFileSync(metadataPath, JSON.stringify(normalized));
  return normalized;
}

export async function GET(request: NextRequest) {
  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const metadata = ensureMetadataFile();
    const requestedVersion = request.nextUrl.searchParams.get('version');
    const version: FileVersion = requestedVersion === 'paid' ? 'paid' : 'demo';
    const requestedFile = version === 'paid' ? metadata.paidFile : metadata.demoFile;
    
    // Verify the file actually exists
    if (requestedFile) {
      const filePath = path.join(uploadsDir, requestedFile);
      if (!fs.existsSync(filePath)) {
        const updatedMetadata: UploadMetadata = {
          ...metadata,
          currentFile: version === 'demo' ? null : metadata.demoFile,
          demoFile: version === 'demo' ? null : metadata.demoFile,
          paidFile: version === 'paid' ? null : metadata.paidFile,
        };
        fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata));
        return NextResponse.json(
          {
            fileName: null,
            version,
            demoFile: updatedMetadata.demoFile,
            paidFile: updatedMetadata.paidFile,
          },
          { status: 200 }
        );
      }
    }
    
    return NextResponse.json({ 
      fileName: requestedFile || null,
      version,
      demoFile: metadata.demoFile,
      paidFile: metadata.paidFile,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting current file:', error);
    return NextResponse.json({ 
      error: 'Failed to get current file information',
      fileName: null,
      version: 'demo',
      demoFile: null,
      paidFile: null,
    }, { status: 500 });
  }
}