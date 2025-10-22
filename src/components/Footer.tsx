'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  const handleTeamClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/Team');
  };

  return (
    <footer className="bg-black text-white py-4 mt-0">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Logo centered in the footer */}
        <div className="mb-2">
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Cerebral Enigma Logo"
              width={64}
              height={64}
              className="h-16"
            />
          </Link>
        </div>

        {/* Social and Links */}
        <div className="flex space-x-4 mb-2">
          <Link href="https://twitter.com/" target="_blank" className="hover:text-blue-500 transition duration-300 text-sm">
            Twitter
          </Link>
          <Link href="https://github.com/" target="_blank" className="hover:text-blue-500 transition duration-300 text-sm">
            GitHub
          </Link>
          <a
            href="/Team"
            onClick={handleTeamClick}
            className="hover:text-blue-500 transition duration-300 text-sm"
          >
            Team
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} SALVAGE PROTOCOL. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}