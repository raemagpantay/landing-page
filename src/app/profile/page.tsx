'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/app/firebase/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<{
    displayName: string | null;
    email: string | null;
    createdAt: string | null;
    photoURL: string | null;
  }>({ displayName: '', email: '', createdAt: '', photoURL: '' });

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        displayName: user.displayName || 'No display name',
        email: user.email || 'No email',
        createdAt: user.metadata?.creationTime || 'Unknown',
        photoURL: user.photoURL || '',
      });
    }
  }, []);

  // Conditional background style for the avatar circle
  const avatarBgStyle = !userInfo.photoURL
    ? {
        backgroundImage: "url('/images/abstract-user-flat-4.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center py-16 px-4 text-white">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-lg flex items-center justify-center"
              style={avatarBgStyle}
            >
              {userInfo.photoURL ? (
                <Image
                  src={userInfo.photoURL}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover"
                  priority
                />
              ) : null}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="text-gray-400 mb-1">Display Name</div>
              <div className="bg-gray-700 rounded-lg p-3">{userInfo.displayName}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Email</div>
              <div className="bg-gray-700 rounded-lg p-3">{userInfo.email}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Account Created</div>
              <div className="bg-gray-700 rounded-lg p-3">{userInfo.createdAt}</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/settings')}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 transition p-3 rounded-lg font-medium"
          >
            Edit Profile
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}