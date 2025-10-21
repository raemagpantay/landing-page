'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isTermsAccepted) {
      setError('You must accept the terms and conditions to sign up.');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (!res) {
        setError('An error occurred. Please try again.');
        return;
      }

      // Send email verification
      await sendEmailVerification(res.user);

      setSuccessMessage(
        `A verification email has been sent to ${email}. Please check your inbox and verify your email before signing in.`
      );

      // Optionally store for later
      sessionStorage.setItem('userEmail', res.user.email);

      // Reset inputs
      setEmail('');
      setPassword('');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('An error occurred during sign-up. Please try again.');
      }
      console.error(e);
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
            src="/favicon.ico"
            alt="Home"
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
          <h1 className="text-white text-2xl mb-5">Sign Up</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />

          <p className="text-gray-400 text-sm mb-4">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/sign-in')}
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
            />
            <label htmlFor="terms" className="text-gray-400 text-sm">
              I accept the terms and conditions
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm mb-4">{successMessage}</p>}

          <button
            onClick={handleSignUp}
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            Sign Up
          </button>
        </div>

        {/* Terms Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
              <h2 className="text-xl font-bold mb-4 text-center">Terms and Conditions</h2>
              <p className="text-gray-700 text-sm mb-4">
                Welcome to Planetary Deep-Sea Survival!
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
