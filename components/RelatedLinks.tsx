import Link from "next/link"

export type RelatedLink = {
  href: string
  label: string
  external?: boolean
}

export function RelatedLinks({
  title = "Related",
  links,
}: {
  title?: string
  links: RelatedLink[]
}) {
  if (links.length === 0) return null
  return (
    <aside className="mt-8 rounded-2xl border border-border bg-muted/30 p-4 md:p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
