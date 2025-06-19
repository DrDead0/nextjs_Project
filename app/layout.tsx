import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViLog",
  description: "Vilog Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ViLog</title>
        <meta name="description" content="Vilog Website" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <header style={{width: '100%', background: '#0070f3', padding: '16px 0', textAlign: 'center', marginBottom: 32}}>
          <Link href="/" style={{color: '#fff', fontWeight: 800, fontSize: 28, letterSpacing: 2, textDecoration: 'none'}}>Vilog</Link>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
