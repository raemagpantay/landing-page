'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

// Animation variants for section entrance
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: 'easeOut' } },
};

// Parallax effect for hero background
function useParallax(offset = 30) {
  const [parallax, setParallax] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setParallax(window.scrollY / offset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);
  return parallax;
}

export default function GameShowcase() {
  const [user] = useAuthState(auth);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [, setIsLoading] = useState(true);
  const router = useRouter(); // <-- keep this at the top level

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

  // Parallax for hero
  const parallax = useParallax(18);

  return (
    <main className="text-white">
      <Header />

      {/* Hero Section with parallax and animated glow */}
      <section
        className="min-h-screen bg-cover bg-center text-white px-6 py-20 flex flex-col items-center text-center relative overflow-hidden"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* Parallax overlay effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 30%, rgba(0,80,255,0.15) 0%, transparent 80%)',
            zIndex: 1,
            pointerEvents: 'none',
            transform: `translateY(${parallax * 10}px)`
          }}
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="max-w-3xl bg-opacity-50 p-8 rounded-lg relative z-10 shadow-2xl"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ textShadow: '0 0 0px #00f6ff' }}
            animate={{ textShadow: [
              '0 0 0px #00f6ff',
              '0 0 16px #00f6ff, 0 0 32px #00f6ff',
              '0 0 0px #00f6ff'
            ] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            <span className="text-blue-600 drop-shadow-glow">PLANETARY DEEP SEA SURVIVAL</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            Dive into the depths and explore the mysteries of the ocean.
          </motion.p>

          {loading ? (
            <motion.button
              disabled
              className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              Loading authentication...
            </motion.button>
          ) : user ? (
            <>
              {isLoading ? (
                <motion.button
                  disabled
                  className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  Loading game...
                </motion.button>
              ) : currentFile ? (
                <motion.a
                  href={`/uploads/${currentFile}`}
                  download
                  className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                  whileHover={{ scale: 1.08, boxShadow: '0 0 24px #00f6ff' }}
                >
                  Download Game
                </motion.a>
              ) : (
                <motion.button
                  disabled
                  className="bg-gray-600 cursor-not-allowed px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  Game Coming Soon
                </motion.button>
              )}
              <motion.button
                onClick={handleSignOut}
                className="mt-4 bg-red-600 hover:bg-red-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                whileHover={{ scale: 1.08, boxShadow: '0 0 24px #ff0055' }}
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
              whileHover={{ scale: 1.08, boxShadow: '0 0 24px #00f6ff' }}
            >
              Sign In to Download
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* Game Features Section with animated entrance */}
      <motion.section
        className="bg-gray-900 text-white py-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
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
          </motion.div>
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500"
            whileHover={{ scale: 1.03, boxShadow: '0 0 32px #00f6ff' }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Image
              src="/images/screenshot1.jpg"
              alt="Gameplay Preview"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Screenshot Section with animated entrance */}
      <motion.section
        className="bg-black text-white py-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500"
            whileHover={{ scale: 1.03, boxShadow: '0 0 32px #00ffb3' }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Image
              src="/images/screenshot4.jpg"
              alt="Gameplay Screenshot"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
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
          </motion.div>
        </div>
      </motion.section>

      {/* Trailer Section with animated entrance */}
      <motion.section
        className="bg-gradient-to-tr from-blue-900 to-black text-white py-20 px-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Watch the Trailer
          </motion.h3>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Get a glimpse of the adventure that awaits you in Planetary Deep-Sea Survival. Watch the trailer and dive into the action!
          </motion.p>
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg bg-gray-800 aspect-video flex items-center justify-center text-gray-500"
            whileHover={{ scale: 1.03, boxShadow: '0 0 32px #00f6ff' }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/your-trailer-video-id"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </main>
  );
}
