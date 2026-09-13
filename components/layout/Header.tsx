"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Logo } from "@/components/Logo"
import { HeaderSearchBar } from "@/components/HeaderSearchBar"
import { PRIMARY_NAV, SECONDARY_NAV, isActivePath, isRelatedPath } from "@/lib/constants/nav"
import { NAV_ICONS } from "@/lib/constants/navIcons"
import { MobileNav } from "@/components/layout/MobileNav"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href)
  const related = isRelatedPath(pathname, href)
  const Icon = NAV_ICONS[href]

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
        active
          ? "font-medium text-link"
          : related
            ? "font-semibold text-foreground"
            : "font-medium text-muted-foreground hover:text-foreground"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-link" strokeWidth={1.75} aria-hidden="true" />}
      <span className="flex flex-col">
        {label}
        {active && (
          <span className="mt-0.5 block h-0.5 rounded-full bg-link" aria-hidden="true" />
        )}
      </span>
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-12 max-w-6xl min-w-0 flex-nowrap items-center justify-between gap-3 overflow-x-hidden px-3 md:h-16 md:overflow-visible md:gap-4 md:px-6">
          <Logo size={26} showText />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {PRIMARY_NAV.map((link) => (
              <DesktopNavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden md:block">
              <HeaderSearchBar />
            </div>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Secondary">
              {SECONDARY_NAV.map((link) => (
                <DesktopNavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
