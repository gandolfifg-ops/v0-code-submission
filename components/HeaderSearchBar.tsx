"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { Loader2, Search, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSmartSearch } from "@/components/SmartSearchProvider"

const DEBOUNCE_MS = 200

export function HeaderSearchBar() {
  const pathname = usePathname()
  const { countryCode, submitQuery } = useSmartSearch()
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const show = pathname === "/scholarships" || pathname === "/loans"
  const placeholder = pathname === "/loans" ? "Search loans…" : "Search scholarships…"

  useEffect(() => {
    if (!show) return
    const q = value.trim()
    if (!q) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(q)}&country=${countryCode}`,
        )
        if (!res.ok) throw new Error("suggestions failed")
        const data = await res.json()
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
        setActiveIndex(-1)
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value, countryCode, show])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  function runSearch(query: string) {
    const next = query.trim()
    if (!next) return
    setValue(next)
    setOpen(false)
    submitQuery(next)
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
      const picked = activeIndex >= 0 ? suggestions[activeIndex] : value
      runSearch(picked)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  if (!show) return null

  return (
    <div ref={wrapRef} className="relative min-w-0 w-full md:w-64 lg:w-72">
      <label className="sr-only" htmlFor="header-smart-search">
        {placeholder}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="header-smart-search"
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        className="h-9 w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-16 text-sm text-foreground outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />}
        {value && (
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
            onClick={() => {
              setValue("")
              setSuggestions([])
              setOpen(false)
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-background py-1 shadow-lg"
        >
          {suggestions.map((item, index) => (
            <li key={item} role="option" aria-selected={index === activeIndex} id={`${listId}-${index}`}>
              <button
                type="button"
                className={`w-full px-4 py-3 text-left text-sm ${
                  index === activeIndex ? "bg-[#C9A84C]/15 text-foreground" : "text-foreground hover:bg-muted"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => runSearch(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
