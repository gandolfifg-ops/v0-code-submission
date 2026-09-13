import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteShell } from "@/components/layout/SiteShell"
import { pageMeta } from "@/lib/seo"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = pageMeta(
  "WealthNutz — Student finance for Canada and the US",
  "Student banking, scholarships, and loans in Canada and the US. Education only — confirm details on official sites.",
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
