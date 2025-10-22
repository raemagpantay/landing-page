'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config'; // Import Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if the user is signed in
  const [userEmail, setUserEmail] = useState(''); // Store the user's email
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [imageError, setImageError] = useState(false); // Track image loading errors
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

  // Function to truncate email if it's too long
  const truncateEmail = (email: string, maxLength: number = 20) => {
    if (email.length <= maxLength) return email;
    const [username, domain] = email.split('@');
    if (username.length > maxLength - 3) {
      return `${username.substring(0, maxLength - 3)}...@${domain}`;
    }
    return email;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const button = document.getElementById('user-menu-button');

      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-transparent text-white py-6 px-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            {!imageError ? (
              <Image
                src="/images/favicontrashbin.ico"
                alt="Salvage Protocol - Environmental Cleanup Game"
                width={60}
                height={60} 
                className="h-20 w-20 hover:scale-105 transition-transform duration-200"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback trash bin icon if image fails to load
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 6v18h18V6H3zm2 2h14v14H5V8zm2-6h6v2H7V2zm0 6v10h2V8H7zm4 0v10h2V8h-2zm4 0v10h2V8h-2z"/>
                  <path d="M9 4h6v1H9V4z" fill="currentColor" opacity="0.7"/>
                </svg>
              </div>
            )}
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
                      className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 z-50 hover:bg-gray-700 transition-colors"
                      id="user-menu-button"
                      aria-expanded={dropdownOpen}
                      onClick={toggleDropdown}
                    >
                      <span className="sr-only">Open user menu</span>
                      <svg
                        className="w-8 h-8 rounded-full p-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute right-0 mt-2 w-64 z-40 transition-all duration-200 ease-in-out ${
                        dropdownOpen
                          ? 'opacity-100 visible transform translate-y-0'
                          : 'opacity-0 invisible transform -translate-y-2'
                      } text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-xl dark:bg-gray-700 dark:divide-gray-600 border border-gray-200 dark:border-gray-600`}
                      id="user-dropdown"
                    >
                      {/* User Info Section */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-600 rounded-t-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {auth.currentUser?.displayName || 'User'}
                            </p>
                            <p
                              className="text-xs text-gray-500 dark:text-gray-300 truncate"
                              title={userEmail} // Show full email on hover
                            >
                              {truncateEmail(userEmail, 25)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                            </svg>
                            Shop
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/Admin"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Admin Panel
                          </Link>
                        </li>
                        <li className="border-t border-gray-100 dark:border-gray-600">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600 dark:text-red-400 dark:hover:text-white transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </div>
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