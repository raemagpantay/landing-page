import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';

// Directory where zip files are stored
const uploadsDir = path.join(process.cwd(), 'public/uploads');

export async function POST(request: NextRequest) {
  try {
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const formData = await request.formData();
    const zipFile = formData.get('zip') as File;

    if (!zipFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is a zip
    if (!zipFile.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Only ZIP files are allowed' }, { status: 400 });
    }

    // Generate a timestamp-based filename to avoid conflicts
    const fileName = `${zipFile.name}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convert the file to an array buffer and save it
    const bytes = await zipFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save metadata about the current file
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify({ currentFile: fileName }));

    return NextResponse.json({ 
      success: true,
      fileName: fileName,
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