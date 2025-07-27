'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, updateEmail, signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

export default function SettingsPage() {
  const router = useRouter();
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    try {
      if (user) {
        if (displayName !== user.displayName) {
          await updateProfile(user, { displayName });
        }
        if (email !== user.email) {
          await updateEmail(user, email);
        }
        setStatus('✅ Profile updated successfully!');
      }
    } catch (error: any) {
      setStatus(`❌ ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/sign-in');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    setStatus('');
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhotoURL(url);
      setStatus('✅ Profile picture updated!');
    } catch (error: any) {
      setStatus('❌ Failed to update profile picture.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Account Settings</h1>
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
              title="Change profile picture"
            >
              <Image
                src={
                  photoURL ||
                  'https://ui-avatars.com/api/?name=' +
                    encodeURIComponent(displayName || 'User') +
                    '&background=374151&color=fff&size=128'
                }
                alt="Profile"
                width={112}
                height={112}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow-lg"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm">Change</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading}
                title="Upload profile picture"
                placeholder="Choose a profile picture"
              />
            </div>
            {uploading && <div className="mt-2 text-blue-300">Uploading...</div>}
          </div>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-medium"
            >
              Save Changes
            </button>
          </form>
          {status && (
            <div className="mt-4 text-center text-lg">{status}</div>
          )}
          <hr className="my-8 border-gray-700" />
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-500 transition p-3 rounded-lg font-medium"
          >
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}