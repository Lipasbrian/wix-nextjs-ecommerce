'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiUser, FiShoppingCart, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/app/Context/Theme/ThemeContext';
import { useCart } from '@/app/Context/CartContext';
import Cart from '@/components/Cart';

export default function Navbar() {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/favicon.ico"
                alt="LAMA"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold">LAMA</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/shop" className="nav-link">
                Shop
              </Link>
              <Link href="/deals" className="nav-link">
                Deals
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="text-2xl text-yellow-500" />
              ) : (
                <FiMoon className="text-2xl text-gray-700" />
              )}
            </button>

            <button
              onClick={() => setShowCart(true)}
              className="relative text-2xl text-gray-700 dark:text-gray-200"
              aria-label="Open cart"
            >
              <FiShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {session ? (
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
                  </div>
                ) : (
                  <FiUser className="text-2xl text-gray-700 dark:text-gray-200" />
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                      {session.user?.role === 'ADMIN' && (
                        <Link href="/admin" className="dropdown-item">
                          Admin Dashboard
                        </Link>
                      )}
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin/analytics"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Analytics Dashboard
                        </Link>
                      )}
                      {session.user?.role === 'VENDOR' && (
                        <Link href="/vendor" className="dropdown-item">
                          Vendor Dashboard
                        </Link>
                      )}
                      <Link href="/profile" className="dropdown-item">
                        Profile Settings
                      </Link>
                      <Link href="/profile/avatar" className="dropdown-item">
                        Change Avatar
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="dropdown-item text-red-600 dark:text-red-400"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Cart showCart={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
}
