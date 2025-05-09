'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the current ZIP file name on component mount
  useEffect(() => {
    const fetchCurrentFile = async () => {
      try {
        const res = await fetch('/api/current-file');
        if (res.ok) {
          const data = await res.json();
          setCurrentFile(data.fileName || null);
        } else {
          setCurrentFile(null);
        }
      } catch (error) {
        console.error('Error fetching current file:', error);
        setCurrentFile(null);
      }
    };

    fetchCurrentFile();
  }, []);

   const handleDelete = async () => {
    try {
      setStatus('Deleting file...');
      const deleteRes = await fetch('/api/Delete', { method: 'DELETE' });
      
      if (deleteRes.ok) {
        setCurrentFile(null);
        setStatus('✅ File deleted successfully.');
      } else {
        setStatus('❌ Failed to delete the file.');
      }
    } catch {
      setStatus('❌ An error occurred during deletion.');
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('❌ Please select a file to upload.');
      return;
    }
  
    try {
      setStatus('Uploading file...');
      const formData = new FormData();
      formData.append('zip', file);
  
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setCurrentFile(data.fileName || null);
        setStatus('✅ Upload successful!');
      } else {
        setStatus('❌ Upload failed.');
      }
    } catch {
      setStatus('❌ An error occurred during the upload process.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Dashboard</h1>

        {currentFile ? (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold">Current ZIP File:</h2>
            <p className="text-lg mt-2">{currentFile}</p>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition"
            >
              Delete Current File
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold">No ZIP file currently uploaded.</h2>
          </div>
        )}

        <form
          onSubmit={handleUpload}
          className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-4">Upload a ZIP File</h2>
          <p className="text-sm text-gray-400 mb-4">
            {currentFile ? 
              "⚠️ Uploading a new file will replace the current file." : 
              "No file currently exists. Ready to upload."}
          </p>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full mb-4 p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition"
          >
            Upload ZIP
          </button>
        </form>

        {status && (
          <p className="mt-6 text-center text-lg font-medium">
            {status}
          </p>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-medium transition"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </main>
  );
}