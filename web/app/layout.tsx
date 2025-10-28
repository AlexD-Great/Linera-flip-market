import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://linera-flip-market.vercel.app'),
  title: "Linera Flip Market - Decentralized Coin Flip Betting",
  description: "Real-time coin flip betting powered by Linera microchains. Create flips, place bets, and win instantly with zero-latency blockchain technology.",
  keywords: ["Linera", "blockchain", "coin flip", "betting", "DeFi", "microchains", "Web3"],
  authors: [{ name: "AlexD-Great" }],
  openGraph: {
    title: "⚡ Linera Flip Market",
    description: "Real-time coin flip betting powered by Linera microchains",
    url: "https://linera-flip-market.vercel.app",
    siteName: "Linera Flip Market",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Linera Flip Market - Decentralized Betting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "⚡ Linera Flip Market",
    description: "Real-time coin flip betting powered by Linera microchains",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
