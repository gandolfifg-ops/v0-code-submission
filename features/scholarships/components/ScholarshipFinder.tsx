"use client"

import { useState, type FormEvent } from "react"
import { CountryToggle } from "@/components/CountryToggle"
import { ResultCard } from "@/features/scholarships/components/ResultCard"
import {
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_MAJORS,
  type ScholarshipCountry,
  type ScholarshipResult,
} from "@/features/scholarships/types"

type SearchResponse = {
  source: "live" | "curated"
  notice: string
  results: ScholarshipResult[]
}

const selectClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

export function ScholarshipFinder() {
  const [country, setCountry] = useState<ScholarshipCountry>("Canada")
  const [major, setMajor] = useState<string>("Any major")
  const [level, setLevel] = useState<string>("Any level")
  const [query, setQuery] = useState("")
  const [university, setUniversity] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [source, setSource] = useState<"live" | "curated" | null>(null)
  const [results, setResults] = useState<ScholarshipResult[]>([])
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/api/scholarships/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, major, level, query, university }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      setResults(data.results ?? [])
      setSource(data.source)
      setNotice(data.notice)
    } catch {
      setError("Could not run the search. Check your connection and try again.")
      setResults([])
      setSource(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
        Scholarships
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Scholarship Finder
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Search public scholarship sites for Canada or the US. This is web search plus a
        short curated list — not a government awards database. Confirm every deadline
        on the official page.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6"
      >
        <CountryToggle
          value={country}
          onChange={setCountry}
          options={[
            { value: "Canada", flag: "CA", label: "Canada" },
            { value: "USA", flag: "US", label: "United States" },
          ]}
        />

        <label className="block text-xs font-medium text-muted-foreground">
          Major
          <select className={`${selectClass} mt-1`} value={major} onChange={(e) => setMajor(e.target.value)}>
            {SCHOLARSHIP_MAJORS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          School level
          <select className={`${selectClass} mt-1`} value={level} onChange={(e) => setLevel(e.target.value)}>
            {SCHOLARSHIP_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          Keywords
          <input
            className={`${selectClass} mt-1`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. first-generation, nursing, Indigenous"
          />
        </label>

        <label className="block text-xs font-medium text-muted-foreground">
          School name (optional)
          <input
            className={`${selectClass} mt-1`}
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="e.g. University of Toronto, UCLA"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="min-h-11 w-full rounded-xl bg-[#C9A84C] text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f] disabled:opacity-60"
        >
          {loading ? "Searching…" : "Find scholarships"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {notice && (
        <p
          className={`mt-6 rounded-xl border px-4 py-3 text-sm break-words ${
            source === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
              : "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-foreground"
          }`}
        >
          {notice}
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      )}

      {!loading && source && results.length === 0 && !error && (
        <p className="mt-6 text-sm text-muted-foreground">
          No listings matched this search. Try a broader major or fewer keywords.
        </p>
      )}
    </div>
  )
}
