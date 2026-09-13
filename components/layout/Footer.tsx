import Link from "next/link"
import { Logo } from "@/components/Logo"
import { FOOTER_NAV, GUIDE_NAV } from "@/lib/constants/nav"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <Logo size={26} showText />
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Schools</p>
          <nav className="mt-2 flex flex-wrap gap-x-5 gap-y-2" aria-label="Schools">
            <Link
              href="/schools"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              School scholarship pages
            </Link>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guides</p>
          <nav className="mt-2 flex flex-wrap gap-x-5 gap-y-2" aria-label="Guides">
            {GUIDE_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="max-w-2xl pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm leading-relaxed text-foreground md:text-xs md:text-muted-foreground">
          WealthNutz provides general financial education only and is not a licensed
          advisor, broker, or lender. Some links are affiliate links — see our{" "}
          <Link href="/terms" className="underline underline-offset-2">
            Terms
          </Link>{" "}
          for details.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WealthNutz
        </p>
      </div>
    </footer>
  )
}
