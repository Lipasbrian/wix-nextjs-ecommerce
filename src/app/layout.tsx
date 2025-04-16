import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Footer from "@/components/Footer";
import { CartProvider } from "@/app/Context/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/app/Context/Theme/ThemeContext";
import HydrationFix from "@/components/HydrationFix";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LAMA E-Commerce",
  description: "Modern shopping experience",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col min-h-screen`}
      >
        <Providers>
          <ThemeProvider>
            <HydrationFix>
              <CartProvider>
                <Toaster position="top-center" />
                <Navbar />
                <main className="flex-grow min-h-[calc(100vh-80px)]">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </HydrationFix>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
