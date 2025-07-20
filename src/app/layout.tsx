"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../i18n";
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'INITIAL_SESSION') {
        // handle initial session
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
      } else if (event === 'SIGNED_OUT') {
        redirect('/signin');
      } else if (event === 'PASSWORD_RECOVERY') {
        redirect('/reset-password');
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [supabase.auth]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}
