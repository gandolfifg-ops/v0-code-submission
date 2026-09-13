import { Banknote, Car, GraduationCap, Landmark } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import type { LoanListingKind, LoanResult, LoanType } from "@/features/loans/types"
import { FollowThrough } from "@/features/student-profile/components/FollowThrough"
import { loanCardKind, prettyIssuerName } from "@/lib/listingDisplay"
import { cleanDisplayText, isConfirmedLoanRate } from "@/lib/liveResultText"

const LOAN_ICONS: Record<LoanType, typeof GraduationCap> = {
  Student: GraduationCap,
  Personal: Banknote,
  Auto: Car,
}

const BADGE_LABEL: Record<LoanListingKind, string> = {
  government: "Government",
  bank: "Bank",
  "private-lender": "Private lender",
  article: "Article",
}

export function LenderCard({ lender }: { lender: LoanResult }) {
  const name = cleanDisplayText(lender.name)
  const highlight = cleanDisplayText(lender.highlight)
  const issuer = prettyIssuerName(lender.href, lender.tagline)
  const kind = loanCardKind(lender)
  const rate = isConfirmedLoanRate(lender.advertisedRate) ? lender.advertisedRate : ""
  const featured = kind === "government" || kind === "bank"

  return (
    <article
      className={`interactive-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl p-4 md:p-5 ${
        featured ? "border-2 border-border bg-card shadow-sm" : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <CreamIcon icon={LOAN_ICONS[lender.loanType]} />
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <span
            className={
              kind === "article"
                ? "rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                : "inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-gold-foreground"
            }
          >
            {kind === "government" ? <Landmark className="h-3 w-3" aria-hidden="true" /> : null}
            {BADGE_LABEL[kind]}
          </span>
          <span className="max-w-full break-words rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {issuer}
          </span>
        </div>
      </div>
      <h3 className="min-w-0 break-words text-base font-semibold text-foreground">{name}</h3>
      <p className="mt-2 line-clamp-2 min-w-0 break-words text-sm leading-relaxed text-muted-foreground">
        {highlight}
      </p>
      {rate ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Advertised rate: </span>
          {rate}
        </p>
      ) : null}
      <FollowThrough
        href={lender.href}
        cta={lender.cta || "Open official page"}
        item={{
          id: `loan:${lender.id}`,
          kind: "loan",
          title: name,
          href: lender.href,
          subtitle: rate ? `${issuer} · ${rate}` : issuer,
          savedAt: Date.now(),
        }}
      />
    </article>
  )
}
