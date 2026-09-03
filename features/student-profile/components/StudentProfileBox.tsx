"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { UserRound } from "lucide-react"
import {
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_MAJORS,
} from "@/features/scholarships/types"
import { getStudentProfile, saveStudentProfile } from "@/features/student-profile/store"
import {
  EMPTY_PROFILE,
  isProfileFilled,
  type StudentProfile,
} from "@/features/student-profile/types"

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

type StudentProfileBoxProps = {
  onProfileChange?: (profile: StudentProfile | null) => void
}

export function StudentProfileBox({ onProfileChange }: StudentProfileBoxProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<StudentProfile>(EMPTY_PROFILE)

  useEffect(() => {
    const stored = getStudentProfile()
    setProfile(stored)
    setDraft(stored ?? EMPTY_PROFILE)
    setEditing(false)
    setReady(true)
    onProfileChange?.(stored)
    // Seed filters once after load; later edits call onProfileChange from save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function persist(next: StudentProfile) {
    saveStudentProfile(next)
    setProfile(next)
    setDraft(next)
    setEditing(false)
    onProfileChange?.(next)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    persist({
      ...draft,
      school: draft.school.trim(),
    })
  }

  if (!ready) return null

  const filled = isProfileFilled(profile)

  return (
    <section
      id="student-profile"
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-3 md:p-5"
    >
      <SectionHeading icon={UserRound}>Your profile</SectionHeading>
      <p className="mt-1 text-xs text-muted-foreground">
        Stored in this browser only. We use it to pre-fill WealthNutz search fields — not
        to apply on other sites.
      </p>

      {!filled && !editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-3 min-h-11 w-full rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted md:hidden"
        >
          Add your profile (optional)
        </button>
      )}

      {!editing && filled && profile ? (
        <div className="mt-3 space-y-1 text-sm text-foreground">
          <p>
            <span className="text-muted-foreground">Country: </span>
            {profile.country === "USA" ? "United States" : "Canada"}
          </p>
          {profile.school.trim() && (
            <p>
              <span className="text-muted-foreground">School: </span>
              {profile.school}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Level: </span>
            {profile.level}
          </p>
          <p>
            <span className="text-muted-foreground">Major: </span>
            {profile.major}
          </p>
          <button
            type="button"
            onClick={() => {
              setDraft(profile)
              setEditing(true)
            }}
            className="mt-3 min-h-11 w-full rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Edit profile
          </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className={`mt-3 space-y-3 ${!filled && !editing ? "hidden md:block" : ""}`}
        >
          {!filled && (
            <p className="text-sm font-medium text-foreground">
              Fill this in so Scholarships and Loans start with your details.
            </p>
          )}
          <CountryToggle
            value={draft.country}
            onChange={(country) => setDraft((prev) => ({ ...prev, country }))}
            options={[
              { value: "Canada", flag: "CA", label: "Canada" },
              { value: "USA", flag: "US", label: "United States" },
            ]}
          />
          <label className="block text-xs font-medium text-muted-foreground">
            School
            <input
              className={`${fieldClass} mt-1`}
              value={draft.school}
              onChange={(e) => setDraft((prev) => ({ ...prev, school: e.target.value }))}
              placeholder="e.g. University of Toronto"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Year / level
            <select
              className={`${fieldClass} mt-1`}
              value={draft.level}
              onChange={(e) => setDraft((prev) => ({ ...prev, level: e.target.value }))}
            >
              {SCHOLARSHIP_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Major
            <select
              className={`${fieldClass} mt-1`}
              value={draft.major}
              onChange={(e) => setDraft((prev) => ({ ...prev, major: e.target.value }))}
            >
              {SCHOLARSHIP_MAJORS.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-[#C9A84C] text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
          >
            Save profile
          </button>
        </form>
      )}
    </section>
  )
}
