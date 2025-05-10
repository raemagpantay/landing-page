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
  const [user, loading] = useAuthState(auth); // Track the authenticated user and loading state
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
      <section
  className="min-h-screen bg-cover bg-center text-white px-6 py-20 flex flex-col items-center text-center"
  style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
>
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-3xl bg-opacity-50 p-8 rounded-lg"
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

      {/* Game Features Section */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-blue-400"> Game Features</h3>
            <p className="text-gray-300 mb-4">
              Planetary Deep-Sea Survival is a thrilling underwater adventure game that combines exploration, survival, and strategy.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Explore vast underwater landscapes filled with hidden treasures and dangers.</li>
              <li>Craft tools and equipment to survive the harsh ocean environment.</li>
              <li>Encounter unique marine life, from friendly creatures to hostile predators.</li>
              <li>Uncover the mysteries of a lost civilization beneath the waves.</li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500">
            
            <img
              src="/images/screenshot1.jpg" // Replace with the actual path to your gameplay preview image
              alt="Gameplay Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500">
            <img
              src="/images/screenshot2.jpg" // Replace with the actual path to your gameplay screenshot
              alt="Gameplay Screenshot"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-green-400"> Game Screenshots</h3>
            <p className="text-gray-300 mb-4">
              Immerse yourself in the stunning visuals of Planetary Deep-Sea Survival. Every detail is crafted to bring the underwater world to life.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Dynamic lighting and realistic water effects.</li>
              <li>Beautifully designed marine environments.</li>
              <li>Detailed character and creature animations.</li>
              <li>Interactive objects and puzzles to solve.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trailer Section */}
      <section className="bg-gradient-to-tr from-blue-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6"> Watch the Trailer</h3>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Get a glimpse of the adventure that awaits you in Planetary Deep-Sea Survival. Watch the trailer and dive into the action!
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/your-trailer-video-id" // Replace with your actual YouTube trailer link
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
