import type { ScholarshipResult } from "@/features/scholarships/types"
import { SaveButton } from "@/features/saved/components/SaveButton"

type ResultCardProps = {
  result: ScholarshipResult
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="interactive-card flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            result.source === "live"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-[#C9A84C]/15 text-[#8B6914] dark:text-[#E8C97A]"
          }`}
        >
          {result.source === "live" ? "Live web result" : "Curated pick"}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
          {result.provider}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground">{result.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.eligibility}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium text-foreground">{result.amount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Deadline</dt>
          <dd className="font-medium text-foreground">{result.deadline}</dd>
        </div>
      </dl>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
      >
        Open official site
      </a>
      <div className="mt-2">
        <SaveButton
          item={{
            id: `scholarship:${result.id}`,
            kind: "scholarship",
            title: result.title,
            href: result.url,
            subtitle: `${result.provider} · ${result.amount}`,
            savedAt: Date.now(),
          }}
        />
      </div>
    </article>
  )
}
