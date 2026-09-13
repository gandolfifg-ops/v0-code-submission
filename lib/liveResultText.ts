const SNIPPET_MAX = 400

/** Strip leftover markdown and labels from live search titles/snippets. */
export function cleanDisplayText(input: string): string {
  let text = input.replace(/\r\n/g, "\n")
  text = text.replace(/^\s*Title:\s*/gim, "")
  text = text.replace(/\bTitle:\s*/gi, "")
  text = text.replace(/^#{1,6}\s+/gm, "")
  text = text.replace(/#{1,6}/g, "")
  text = text.replace(/`+/g, "")
  text = text.replace(/\*\*/g, "")
  text = text.replace(/__/g, "")
  text = text.replace(/\*/g, "")
  text = text.replace(/_/g, " ")
  text = text.replace(/\s+/g, " ")
  return text.trim()
}

const APPLICATION_FORM_SNIPPET = "Official application form — open the site to apply"

const FORM_SIGNALS =
  /protected\s*b\b|page\s+\d+\s+of\s+\d+|\bapplication form\b|\bfillable (?:pdf|form)\b|\bpdf form\b|\bfor office use only\b|\bplease (?:print|complete|fill|sign)\b|\bblock letters\b/i

/** Title/snippet looks like a downloadable or government application form — not a program page. */
export function isApplicationFormListing(title: string, snippet: string, url = ""): boolean {
  const titleText = title.trim()
  const blob = `${titleText}\n${snippet}`
  if (FORM_SIGNALS.test(blob) || FORM_SIGNALS.test(titleText)) return true
  if (/^\s*(application(?: form)?|formulaire)\s*$/i.test(titleText)) return true
  if (/\.pdf(\?|$)/i.test(url) && /(?:\bapply\b|\bapplication\b|\bform\b)/i.test(blob)) return true
  return false
}

function hostnameKey(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    return ""
  }
}

/** Drop form/PDF hits when the same host already has a normal program page. */
export function dropApplicationFormsIfProgramPageExists<
  T extends { url?: string; title?: string; content?: string },
>(hits: T[]): T[] {
  const programHosts = new Set<string>()
  for (const hit of hits) {
    if (!hit.url) continue
    if (isApplicationFormListing(hit.title ?? "", hit.content ?? "", hit.url)) continue
    const host = hostnameKey(hit.url)
    if (host) programHosts.add(host)
  }
  return hits.filter((hit) => {
    if (!hit.url) return true
    if (!isApplicationFormListing(hit.title ?? "", hit.content ?? "", hit.url)) return true
    const host = hostnameKey(hit.url)
    return !host || !programHosts.has(host)
  })
}

export function applicationFormDisplayTitle(title: string): string {
  const cleaned = cleanDisplayText(title)
  if (!cleaned || FORM_SIGNALS.test(cleaned) || /^\s*application(?: form)?\s*$/i.test(cleaned)) {
    return "Official application form"
  }
  return cleaned.slice(0, 100)
}

const JUNK =
  /protected\s*b\b|copyright|all rights reserved|privacy (?:policy|statement)|terms of (?:use|service)|skip to(?: main)? content|javascript must be enabled|enable cookies|click here to (?:download|print|apply)|print this (?:form|page)|fill(?:able)? form|date of birth|social insurance|sin number|income table|household income|line \d+|box \d+|ocr error|�{2,}/i

const FORM_NOISE =
  /please (?:print|complete|fill|sign)|block letters|for office use|applicant must|instructions?:|section [a-z0-9]+ of this form/i

function isMostlyCaps(s: string): boolean {
  const letters = s.replace(/[^A-Za-z]/g, "")
  if (letters.length < 24) return false
  return letters.replace(/[^A-Z]/g, "").length / letters.length > 0.72
}

function stripOcrAndMarkdown(input: string): string {
  let text = input.replace(/\r\n/g, "\n")
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, " ")
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
  text = text.replace(/<[^>]+>/g, " ")
  text = text.replace(/\|/g, " ")
  text = text.replace(/[|]{2,}/g, " ")
  text = text.replace(/[^\S\n]+/g, " ")
  text = text.replace(/[^\x09\x0a\x0d\x20-\x7e\u00a0-\u024f\u2010-\u2027]/g, " ")
  return cleanDisplayText(text)
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^[\s•\-–—*]+/, "").trim())
    .filter((s) => s.length >= 28 && s.length <= 320)
}

function keepSentence(s: string): boolean {
  if (JUNK.test(s) || FORM_NOISE.test(s) || isMostlyCaps(s)) return false
  if (/^\d+(\.\d+)?%?$/.test(s)) return false
  if ((s.match(/\d/g) ?? []).length > 24) return false
  return true
}

function scoreSentence(s: string, title: string): number {
  let n = 0
  const blob = s.toLowerCase()
  if (/\b(scholarship|bursar|award|grant|loan|lender|student)\b/.test(blob)) n += 3
  if (/\b(eligib|for students|who can apply|open to|available to)\b/.test(blob)) n += 2
  if (/\b(canada|canadian|ontario|quebec|province|national|university|college|school)\b/.test(blob))
    n += 2
  if (/\b(cover|tuition|pays|funding|financial aid)\b/.test(blob)) n += 1
  if (title && blob.includes(title.slice(0, 24).toLowerCase())) n += 1
  return n
}

function detectListingKind(url: string, text: string): "form" | "pdf" | "news" | "page" {
  const blob = `${url} ${text}`.toLowerCase()
  if (isApplicationFormListing("", text, url) || blob.includes("application form") || blob.includes("fillable pdf")) {
    return "form"
  }
  if (/\.pdf(\?|$)/i.test(url)) {
    return "pdf"
  }
  if (/news[- ]?release|press release|media release/.test(blob)) return "news"
  return "page"
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const at = cut.lastIndexOf(" ")
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`
}

/**
 * Short card body for live results. Does not invent amounts.
 * Prefers what / who / why / where from existing sentences.
 */
export function summarizeLiveSnippet(
  input: string,
  opts?: { url?: string; title?: string; fallback?: string },
): string {
  const url = opts?.url ?? ""
  const title = opts?.title ?? ""
  const fallback = opts?.fallback ?? "See the official listing for eligibility details."
  const kind = detectListingKind(url, `${title}\n${input}`)
  if (kind === "form" || isApplicationFormListing(title, input, url)) {
    return APPLICATION_FORM_SNIPPET
  }
  const prefix =
    kind === "pdf"
      ? "This listing is a PDF — open the official site for the full document. "
      : kind === "news"
        ? "This is a news release. Confirm current details on the official page. "
        : ""

  const cleaned = stripOcrAndMarkdown(input)
  const ranked = splitSentences(cleaned)
    .filter(keepSentence)
    .map((s) => ({ s, score: scoreSentence(s, title) }))
    .sort((a, b) => b.score - a.score)

  const picked: string[] = []
  let used = prefix.length
  for (const { s, score } of ranked) {
    if (score < 1 && picked.length > 0) continue
    const nextLen = used + (picked.length ? 1 : 0) + s.length
    if (nextLen > SNIPPET_MAX) {
      if (picked.length === 0) {
        return clip(prefix + s, SNIPPET_MAX)
      }
      break
    }
    picked.push(s)
    used = nextLen
    if (picked.length >= 3 || used >= 220) break
  }

  const body = `${prefix}${picked.join(" ")}`.trim()
  if (!body) {
    if (kind === "form") return APPLICATION_FORM_SNIPPET
    if (kind === "pdf") {
      return "This listing is a PDF — open the official site for the full document."
    }
    if (kind === "news") {
      return "This is a news release. Confirm current details on the official page."
    }
    return fallback
  }
  return clip(body, SNIPPET_MAX)
}

const MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  sept: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
}

const MONTH_TOKEN =
  "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec"

const DEADLINE_WORD =
  /(?:application\s+)?(?:deadlines?|due(?:\s+dates?)?|closes?|closing|apply\s+by|submi(?:t|ssion)|ends?|cutoff|must be (?:received|submitted)|nominations?\s+due)/i

const SKIP_BEFORE =
  /(?:updated|published|posted|last\s+modified|as\s+of|copyright|founded|established|born)\s*$/i

type FoundDeadline = {
  date: Date
  labeled: boolean
}

function utcDay(year: number, monthIndex: number, day: number): Date | null {
  if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) return null
  const date = new Date(Date.UTC(year, monthIndex, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return date
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function monthIndex(token: string): number | undefined {
  return MONTHS[token.toLowerCase().replace(".", "")]
}

function academicYearFromText(text: string): { start: number; end: number } | null {
  const range = text.match(/\b(20\d{2})\s*[-–\/]\s*(20)?(\d{2})\b/)
  if (!range) return null
  const start = Number(range[1])
  const end = range[2] ? Number(`${range[2]}${range[3]}`) : start - (start % 100) + Number(range[3])
  if (end < start || end > start + 1) return null
  return { start, end }
}

function inferYear(
  text: string,
  matchStart: number,
  matchEnd: number,
  month: number,
  explicitYear: number | null,
  now: Date,
): number {
  if (explicitYear) return explicitYear

  const local = text.slice(Math.max(0, matchStart - 140), Math.min(text.length, matchEnd + 140))
  const localRange = academicYearFromText(local) ?? academicYearFromText(text)
  if (localRange) {
    // Fall/winter (Aug–Dec) sit in the first calendar year of an academic cycle.
    return month >= 7 ? localRange.start : localRange.end
  }

  const localYears = [...local.matchAll(/\b(20\d{2})\b/g)].map((m) => Number(m[1]))
  const thisYear = now.getUTCFullYear()
  if (localYears.includes(thisYear)) return thisYear
  if (localYears.length === 1) return localYears[0]

  return thisYear
}

function isLabeled(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 100), index)
  const around = text.slice(Math.max(0, index - 40), Math.min(text.length, index + 48))
  return DEADLINE_WORD.test(before) || DEADLINE_WORD.test(around)
}

function shouldSkip(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 48), index)
  return SKIP_BEFORE.test(before)
}

