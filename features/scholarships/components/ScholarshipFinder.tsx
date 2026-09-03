"use client"

import { useEffect, useState, type FormEvent } from "react"
import { GraduationCap, ListChecks, Search } from "lucide-react"
import { CountryToggle } from "@/components/CountryToggle"
import { useSmartSearch } from "@/components/SmartSearchProvider"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ResultCard } from "@/features/scholarships/components/ResultCard"
import { StudentProfileBox } from "@/features/student-profile/components/StudentProfileBox"
import { isProfileFilled, type StudentProfile } from "@/features/student-profile/types"
import {
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_MAJORS,
  type ScholarshipCountry,
  type ScholarshipResult,
} from "@/features/scholarships/types"
import { isExpiredDeadline } from "@/lib/liveResultText"

type SearchResponse = {
  source: "live" | "curated"
  notice: string
  results: ScholarshipResult[]
}

const selectClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

export function ScholarshipFinder() {
  const { setCountry: setSearchCountry, ticket } = useSmartSearch()
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
  const [hasSearched, setHasSearched] = useState(false)

  function applyProfile(profile: StudentProfile | null) {
    if (!isProfileFilled(profile) || !profile) return
    setCountry(profile.country)
    setSearchCountry(profile.country)
    if (profile.major) setMajor(profile.major)
    if (profile.level) setLevel(profile.level)
    if (profile.school.trim()) setUniversity(profile.school.trim())
  }

  async function runSearch(next: { query: string; university?: string; fromHeader?: boolean }) {
    setLoading(true)
    setError(null)
    setNotice(null)
    setHasSearched(true)
    const fromHeader = Boolean(next.fromHeader)
    try {
      const res = await fetch("/api/scholarships/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          major: fromHeader ? "Any major" : major,
          level: fromHeader ? "Any level" : level,
          query: next.query,
          university: fromHeader ? "" : (next.university ?? university),
        }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      const results = (data.results ?? []).filter((item) => !isExpiredDeadline(item.deadline))
      setResults(results)
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

  useEffect(() => {
    setSearchCountry(country)
  }, [country, setSearchCountry])

  useEffect(() => {
    if (!ticket) return
    setQuery(ticket.query)
    setUniversity("")
    void runSearch({ query: ticket.query, university: "", fromHeader: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when header submits a new ticket
  }, [ticket?.id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await runSearch({ query, university })
  }

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-3 py-3 md:px-6 md:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
        Scholarships
      </p>
      <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground md:mt-2 md:text-4xl">
        Scholarship Finder
      </h1>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base ${hasSearched ? "hidden md:block" : ""}`}>
        Search public scholarship sites for Canada or the US. This is web search plus a
        short curated list — not a government awards database. Confirm every deadline
        on the official page.
      </p>

      <div className="mt-3 grid min-w-0 gap-3 md:mt-6 md:gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <div className={`min-w-0 space-y-3 lg:sticky lg:top-20 lg:space-y-4 ${results.length > 0 ? "order-2" : "order-1"} lg:order-none`}>
          <StudentProfileBox onProfileChange={applyProfile} />

          <form
            onSubmit={onSubmit}
            className="space-y-2 rounded-2xl border border-border bg-card p-3 md:space-y-3 md:p-5"
          >
            <SectionHeading icon={Search}>Search awards</SectionHeading>
            <CountryToggle
              value={country}
              onChange={(next) => {
                setCountry(next)
                setSearchCountry(next)
              }}
              options={[
                { value: "Canada", flag: "CA", label: "Canada" },
                { value: "USA", flag: "US", label: "United States" },
              ]}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
            </div>

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
        </div>

        <div className={`min-w-0 ${results.length > 0 ? "order-1" : "order-2"} lg:order-none`}>
          {error && (
            <p className="break-words rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 md:px-4 md:py-3 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          {notice && (
            <p
              className={`break-words rounded-xl border px-3 py-2 text-sm md:px-4 md:py-3 ${
                source === "live"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                  : "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-foreground"
              }`}
            >
              {notice}
            </p>
          )}

          {results.length > 0 && (
            <section className={notice || error ? "mt-4" : ""}>
              <SectionHeading icon={ListChecks}>Results</SectionHeading>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </section>
          )}

          {!loading && source && results.length === 0 && !error && (
            <p className="text-sm text-muted-foreground">
              No listings matched this search. Try a broader major or fewer keywords.
            </p>
          )}

          {!hasSearched && !loading && (
            <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-3 md:p-5">
              <SectionHeading icon={GraduationCap}>How it works</SectionHeading>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Save your student profile (optional) so filters start filled in.</li>
                <li>Search public sites — we do not apply for you.</li>
                <li>Open the official page, then Save the listing to track it here.</li>
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
