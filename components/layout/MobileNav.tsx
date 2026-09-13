"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { HeaderSearchBar } from "@/components/HeaderSearchBar"
import { ALL_NAV, isActivePath, isRelatedPath } from "@/lib/constants/nav"
import { NAV_ICONS } from "@/lib/constants/navIcons"
import { X } from "lucide-react"

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const nodes = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-nav-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        id="mobile-nav"
        className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-background shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span id="mobile-nav-title" className="text-sm font-semibold text-foreground">
            Menu
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="border-b border-border px-3 py-3">
          <HeaderSearchBar
            className="relative z-50 min-w-0 w-full"
            inputId="mobile-smart-search"
            onRanSearch={onClose}
          />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Mobile">
          {ALL_NAV.map((link) => {
            const active = isActivePath(pathname, link.href)
            const related = isRelatedPath(pathname, link.href)
            const Icon = NAV_ICONS[link.href]
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-3 text-base transition-colors ${
                  active
                    ? "bg-muted font-medium text-link"
                    : related
                      ? "font-semibold text-foreground hover:bg-muted"
                      : "font-medium text-foreground hover:bg-muted"
                }`}
              >
                {Icon && (
                  <Icon className="h-4 w-4 shrink-0 text-link" strokeWidth={1.75} aria-hidden="true" />
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
