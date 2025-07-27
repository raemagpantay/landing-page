'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, updateEmail, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`❌ ${error.message}`);
      } else {
        setStatus('❌ An unknown error occurred.');
      }
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
    } catch {
      setStatus('❌ Failed to update profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    if (!user) {
      setStatus('❌ User not found.');
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus('❌ Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('❌ New passwords do not match.');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setStatus('✅ Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string'
      ) {
        const errObj = error as { code?: string; message?: string };
        if (errObj.code === 'auth/wrong-password') {
          setStatus('❌ Current password is incorrect.');
        } else if (errObj.code === 'auth/weak-password') {
          setStatus('❌ Password should be at least 6 characters.');
        } else if (typeof errObj.message === 'string') {
          setStatus(`❌ ${errObj.message}`);
        } else {
          setStatus('❌ An unknown error occurred.');
        }
      } else if (error instanceof Error) {
        setStatus(`❌ ${error.message}`);
      } else {
        setStatus('❌ An unknown error occurred.');
      }
    }
  };

  // Conditional background style for the avatar circle
  const avatarBgStyle = !photoURL
    ? {
        backgroundImage: "url('/images/abstract-user-flat-4.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Account Settings</h1>
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative group cursor-pointer w-28 h-28 rounded-full border-4 border-blue-600 shadow-lg flex items-center justify-center"
              style={avatarBgStyle}
              onClick={handleAvatarClick}
              title="Change profile picture"
            >
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover"
                  priority
                />
              ) : null}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm">Change Profile</span>
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

          {/* Change Password Section */}
          <form onSubmit={handleChangePassword} className="space-y-6 mt-10">
            <h2 className="text-xl font-semibold mb-2 text-center">Change Password</h2>
            <div>
              <label className="block mb-2 text-gray-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-medium"
            >
              Change Password
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