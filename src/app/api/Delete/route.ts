import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Directory where ZIP files are stored
const uploadsDir = path.join(process.cwd(), 'public/uploads');
const metadataPath = path.join(uploadsDir, 'metadata.json');

export async function DELETE(req: Request) {
  try {
    const { fileName } = await req.json(); // Parse the file name from the request body
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const filePath = path.join(uploadsDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    // Update metadata to remove the current file reference
    if (fs.existsSync(metadataPath)) {
      fs.writeFileSync(metadataPath, JSON.stringify({ currentFile: null }));
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}