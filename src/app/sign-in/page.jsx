'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Track error messages
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (!res) {
        setError('Invalid email or password.');
        return;
      }
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setError('User does not exist.');
      } else if (e.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <p className="text-gray-400 text-sm mb-4">
          Don't have an account?{' '}
          <span
            onClick={() => router.push('/sign-up')}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Sign up here
          </span>
        </p>
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;