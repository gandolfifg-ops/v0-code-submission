import type { LoanResult } from "@/features/loans/types"
import { SaveButton } from "@/features/saved/components/SaveButton"

export function LenderCard({ lender }: { lender: LoanResult }) {
  return (
    <article className="interactive-card flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            lender.source === "live"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-[#C9A84C]/15 text-[#8B6914] dark:text-[#E8C97A]"
          }`}
        >
          {lender.source === "live" ? "Live web result" : "Curated pick"}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          {lender.loanType}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground">{lender.name}</h3>
      <p className="mt-1 text-sm font-medium text-[#8B6914] dark:text-[#C9A84C]">{lender.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lender.highlight}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Advertised rate: </span>
        {lender.advertisedRate}
      </p>
      <a
        href={lender.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
      >
        {lender.cta}
      </a>
      <div className="mt-2">
        <SaveButton
          item={{
            id: `loan:${lender.id}`,
            kind: "loan",
            title: lender.name,
            href: lender.href,
            subtitle: `${lender.loanType} · ${lender.advertisedRate}`,
            savedAt: Date.now(),
          }}
        />
      </div>
    </article>
  )
}
