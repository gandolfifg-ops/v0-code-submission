import { EMPTY_PROFILE, type StudentCountry, type StudentProfile } from "@/features/student-profile/types"

export const STUDENT_PROFILE_KEY = "wealthnutz.studentProfile"
export const STUDENT_COUNTRY_KEY = "wealthnutz.country"

type Listener = () => void

const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((fn) => fn())
}

function asCountry(value: unknown): StudentCountry | null {
  if (value === "USA" || value === "US") return "USA"
  if (value === "Canada" || value === "CA") return "Canada"
  return null
}

function readCountryKey(): StudentCountry | null {
  if (typeof window === "undefined") return null
  try {
    return asCountry(window.localStorage.getItem(STUDENT_COUNTRY_KEY))
  } catch {
    return null
  }
}

function writeCountryKey(country: StudentCountry): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STUDENT_COUNTRY_KEY, country)
  } catch {
    // Private mode or quota — profile write may still succeed.
  }
}

function readProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STUDENT_PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StudentProfile>
    if (!parsed || typeof parsed !== "object") return null
    const country = asCountry(parsed.country) ?? readCountryKey() ?? "Canada"
    return {
      country,
      school: typeof parsed.school === "string" ? parsed.school : "",
      level: typeof parsed.level === "string" ? parsed.level : EMPTY_PROFILE.level,
      major: typeof parsed.major === "string" ? parsed.major : EMPTY_PROFILE.major,
    }
  } catch {
    return null
  }
}

export function getStoredCountry(): StudentCountry | null {
  const fromKey = readCountryKey()
  if (fromKey) return fromKey
  return readProfile()?.country ?? null
}

export function hasChosenCountry(): boolean {
  return getStoredCountry() !== null
}

export function getStudentProfile(): StudentProfile | null {
  return readProfile()
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return
  const country = asCountry(profile.country) ?? "Canada"
  writeCountryKey(country)
  try {
    window.localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify({ ...profile, country }))
  } catch {
    return
  }
  notify()
}

export function saveStudentCountry(country: StudentCountry): void {
  const next = asCountry(country) ?? "Canada"
  writeCountryKey(next)
  const existing = readProfile() ?? EMPTY_PROFILE
  saveStudentProfile({ ...existing, country: next })
}

export function clearStudentProfile(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STUDENT_PROFILE_KEY)
  } catch {
    // ignore
  }
  notify()
}

export function subscribeStudentProfile(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
