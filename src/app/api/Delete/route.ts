import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory where ZIP files are stored
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
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

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

export async function DELETE(req: Request) {
  try {
    const { fileName, version } = await req.json();
    const selectedVersion: FileVersion | null = version === 'paid' || version === 'demo' ? version : null;
    const metadata = readMetadata();

    const targetFileName = selectedVersion
      ? selectedVersion === 'paid'
        ? metadata.paidFile
        : metadata.demoFile
      : fileName;

    if (!targetFileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const filePath = path.join(uploadsDir, targetFileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    const updatedMetadata: UploadMetadata = {
      ...metadata,
      currentFile: selectedVersion === 'demo' ? null : metadata.demoFile,
      demoFile: selectedVersion === 'demo' ? null : metadata.demoFile,
      paidFile: selectedVersion === 'paid' ? null : metadata.paidFile,
    };

    fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata));

    return NextResponse.json({
      message: 'File deleted successfully',
      version: selectedVersion,
      demoFile: updatedMetadata.demoFile,
      paidFile: updatedMetadata.paidFile,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}