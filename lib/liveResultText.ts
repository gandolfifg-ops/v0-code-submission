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

/** Returns a UTC calendar date if the string is a real date; otherwise null. */
export function parseDeadlineDate(raw: string): Date | null {
  const text = raw.trim()
  if (!text) return null
  if (/check official|not listed|see listing|varies/i.test(text)) return null

  const named = text.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),?\s+(\d{4})$/i,
  )
  if (named) {
    const month = MONTHS[named[1].toLowerCase().replace(".", "")]
    if (month === undefined) return null
    return utcDay(Number(named[3]), month, Number(named[2]))
  }

  const numeric = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (numeric) {
    return utcDay(Number(numeric[3]), Number(numeric[1]) - 1, Number(numeric[2]))
  }

  return null
}

export const UNLISTED_DEADLINE = "Deadline not listed — check official page"

export function extractDeadlineFromSnippet(content: string): string {
  const labeled = content.match(
    /(?:deadline|due|closes?|ends?)(?:\s*:?\s*)([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/i,
  )
  if (labeled?.[1]) return labeled[1]
  const anyDate = content.match(
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
  )
  if (anyDate?.[0]) return anyDate[0]
  return UNLISTED_DEADLINE
}

export function resolveScholarshipDeadline(raw: string): { keep: boolean; deadline: string } {
  if (raw === UNLISTED_DEADLINE) return { keep: true, deadline: UNLISTED_DEADLINE }
  const parsed = parseDeadlineDate(raw)
  if (!parsed) return { keep: true, deadline: UNLISTED_DEADLINE }
  if (isExpiredDeadline(raw)) return { keep: false, deadline: raw }
  return { keep: true, deadline: raw }
}

export function isExpiredDeadline(raw: string, now = new Date()): boolean {
  const parsed = parseDeadlineDate(raw)
  if (!parsed) return false
  return startOfUtcDay(parsed) < startOfUtcDay(now)
}
