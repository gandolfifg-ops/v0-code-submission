import type { ReactNode } from "react"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { SmartSearchProvider } from "@/components/SmartSearchProvider"

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <SmartSearchProvider>
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmartSearchProvider>
  )
}
