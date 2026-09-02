import { GraduationCap, Star } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import type { ScholarshipResult } from "@/features/scholarships/types"
import { SCHOLARSHIP_CHECKLIST } from "@/features/student-profile/checklists"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"

type ResultCardProps = {
  result: ScholarshipResult
}

export function ResultCard({ result }: ResultCardProps) {
  const featured = result.source === "live"

  return (
    <article
      className={`interactive-card flex flex-col rounded-2xl p-4 sm:p-5 ${
        featured
          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/10 shadow-sm"
          : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <CreamIcon icon={GraduationCap} />
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        {featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A84C] px-2.5 py-1 text-[11px] font-bold text-[#07090d]">
            <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
            Live web result
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            Curated pick
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          {result.provider}
        </span>
        </div>
      </div>
      <h3 className="text-base font-semibold text-foreground">{result.title}</h3>
      <div className="mt-2">
        <ExpandableText
          text={result.eligibility}
          className="text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium text-foreground">{result.amount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Deadline</dt>
          <dd className="font-medium text-foreground">{result.deadline}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Last checked</dt>
          <dd className="font-medium text-foreground">{result.lastChecked}</dd>
        </div>
      </dl>
      <FollowThrough
        href={result.url}
        cta="Open official site"
        checklist={SCHOLARSHIP_CHECKLIST}
        item={{
          id: `scholarship:${result.id}`,
          kind: "scholarship",
          title: result.title,
          href: result.url,
          subtitle: `${result.provider} · ${result.amount}`,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
