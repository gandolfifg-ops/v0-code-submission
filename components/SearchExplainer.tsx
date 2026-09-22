type SearchExplainerProps = {
  kind: "scholarships" | "loans"
  className?: string
}

export function SearchExplainer({ kind, className = "" }: SearchExplainerProps) {
  const amountLine =
    kind === "scholarships"
      ? "Amounts and deadlines may say “Varies” or be incomplete — always confirm on the official award page."
      : "Any APR shown was taken from that same official page and is not a personalized quote."

  return (
    <details className={`rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground ${className}`}>
      <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        How we search
      </summary>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>We prefer official school, government, and foundation pages over blogs and listicles.</li>
        <li>
          {kind === "scholarships"
            ? "Live web search runs when available; otherwise we show curated official starting points."
            : "Government and official lender pages rank first; comparison-site roundups are filtered out."}
        </li>
        <li>{amountLine}</li>
        <li>We do not apply for you — open the official site, then Save a listing here if you want to track it.</li>
      </ul>
    </details>
  )
}
