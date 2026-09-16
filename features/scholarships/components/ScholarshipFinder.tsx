"use client"

import { useEffect, useState, type FormEvent } from "react"
import { GraduationCap, ListChecks, Loader2, Search } from "lucide-react"
import { useSmartSearch } from "@/components/SmartSearchProvider"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ResultCard } from "@/features/scholarships/components/ResultCard"
import { StudentProfileBox } from "@/features/student-profile/components/StudentProfileBox"
import { RegionalAidStrip } from "@/features/student-profile/components/RegionalAidStrip"
import { SchoolAutocomplete } from "@/features/student-profile/components/SchoolAutocomplete"
import { getStudentProfile, patchStudentProfile } from "@/features/student-profile/store"
import { type StudentProfile } from "@/features/student-profile/types"
import { resolveSchool } from "@/features/scholarships/schools"
import {
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_MAJORS,
  scholarshipLevelLabel,
  normalizeScholarshipLevel,
  type ScholarshipCountry,
  type ScholarshipResult,
} from "@/features/scholarships/types"
import { scholarshipResultGroup } from "@/lib/listingDisplay"
import { isExpiredDeadline } from "@/lib/liveResultText"

type SearchResponse = {
  source: "live" | "curated"
  notice: string
  results: ScholarshipResult[]
  hasMore?: boolean
}

const selectClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

const RESULT_GROUPS = [
  { id: "official-school" as const, title: "Official school pages" },
  { id: "government" as const, title: "Government aid" },
  { id: "other" as const, title: "Other awards" },
]

const PAGE_SIZE = 6

function groupedScholarshipResults(results: ScholarshipResult[]) {
  return RESULT_GROUPS.map((group) => ({
    ...group,
    items: results.filter((item) => scholarshipResultGroup(item) === group.id),
  })).filter((group) => group.items.length > 0)
}

function scholarshipResultsSummary(
  count: number,
  country: ScholarshipCountry,
  major: string,
  level: string,
): string {
  const parts = [
    `${count} ${count === 1 ? "award" : "awards"}`,
    country === "USA" ? "United States" : "Canada",
  ]
  if (major !== "Any major") parts.push(major)
  if (level !== "Any level") parts.push(scholarshipLevelLabel(level))
  return parts.join(" · ")
}

