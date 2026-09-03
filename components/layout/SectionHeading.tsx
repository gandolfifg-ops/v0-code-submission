import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type SectionHeadingProps = {
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function SectionHeading({ icon: Icon, children, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`flex items-center gap-2 text-base font-semibold text-foreground md:gap-2.5 md:text-lg ${className}`}>
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/15 text-[#8B6914] dark:text-[#C9A84C] md:h-8 md:w-8">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      {children}
    </h2>
  )
}