function addFound(
  found: FoundDeadline[],
  seen: Set<number>,
  date: Date | null,
  labeled: boolean,
) {
  if (!date) return
  const key = startOfUtcDay(date)
  if (seen.has(key)) {
    const existing = found.find((item) => startOfUtcDay(item.date) === key)
    if (existing && labeled) existing.labeled = true
    return
  }
  seen.add(key)
  found.push({ date, labeled })
}

function collectDeadlineDates(content: string, now: Date): FoundDeadline[] {
  const text = content.replace(/\r\n/g, "\n")
  const found: FoundDeadline[] = []
  const seen = new Set<number>()

  const monthDayYear = new RegExp(
    `\\b(${MONTH_TOKEN})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s*,\\s*|\\s+)(20\\d{2})\\b`,
    "gi",
  )
  const monthDay = new RegExp(
    `\\b(${MONTH_TOKEN})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?!\\s*,?\\s*20\\d{2})`,
    "gi",
  )
  const dayMonthYear = new RegExp(
    `\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_TOKEN})\\.?(?:\\s*,\\s*|\\s+)(20\\d{2})\\b`,
    "gi",
  )
  const dayMonth = new RegExp(
    `\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_TOKEN})\\.?\\b(?!\\s*,?\\s*20\\d{2})`,
    "gi",
  )
  const numeric = /\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/g
  const iso = /\b(20\d{2})-(\d{2})-(\d{2})\b/g

  let match: RegExpExecArray | null

  while ((match = monthDayYear.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    const month = monthIndex(match[1])
    if (month === undefined) continue
    addFound(
      found,
      seen,
      utcDay(Number(match[3]), month, Number(match[2])),
      isLabeled(text, match.index),
    )
  }

  while ((match = dayMonthYear.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    const month = monthIndex(match[2])
    if (month === undefined) continue
    addFound(
      found,
      seen,
      utcDay(Number(match[3]), month, Number(match[1])),
      isLabeled(text, match.index),
    )
  }

  while ((match = monthDay.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    const month = monthIndex(match[1])
    if (month === undefined) continue
    const year = inferYear(text, match.index, match.index + match[0].length, month, null, now)
    addFound(found, seen, utcDay(year, month, Number(match[2])), isLabeled(text, match.index))
  }

  while ((match = dayMonth.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    const month = monthIndex(match[2])
    if (month === undefined) continue
    const year = inferYear(text, match.index, match.index + match[0].length, month, null, now)
    addFound(found, seen, utcDay(year, month, Number(match[1])), isLabeled(text, match.index))
  }

  while ((match = numeric.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    addFound(
      found,
      seen,
      utcDay(Number(match[3]), Number(match[1]) - 1, Number(match[2])),
      isLabeled(text, match.index),
    )
  }

  while ((match = iso.exec(text))) {
    if (shouldSkip(text, match.index)) continue
    addFound(
      found,
      seen,
      utcDay(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
      isLabeled(text, match.index),
    )
  }

  return found
}

function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function soonestOnOrAfter(found: FoundDeadline[], now: Date): Date | null {
  const today = startOfUtcDay(now)
  const upcoming = found.filter((item) => startOfUtcDay(item.date) >= today)
  if (upcoming.length === 0) return null
  return upcoming.reduce((a, b) => (startOfUtcDay(a.date) <= startOfUtcDay(b.date) ? a : b)).date
}

/** Returns a UTC calendar date if the string is a real date; otherwise null. */
export function parseDeadlineDate(raw: string, now = new Date()): Date | null {
  const text = raw.trim()
  if (!text) return null
  if (/check official|not listed|see listing|varies/i.test(text)) return null

  const named = text.match(
    new RegExp(
      `^(${MONTH_TOKEN})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(20\\d{2}))?$`,
      "i",
    ),
  )
  if (named) {
    const month = monthIndex(named[1])
    if (month === undefined) return null
    const year = named[3] ? Number(named[3]) : now.getUTCFullYear()
    return utcDay(year, month, Number(named[2]))
  }

  const dayMonth = text.match(
    new RegExp(`^(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_TOKEN})\\.?(?:,?\\s+(20\\d{2}))?$`, "i"),
  )
  if (dayMonth) {
    const month = monthIndex(dayMonth[2])
    if (month === undefined) return null
    const year = dayMonth[3] ? Number(dayMonth[3]) : now.getUTCFullYear()
    return utcDay(year, month, Number(dayMonth[1]))
  }

  const numeric = text.match(/^(\d{1,2})\/(\d{1,2})\/(20\d{2})$/)
  if (numeric) {
    return utcDay(Number(numeric[3]), Number(numeric[1]) - 1, Number(numeric[2]))
  }

  const iso = text.match(/^(20\d{2})-(\d{2})-(\d{2})$/)
  if (iso) {
    return utcDay(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  }

  return null
}

export const UNLISTED_DEADLINE = "Deadline not listed — check official page"

export function extractDeadlineFromSnippet(content: string, now = new Date()): string {
  return evaluateScholarshipDeadlines(content, now).deadline
}

/** Keep/drop from every date found in listing text — not a single labeled match. */
export function evaluateScholarshipDeadlines(
  content: string,
  now = new Date(),
): { keep: boolean; deadline: string } {
  const found = collectDeadlineDates(content, now)
  if (found.length === 0) {
    return { keep: true, deadline: UNLISTED_DEADLINE }
  }
  const soonest = soonestOnOrAfter(found, now)
  if (!soonest) {
    return { keep: false, deadline: UNLISTED_DEADLINE }
  }
  return { keep: true, deadline: formatDeadline(soonest) }
}

export function resolveScholarshipDeadline(
  raw: string,
  now = new Date(),
): { keep: boolean; deadline: string } {
  if (raw === UNLISTED_DEADLINE) return { keep: true, deadline: UNLISTED_DEADLINE }
  const parsed = parseDeadlineDate(raw, now)
  if (!parsed) return { keep: true, deadline: UNLISTED_DEADLINE }
  if (isExpiredDeadline(raw, now)) return { keep: false, deadline: raw }
  return { keep: true, deadline: formatDeadline(parsed) }
}

export function isExpiredDeadline(raw: string, now = new Date()): boolean {
  const parsed = parseDeadlineDate(raw, now)
  if (!parsed) return false
  return startOfUtcDay(parsed) < startOfUtcDay(now)
}

const MIN_SCHOLARSHIP_AMOUNT = 100

function parseMoneyToken(raw: string): number | null {
  const n = Number(raw.replace(/,/g, ""))
  if (!Number.isFinite(n)) return null
  return n
}

function prettyMoneyPhrase(match: string): string {
  return match.replace(/\s+/g, " ").trim()
}

/** Skip $1/$5 page artifacts; keep hundreds/thousands or tuition phrases. */
export function extractScholarshipAmount(text: string): string {
  const phrase = text.match(/\bfull[\s-]*(tuition|ride)\b|\btuition\s+waiver\b/i)
  if (phrase) {
    const raw = phrase[0].toLowerCase()
    if (raw.includes("ride")) return "Full ride"
    if (raw.includes("waiver")) return "Tuition waiver"
    return "Full tuition"
  }

  const moneyPattern =
    /\$\s*([\d,]+)(?:\.\d{1,2})?(?:\s*[-–—]\s*\$?\s*([\d,]+)(?:\.\d{1,2})?)?(\+)?/g
  const viable: { value: number; display: string }[] = []
  let match: RegExpExecArray | null
  while ((match = moneyPattern.exec(text))) {
    const low = parseMoneyToken(match[1])
    if (low === null) continue
    const high = match[2] ? parseMoneyToken(match[2]) : null
    const best = Math.max(low, high ?? low)
    if (best < MIN_SCHOLARSHIP_AMOUNT) continue
    let display = prettyMoneyPhrase(match[0])
    if (low < MIN_SCHOLARSHIP_AMOUNT && high !== null && high >= MIN_SCHOLARSHIP_AMOUNT) {
      display = `$${match[2]}${match[3] ?? ""}`
    }
    viable.push({ value: best, display })
  }

  if (viable.length > 0) {
    viable.sort((a, b) => b.value - a.value)
    return viable[0].display
  }

  if (/\bvaries\b/i.test(text)) return "Varies"
  return "Varies"
}

const CLOSED_NOTICE =
  /applications? are currently closed|this award has been discontinued|archived listing|past deadline|no longer (?:offered|available|accepting)|applications? (?:are )?closed|this (?:page|program|award) (?:has been )?archived/i

const CURRENT_CYCLE = /\b2026\b|\b2027\b|2026\s*[-–\/]\s*2027|2026\s*[-–\/]\s*27/

const ARCHIVED_PATH = /\/archive(?:d)?\/|\/(201[0-9]|202[0-4])(?:\/|$)/i

/** Drop closed/archived pages unless they mention a 2026/2027 cycle. */
export function isClosedOrArchivedListing(text: string, url = ""): boolean {
  const blob = `${text} ${url}`
  const mentionsCurrentCycle = CURRENT_CYCLE.test(blob)
  if (ARCHIVED_PATH.test(url) && !mentionsCurrentCycle) return true
  if (CLOSED_NOTICE.test(text) && !mentionsCurrentCycle) return true
  return false
}
