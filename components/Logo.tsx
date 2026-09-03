import Link from "next/link"

type LogoProps = {
  size?: number
  showText?: boolean
  href?: string
}

function LogoSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <polygon
        points="16,2 30,9 30,23 16,30 2,23 2,9"
        stroke="#C9A84C"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#C9A84C"
        style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 11 }}
      >
        W
      </text>
    </svg>
  )
}

export function Logo({ size = 32, showText = false, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-2 bg-transparent transition-opacity hover:opacity-80"
      aria-label="WealthNutz home"
    >
      <LogoSvg size={size} />
      {showText && (
        <span className="text-xs font-black uppercase tracking-tight text-[#C9A84C] sm:text-sm md:text-base">
          WealthNutz
        </span>
      )}
    </Link>
  )
}
