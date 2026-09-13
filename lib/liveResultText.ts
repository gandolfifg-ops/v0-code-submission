const SNIPPET_MAX = 220

const PAGE_CHROME =
  /language selection|search menu|skip to(?: main)? content|you are here|breadcrumb(?: trail)?|date modified|share this page|toggle submenu|main navigation|secondary menu|\bfrançais\b|\benglish\b\s*\/|\bcookie (?:consent|banner|settings|policy)\b|we use cookies|apply nowapply now/gi

const CANADA_NAV_RUN =
  /(?:language selection|search menu|you are here|skip to(?: main)? content|menu|search|home)(?:\s+(?:language selection|search menu|you are here|skip to(?: main)? content|menu|search|home))+/gi

function stripPageChrome(input: string): string {
  let text = input.replace(/\r\n/g, "\n")
  text = text.replace(/apply now\s*apply now/gi, "Apply now")
  text = text.replace(CANADA_NAV_RUN, " ")
  text = text.replace(PAGE_CHROME, " ")
  text = text.replace(/^(?:\s*(?:menu|home|search|:)\s*)+/gi, " ")
  text = text.replace(/^[:\-–—]+\s*/, "")
  return text
}

/** Strip leftover markdown and labels from live search titles/snippets. */
export function cleanDisplayText(input: string): string {
  let text = stripPageChrome(input.replace(/\r\n/g, "\n"))
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

function hostAndPathKey(url: string): string {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()
    const path = (parsed.pathname.replace(/\/+$/, "") || "/").toLowerCase()
    return `${host}${path}`
  } catch {
    return url.toLowerCase()
  }
}

const FAQ_OR_NEWSROOM =
  /(^|\/)faqs?(\/|$)|frequently[- ]asked([- ]questions)?|(^|\/)newsroom(\/|$)|(^|\/)press[-_]releases?(\/|$)/i

const APPLY_OR_PROGRAM_PATH =
  /(^|\/)(apply|application|applications)(\/|$)|(^|\/)(awards?|scholarships?|bursar(?:y|ies)?|financial-aid|finaid|student-aid)(\/|$)/i

function isFaqOrNewsroomScholarshipPage(url: string, title = ""): boolean {
  if (FAQ_OR_NEWSROOM.test(url)) return true
  if (/\bfaqs?\b|frequently asked questions|newsroom|press[- ]releases?/i.test(title)) return true
  if (FAQ_OR_NEWSROOM.test(title)) return true
  return false
}

function scholarshipListingKeepScore(url: string, title = ""): number {
  if (isFaqOrNewsroomScholarshipPage(url, title)) return 0
  let n = 1
  try {
    const path = new URL(url).pathname
    if (APPLY_OR_PROGRAM_PATH.test(path) || APPLY_OR_PROGRAM_PATH.test(title)) n += 2
    if (/(^|\/)(apply|application)(\/|$)/i.test(path)) n += 1
  } catch {
    /* ignore */
  }
  return n
}

function awardNameKey(title: string): string | null {
  let n = cleanDisplayText(title).toLowerCase()
  n = n.replace(/\s*[|\-–—:]\s*(home|faq|faqs|frequently asked questions|newsroom).*$/i, "")
  n = n.replace(/\b(faq|faqs|frequently asked questions|newsroom|press release)\b/g, " ")
  n = n.replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()
  if (n.length < 12) return null
  if (/^(scholarships?|awards?|student awards?|financial aid|bursaries|grants?)$/.test(n)) return null
  return n
}

function urlQualityScore(url: string): number {
  let n = 0
  const lower = url.toLowerCase()
  if (/\/node(\/|$)/i.test(lower)) n += 8
  if (/index\.php/i.test(lower)) n += 5
  if (/[?&](sid|session|php|utm_)/i.test(lower)) n += 4
  if (/\/about(\/|$)/i.test(lower)) n += 3
  try {
    const parsed = new URL(url)
    n += parsed.pathname.length / 40
    n += parsed.search.length / 20
  } catch {
    n += url.length / 80
  }
  return n
}

function similarAwardTitle(a: string, b: string): boolean {
  const left = awardNameKey(a)
  const right = awardNameKey(b)
  if (left && right && (left === right || left.includes(right) || right.includes(left))) return true
  const compact = (value: string) =>
    cleanDisplayText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\b(about|home|official|welcome)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  const ca = compact(a)
  const cb = compact(b)
  if (!ca || !cb || ca.length < 8 || cb.length < 8) return false
  return ca === cb || ca.includes(cb) || cb.includes(ca)
}

