import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory where zip files are stored
const uploadsDir = path.join(process.cwd(), 'public/uploads');
const metadataPath = path.join(uploadsDir, 'metadata.json');

export async function GET() {
  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Check if the metadata file exists
    if (!fs.existsSync(metadataPath)) {
      // If not, create it with null currentFile
      fs.writeFileSync(metadataPath, JSON.stringify({ currentFile: null }));
      return NextResponse.json({ fileName: null }, { status: 200 });
    }

    // Read the current file name from metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    // Verify the file actually exists
    if (metadata.currentFile) {
      const filePath = path.join(uploadsDir, metadata.currentFile);
      if (!fs.existsSync(filePath)) {
        // File referenced in metadata doesn't exist, update metadata
        fs.writeFileSync(metadataPath, JSON.stringify({ currentFile: null }));
        return NextResponse.json({ fileName: null }, { status: 200 });
      }
    }
    
    return NextResponse.json({ 
      fileName: metadata.currentFile || null 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting current file:', error);
    return NextResponse.json({ 
      error: 'Failed to get current file information',
      fileName: null
    }, { status: 500 });
  }
}