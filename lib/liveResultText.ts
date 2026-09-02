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
