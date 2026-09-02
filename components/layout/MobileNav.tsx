"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ALL_NAV, isActivePath } from "@/lib/constants/nav"
import { NAV_ICONS } from "@/lib/constants/navIcons"
import { X } from "lucide-react"

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {ALL_NAV.map((link) => {
            const active = isActivePath(pathname, link.href)
            const Icon = NAV_ICONS[link.href]
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  active
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0 text-[#C9A84C]" strokeWidth={1.75} aria-hidden="true" />
                )}
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
