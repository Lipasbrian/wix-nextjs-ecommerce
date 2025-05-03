import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from '@/components/ui/use-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LAMA E-Commerce',
  description: 'Modern shopping experience',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            <ToastProvider>{children}</ToastProvider>
          </main>
          <Footer />
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
