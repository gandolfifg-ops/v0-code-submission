import Link from "next/link"
import { extractChatDeepLinks } from "@/features/chat/deepLinks"

export function ChatDeepLinks({ content }: { content: string }) {
  const links = extractChatDeepLinks(content)
  if (links.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.label === "Loans" || link.label === "Marketplace"
              ? "inline-flex min-h-12 items-center rounded-xl border-2 border-gold bg-gold px-5 py-2.5 text-base font-bold text-gold-foreground underline underline-offset-4 transition-colors hover:bg-gold-hover"
              : "inline-flex min-h-11 items-center rounded-xl border-2 border-gold bg-gold px-3.5 text-sm font-semibold text-gold-foreground underline underline-offset-4 transition-colors hover:bg-gold-hover"
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
