'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GameShowcase() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading, error] = useAuthState(auth); // Track the authenticated user and loading state
  const router = useRouter();

  // Fetch the current ZIP file name on component mount
  useEffect(() => {
    const fetchCurrentFile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/current-file');
        if (res.ok) {
          const data = await res.json();
          setCurrentFile(data.fileName || null);
        }
      } catch (error) {
        console.error('Error fetching current file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentFile();
  }, []);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('userEmail'); // Clear session storage
      router.push('/sign-in'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <main className="bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-500">PLANETARY DEEP SEA SURVIVAL</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Dive into the depths and explore the mysteries of the ocean.
          </p>

          {loading ? (
            <button
              disabled
              className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
            >
              Loading authentication...
            </button>
          ) : user ? (
            <>
              {isLoading ? (
                <button
                  disabled
                  className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                >
                  Loading game...
                </button>
              ) : currentFile ? (
                <a
                  href={`/uploads/${currentFile}`}
                  download
                  className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                >
                  Download Game
                </a>
              ) : (
                <button
                  disabled
                  className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                >
                  Game Coming Soon
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="mt-4 bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
            >
              Sign In to Download
            </button>
          )}
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-blue-400"> The Problem</h3>
            <p className="text-gray-300 mb-4">
              Most games focus purely on entertainment. Players aren&apos;t pushed to analyze, strategize, or solve meaningful problems.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Lack of puzzles or problem-solving tasks</li>
              <li>No logical or strategic thinking required</li>
              <li>Minimal educational value behind the fun</li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500">
            [Insert related image or video preview]
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500">
            [Pixel art / game UI image preview]
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-green-400"> The Solution</h3>
            <p className="text-gray-300 mb-4">
              <strong>&quot;Unlocking Minds&quot;</strong> is an educational mystery game for ages 16–30. It merges logic-based gameplay with fun, story-driven challenges.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Solve puzzles, uncover clues, and crack mysteries</li>
              <li>Dynamic difficulty adapts to your skill level</li>
              <li>Choices matter every decision impacts your story</li>
              <li>Visually rich pixel art using Aseprite</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="bg-gradient-to-tr from-blue-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6"> Why It Matters</h3>
          <p className="text-lg md:text-xl text-gray-300">
            &quot;Unlocking Minds&quot; is more than just a game it&apos;s a way to sharpen your brain while having fun. We believe education should be exciting, and entertainment should make you think.
            Our mission is to inspire a new wave of games that help players grow smarter while staying fully engaged.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}