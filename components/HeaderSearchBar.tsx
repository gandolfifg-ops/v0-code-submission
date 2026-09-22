"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { Loader2, Search, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useSmartSearch } from "@/components/SmartSearchProvider"
import { matchSiteSearch, type SiteSearchHit } from "@/lib/siteSearch"

const DEBOUNCE_MS = 200

type HeaderSearchBarProps = {
  className?: string
  inputId?: string
  onRanSearch?: () => void
}

export function HeaderSearchBar({
  className,
  inputId = "header-smart-search",
  onRanSearch,
}: HeaderSearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { countryCode } = useSmartSearch()
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<SiteSearchHit[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const placeholder =
    pathname === "/cards" || pathname.startsWith("/cards/")
      ? "Search student cards…"
      : "Schools, OSAP, FAFSA, EQ Bank…"

  useEffect(() => {
    const q = value.trim()
    if (!q) {
      setSuggestions([])
      setLoading(false)
      return
    }

    const local = matchSiteSearch(q, { country: countryCode, limit: 8 })
    setSuggestions(local)
    setActiveIndex(-1)
    setOpen(true)
    setLoading(true)

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(q)}&country=${countryCode}`,
        )
        if (!res.ok) throw new Error("suggestions failed")
        const data = await res.json()
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions as SiteSearchHit[])
        }
      } catch {
        // Keep instant client matches if the API is empty or down.
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value, countryCode])

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function goToResults(query: string) {
    const next = query.trim()
    if (!next) return
    setValue(next)
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(next)}`)
    onRanSearch?.()
  }

  function goToHit(hit: SiteSearchHit) {
    setValue(hit.label)
    setOpen(false)
    router.push(hit.href)
    onRanSearch?.()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!open) setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const picked = activeIndex >= 0 ? suggestions[activeIndex] : null
      if (picked) goToHit(picked)
      else goToResults(value)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const showPanel = open && value.trim().length > 0

  return (
    <div ref={wrapRef} className={`relative z-50 ${className ?? "min-w-0 w-full md:w-64 lg:w-80"}`}>
      {showPanel && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:bg-black/20"
          aria-label="Close search"
          onClick={() => {
            setOpen(false)
            setActiveIndex(-1)
          }}
        />
      )}
        <label className="sr-only" htmlFor={inputId}>
          {placeholder}
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            className="relative z-50 min-h-11 w-full rounded-lg border border-border bg-background py-2 pl-9 pr-16 text-sm text-foreground outline-none focus:border-link focus:ring-1 focus:ring-link"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (value.trim()) setOpen(true)
          }}
          onKeyDown={onKeyDown}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />}
          {value && (
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
              onClick={() => {
                setValue("")
                setSuggestions([])
                setOpen(false)
              }}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
        {showPanel && (
          <ul
            id={listId}
            role="listbox"
            className="absolute right-0 z-[60] mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-background py-1 shadow-lg"
          >
            {suggestions.map((item, index) => (
              <li key={item.id} role="option" aria-selected={index === activeIndex} id={`${listId}-${index}`}>
                <button
                  type="button"
                  className={`flex min-h-11 w-full flex-col justify-center px-4 py-2 text-left text-sm ${
                    index === activeIndex ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToHit(item)}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs capitalize text-muted-foreground">{item.kind}</span>
                </button>
              </li>
            ))}
            <li role="option" aria-selected={activeIndex === suggestions.length}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center px-4 py-2 text-left text-sm font-medium text-link hover:bg-muted"
                onClick={() => goToResults(value)}
              >
                Search WealthNutz for “{value.trim()}”
              </button>
            </li>
          </ul>
        )}
    </div>
  )
}
