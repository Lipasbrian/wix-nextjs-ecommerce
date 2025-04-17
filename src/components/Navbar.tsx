"use client";

import Link from "next/link";
import { useCart } from "@/app/Context/CartContext";
import { useState, useEffect } from "react";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { useTheme } from "@/app/Context/Theme/ThemeContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Add this line to get cart from context
  const { cart, totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking a token in localStorage)
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
  }, []);

  const handleLogout = () => {
    // Clear user session (implement actual logout logic here)
    localStorage.removeItem("userToken"); // Example: Remove token from localStorage
    setIsLoggedIn(false); // Update logged-in state
    router.push("/login"); // Redirect to login page
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      // Redirect to login page if user is not logged in
      router.push("/login");
    } else {
      // Toggle profile dropdown if user is logged in
      setIsProfileOpen(!isProfileOpen);
    }
  };

  return (
    <header
      className={`sticky top-0 z-10 h-20 shadow-sm ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="h-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
        {/* Mobile Layout */}
        <div className="md:hidden h-full flex items-center justify-between">
          <Menu />

          {/* Center - Logo */}
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="LAMA Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="text-2xl tracking-wide">LAMA</div>
          </Link>

          {/* Right Side - Theme Toggle, Cart, and Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? "🌑" : "☀️"}
            </button>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              aria-label="Cart"
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Profile"
              >
                👤
              </button>

              {/* Profile Dropdown */}
              {isLoggedIn && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {/* Add Create Ad link here */}
                  <Link
                    href="/Vendor/ads/create"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Create Ad
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-8 h-full">
          {/* Left Section - Logo and Links */}
          <div className="flex-1 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="LAMA Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-2xl tracking-wide">LAMA</div>
            </Link>

            <div className="hidden xl:flex gap-4">
              <Link
                href="/"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Home
              </Link>
              {/* Add Create Ad link here */}
              {isLoggedIn && (
                <Link
                  href="/Vendor/ads/create"
                  className="hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Create Ad
                </Link>
              )}
              <Link
                href="/shop"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Shop
              </Link>
              <Link
                href="/deals"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Deals
              </Link>
              <Link
                href="/about"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section - Search, Theme, Cart, and Profile */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <button
              onClick={toggleTheme}
              className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? "🌑" : "☀️"}
            </button>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              aria-label="Cart"
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Profile"
              >
                👤
              </button>

              {/* Profile Dropdown */}
              {isLoggedIn && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Modal */}
        {isCartOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setIsCartOpen(false)} // Close the cart when clicking the overlay
            />
            <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg z-20 w-80 p-4">
              <h2 className="text-lg font-bold mb-4">Your Cart</h2>
              {cart.length > 0 ? (
                <ul>
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between mb-2">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} x ${item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Your cart is empty.</p>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
