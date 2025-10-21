'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ensure we're on the client side before accessing sessionStorage
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    const handleEmailVerification = async () => {
      const actionCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');
      
      if (mode !== 'verifyEmail' || !actionCode) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        // Apply the email verification
        await applyActionCode(auth, actionCode);
        console.log('Email verification applied successfully');
        
        // Get the stored credentials from sessionStorage
        const userEmail = sessionStorage.getItem('userEmail');
        const userPassword = sessionStorage.getItem('tempPassword');
        
        if (userEmail && userPassword) {
          console.log('Found stored credentials, attempting auto-login...');
          
          try {
            // Sign in the user automatically
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            console.log('Auto-login successful:', userCredential.user.email);
            
            // Clean up temporary storage
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('tempPassword');
            
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to homepage...');
            
            // Redirect to homepage after 2 seconds
            setTimeout(() => {
              router.push('/');
            }, 2000);
            
          } catch (loginError) {
            console.error('Auto-login failed:', loginError);
            // Clean up storage even if login fails
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('tempPassword');
            
            setStatus('success');
            setMessage('Email verified successfully! Please sign in to continue.');
          }
        } else {
          console.log('No stored credentials found');
          setStatus('success');
          setMessage('Email verified successfully! Please sign in to continue.');
        }
        
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');

        if (typeof error === 'object' && error !== null && 'code' in error) {
          const errorCode = (error as { code: string }).code;
          console.log('Firebase error code:', errorCode);
          
          if (errorCode === 'auth/expired-action-code') {
            setMessage('Verification link has expired. Please request a new one.');
          } else if (errorCode === 'auth/invalid-action-code') {
            setMessage('Invalid verification link. Please check your email for the correct link.');
          } else if (errorCode === 'auth/user-disabled') {
            setMessage('This account has been disabled. Please contact support.');
          } else {
            setMessage(`Verification failed: ${errorCode}. Please try again.`);
          }
        } else {
          setMessage('Failed to verify email. Please try again.');
        }
      }
    };

    // Also listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && status === 'success') {
        console.log('User is authenticated and verified:', user.email);
        // User is already signed in and verified, redirect to homepage
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    });

    handleEmailVerification();

    return () => unsubscribe();
  }, [searchParams, router, status, isClient]);

  // Show loading until client-side hydration
  if (!isClient) {
    return (
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
            <h1 className="text-white text-2xl mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Logo */}
      <div className="py-6 px-6">
        <Link href="/">
          <Image
            src="/images/favicontrashbin.ico"
            alt="Salvage Protocol"
            width={48}
            height={48}
            className="rounded-full hover:scale-110 transition"
            title="Go to Homepage"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96 text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <h1 className="text-white text-2xl mb-4">Verifying Email</h1>
              <p className="text-gray-300">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h1 className="text-white text-2xl mb-4">Email Verified!</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full p-3 bg-green-600 rounded text-white hover:bg-green-500 transition"
                >
                  Go to Homepage
                </button>
                <Link 
                  href="/sign-in"
                  className="block w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition"
                >
                  Sign In Manually
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-400 text-6xl mb-4">✗</div>
              <h1 className="text-white text-2xl mb-4">Verification Failed</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="space-y-3">
                <Link 
                  href="/sign-up"
                  className="block w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition"
                >
                  Sign Up Again
                </Link>
                <Link 
                  href="/sign-in"
                  className="block w-full p-3 bg-gray-600 rounded text-white hover:bg-gray-500 transition"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}