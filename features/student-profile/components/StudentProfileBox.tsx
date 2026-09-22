"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { UserRound } from "lucide-react"
import { resolveSchool } from "@/features/scholarships/schools"
import {
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_MAJORS,
  scholarshipLevelLabel,
  normalizeScholarshipLevel,
} from "@/features/scholarships/types"
import { SchoolAutocomplete } from "@/features/student-profile/components/SchoolAutocomplete"
import {
  CANADA_PROVINCE_CHIPS,
  normalizeCanadaProvince,
  provinceFromSchool,
} from "@/features/student-profile/regionalAid"
import {
  getStudentProfile,
  saveStudentProfile,
  subscribeStudentProfile,
} from "@/features/student-profile/store"
import {
  EMPTY_PROFILE,
  isProfileFilled,
  type StudentProfile,
} from "@/features/student-profile/types"
import { DigestSignup } from "@/features/digest/components/DigestSignup"

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

const GRAD_YEARS = ["", "2026", "2027", "2028", "2029", "2030", "2031", "2032"]

type StudentProfileBoxProps = {
  onProfileChange?: (profile: StudentProfile | null) => void
}

function withSchoolDefaults(draft: StudentProfile, schoolName: string): StudentProfile {
  const registered = resolveSchool(schoolName)
  const inferred = provinceFromSchool(schoolName)
  return {
    ...draft,
    school: schoolName,
    country: registered?.country ?? draft.country,
    provinceOrState:
      registered?.country === "Canada" && inferred && !normalizeCanadaProvince(draft.provinceOrState)
        ? inferred
        : draft.provinceOrState,
  }
}

export function StudentProfileBox({ onProfileChange }: StudentProfileBoxProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<StudentProfile>(EMPTY_PROFILE)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    const sync = () => {
      const stored = getStudentProfile()
      setProfile(stored)
      setDraft(stored ?? EMPTY_PROFILE)
      setReady(true)
      onProfileChange?.(stored)
    }
    sync()
    return subscribeStudentProfile(sync)
    // Seed filters after load and when the shared profile (including country) updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function persist(next: StudentProfile) {
    saveStudentProfile(next)
    setProfile(next)
    setDraft(next)
    setEditing(false)
    setJustSaved(true)
    onProfileChange?.(next)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    persist({
      ...draft,
      school: draft.school.trim(),
      level: normalizeScholarshipLevel(draft.level),
      provinceOrState:
        draft.country === "Canada"
          ? normalizeCanadaProvince(draft.provinceOrState) || draft.provinceOrState.trim()
          : draft.provinceOrState.trim(),
      graduationYear: draft.graduationYear.trim(),
    })
  }

  if (!ready) return null

  const filled = isProfileFilled(profile)
  const provinceChip = draft.country === "Canada" ? normalizeCanadaProvince(draft.provinceOrState) : ""

  return (
    <section
      id="student-profile"
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-4 md:p-5"
    >
      <SectionHeading icon={UserRound}>Your profile</SectionHeading>
      <p className="mt-1 text-xs text-muted-foreground">
        Stored in this browser only. We use it to pre-fill country, major, and level, and to pin official aid — not to lock search to your school unless you type that school.
      </p>

      {!filled && !editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-3 w-full rounded-2xl border border-dashed border-border bg-muted/50 p-4 text-left transition-colors hover:bg-muted md:hidden"
        >
          <span className="block text-sm font-semibold text-foreground">Add your profile (optional)</span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Pre-fill country, school, and major for faster searches.
          </span>
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
          {profile.provinceOrState.trim() && (
            <p>
              <span className="text-muted-foreground">
                {profile.country === "USA" ? "State: " : "Province: "}
              </span>
              {profile.country === "Canada"
                ? normalizeCanadaProvince(profile.provinceOrState) || profile.provinceOrState
                : profile.provinceOrState}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Level: </span>
            {scholarshipLevelLabel(profile.level)}
          </p>
          <p>
            <span className="text-muted-foreground">Major: </span>
            {profile.major}
          </p>
          {profile.graduationYear.trim() && (
            <p>
              <span className="text-muted-foreground">Graduation year: </span>
              {profile.graduationYear}
            </p>
          )}
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
            <SchoolAutocomplete
              value={draft.school}
              country={draft.country}
              onChange={(school) => setDraft((prev) => ({ ...prev, school }))}
              onPickSchool={(school) => setDraft((prev) => withSchoolDefaults(prev, school))}
            />
          </label>
          {draft.country === "Canada" ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Province (optional)</p>
              <div className="mt-1 flex flex-wrap gap-2" role="group" aria-label="Province">
                {CANADA_PROVINCE_CHIPS.map((chip) => {
                  const active = provinceChip === chip.code
                  return (
                    <button
                      key={chip.code}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, provinceOrState: chip.code }))}
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-gold text-gold-foreground hover:bg-gold-hover"
                          : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {chip.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <label className="block text-xs font-medium text-muted-foreground">
              State (optional)
              <input
                className={`${fieldClass} mt-1`}
                value={draft.provinceOrState}
                onChange={(e) => setDraft((prev) => ({ ...prev, provinceOrState: e.target.value }))}
                placeholder="e.g. California"
              />
            </label>
          )}
          <label className="block text-xs font-medium text-muted-foreground">
            School level
            <select
              className={`${fieldClass} mt-1`}
              value={normalizeScholarshipLevel(draft.level)}
              onChange={(e) => setDraft((prev) => ({ ...prev, level: e.target.value }))}
            >
              {SCHOLARSHIP_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {scholarshipLevelLabel(level)}
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
          <label className="block text-xs font-medium text-muted-foreground">
            Graduation year (optional)
            <select
              className={`${fieldClass} mt-1`}
              value={draft.graduationYear}
              onChange={(e) => setDraft((prev) => ({ ...prev, graduationYear: e.target.value }))}
            >
              {GRAD_YEARS.map((year) => (
                <option key={year || "none"} value={year}>
                  {year || "Not set"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-gold text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
          >
            Save profile
          </button>
        </form>
      )}
      {justSaved ? (
        <div className="mt-3">
          <DigestSignup heading="Get a weekly digest after saving your profile" />
        </div>
      ) : null}
    </section>
  )
}
