type PlaceholderPageProps = {
  title: string
  description: string
  phase: string
}

export function PlaceholderPage({ title, description, phase }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
        {phase}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          This section is under construction. Navigation and layout are ready — feature
          content arrives in the next rebuild phase.
        </p>
      </div>
    </div>
  )
}
