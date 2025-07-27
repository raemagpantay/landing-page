'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-0">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Logo centered in the footer */}
        <div className="mb-2">
            <Link href="/">
            <Image
              src="/favicon.ico" // Path to your favicon in the public folder
              alt="Cerebral Enigma Logo"
              width={64} // Adjust the width of the logo (16 * 4 = 64px)
              height={64} // Adjust the height of the logo (16 * 4 = 64px)
              className="h-16" // Optional: Add custom styles
            />
            </Link>
        </div>

        {/* Social and Links */}
        <div className="flex space-x-4 mb-2">
          <Link href="https://twitter.com" target="_blank" className="hover:text-blue-500 transition duration-300 text-sm">
            Twitter
          </Link>
          <Link href="https://github.com" target="_blank" className="hover:text-blue-500 transition duration-300 text-sm">
            GitHub
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition duration-300 text-sm">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} PLANETARY DEEP-SEA SURVIVAL. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}