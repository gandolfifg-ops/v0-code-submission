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
          className="inline-flex min-h-11 items-center rounded-xl border-2 border-[#C9A84C] bg-[#C9A84C]/15 px-3.5 text-sm font-semibold text-[#8B6914] underline underline-offset-4 transition-colors hover:bg-[#C9A84C]/25 dark:text-[#C9A84C]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
