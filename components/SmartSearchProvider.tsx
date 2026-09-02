"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type SearchCountry = "Canada" | "USA"

type SmartSearchTicket = {
  query: string
  id: number
}

type SmartSearchContextValue = {
  country: SearchCountry
  setCountry: (country: SearchCountry) => void
  countryCode: "CA" | "US"
  ticket: SmartSearchTicket | null
  submitQuery: (query: string) => void
}

const SmartSearchContext = createContext<SmartSearchContextValue | null>(null)

export function SmartSearchProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<SearchCountry>("Canada")
  const [ticket, setTicket] = useState<SmartSearchTicket | null>(null)

  const submitQuery = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setTicket({ query: trimmed, id: Date.now() })
  }, [])

  const value = useMemo(
    () => ({
      country,
      setCountry,
      countryCode: (country === "USA" ? "US" : "CA") as "CA" | "US",
      ticket,
      submitQuery,
    }),
    [country, ticket, submitQuery],
  )

  return <SmartSearchContext.Provider value={value}>{children}</SmartSearchContext.Provider>
}

export function useSmartSearch() {
  const ctx = useContext(SmartSearchContext)
  if (!ctx) {
    throw new Error("useSmartSearch must be used within SmartSearchProvider")
  }
  return ctx
}
