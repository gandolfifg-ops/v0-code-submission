"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "@/components/Logo"
import { PRIMARY_NAV, SECONDARY_NAV, isActivePath } from "@/lib/constants/nav"
import { MobileNav } from "@/components/layout/MobileNav"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href)

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? "text-[#C9A84C]" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {active && (
        <span className="mt-0.5 block h-0.5 rounded-full bg-[#C9A84C]" aria-hidden="true" />
      )}
    </Link>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Logo size={28} showText />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {PRIMARY_NAV.map((link) => (
              <DesktopNavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex" aria-label="Secondary">
              {SECONDARY_NAV.map((link) => (
                <DesktopNavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
