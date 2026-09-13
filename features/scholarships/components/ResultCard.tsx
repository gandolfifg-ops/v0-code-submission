import { GraduationCap } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import type { ScholarshipListingKind, ScholarshipResult } from "@/features/scholarships/types"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"
import { prettyIssuerName, scholarshipCardBadge } from "@/lib/listingDisplay"
import { cleanDisplayText, isDisplayableAwardAmount, isDisplayableDeadline } from "@/lib/liveResultText"

function clipTwoLineSnippet(text: string): string {
  const cleaned = cleanDisplayText(text)
  if (cleaned.length <= 220) return cleaned
  const cut = cleaned.slice(0, 219)
  const at = cut.lastIndexOf(" ")
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`
}

const BADGE_LABEL: Record<ScholarshipListingKind, string> = {
  "official-school": "Official school",
  government: "Government",
  foundation: "Foundation",
  listing: "Listing",
}

type ResultCardProps = {
  result: ScholarshipResult
}

export function ResultCard({ result }: ResultCardProps) {
  const title = cleanDisplayText(result.title)
  const issuer = prettyIssuerName(result.url, result.provider)
  const badge = scholarshipCardBadge(result.url, result.listingKind)
  const eligibility = clipTwoLineSnippet(result.eligibility)
  const amount = isDisplayableAwardAmount(result.amount) ? result.amount.trim() : ""
  const deadline = isDisplayableDeadline(result.deadline) ? result.deadline.trim() : ""
  const featured = badge === "official-school" || badge === "government"

  return (
    <article
      className={`interactive-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl p-4 md:p-5 ${
        featured ? "border-2 border-border bg-card shadow-sm" : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex min-w-0 items-start gap-3">
        <CreamIcon icon={GraduationCap} />
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <span
            className={
              badge === "listing"
                ? "rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                : "inline-flex items-center rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-gold-foreground"
            }
          >
            {BADGE_LABEL[badge]}
          </span>
          <span className="max-w-full break-words rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {issuer}
          </span>
        </div>
      </div>
      <h3 className="min-w-0 break-words text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 line-clamp-2 min-w-0 break-words text-sm leading-relaxed text-muted-foreground">
        {eligibility}
      </p>
      {amount || deadline ? (
        <dl className={`mt-3 grid gap-2 text-xs ${amount && deadline ? "grid-cols-2" : "grid-cols-1"}`}>
          {amount ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="break-words font-medium text-foreground">{amount}</dd>
            </div>
          ) : null}
          {deadline ? (
            <div className="min-w-0">
              <dt className="text-muted-foreground">Deadline</dt>
              <dd className="break-words font-medium text-foreground">{deadline}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      {result.lastChecked ? (
        <p className="mt-2 text-xs text-muted-foreground">Last checked {result.lastChecked}</p>
      ) : null}
      <FollowThrough
        href={result.url}
        cta="Open official page"
        item={{
          id: `scholarship:${result.id}`,
          kind: "scholarship",
          title: title,
          href: result.url,
          subtitle: amount ? `${issuer} · ${amount}` : issuer,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
