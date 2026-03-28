// Layout v54 — Full module graph reset via file deletion and recreation
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WealthNutz — Finding the Best Loans, Scholarships & Credit Cards for everyone across North America',
  description: 'Stop searching and start finding. We simplify the complex world of North American finance by matching young people with the best loans, scholarships, and cards, in combination with high level simulations and our own financial AI, all in one smart platform ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
