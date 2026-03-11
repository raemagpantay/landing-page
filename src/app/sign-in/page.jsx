'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showAutoLoginMessage, setShowAutoLoginMessage] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const normalizeEmail = (value) => value.trim().toLowerCase();



  const getSignInErrorMessage = (firebaseCode, fallbackMessage) => {
    switch (firebaseCode) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'No account matched these credentials. Check your email and password.';
      case 'auth/wrong-password':
        return 'Password is incorrect for this account.';
      case 'auth/invalid-email':
        return 'Email address format is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support for help.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait before trying again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      default:
        return `Sign-in failed: ${fallbackMessage || 'Unknown error occurred.'}`;
    }
  };

  // Ensure we're on the client side before accessing sessionStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server

    // Check for stored credentials (from successful email verification)
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedPassword = sessionStorage.getItem('tempPassword');

    if (storedEmail && storedPassword) {
      console.log('Found stored credentials, attempting auto-login...');
      setEmail(storedEmail);
      setPassword(storedPassword);
      setShowAutoLoginMessage(true);
      
      // Auto-login attempt
      handleAutoLogin(storedEmail, storedPassword);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        console.log('User is authenticated and verified:', user.email);
        // Clean up stored credentials
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('userEmail');
          sessionStorage.removeItem('tempPassword');
        }
        // Check admin status and redirect accordingly
        await checkAdminAndRedirect(user);
      }
    });

    return () => unsubscribe();
  }, [router, isClient]);

  const checkAdminAndRedirect = async (user) => {
    try {
      // Check if user is an admin
      const res = await fetch('/api/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          console.log('Admin user detected, redirecting to admin dashboard...');
          router.push('/Admin');
          return;
        }
      }
      
      // If not admin or check failed, redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('Error checking admin status:', error);
      // On error, default to homepage
      router.push('/');
    }
  };

  const handleAutoLogin = async (userEmail, userPassword) => {
    try {
      setIsLoading(true);
      console.log('Attempting auto-login for:', userEmail);
      
      const res = await signInWithEmailAndPassword(userEmail, userPassword);
      if (res && res.user) {
        if (res.user.emailVerified) {
          console.log('Auto-login successful, checking admin status...');
          // Clean up storage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('tempPassword');
          }
          // Check admin status and redirect accordingly
          await checkAdminAndRedirect(res.user);
        } else {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
          setShowAutoLoginMessage(false);
        }
      }
    } catch (e) {
      console.error('Auto-login failed:', e);
      setError(getSignInErrorMessage(e.code, e.message));
      // Don't show error for auto-login failure, let user try manually
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('tempPassword');
      }
      setShowAutoLoginMessage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await signInWithEmailAndPassword(normalizedEmail, password);
      if (res && res.user) {
        if (res.user.emailVerified) {
          console.log('Sign-in successful, checking admin status...');
          await checkAdminAndRedirect(res.user);
        } else {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
        }
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } catch (e) {
      console.error('Sign-in error:', e);
      setError(getSignInErrorMessage(e.code, e.message));
    } finally {
      setIsLoading(false);
    }
  };

  const getResetPasswordErrorMessage = (firebaseCode, fallbackMessage) => {
    switch (firebaseCode) {
      case 'auth/invalid-email':
        return 'Email address format is invalid.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      default:
        return `Password reset failed: ${fallbackMessage || 'Unknown error occurred.'}`;
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Enter your email first, then click Forgot Password.');
      return;
    }

    try {
      setIsResetLoading(true);

      const normalizedEmail = normalizeEmail(email);

      const actionCodeSettings = {
        url: `${window.location.origin}/sign-in`,
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, normalizedEmail, actionCodeSettings);
      setSuccessMessage('Password reset email sent. Please check your inbox.');
    } catch (e) {
      console.error('Password reset error:', e);
      setError(getResetPasswordErrorMessage(e.code, e.message));
    } finally {
      setIsResetLoading(false);
    }
  };

  // Show loading spinner until client-side hydration is complete
  if (!isClient) {
    return (
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/images/TrashArt-bg.jpg')" }}
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/TrashArt-bg.jpg')" }}
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

      {/* Main Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96">
          <h1 className="text-white text-2xl mb-5">Sign In</h1>

          {showAutoLoginMessage && (
            <div className="bg-blue-900/50 border border-blue-500 text-blue-100 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">Attempting to sign you in automatically...</p>
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-24 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && email && password && !isLoading) {
                  handleSignIn();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-indigo-300 hover:text-indigo-200"
              disabled={isLoading || isResetLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm mb-4"
            disabled={isLoading || isResetLoading}
          >
            {isResetLoading ? 'Sending reset link...' : 'Forgot Password?'}
          </button>

          <p className="text-gray-400 text-sm mb-4">
            Don&apos;t have an account?{' '}
            <span
              onClick={() => router.push('/sign-up')}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          <button
            onClick={handleSignIn}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!email || !password || isLoading || isResetLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;