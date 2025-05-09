// src/pages/about.tsx

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20 px-6">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-blue-400">Meet the Team</h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Behind &apos;Unlocking Minds&apos; is a team of passionate individuals who brought this educational game to life. Get to know the people who made it all possible.
          </p>
        </div>

        {/* Project Management Section */}
        <section className="flex flex-col md:flex-row py-16 mb-12 items-center" data-aos="fade-up">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-yellow-400 mb-4">🗂️ Project Management</h2>
            <p className="text-gray-300 mb-6">
              <span className="font-bold">[Project Manager&apos;s Name]</span> ensured that every aspect of the project was well-coordinated, meeting deadlines and keeping the vision on track.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/project-management.jpg"
              alt="Project Management"
              width={224}
              height={224}
              className="rounded-full object-cover shadow-2xl border-4 border-yellow-400"
            />
          </div>
        </section>

        {/* Designer Section */}
        <section className="flex flex-col md:flex-row-reverse py-16 mb-12 items-center" data-aos="fade-up">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-pink-400 mb-4">🎨 Designer</h2>
            <p className="text-gray-300 mb-6">
              <span className="font-bold">[Designer&apos;s Name]</span> brought the game to life with stunning visuals, pixel art, and animations, creating a nostalgic and immersive experience.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/designer.jpg"
              alt="Designer"
              width={224}
              height={224}
              className="rounded-full object-cover shadow-2xl border-4 border-pink-400"
            />
          </div>
        </section>

        {/* Documentation Section */}
        <section className="flex flex-col md:flex-row py-16 mb-12 items-center" data-aos="fade-up">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-green-400 mb-4">📚 Documentation</h2>
            <p className="text-gray-300 mb-6">
              <span className="font-bold">[Documentation Expert&apos;s Name]</span> ensured that all game mechanics were well-documented, creating clear guidelines for smooth development.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/documentation.jpg"
              alt="Documentation"
              width={224}
              height={224}
              className="rounded-full object-cover shadow-2xl border-4 border-green-400"
            />
          </div>
        </section>

        {/* Programmer Section */}
        <section className="flex flex-col md:flex-row-reverse py-16 mb-12 items-center" data-aos="fade-up">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-blue-400 mb-4">💻 Programmer</h2>
            <p className="text-gray-300 mb-6">
              <span className="font-bold">[Programmer&apos;s Name]</span> transformed ideas into code, ensuring smooth gameplay and seamless performance across platforms.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/programmer.jpg"
              alt="Programmer"
              width={224}
              height={224}
              className="rounded-full object-cover shadow-2xl border-4 border-blue-400"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}