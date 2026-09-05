import type { LucideIcon } from "lucide-react"

type CreamIconProps = {
  icon: LucideIcon
  size?: "sm" | "md" | "lg"
  className?: string
  /** Cream glyph for gold selected buttons (no boxed background). */
  variant?: "boxed" | "onGold"
}

export function CreamIcon({ icon: Icon, size = "md", className = "", variant = "boxed" }: CreamIconProps) {
  const box =
    size === "sm" ? "h-6 w-6 rounded-md" : size === "lg" ? "h-12 w-12 rounded-xl" : "h-8 w-8 rounded-lg"
  const glyph = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4"

  if (variant === "onGold") {
    return <Icon className={`${glyph} shrink-0 text-[#F5E6C8] ${className}`} strokeWidth={1.75} aria-hidden="true" />
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-[#F5E6C8] text-[#8B6914] dark:bg-[#C9A84C]/20 dark:text-[#C9A84C] ${box} ${className}`}
      aria-hidden="true"
    >
      <Icon className={glyph} strokeWidth={1.75} />
    </span>
  )
}
