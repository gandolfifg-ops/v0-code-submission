"use client"

import { useEffect, useState } from "react"
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

export function CountryWelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!hasChosenCountry()) setOpen(true)
  }, [])

  function choose(country: StudentCountry) {
    saveStudentCountry(country)
    setOpen(false)
  }

  function dismissWithCanada() {
    if (!hasChosenCountry()) saveStudentCountry("Canada")
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismissWithCanada()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-md rounded-2xl border-border p-5 sm:p-6"
      >
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Are you in Canada or the United States?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            We’ll use this to show scholarships, loans, and banking for your country. You can
            change it anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-1">
          <button
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
