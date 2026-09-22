"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { CountryFlag } from "@/components/CountryFlag"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { hasChosenCountry, saveStudentCountry } from "@/features/student-profile/store"
import type { StudentCountry } from "@/features/student-profile/types"

const SKIP_COUNTRY_MODAL = ["/privacy", "/terms", "/cookies", "/about", "/help", "/contact"]

function shouldSkipCountryModal(pathname: string): boolean {
  return SKIP_COUNTRY_MODAL.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function CountryWelcomeModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const canadaRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (shouldSkipCountryModal(pathname)) {
      setOpen(false)
      return
    }
    if (!hasChosenCountry()) {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      setOpen(true)
    }
  }, [pathname])

  function choose(country: StudentCountry) {
    saveStudentCountry(country)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Esc / backdrop must not silently pick Canada for a US student.
        if (!next && !hasChosenCountry()) {
          setOpen(true)
          return
        }
        setOpen(next)
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-md rounded-2xl border-border p-5 sm:p-6"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          canadaRef.current?.focus()
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          const previous = restoreFocusRef.current
          if (previous && previous !== document.body && document.contains(previous)) {
            previous.focus()
            return
          }
          document.getElementById("main-content")?.focus()
        }}
      >
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle
            id="country-welcome-title"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Are you in Canada or the United States?
          </DialogTitle>
          <DialogDescription id="country-welcome-desc" className="text-sm text-muted-foreground">
            Choose one so we show scholarships, loans, and banking for your country. You can
            change it anytime with the country toggle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-1">
          <button
            ref={canadaRef}
            type="button"
            onClick={() => choose("Canada")}
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-gold px-4 text-base font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
          >
            <CountryFlag code="CA" className="h-5 w-8 rounded-sm" />
            Canada
          </button>
          <button
            type="button"
            onClick={() => choose("USA")}
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 text-base font-bold text-foreground transition-colors hover:bg-muted"
          >
            <CountryFlag code="US" className="h-5 w-8 rounded-sm" />
            United States
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
