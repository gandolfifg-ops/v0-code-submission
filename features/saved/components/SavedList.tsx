"use client"

import Link from "next/link"
import { useSavedItems } from "@/features/saved/hooks/useSavedItems"
import type { SavedItem } from "@/features/saved/types"

function SavedCard({
  item,
  onRemove,
}: {
  item: SavedItem
  onRemove: (id: string) => void
}) {
  return (
    <article className="interactive-card flex flex-col rounded-2xl border border-border bg-card p-5">
      <span className="w-fit rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
        {item.kind}
      </span>
      <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
      >
        Open official site
      </a>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="mt-2 min-h-11 rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Remove
      </button>
    </article>
  )
}

export function SavedList() {
  const { items, ready, signedIn, remove } = useSavedItems()
  const scholarships = items.filter((item) => item.kind === "scholarship")
  const loans = items.filter((item) => item.kind === "loan")

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Saved</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Saved items</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {signedIn
          ? "These items sync to your account. A copy also stays in this browser."
          : "Saved in this browser only. Clearing site data deletes them. There is no account sync yet."}
      </p>

      {!ready && <p className="mt-8 text-sm text-muted-foreground">Loading saved items…</p>}

      {ready && items.length === 0 && (
        <div className="mt-8 max-w-2xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/scholarships"
              className="inline-flex min-h-14 items-center justify-center rounded-xl bg-gold px-4 text-base font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
            >
              Find scholarships
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-border bg-card px-4 text-base font-bold text-foreground transition-colors hover:bg-muted"
            >
              Browse marketplace
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Save from a card after you search.</p>
        </div>
      )}

      {ready && scholarships.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Scholarships</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {scholarships.map((item) => (
              <SavedCard key={item.id} item={item} onRemove={remove} />
            ))}
          </div>
        </section>
      )}

      {ready && loans.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Loans</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {loans.map((item) => (
              <SavedCard key={item.id} item={item} onRemove={remove} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
