// Layout v15 — Force full recompile of all child routes
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Forge | The AI-Powered Wealth Intelligence Platform',
  description: 'Forge is the ultimate AI tool for students to scour the web for scholarships, optimize investments, and build a debt-free future. Real-time scholarship search, loan comparison, and quantitative financial advice for students in USA and Canada.',
  keywords: 'Forge AI, real-time scholarship search, AI wealth co-pilot, student investment optimizer, scholarship finder 2026, student loan comparison, TFSA, Roth IRA, debt-free future, financial literacy',
  generator: 'v0.app',
  openGraph: {
    title: 'Forge | AI-Powered Wealth Intelligence Platform',
    description: 'Forge is the ultimate AI tool for students to scour the web for scholarships, optimize investments, and build a debt-free future.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forge | AI Wealth Intelligence Platform',
    description: 'Scour the web for scholarships, optimize investments, and build a debt-free future with Forge AI.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
