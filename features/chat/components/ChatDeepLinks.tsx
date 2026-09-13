import Link from "next/link"
import { extractChatDeepLinks } from "@/features/chat/deepLinks"
import type { StudentCountry } from "@/features/student-profile/types"

export function ChatDeepLinks({
  content,
  country = null,
}: {
  content: string
  country?: StudentCountry | null
}) {
  const links = extractChatDeepLinks(content, country)
  if (links.length === 0) return null

  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Sources
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-muted/70 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
