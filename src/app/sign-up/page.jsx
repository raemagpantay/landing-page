'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { sendEmailVerification, signOut } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    if (!isTermsAccepted) {
      setError('You must accept the terms and conditions to sign up.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Creating user account...');
      const res = await createUserWithEmailAndPassword(email, password);
      if (!res) {
        setError('An error occurred. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('User created successfully:', res.user.email);

      // Store credentials for auto-login after verification
      sessionStorage.setItem('userEmail', res.user.email || email);
      sessionStorage.setItem('tempPassword', password);
      console.log('Stored credentials in sessionStorage');

      // Send email verification WITHOUT custom action URL (use default Firebase handling)
      console.log('Sending verification email...');
      await sendEmailVerification(res.user);

      // Sign out the user temporarily until they verify their email
      await signOut(auth);
      console.log('User signed out temporarily until email verification');

      setShowVerificationMessage(true);
      setSuccessMessage(
        `Account created successfully! A verification email has been sent to ${email}. Please check your inbox and click the verification link. After verifying, you can sign in and will be automatically logged in.`
      );

      // Reset inputs
      setEmail('');
      setPassword('');
      setIsTermsAccepted(false);

      console.log('Sign-up process completed successfully');
    } catch (e) {
      console.error('Sign-up error:', e);
      
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try signing in instead.');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(`An error occurred during sign-up: ${e.message || 'Please try again.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    // Clear any stored credentials since user will sign in manually
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('tempPassword');
    router.push('/sign-in');
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/TrashArt-bg.jpg')" }}
    >
      {/* Logo section in sign-up page */}
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
        <div
          className={`bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-xl w-96 ${
            isModalOpen ? 'blur-sm' : ''
          }`}
        >
          {!showVerificationMessage ? (
            <>
              <h1 className="text-white text-2xl mb-5">Sign Up</h1>

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
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                disabled={isLoading}
              />

              <p className="text-gray-400 text-sm mb-4">
                Already have an account?{' '}
                <span
                  onClick={handleGoToSignIn}
                  className="text-indigo-400 cursor-pointer hover:underline"
                >
                  Sign in
                </span>
              </p>

              <p className="text-gray-400 text-sm mb-4">
                By signing up, you agree to our{' '}
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-400 cursor-pointer hover:underline"
                >
                  terms and conditions
                </span>.
              </p>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-gray-400 text-sm">
                  I accept the terms and conditions
                </label>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSignUp}
                className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email || !password || !isTermsAccepted || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-green-400 text-6xl mb-4">📧</div>
                <h1 className="text-white text-2xl mb-4">Check Your Email!</h1>
                
                {successMessage && (
                  <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded-lg mb-6">
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={handleGoToSignIn}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 transition"
                  >
                    Go to Sign In
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowVerificationMessage(false);
                      setSuccessMessage('');
                    }}
                    className="w-full p-3 bg-gray-600 rounded text-white hover:bg-gray-500 transition"
                  >
                    Sign Up Another Account
                  </button>
                </div>

                <p className="text-gray-400 text-xs mt-4">
                  Didn't receive the email? Check your spam folder.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Terms Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
              <h2 className="text-xl font-bold mb-4 text-center">Terms and Conditions</h2>
              <p className="text-gray-700 text-sm mb-4">
                Welcome to Salvage Protocol!
                <br />
                <br />
                Please read these Terms and Conditions carefully before creating an account.
                By registering, accessing, or playing the game or using our website, you agree to be bound by these Terms.
                <br />
                <br />
                <strong>1. Eligibility</strong>
                <br />
                You must be at least 13 years old to register.
                <br />
                <br />
                <strong>2. Account Responsibility</strong>
                <br />
                You agree to provide accurate and complete information when creating your account.
                <br />
                <br />
                <strong>3. User Conduct</strong>
                <br />
                You agree not to use the game or website for any illegal or harmful activity.
                <br />
                <br />
                <strong>4. Data Privacy</strong>
                <br />
                Your personal information will only be used for account management, gameplay features, and service improvement.
                <br />
                <br />
                <strong>5. Email Verification</strong>
                <br />
                After signing up, you will receive a verification email. Click the link to activate your account.
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500 mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
