'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config'; // Import Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if the user is signed in
  const [userEmail, setUserEmail] = useState(''); // Store the user's email
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email || '');
        sessionStorage.setItem('userEmail', user.email || '');
      } else {
        setIsSignedIn(false);
        setUserEmail('');
        sessionStorage.removeItem('userEmail');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      setDropdownOpen(false); // Close the dropdown
      router.push('/sign-in'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <header className="bg-transparent text-white py-6 px-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Unlocking Minds Logo"
              width={80}
              height={80}
              className="h-20 -mt-5 -mb-5"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-transparent">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
              {isSignedIn ? (
                <>
                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 z-50"
                      id="user-menu-button"
                      aria-expanded={dropdownOpen}
                      onClick={toggleDropdown}
                    >
                      <span className="sr-only">Open user menu</span>
                      <svg
                        className="w-8 h-8 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          key="dropdown"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          className="absolute right-0 mt-2 w-48 z-40 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 origin-top-right"
                          id="user-dropdown"
                        >
                          <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900 dark:text-white">
                              {auth.currentUser?.displayName || userEmail}
                            </span>
                          </div>
                          <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                              <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition"
                              >
                                Profile
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition"
                              >
                                Settings
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition"
                              >
                                Sign out
                              </button>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                // Sign In Button
                <Link
                  href="/sign-in"
                  className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl text-lg font-medium shadow-xl"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}