function pickPreferredScholarshipHit<T extends { url?: string; title?: string }>(current: T, next: T): T {
  const nextScore = scholarshipListingKeepScore(next.url ?? "", next.title ?? "")
  const currentScore = scholarshipListingKeepScore(current.url ?? "", current.title ?? "")
  if (nextScore !== currentScore) return nextScore > currentScore ? next : current
  const nextJunk = urlQualityScore(next.url ?? "")
  const currentJunk = urlQualityScore(current.url ?? "")
  if (nextJunk !== currentJunk) return nextJunk < currentJunk ? next : current
  return (next.url ?? "").length < (current.url ?? "").length ? next : current
}

/** Same award name or same host+path: keep apply/program pages, drop FAQ and newsroom. */
export function dedupeLiveScholarshipHits<T extends { url?: string; title?: string }>(hits: T[]): T[] {
  const usable = hits.filter((hit) => !isFaqOrNewsroomScholarshipPage(hit.url ?? "", hit.title ?? ""))
  const byPath = new Map<string, T>()
  for (const hit of usable) {
    if (!hit.url) continue
    const key = hostAndPathKey(hit.url)
    const prev = byPath.get(key)
    byPath.set(key, prev ? pickPreferredScholarshipHit(prev, hit) : hit)
  }
  const pathWinners = new Set(byPath.values())
  const pathDeduped = usable.filter((hit) => !hit.url || pathWinners.has(hit))

  const byName = new Map<string, T>()
  for (const hit of pathDeduped) {
    const key = awardNameKey(hit.title ?? "")
    if (!key) continue
    const prev = byName.get(key)
    byName.set(key, prev ? pickPreferredScholarshipHit(prev, hit) : hit)
  }
  const nameDeduped = pathDeduped.filter((hit) => {
    const key = awardNameKey(hit.title ?? "")
    if (!key) return true
    return byName.get(key) === hit
  })

  const byHostTitle: T[] = []
  for (const hit of nameDeduped) {
    const host = hostnameKey(hit.url ?? "")
    const title = hit.title ?? ""
    const prevIndex = byHostTitle.findIndex(
      (existing) => hostnameKey(existing.url ?? "") === host && similarAwardTitle(existing.title ?? "", title),
    )
    if (prevIndex === -1) {
      byHostTitle.push(hit)
      continue
    }
    byHostTitle[prevIndex] = pickPreferredScholarshipHit(byHostTitle[prevIndex], hit)
  }
  return byHostTitle
}

/** Aggregators kept only when no official (non-aggregator) hit exists. Does not change Tavily allowlists. */
const POST_FILTER_AGGREGATOR_HOSTS = [
  "scholartree.ca",
  "fastweb.com",
  "bold.org",
  "scholarships.com",
  "cappex.com",
  "yconic.com",
  "scholarshipscanada.com",
  "immigrationnewscanada.ca",
] as const

export function isPostFilterScholarshipAggregator(url: string): boolean {
  const host = hostnameKey(url)
  if (!host) return false
  return POST_FILTER_AGGREGATOR_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))
}

export function dropAggregatorScholarshipHitsIfOfficialExists<T extends { url?: string }>(hits: T[]): T[] {
  const official = hits.filter((hit) => hit.url && !isPostFilterScholarshipAggregator(hit.url))
  if (official.length === 0) return hits
  return official
}

export function applicationFormDisplayTitle(title: string): string {
  const cleaned = cleanDisplayText(title)
  if (!cleaned || FORM_SIGNALS.test(cleaned) || /^\s*application(?: form)?\s*$/i.test(cleaned)) {
    return "Official application form"
  }
  return cleaned.slice(0, 100)
}

