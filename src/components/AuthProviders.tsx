'use client';

import { CartProvider } from '@/app/Context/CartContext';
import { ThemeProvider } from '@/app/Context/Theme/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function AuthProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
