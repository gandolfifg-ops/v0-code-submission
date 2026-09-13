"use client"

import { useId, useMemo, useState, type KeyboardEvent } from "react"
import { SCHOOL_PAGES, normalizeSchoolKey, resolveSchool } from "@/features/scholarships/schools"
import type { StudentCountry } from "@/features/student-profile/types"

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

type SchoolAutocompleteProps = {
  value: string
  country: StudentCountry
  onChange: (school: string) => void
  onPickSchool?: (school: string) => void
  placeholder?: string
  id?: string
}

function matchesSchool(query: string, name: string, aliases: string[]): boolean {
  const q = normalizeSchoolKey(query)
  if (!q) return true
  if (normalizeSchoolKey(name).includes(q)) return true
  return aliases.some((alias) => normalizeSchoolKey(alias).includes(q))
}

export function SchoolAutocomplete({
  value,
  country,
  onChange,
  onPickSchool,
  placeholder = "e.g. University of Waterloo, UCLA",
  id,
}: SchoolAutocompleteProps) {
  const listId = useId()
  const inputId = id ?? listId
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const suggestions = useMemo(() => {
    const pool = SCHOOL_PAGES.filter((school) => school.country === country)
    const matched = pool.filter((school) => matchesSchool(value, school.name, school.aliases ?? []))
    const list = value.trim() ? matched : pool
    return [...list].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10)
  }, [country, value])

  function pick(name: string) {
    const registered = resolveSchool(name)
    const next = registered?.name ?? name
    onChange(next)
    onPickSchool?.(next)
    setOpen(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!open) setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0)))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === "Enter") {
      if (open && suggestions[activeIndex]) {
        event.preventDefault()
        pick(suggestions[activeIndex].name)
      }
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <input
        id={inputId}
        className={`${fieldClass} mt-1`}
        value={value}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActiveIndex(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120)
        }}
        onKeyDown={onKeyDown}
      />
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-background py-1 shadow-lg"
        >
          {suggestions.map((school, index) => (
            <li key={school.slug} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`flex min-h-11 w-full items-center px-3 text-left text-sm ${
                  index === activeIndex ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/70"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(school.name)}
              >
                {school.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
