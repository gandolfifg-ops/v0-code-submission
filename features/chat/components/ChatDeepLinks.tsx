import Link from "next/link"
import { extractChatDeepLinks } from "@/features/chat/deepLinks"

export function ChatDeepLinks({ content }: { content: string }) {
  const links = extractChatDeepLinks(content)
  if (links.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-8 items-center rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/15 px-2.5 py-1 text-[11px] font-semibold text-[#8B6914] transition-colors hover:bg-[#C9A84C]/25 dark:text-[#C9A84C]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