export function ScholarshipFinder({
  initialSchool = "",
  initialQuery = "",
}: {
  initialSchool?: string
  initialQuery?: string
}) {
  const schoolFromUrl = initialSchool.trim()
  const queryFromUrl = initialQuery.trim()
  const { setCountry: setSearchCountry, ticket } = useSmartSearch()
  const [country, setCountry] = useState<ScholarshipCountry>("Canada")
  const [major, setMajor] = useState<string>("Any major")
  const [level, setLevel] = useState<string>("Any level")
  const [query, setQuery] = useState(queryFromUrl)
  const [university, setUniversity] = useState(schoolFromUrl)
  const [provinceOrState, setProvinceOrState] = useState("")
  const shouldAutoSearch = Boolean(schoolFromUrl || queryFromUrl)
  const [loading, setLoading] = useState(shouldAutoSearch)
  const [notice, setNotice] = useState<string | null>(null)
  const [source, setSource] = useState<"live" | "curated" | null>(null)
  const [results, setResults] = useState<ScholarshipResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(shouldAutoSearch)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const [canSearchMore, setCanSearchMore] = useState(false)

  function applyProfile(profile: StudentProfile | null) {
    if (!profile) return
    setCountry(profile.country)
    setSearchCountry(profile.country)
    setLevel(normalizeScholarshipLevel(profile.level))
    if (profile.major) setMajor(profile.major)
    setProvinceOrState(profile.provinceOrState ?? "")
  }

  useEffect(() => {
    const stored = getStudentProfile()
    if (stored) applyProfile(stored)
    // Prefill once from the existing localStorage profile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(next: { query: string; university?: string; fromHeader?: boolean }) {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setCanSearchMore(false)
    const fromHeader = Boolean(next.fromHeader)
    const schoolName = fromHeader ? "" : (next.university ?? university).trim()
    const registered = resolveSchool(schoolName)
    const stored = getStudentProfile()
    const requestCountry = registered?.country ?? stored?.country ?? country
    const requestMajor = fromHeader ? "Any major" : major || stored?.major || "Any major"
    const requestLevel = fromHeader ? "Any level" : level || stored?.level || "Any level"
    try {
      const res = await fetch("/api/scholarships/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: requestCountry,
          major: requestMajor,
          level: requestLevel,
          query: next.query,
          university: schoolName,
        }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      const nextResults = (data.results ?? []).filter((item) => !isExpiredDeadline(item.deadline))
      setResults(nextResults)
      setVisibleCount(PAGE_SIZE)
      setSource(data.source)
      setNotice(data.notice)
      setCanSearchMore(data.hasMore !== false && data.source === "live")
    } catch {
      setError("Search didn’t work — try again")
      setResults([])
      setSource(null)
      setCanSearchMore(false)
    } finally {
      setLoading(false)
    }
  }

  async function searchMoreOfficialAwards() {
    if (loadingMore || loading) return
    setLoadingMore(true)
    setError(null)
    const schoolName = university.trim()
    const registered = resolveSchool(schoolName)
    const stored = getStudentProfile()
    const requestCountry = registered?.country ?? stored?.country ?? country
    try {
      const res = await fetch("/api/scholarships/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: requestCountry,
          major,
          level,
          query,
          university: schoolName,
          expand: true,
          excludeUrls: results.map((item) => item.url),
        }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      const extra = (data.results ?? []).filter((item) => !isExpiredDeadline(item.deadline))
      const seen = new Set(results.map((item) => item.url))
      const unique = extra.filter((item) => !seen.has(item.url))
      if (unique.length === 0) {
        setCanSearchMore(false)
        return
      }
      setResults((prev) => [...prev, ...unique])
      setVisibleCount((count) => count + unique.length)
      setCanSearchMore(data.hasMore !== false)
    } catch {
      setError("Search didn’t work — try again")
    } finally {
      setLoadingMore(false)
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

  useEffect(() => {
    if (!queryFromUrl && !schoolFromUrl) return
    const registered = resolveSchool(schoolFromUrl)
    if (registered) {
      setCountry(registered.country)
      setSearchCountry(registered.country)
    }
    void runSearch({ query: queryFromUrl, university: schoolFromUrl })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once from /scholarships?school= or ?q=
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await runSearch({ query, university })
  }

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-3 py-3 md:px-6 md:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">
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
      {hasSearched && !loading && (
        <p className="mt-2 text-sm font-medium text-muted-foreground md:hidden">
          {results.length > 0
            ? scholarshipResultsSummary(results.length, country, major, level)
            : "No awards matched this search"}
        </p>
      )}

      <div className="mt-3 md:mt-4">
        <RegionalAidStrip
          country={country}
          provinceOrState={provinceOrState}
          onProvinceChange={(code) => {
            setProvinceOrState(code)
            patchStudentProfile({ country: "Canada", provinceOrState: code })
          }}
        />
      </div>

      <div className="mt-3 grid min-w-0 gap-3 md:mt-6 md:gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <div className={`min-w-0 space-y-3 lg:sticky lg:top-20 lg:space-y-4 ${results.length > 0 || loading ? "order-2" : "order-1"} lg:order-none`}>
          <StudentProfileBox onProfileChange={applyProfile} />

          <form
            onSubmit={onSubmit}
            className="space-y-2 rounded-2xl border border-border bg-card p-4 md:space-y-3 md:p-5"
          >
            <SectionHeading icon={Search}>Search awards</SectionHeading>

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
                <select className={`${selectClass} mt-1`} value={normalizeScholarshipLevel(level)} onChange={(e) => setLevel(e.target.value)}>
                  {SCHOLARSHIP_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {scholarshipLevelLabel(l)}
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
                placeholder="e.g. Indigenous, first-generation, international student, Canadian citizen"
              />
            </label>

            <label className="block text-xs font-medium text-muted-foreground">
              School name (optional)
              <SchoolAutocomplete
                value={university}
                country={country}
                onChange={setUniversity}
                placeholder="e.g. University of Waterloo, UCLA"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />}
              {loading ? "Searching official pages…" : "Find scholarships"}
            </button>
          </form>
        </div>

        <div className={`min-w-0 ${results.length > 0 || loading ? "order-1" : "order-2"} lg:order-none`}>
          {loading && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Searching official pages…
            </p>
          )}

          {error && (
            <p className="break-words rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 md:px-4 md:py-3 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          {notice && !loading && (
            <p
              className={`break-words rounded-xl border px-3 py-2 text-sm md:px-4 md:py-3 ${
                source === "live"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                  : "border-border bg-muted text-foreground"
              }`}
            >
              {notice}
            </p>
          )}

          {loading && results.length === 0 && (
            <section className={error ? "mt-4" : ""} aria-hidden="true">
              <SectionHeading icon={ListChecks}>Results</SectionHeading>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[0, 1, 2].map((key) => (
                  <div
                    key={key}
                    className="h-40 animate-pulse rounded-2xl border border-border bg-muted/50"
                  />
                ))}
              </div>
            </section>
          )}

          {results.length > 0 && (
            <section className={`relative ${notice || error || loading ? "mt-4" : ""}`}>
              {loading && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-background/60" aria-hidden="true" />
              )}
              <SectionHeading icon={ListChecks}>Results</SectionHeading>
              <div className={loading ? "opacity-50" : ""}>
                {groupedScholarshipResults(results.slice(0, visibleCount)).map((group, index) => (
                  <div key={group.id} className={index === 0 ? "mt-3" : "mt-6"}>
                    <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {group.items.map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                    </div>
                  </div>
                ))}
                {(visibleCount < results.length || canSearchMore) && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {visibleCount < results.length ? (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        Show more results
                      </button>
                    ) : null}
                    {canSearchMore ? (
                      <button
                        type="button"
                        disabled={loadingMore || loading}
                        onClick={() => void searchMoreOfficialAwards()}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        {loadingMore && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />}
                        {loadingMore ? "Searching more official pages…" : "Search more official awards"}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          )}

          {!loading && source && results.length === 0 && !error && (
            <p className="text-sm text-muted-foreground">
              No listings matched this search. Try a broader major or fewer keywords.
            </p>
          )}

          {!hasSearched && !loading && (
            <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 md:p-5">
              <SectionHeading icon={GraduationCap}>How it works</SectionHeading>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Save your student profile (optional) so country, major, and level start filled in.</li>
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
