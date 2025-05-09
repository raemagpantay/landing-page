import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory where zip files are stored
const uploadsDir = path.join(process.cwd(), 'public/uploads');

export async function DELETE() {
  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ error: 'Uploads directory does not exist' }, { status: 404 });
    }

    // Read the current file name from the metadata file
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json({ message: 'No file found to delete' }, { status: 200 });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const currentFileName = metadata.currentFile;

    if (!currentFileName) {
      return NextResponse.json({ message: 'No file found to delete' }, { status: 200 });
    }

    // Delete the actual zip file
    const filePath = path.join(uploadsDir, currentFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update metadata to reflect no current file
    fs.writeFileSync(metadataPath, JSON.stringify({ currentFile: null }));

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}