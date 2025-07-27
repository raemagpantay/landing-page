
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

const team = [
  {
    name: 'Kevin Biazon',
    role: 'Lead Developer & Game Designer',
    quote: '"Turning ideas into immersive worlds."',
    profile: '/images/teampics/Kevin.jpg',
    accent: 'from-red-500 to-orange-400',
  },
  {
    name: 'Aaron Ferry',
    role: 'UI/UX Designer & Animator',
    quote: '"Design is intelligence made visible."',
    profile: '/images/teampics/Aaron.jpg',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Jenzel Dela Cruz',
    role: '3D Artist & Map Designer',
    quote: '"Art is not what you see, but what you make others see."',
    profile: '/images/teampics/Jenzel.jpg',
    accent: 'from-yellow-400 to-pink-500',
  },
  {
    name: 'Rae Magpantay',
    role: 'Project Manager & Website Developer',
    quote: '"Building the invisible, powering the experience."',
    profile: '/images/teampics/Rae.jpg',
    accent: 'from-green-400 to-blue-500',
  },
];

export default function Team() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 px-0 py-0">
        <section className="w-full flex flex-col items-center py-20 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            Meet the Team
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-16 text-center max-w-2xl">
            Behind <span className="text-blue-400 font-bold">Planetary Deep-Sea Survival</span> is a passionate team of developers, designers, and artists. Get to know the people who brought this adventure to life!
          </p>
          {/* Team Cards */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 justify-center items-stretch">
            {team.map((member) => (
              <div
                key={member.name}
                className={`relative flex-1 min-w-[320px] max-w-md rounded-2xl overflow-hidden shadow-2xl group transition-all duration-500`}
                style={{
                  background: `linear-gradient(135deg, rgba(30,41,59,0.95) 70%, rgba(0,0,0,0.95) 100%)`,
                }}
              >
                {/* Profile Image */}
                <div className="relative flex flex-col items-center pt-10 z-10">
                  <div className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg overflow-hidden mb-4 bg-gray-900">
                    <Image
                      src={member.profile}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="w-28 h-28 object-cover"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white mb-1">{member.name}</span>
                  <span className="text-cyan-300 font-medium mb-4">{member.role}</span>
                  <div className="w-full flex-1 flex items-end justify-center">
                    <div className="bg-black/60 rounded-xl px-6 py-4 mt-4 mb-8 shadow-lg text-center transition-all duration-500 group-hover:bg-cyan-900/80">
                      <span className="text-lg italic text-cyan-200">{member.quote}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}