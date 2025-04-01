"use client";

import Link from "next/link";
import { useCart } from "@/app/Context/CartContext";
import { useState } from "react";
import Menu from "./Menu";
import SearchBar from "./SearchBar";

import { useTheme } from "@/app/Context/Theme/ThemeContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          <Link href="/" className="text-xl font-bold">
            <div className="text-2xl tracking-wide">LAMA</div>
          </Link>

          {/* Right Side - Theme Toggle and Cart */}
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-8 h-full">
          {/* Left Section - Logo and Links */}
          <div className="flex-1 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-2xl tracking-wide">LAMA</div>
            </Link>

            <div className="hidden xl:flex gap-4">
              <Link
                href="/"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Home
              </Link>
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

          {/* Right Section - Search, Theme, and Cart */}
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cart Modal */}
        {isCartOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setIsCartOpen(false)}
            />
            {/* Your cart modal content here */}
          </>
        )}
      </div>
    </header>
  );
}
