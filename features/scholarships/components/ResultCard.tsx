import { GraduationCap, Globe } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import type { ScholarshipResult } from "@/features/scholarships/types"
import { SCHOLARSHIP_CHECKLIST } from "@/features/student-profile/checklists"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"
import { cleanDisplayText } from "@/lib/liveResultText"

type ResultCardProps = {
  result: ScholarshipResult
}

function displayAmount(amount: string): string {
  const value = amount.trim()
  if (!value || /^\$\??$/.test(value) || /^(n\/?a|unknown|see listing|tbd)$/i.test(value)) {
    return "Varies"
  }
  return value
}

export function ResultCard({ result }: ResultCardProps) {
  const featured = result.source === "live"
  const title = cleanDisplayText(result.title)
  const eligibility = cleanDisplayText(result.eligibility)
  const amount = displayAmount(result.amount)

  return (
    <article
      className={`interactive-card flex min-w-0 flex-col overflow-hidden rounded-2xl p-4 sm:p-5 ${
        featured
          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/10 shadow-sm"
          : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex min-w-0 items-start gap-3">
        <CreamIcon icon={GraduationCap} />
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A84C] px-2.5 py-1 text-[11px] font-semibold text-[#07090d]">
            <Globe className="h-3 w-3 shrink-0" aria-hidden="true" />
            Web Result
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            Curated pick
          </span>
        )}
        <span className="max-w-full break-all rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          {result.provider}
        </span>
        </div>
      </div>
      <h3 className="break-words text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-2 min-w-0">
        <ExpandableText
          text={eligibility}
          className="break-words text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="min-w-0">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="break-words font-medium text-foreground">{amount}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-muted-foreground">Deadline</dt>
          <dd className="break-words font-medium text-foreground">{result.deadline}</dd>
        </div>
      </dl>
      <FollowThrough
        href={result.url}
        cta="Open official site"
        checklist={SCHOLARSHIP_CHECKLIST}
        item={{
          id: `scholarship:${result.id}`,
          kind: "scholarship",
          title: title,
          href: result.url,
          subtitle: `${result.provider} · ${amount}`,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
