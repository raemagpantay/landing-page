'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { sendEmailVerification, signOut } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

function SignUp() {
  const MINIMUM_AGE = 18;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [createUserWithEmailAndPassword, , , signUpError] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const getDetailedErrorMessage = (err) => {
    if (!err) {
      return 'Sign-up failed: Firebase did not return a user credential.';
    }

    const code = err.code || 'unknown';
    const message = err.message || 'No additional details provided.';
    return `Sign-up failed (${code}): ${message}`;
  };

  const getAgeFromBirthDate = (dateString) => {
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }

    return age;
  };

  const getSignUpErrorMessage = (firebaseCode, fallbackMessage) => {
    switch (firebaseCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in or use another email.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Email address format is invalid.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-up is currently disabled. Please contact support.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts right now. Please wait and try again.';
      default:
        return `Sign-up failed: ${fallbackMessage || 'Unknown error occurred.'}`;
    }
  };

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !birthDate) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const age = getAgeFromBirthDate(birthDate);
    if (Number.isNaN(age)) {
      setError('Please enter a valid birth date.');
      setIsLoading(false);
      return;
    }

    if (age < MINIMUM_AGE) {
      setError(`You must be at least ${MINIMUM_AGE} years old to create an account.`);
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
        if (signUpError) {
          setError(getSignUpErrorMessage(signUpError.code, signUpError.message));
        } else {
          setError(getDetailedErrorMessage(null));
        }
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
      setConfirmPassword('');
      setBirthDate('');
      setIsTermsAccepted(false);

      console.log('Sign-up process completed successfully');
    } catch (e) {
      console.error('Sign-up error:', e);
      setError(getSignUpErrorMessage(e?.code, e?.message || getDetailedErrorMessage(e)));
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
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-24 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-indigo-300 hover:text-indigo-200"
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pr-24 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-indigo-300 hover:text-indigo-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white"
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-gray-400 text-xs mb-4">You must be at least {MINIMUM_AGE} years old.</p>

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
                disabled={!email || !password || !confirmPassword || !birthDate || !isTermsAccepted || isLoading}
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
                You must be at least 18 years old to register.
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
