import Image from "next/image"
import Link from "next/link"

type LogoProps = {
  size?: number
  showText?: boolean
  href?: string
}

export function Logo({ size = 32, showText = false, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-2 bg-transparent transition-opacity hover:opacity-80"
      aria-label="WealthNutz home"
    >
      <span
        className="relative inline-block shrink-0 overflow-hidden rounded-full bg-transparent mix-blend-multiply dark:mix-blend-normal dark:isolate dark:bg-[#F5E6C8]"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Image
          src="/images/logo-squirrel.png"
          alt=""
          fill
          sizes={`${size}px`}
          className="bg-transparent object-cover object-center dark:mix-blend-multiply"
        />
      </span>
      {showText && (
        <span className="whitespace-nowrap text-xs font-black uppercase tracking-tight text-link sm:text-sm md:text-base">
          WealthNutz
        </span>
      )}
    </Link>
  )
}
