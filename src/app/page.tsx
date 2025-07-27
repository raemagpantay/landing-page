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
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Fetch the current ZIP file name on component mount
  useEffect(() => {
    const fetchCurrentFile = async () => {
      try {
        const res = await fetch('/api/current-file');
        if (res.ok) {
          const data = await res.json();
          setCurrentFile(data.fileName || null);
        }
      } catch (error) {
        console.error('Error fetching current file:', error);
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
          className="mb-32 w-full flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 120 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* Multi-line animated game title */}
          <div className="select-none">
            {[
              { text: "PLANETARY", color: "text-red-500" },
              { text: "DEEP SEA", color: "text-blue-400" },
              { text: "SURVIVAL", color: "text-yellow-400" }
            ].map((line, idx) => (
              <div
                key={line.text}
                className={`title flex justify-center text-6xl md:text-8xl font-extrabold uppercase tracking-wider ${line.color}`}
                style={{
                  transform: "translateX(-50%) rotate(-8deg)",
                  left: "50%",
                  position: "relative",
                  lineHeight: 1.1,
                }}
              >
                {line.text.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.28 + i * 0.06,
                      duration: 0.7,
                      type: "spring",
                      stiffness: 400,
                      damping: 18,
                    }}
                    style={{
                      transform: "skew(-10deg)",
                      textShadow:
                        "#533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px",
                      minWidth: "10px",
                      minHeight: "10px",
                      position: "relative",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>

          {/* Download/Sign In Button */}
          <motion.div
            className="flex flex-col items-center w-full mt-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.7, ease: 'easeOut' }}
          >
            {!user ? (
              <button
                onClick={() => router.push('/sign-in')}
                className="restart-btn relative -rotate-6 w-64 h-16 flex items-center justify-center text-2xl font-bold uppercase tracking-widest border-4 border-cyan-400 rounded-full bg-transparent select-none transition-all duration-200 hover:bg-cyan-400/10 hover:scale-105 active:scale-95"
                style={{
                  color: '#22d3ee',
                  boxShadow: '#533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px',
                  visibility: 'visible',
                  opacity: 1,
                  letterSpacing: '2px',
                }}
              >
                {"Sign In to Download".split("").map((char, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      transform: 'skew(-10deg)',
                      minWidth: '10px',
                      minHeight: '10px',
                      position: 'relative',
                      textShadow:
                        '#533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px',
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </button>
            ) : (
              <a
                href={currentFile ? `/uploads/${currentFile}` : "#"}
                download
                className={`restart-btn relative -rotate-6 w-64 h-16 flex items-center justify-center text-2xl font-bold uppercase tracking-widest border-4 border-cyan-400 rounded-full bg-transparent select-none transition-all duration-200 hover:bg-cyan-400/10 hover:scale-105 active:scale-95 ${
                  currentFile
                    ? "cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{
                  color: '#22d3ee',
                  boxShadow: '#533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px',
                  visibility: 'visible',
                  opacity: 1,
                  letterSpacing: '2px',
                }}
                tabIndex={currentFile ? 0 : -1}
                aria-disabled={!currentFile}
              >
                {"Download Now".split("").map((char, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      transform: 'skew(-10deg)',
                      minWidth: '10px',
                      minHeight: '10px',
                      position: 'relative',
                      textShadow:
                        '#533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px',
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </a>
            )}
          </motion.div>
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
