import Link from "next/link"
import { JsonLd } from "@/components/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo"

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const last = index === items.length - 1
            return (
              <li key={item.path} className="inline-flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="underline-offset-2 hover:text-foreground hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
