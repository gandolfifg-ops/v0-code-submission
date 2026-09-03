import { Banknote, Car, GraduationCap, Star } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import type { LoanResult, LoanType } from "@/features/loans/types"
import { LOAN_CHECKLISTS } from "@/features/student-profile/checklists"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"
import { cleanDisplayText } from "@/lib/liveResultText"

const LOAN_ICONS: Record<LoanType, typeof GraduationCap> = {
  Student: GraduationCap,
  Personal: Banknote,
  Auto: Car,
}

export function LenderCard({ lender }: { lender: LoanResult }) {
  const featured = lender.source === "live"
  const name = cleanDisplayText(lender.name)
  const highlight = cleanDisplayText(lender.highlight)

  return (
    <article
      className={`interactive-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl p-4 md:p-5 ${
        featured
          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/10 shadow-sm"
          : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <CreamIcon icon={LOAN_ICONS[lender.loanType]} />
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
          {lender.loanType}
        </span>
        </div>
      </div>
      <h3 className="min-w-0 break-words text-base font-semibold text-foreground">{name}</h3>
      <p className="mt-1 min-w-0 break-words text-sm font-medium text-[#8B6914] dark:text-[#C9A84C]">{lender.tagline}</p>
      <div className="mt-3 min-w-0">
        <ExpandableText
          text={highlight}
          className="break-words text-sm leading-relaxed text-muted-foreground"
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
          title: name,
          href: lender.href,
          subtitle: `${lender.loanType} · ${lender.advertisedRate}`,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
