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

function downloadBlob(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function toCsv(items: SavedItem[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const header = ["kind", "title", "subtitle", "href", "savedAt"].join(",")
  const rows = items.map((item) =>
    [item.kind, item.title, item.subtitle, item.href, new Date(item.savedAt).toISOString()]
      .map((cell) => escape(String(cell)))
      .join(","),
  )
  return [header, ...rows].join("\n")
}

export function SavedList() {
  const { items, ready, remove } = useSavedItems()
  const scholarships = items.filter((item) => item.kind === "scholarship")
  const loans = items.filter((item) => item.kind === "loan")
  const products = items.filter((item) => item.kind === "product")

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Saved</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Saved items</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Saved in this browser only. Clearing site data deletes them. There is no account sync yet.
      </p>
      {ready && items.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              downloadBlob(
                `wealthnutz-saved-${new Date().toISOString().slice(0, 10)}.json`,
                JSON.stringify(items, null, 2),
                "application/json",
              )
            }
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() =>
              downloadBlob(
                `wealthnutz-saved-${new Date().toISOString().slice(0, 10)}.csv`,
                toCsv(items),
                "text/csv;charset=utf-8",
              )
            }
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Export CSV
          </button>
        </div>
      )}

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

      {ready && products.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Marketplace</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {products.map((item) => (
              <SavedCard key={item.id} item={item} onRemove={remove} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
