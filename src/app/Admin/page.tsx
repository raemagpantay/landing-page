'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLoginAt?: string;
  disabled?: boolean;
}

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [archivingUserId, setArchivingUserId] = useState<string | null>(null);
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

  // Fetch registered users from Firebase
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      
      const res = await fetch('/api/get-users');
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const errorData = await res.json();
        setUsersError(errorData.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError('An error occurred while fetching users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleArchiveUser = async (uid: string, currentlyDisabled: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlyDisabled ? 'enable' : 'disable'} this user account?`)) {
      return;
    }

    try {
      setArchivingUserId(uid);
      
      const res = await fetch('/api/archive-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uid, 
          disabled: !currentlyDisabled 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(`✅ User account ${currentlyDisabled ? 'enabled' : 'disabled'} successfully.`);
        
        // Refresh users list
        await fetchUsers();
        
        // Clear status after 3 seconds
        setTimeout(() => setStatus(''), 3000);
      } else {
        const errorData = await res.json();
        setStatus(`❌ Failed to ${currentlyDisabled ? 'enable' : 'disable'} user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error archiving user:', error);
      setStatus('❌ An error occurred while archiving the user.');
    } finally {
      setArchivingUserId(null);
    }
  };

  const handleDelete = async () => {
    try {
      setStatus('Deleting file...');
      const deleteRes = await fetch('/api/Delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: currentFile }),
      });
  
      if (deleteRes.ok) {
        setCurrentFile(null);
        setStatus('✅ File deleted successfully.');
      } else {
        const errorData = await deleteRes.json();
        setStatus(`❌ Failed to delete the file: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const activeUsersCount = users.filter(user => !user.disabled).length;
  const archivedUsersCount = users.filter(user => user.disabled).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Dashboard</h1>

        {/* File Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
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
              <label htmlFor="zipFile" className="block text-sm font-medium text-gray-400 mb-2">
                Select a ZIP file to upload:
              </label>
              <input
                id="zipFile"
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                placeholder="Choose a ZIP file"
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
          </div>

          {/* Users Statistics */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">User Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-blue-400">{users.length}</h3>
                <p className="text-sm text-gray-300">Total Users</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-400">{activeUsersCount}</h3>
                <p className="text-sm text-gray-300">Active Users</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-yellow-400">
                  {users.filter(user => {
                    const lastLogin = user.lastLoginAt;
                    if (!lastLogin || user.disabled) return false;
                    const daysSinceLogin = (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24);
                    return daysSinceLogin <= 7;
                  }).length}
                </h3>
                <p className="text-sm text-gray-300">Active (7 days)</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-orange-400">{archivedUsersCount}</h3>
                <p className="text-sm text-gray-300">Archived Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Users Table Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Registered Users</h2>
            <button
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition"
            >
              Refresh Data
            </button>
          </div>

          {usersLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-2">Loading users...</span>
            </div>
          ) : usersError ? (
            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading users:</p>
              <p className="text-sm">{usersError}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No users registered yet.</p>
              <p className="text-sm">Users will appear here once they sign up.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4 font-semibold text-gray-300">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-300">Display Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-300">Registered</th>
                    <th className="py-3 px-4 font-semibold text-gray-300">Last Login</th>
                    <th className="py-3 px-4 font-semibold text-gray-300">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const isRecentlyActive = user.lastLoginAt && !user.disabled &&
                      (Date.now() - new Date(user.lastLoginAt).getTime()) < (7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <tr 
                        key={user.uid} 
                        className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'
                        } ${user.disabled ? 'opacity-60' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-blue-300">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.uid.substring(0, 8)}...</div>
                        </td>
                        <td className="py-3 px-4">
                          {user.displayName ? (
                            <span className="text-green-300">{user.displayName}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : (
                            <span className="text-gray-500 italic">Never</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.disabled
                                ? 'bg-red-900/50 text-red-300 border border-red-500/50'
                                : isRecentlyActive 
                                ? 'bg-green-900/50 text-green-300 border border-green-500/50' 
                                : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'
                            }`}
                          >
                            {user.disabled ? 'Archived' : isRecentlyActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleArchiveUser(user.uid, user.disabled || false)}
                            disabled={archivingUserId === user.uid}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              user.disabled
                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {archivingUserId === user.uid ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                Processing...
                              </div>
                            ) : user.disabled ? (
                              'Enable'
                            ) : (
                              'Archive'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center">
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