const JUNK =
  /protected\s*b\b|copyright|all rights reserved|privacy (?:policy|statement)|terms of (?:use|service)|skip to(?: main)? content|language selection|search menu|you are here|breadcrumb|javascript must be enabled|enable cookies|click here to (?:download|print|apply)|print this (?:form|page)|fill(?:able)? form|date of birth|social insurance|sin number|income table|household income|line \d+|box \d+|ocr error|�{2,}/i

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
  if (/language selection|you are here|skip to(?: main)? content/i.test(s)) return false
  if (!/[a-z]/.test(s)) return false
  if (!/\s/.test(s)) return false
  const words = s.split(/\s+/).filter(Boolean)
  if (words.length < 8 && !/[.!?]$/.test(s)) return false
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
    if (picked.length >= 2 || used >= 180) break
  }

  const body = `${prefix}${picked.join(" ")}`.trim()
  if (!body) {
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

const ORG_HISTORY =
  /\bestablished in\s*(?:19|20)\d{2}\b|\bestablished in\b|\bfounded in\b|\bsince (?:19|20)\d{2}\b|\bincorporated in\b|\bfor (?:over|more than) \d+ years\b|\bour (?:history|story|heritage|mission|vision)\b|\bcelebrat(?:e|ing) \d+ years\b|\bthe (?:foundation|organization|society) was (?:created|founded|established)\b/i

function keepScholarshipSentence(s: string): boolean {
  if (!keepSentence(s)) return false
  if (ORG_HISTORY.test(s)) return false
  if (/protected\s*b\b|page\s+\d+\s+of\s+\d+/i.test(s)) return false
  return true
}

function scoreScholarshipSentence(s: string, title: string): number {
  const blob = s.toLowerCase()
  if (ORG_HISTORY.test(blob)) return -99
  let n = 0
  if (/\b(scholarship|bursar(?:y|ies)?|award|grant)\b/.test(blob)) n += 3
  if (/\b(eligib|for students|who (?:can|may) apply|open to|available to|canadian citizen|permanent resident|international|undergraduate|graduate|high school)\b/.test(blob))
    n += 3
  if (/\$|full tuition|up to\s+\$/.test(blob)) n += 2
  if (/\b(canada|canadian|ontario|quebec|university|college|school|at )\b/.test(blob)) n += 2
  if (title && blob.includes(title.slice(0, 24).toLowerCase())) n += 1
  return n
}

/** Live scholarship card copy: what / who / amount / where. Max two sentences. */
export function summarizeScholarshipSnippet(
  input: string,
  opts?: { url?: string; title?: string; fallback?: string },
): string {
  const url = opts?.url ?? ""
  const title = opts?.title ?? ""
  const fallback = opts?.fallback ?? "See the official listing for eligibility details."
  if (isApplicationFormListing(title, input, url)) {
    return APPLICATION_FORM_SNIPPET
  }

  const cleaned = stripOcrAndMarkdown(input)
  const ranked = splitSentences(cleaned)
    .filter(keepScholarshipSentence)
    .map((s) => ({ s, score: scoreScholarshipSentence(s, title) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const picked: string[] = []
  let used = 0
  for (const { s } of ranked) {
    const nextLen = used + (picked.length ? 1 : 0) + s.length
    if (nextLen > SNIPPET_MAX) {
      if (picked.length === 0) return clip(s, SNIPPET_MAX)
      break
    }
    picked.push(s)
    used = nextLen
    if (picked.length >= 2 || used >= 180) break
  }

  const body = picked.join(" ").trim()
  if (!body) return fallback
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
  /(?:application\s+)?(?:deadlines?|due(?:\s+dates?)?|closes?|closing|apply\s+by|submi(?:t|ssion)|application(?:s)?\s+end|cutoff|must be (?:received|submitted)|nominations?\s+due)/i

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

function addUtcMonths(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()))
}

function isWithinApplicationWindow(date: Date, now: Date): boolean {
  const t = startOfUtcDay(date)
  const today = startOfUtcDay(now)
  const limit = startOfUtcDay(addUtcMonths(now, 18))
  return t >= today && t <= limit
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

export function isDisplayableDeadline(raw: string, now = new Date()): boolean {
  const text = raw.trim()
  if (!text || text === UNLISTED_DEADLINE) return false
  if (/check official|not listed|see listing|varies|apply via/i.test(text)) return false
  const parsed = parseDeadlineDate(text, now)
  if (!parsed) return false
  return isWithinApplicationWindow(parsed, now)
}

export function extractDeadlineFromSnippet(content: string, now = new Date()): string {
  return evaluateScholarshipDeadlines(content, now).deadline
}

/** Keep listings unless every labeled application deadline is already past. */
export function evaluateScholarshipDeadlines(
  content: string,
  now = new Date(),
): { keep: boolean; deadline: string } {
  const found = collectDeadlineDates(content, now)
  if (found.length === 0) {
    return { keep: true, deadline: "" }
  }
  const labeled = found.filter((item) => item.labeled)
  const displayable = labeled.filter((item) => isWithinApplicationWindow(item.date, now))
  if (displayable.length > 0) {
    const soonest = soonestOnOrAfter(displayable, now)
    return { keep: true, deadline: soonest ? formatDeadline(soonest) : "" }
  }
  const today = startOfUtcDay(now)
  const labeledPast = labeled.filter((item) => startOfUtcDay(item.date) < today)
  if (labeled.length > 0 && labeledPast.length === labeled.length) {
    return { keep: false, deadline: "" }
  }
  return { keep: true, deadline: "" }
}

export function resolveScholarshipDeadline(
  raw: string,
  now = new Date(),
): { keep: boolean; deadline: string } {
  if (!raw.trim() || raw === UNLISTED_DEADLINE) return { keep: true, deadline: "" }
  const parsed = parseDeadlineDate(raw, now)
  if (!parsed) return { keep: true, deadline: "" }
  if (isExpiredDeadline(raw, now)) return { keep: false, deadline: raw }
  if (!isWithinApplicationWindow(parsed, now)) return { keep: true, deadline: "" }
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

const COST_CONTEXT =
  /\b(?:tuition|fees?|comprehensive fee|cost of attendance|room and board|meal plan|housing|residence fee|affordability|cost to attend|net price)\b/i

const AWARD_CONTEXT = /\b(?:scholarship|bursar(?:y|ies)?|award|grant|stipend)\b/i

/** Skip $1/$5 page artifacts; keep hundreds/thousands or tuition phrases. Never treat sticker price as an award. */
export function extractScholarshipAmount(text: string, url = ""): string {
  const blob = `${url}\n${text}`
  if (/\/afford(?:ability)?(?:\/|$)/i.test(url) || /cost[-_ ]of[-_ ]attendance|tuition[-_ ]and[-_ ]fees/i.test(url)) {
    return ""
  }

  const phrase = text.match(/\bfull[\s-]*(tuition|ride)\b|\btuition\s+waiver\b/i)
  if (phrase) {
    const at = phrase.index ?? 0
    const window = text.slice(Math.max(0, at - 90), Math.min(text.length, at + phrase[0].length + 90))
    if (AWARD_CONTEXT.test(window) || AWARD_CONTEXT.test(blob)) {
      const raw = phrase[0].toLowerCase()
      if (raw.includes("ride")) return "Full ride"
      if (raw.includes("waiver")) return "Tuition waiver"
      return "Full tuition"
    }
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
    const window = text.slice(Math.max(0, match.index - 90), Math.min(text.length, match.index + match[0].length + 90))
    if (COST_CONTEXT.test(window) && !AWARD_CONTEXT.test(window)) continue
    if (COST_CONTEXT.test(blob) && !AWARD_CONTEXT.test(blob)) continue
    if (!AWARD_CONTEXT.test(window) && !AWARD_CONTEXT.test(blob)) continue
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

  return ""
}

/** True only for a real award figure — not "Varies" or tuition-schedule prose. */
export function isDisplayableAwardAmount(amount: string): boolean {
  const value = amount.trim()
  if (!value) return false
  if (/^(varies|n\/?a|unknown|see listing|tbd|check official)/i.test(value)) return false
  if (/^\$\??$/.test(value)) return false
  if (/\bfull[\s-]*(tuition|ride)\b|\btuition\s+waiver\b/i.test(value)) return true
  if (/\$\s*[\d,]/.test(value) || /[\d,]+\s*(dollars|usd|cad)/i.test(value)) return true
  return false
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

const LOAN_ROUNDUP_TITLE = /\bbest\s+.+\s+rates\b|\bbest student loan rates\b|\bcompare lenders\b|\btop\s+\d+\s+student loans\b/i
const LOAN_BLOG_PATH = /\/blog\/|\/news\/|\/article\//i
const LOAN_NODE_PATH = /\/node(\/|$)/i
const UNCERTAIN_LOAN_RATE = ""

const LOAN_RATE_BLOCK_HOSTS = [
  "bankrate.com",
  "nerdwallet.com",
  "credible.com",
  "wikipedia.org",
  "investopedia.com",
] as const

export function isDroppedLoanHit(url: string, title = ""): boolean {
  const lower = url.toLowerCase()
  let host = ""
  try {
    host = new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    host = ""
  }
  if (LOAN_RATE_BLOCK_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
    return true
  }
  if (LOAN_BLOG_PATH.test(lower) || LOAN_NODE_PATH.test(lower)) return true
  if (LOAN_ROUNDUP_TITLE.test(title) || LOAN_ROUNDUP_TITLE.test(url)) return true
  if (/best student loan rates in september/i.test(`${title} ${url}`)) return true
  if (/\bcompare lenders\b/i.test(`${title} ${url}`)) return true
  return false
}

/** Keep a % only when APR/interest sits next to it on an official (non-roundup) page. */
export function extractLoanAdvertisedRate(text: string, url = ""): string {
  if (!url || isDroppedLoanHit(url, text.slice(0, 120))) return UNCERTAIN_LOAN_RATE
  const pattern = /(\d{1,2}(?:\.\d{1,3})?)\s*%/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    const window = text.slice(Math.max(0, match.index - 40), Math.min(text.length, match.index + match[0].length + 40))
    if (/\b(apr|interest(?:\s+rate)?|direct loan)\b/i.test(window)) {
      return `Advertised ${match[1]}% — confirm on official site`
    }
  }
  return UNCERTAIN_LOAN_RATE
}

export function isConfirmedLoanRate(rate: string): boolean {
  return /\d+(?:\.\d+)?\s*%/.test(rate.trim())
}
