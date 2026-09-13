import Link from "next/link"
import { Logo } from "@/components/Logo"

const LINKS = [
  { href: "/", label: "Marketplace" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/schools", label: "Schools" },
  { href: "/help", label: "Help" },
] as const

export default function NotFound() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Logo size={40} showText />
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        That page is gone
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        That URL isn’t on WealthNutz. Scholarships, school pages, and Marketplace are still here.
      </p>
      <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label="Helpful links">
        {LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              index === 0
                ? "inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
                : "inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </article>
  )
}
