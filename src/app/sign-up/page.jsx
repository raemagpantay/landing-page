'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
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
      console.log({ res });
      sessionStorage.setItem('userEmail', res.user.email); // Store user email in sessionStorage
      setEmail('');
      setPassword('');
      setError('');
      router.push('/'); // Redirect to homepage after successful sign-up
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
    <div className="min-h-screen flex items-center justify-center">
      <div className={`bg-gray-800 p-10 rounded-lg shadow-xl w-96 ${isModalOpen ? 'blur-sm' : ''}`}>
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
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>

      {/* Modal for Terms and Conditions */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4 text-center">Terms and Conditions</h2>
            <p className="text-gray-700 text-sm mb-4">
              Welcome to Planetary Deep-Sea Survival!
              <br />
              <br />
              Please read these Terms and Conditions ("Terms") carefully before creating an account. By registering, accessing, or playing the Planetary Deep-Sea Survival game or using our website, you agree to be bound by these Terms.
              <br />
              <br />
              <strong>1. Eligibility</strong>
              <br />
              You must be at least 13 years old to register. By signing up, you confirm that you meet the age requirement or have the permission of a parent or guardian.
              <br />
              <br />
              <strong>2. Account Registration and Responsibility</strong>
              <br />
              You agree to provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials.
              <br />
              <br />
              <strong>3. User Conduct</strong>
              <br />
              You agree not to use the game or website for any illegal or harmful activity. Cheating, exploiting bugs, or disrupting gameplay for others is strictly prohibited.
              <br />
              <br />
              <strong>4. Data Privacy</strong>
              <br />
              Your personal information will only be used for account management, gameplay features, and improvement of services. We do not share or sell user data to third parties.
              <br />
              <br />
              <strong>5. Gameplay Progress and Updates</strong>
              <br />
              Game progress may be reset or affected by updates, bug fixes, or system changes.
              <br />
              <br />
              <strong>6. Termination and Suspension</strong>
              <br />
              We reserve the right to suspend or terminate accounts that violate these Terms or are involved in suspicious activity.
              <br />
              <br />
              <strong>7. Intellectual Property</strong>
              <br />
              All game assets, designs, and systems are property of the developers of Planetary Deep-Sea Survival.
              <br />
              <br />
              <strong>8. Changes to Terms</strong>
              <br />
              These Terms may be updated at any time. Continued use of the game after updates constitutes acceptance of the revised Terms.
              <br />
              <br />
              <strong>9. Contact</strong>
              <br />
              If you have questions or concerns about your account or these Terms, please contact us through the support page on our website.
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
  );
}

export default SignUp;