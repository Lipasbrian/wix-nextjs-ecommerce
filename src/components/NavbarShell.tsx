import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import Menu from "./Menu";
import { useState } from "react";
import { useTheme } from "@/app/Context/Theme/ThemeContext";

export default function NavbarShell({
  itemCount,
  onCartClick,
}: {
  itemCount: number;
  onCartClick: () => void;
}) {
  const { theme, toggleTheme } = useTheme(); // Theme toggle logic
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart modal state

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm h-20">
      <div className="h-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
        {/* Mobile Layout */}
        <div className="md:hidden h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <div className="text-2xl tracking-wide">LAMA</div>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-md"
              aria-label="Cart"
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Menu />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-8 h-full">
          {/* Left Section */}
          <div className="w-1/3 xl:w-1/2 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="LAMA Logo" width={24} height={24} />
              <div className="text-2xl tracking-wide">LAMA</div>
            </Link>
            <div className="hidden xl:flex gap-4">
              <Link href="/">Homepage</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
            <SearchBar />
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? "🌑" : "☀️"}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-md"
                aria-label="Cart"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Cart Modal */}
              {isCartOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setIsCartOpen(false)}
                  />
                  <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg z-20 w-80 p-4">
                    <h2 className="text-lg font-bold mb-4">Your Cart</h2>
                    {itemCount > 0 ? (
                      <ul>
                        {/* Replace with actual cart items */}
                        <li className="flex justify-between mb-2">
                          <span>Item Name</span>
                          <span>1 x $10</span>
                        </li>
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
          </div>
        </div>
      </div>
    </header>
  );
}
