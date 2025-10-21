'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    // Check for stored credentials (from successful email verification)
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedPassword = sessionStorage.getItem('tempPassword');

    if (storedEmail && storedPassword) {
      console.log('Found stored credentials, attempting auto-login...');
      setEmail(storedEmail);
      setPassword(storedPassword);
      
      // Auto-login attempt
      handleAutoLogin(storedEmail, storedPassword);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        console.log('User is authenticated and verified:', user.email);
        // Clean up stored credentials
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('tempPassword');
        // Redirect to homepage
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAutoLogin = async (userEmail, userPassword) => {
    try {
      setIsLoading(true);
      console.log('Attempting auto-login for:', userEmail);
      
      const res = await signInWithEmailAndPassword(userEmail, userPassword);
      if (res && res.user) {
        if (res.user.emailVerified) {
          console.log('Auto-login successful, redirecting to homepage...');
          // Clean up storage
          sessionStorage.removeItem('userEmail');
          sessionStorage.removeItem('tempPassword');
          // Redirect to homepage
          router.push('/');
        } else {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
        }
      }
    } catch (e) {
      console.error('Auto-login failed:', e);
      // Don't show error for auto-login failure, let user try manually
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('tempPassword');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res && res.user) {
        if (res.user.emailVerified) {
          console.log('Sign-in successful, redirecting to homepage...');
          router.push('/');
        } else {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
        }
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } catch (e) {
      console.error('Sign-in error:', e);
      if (e.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (e.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Main Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96">
          <h1 className="text-white text-2xl mb-5">Sign In</h1>

          {sessionStorage.getItem('userEmail') && (
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            disabled={isLoading}
          />

          <p className="text-gray-400 text-sm mb-4">
            Don't have an account?{' '}
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

          <button
            onClick={handleSignIn}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!email || !password || isLoading}
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