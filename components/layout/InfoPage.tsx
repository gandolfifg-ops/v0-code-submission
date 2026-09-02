import type { ReactNode } from "react"

type InfoPageProps = {
  title: string
  lede?: string
  children: ReactNode
}

export function InfoPage({ title, lede, children }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 text-sm text-muted-foreground">{lede}</p>}
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}
