import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instagram Reel Downloader',
  description: 'Download Instagram Reels and Videos instantly.',
  openGraph: {
    title: 'Instagram Reel Downloader',
    description: 'Download Instagram Reels and Videos instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Reel Downloader',
    description: 'Download Instagram Reels and Videos instantly.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
