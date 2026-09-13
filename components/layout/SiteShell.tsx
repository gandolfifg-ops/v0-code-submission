import type { ReactNode } from "react"
import { CountryWelcomeModal } from "@/components/CountryWelcomeModal"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { SmartSearchProvider } from "@/components/SmartSearchProvider"

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <SmartSearchProvider>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-gold px-3 py-2 text-sm font-bold text-gold-foreground outline-none focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <CountryWelcomeModal />
      </div>
    </SmartSearchProvider>
  )
}
