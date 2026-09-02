import { Star } from "lucide-react"
import { ExpandableText } from "@/components/ExpandableText"
import type { LoanResult } from "@/features/loans/types"
import { LOAN_CHECKLISTS } from "@/features/student-profile/checklists"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"

export function LenderCard({ lender }: { lender: LoanResult }) {
  const featured = lender.source === "live"

  return (
    <article
      className={`interactive-card flex flex-col rounded-2xl p-4 sm:p-5 ${
        featured
          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/10 shadow-sm"
          : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex flex-wrap gap-2">
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
          {lender.loanType}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground">{lender.name}</h3>
      <p className="mt-1 text-sm font-medium text-[#8B6914] dark:text-[#C9A84C]">{lender.tagline}</p>
      <div className="mt-3">
        <ExpandableText
          text={lender.highlight}
          className="text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Advertised rate: </span>
        {lender.advertisedRate}
      </p>
      <FollowThrough
        href={lender.href}
        cta={lender.cta}
        checklist={LOAN_CHECKLISTS[lender.loanType]}
        item={{
          id: `loan:${lender.id}`,
          kind: "loan",
          title: lender.name,
          href: lender.href,
          subtitle: `${lender.loanType} · ${lender.advertisedRate}`,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
