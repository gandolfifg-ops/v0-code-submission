import { EMPTY_PROFILE, type StudentProfile } from "@/features/student-profile/types"

export const STUDENT_PROFILE_KEY = "wealthnutz.studentProfile"

type Listener = () => void

const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((fn) => fn())
}

function readProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STUDENT_PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StudentProfile>
    const country = parsed.country === "USA" ? "USA" : "Canada"
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

export function getStudentProfile(): StudentProfile | null {
  return readProfile()
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile))
  notify()
}

export function clearStudentProfile(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STUDENT_PROFILE_KEY)
  notify()
}

export function subscribeStudentProfile(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
