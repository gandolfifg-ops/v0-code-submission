import Link from "next/link"
import { FOOTER_NAV } from "@/lib/constants/nav"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {FOOTER_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          WealthNutz provides general financial education only and is not a licensed
          advisor, broker, or lender. Some links are affiliate links — see our Terms for
          details.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WealthNutz
        </p>
      </div>
    </footer>
  )
}
