"use client"

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/Context/Theme/ThemeContext";
import FooterTime from "./FooterTime";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className={`py-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'
    } transition-colors duration-300`}>
      {/* ===== TOP SECTION ===== */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* ===== LEFT COLUMN ===== */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/" className="text-2xl tracking-wide">
            LAMA
          </Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

          <span className="font-semibold">test@gmail.com</span>
          <span className="font-semibold">test@gmail.com</span>

          <div className="flex gap-6">
            <Image 
              src="/ticktok.png" 
              alt="TikTok" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/facebook.png" 
              alt="Facebook" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/instagram.png" 
              alt="Instagram" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/youtube.png" 
              alt="YouTube" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/pinterest.png" 
              alt="Pinterest" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/x.png" 
              alt="X" 
              width={16} 
              height={16}
              className={theme === 'dark' ? 'invert' : ''}
            />
          </div>
        </div>

        {/* ===== CENTER COLUMNS ===== */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="" className="hover:underline">About Us</Link>
              <Link href="" className="hover:underline">Careers</Link>
              <Link href="" className="hover:underline">Affliates</Link>
              <Link href="" className="hover:underline">Blog</Link>
              <Link href="" className="hover:underline">Contact Us</Link>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="" className="hover:underline">New Arrivals</Link>
              <Link href="" className="hover:underline">Accessories</Link>
              <Link href="" className="hover:underline">Men</Link>
              <Link href="" className="hover:underline">Women</Link>
              <Link href="" className="hover:underline">All Products</Link>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">HELP</h1>
            <div className="flex flex-col gap-6">
              <Link href="" className="hover:underline">Customer Service</Link>
              <Link href="" className="hover:underline">My Account</Link>
              <Link href="https://www.tiktok.com/link/v2?aid=1988&lang=en&scene=bio_url&target=https%3A%2F%2Fallthingzqute174.bumpa.shop" className="hover:underline">Find a Store</Link>
              <Link href="https://www.ey.com/en_gl/legal-and-privacy/data-protection-binding-corporate-rules-program" className="hover:underline">Legal & Privacy</Link>
              <Link href="https://www.amazon.co.uk/Amazon-Gift-Voucher-Greeting-Card-Birthday-Christmas-Top-Up/b/?ie=UTF8&node=1571304031&ref_=nav_cs_gc" className="hover:underline">Gift Card</Link>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">SUBSCRIBE</h1>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className={`p-4 w-3/4 focus:outline-none ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
              }`}
            />
            <button className={`w-1/4 bg-lama text-white hover:bg-blue-700 transition-colors`}>
              JOIN
            </button>
          </div>
          <span className="font-semibold">Secure Payment</span>
          <div className="flex justify-between">
            <Image 
              src="/discover.png" 
              alt="Discover" 
              width={40} 
              height={20}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/skrill.png" 
              alt="Skrill" 
              width={40} 
              height={20}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/paypal.png" 
              alt="PayPal" 
              width={40} 
              height={20}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/mastercard.png" 
              alt="Mastercard" 
              width={40} 
              height={20}
              className={theme === 'dark' ? 'invert' : ''}
            />
            <Image 
              src="/visa.png" 
              alt="Visa" 
              width={40} 
              height={20}
              className={theme === 'dark' ? 'invert' : ''}
            />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-8 mt-16 pt-8 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      } border-t`}>
        <div className="flex flex-row">
          © <FooterTime /> Lama Shop
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="">
            <span className="opacity-70 mr-4">Language</span>
            <span className="font-medium">Kenya | English</span>
          </div>
          <div className="">
            <span className="opacity-70 mr-4">Currency</span>
            <span className="font-medium">KSh </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;