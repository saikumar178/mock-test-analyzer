'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Home, Info, History, PencilLine, Mail,Trophy, Shield } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        {/* Light Theme Logo */}
        <Image
          src="/logo.png"
          alt="MockTest Logo Light"
          width={90}
          height={90}
          className="block dark:hidden"
        />

        {/* Dark Theme Logo */}
        <Image
          src="/logo1.png"
          alt="MockTest Logo Dark"
          width={90}
          height={90}
          className="hidden dark:block"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <Link href="/dashboard" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">Dashboard</Link>
        <Link href="/leaderboard" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
  Leaderboard
</Link>

        <Link href="/about" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">About</Link>
        <Link href="/history" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">History</Link>
        <Link href="/contact" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">Contact</Link>
        <Link href="/exam/start" className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">Take Exam</Link>

        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow transition duration-200">
              Admin
            </button>
          </Link>
        )}

        {session?.user ? (
          <>
            <Link href="/profile" className="flex items-center gap-2">
              <Image
                src={session.user.image || '/profile_pic.jpg'}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <span className="text-gray-800 dark:text-gray-200">{session.user.name}</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded">Login</Link>
            <Link href="/signup" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-1.5 rounded">Signup</Link>
          </>
        )}
      </div>

      {/* Hamburger for Mobile */}
      <button className="md:hidden text-gray-700 dark:text-white" onClick={toggleMenu}>
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded shadow-md w-48 p-4 flex flex-col space-y-2 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-2 hover:text-blue-600">
  <Trophy className="w-4 h-4" /> Leaderboard
</Link>

          <Link href="/about" className="flex items-center gap-2 hover:text-blue-600">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link href="/history" className="flex items-center gap-2 hover:text-blue-600">
            <History className="w-4 h-4" /> History
          </Link>
          <Link href="/contact" className="flex items-center gap-2 hover:text-blue-600">
            <Mail className="w-4 h-4" /> Contact
          </Link>
          <Link href="/exam/start" className="flex items-center gap-2 hover:text-blue-600">
            <PencilLine className="w-4 h-4" /> Take Exam
          </Link>

          {session?.user?.role === 'ADMIN' && (
            <Link href="/admin" className="flex items-center gap-2 hover:text-blue-600">
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}

          {!session?.user ? (
            <>
              <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-center">
                Login
              </Link>
              <Link href="/signup" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-1.5 rounded text-center">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-800 dark:text-gray-200">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
