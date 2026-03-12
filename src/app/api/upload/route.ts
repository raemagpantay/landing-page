import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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

function readMetadata(): UploadMetadata {
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

function writeMetadata(metadata: UploadMetadata) {
  fs.writeFileSync(metadataPath, JSON.stringify(metadata));
}

function buildStoredFileName(originalName: string, version: FileVersion): string {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${version}-${Date.now()}-${safeName}`;
}

export async function POST(request: NextRequest) {
  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const formData = await request.formData();
    const zipFile = formData.get('zip') as File;
  const requestedVersion = formData.get('version');
  const version: FileVersion = requestedVersion === 'paid' ? 'paid' : 'demo';

    if (!zipFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is a zip
    if (!zipFile.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Only ZIP files are allowed' }, { status: 400 });
    }

    // Generate a version-tagged filename to keep demo and paid files independent.
    const fileName = buildStoredFileName(zipFile.name, version);
    const filePath = path.join(uploadsDir, fileName);

    // Convert the file to an array buffer and save it
    const bytes = await zipFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const metadata = readMetadata();
    const previousFile = version === 'paid' ? metadata.paidFile : metadata.demoFile;

    // Replace old file in the same version slot if it exists.
    if (previousFile && previousFile !== fileName) {
      const previousPath = path.join(uploadsDir, previousFile);
      if (fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
      }
    }

    const updatedMetadata: UploadMetadata = {
      ...metadata,
      currentFile: version === 'demo' ? fileName : metadata.demoFile,
      demoFile: version === 'demo' ? fileName : metadata.demoFile,
      paidFile: version === 'paid' ? fileName : metadata.paidFile,
    };

    writeMetadata(updatedMetadata);

    return NextResponse.json({ 
      success: true,
      fileName: fileName,
      version,
      demoFile: updatedMetadata.demoFile,
      paidFile: updatedMetadata.paidFile,
      message: 'File uploaded successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

// To handle the file size limit
export const config = {
  api: {
    bodyParser: false,
  },
};