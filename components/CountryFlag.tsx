type CountryFlagProps = {
  code: "CA" | "US"
  className?: string
}

export function CountryFlag({ code, className = "h-3.5 w-[1.35rem] shrink-0 rounded-[2px]" }: CountryFlagProps) {
  if (code === "CA") {
    return (
      <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
        <rect width="24" height="16" fill="#FF0000" />
        <rect x="6" width="12" height="16" fill="#FFFFFF" />
        <path
          fill="#FF0000"
          d="M12 2.2l.7 2.4 1.9-.8-.9 2.1 2.2 1.1-2.4.3.2 2.1L12 8.6l-1.7 1.8.2-2.1-2.4-.3 2.2-1.1-.9-2.1 1.9.8z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#B22234" />
      <rect y="1.23" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="3.69" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="6.15" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="8.62" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="11.08" width="24" height="1.23" fill="#FFFFFF" />
      <rect y="13.54" width="24" height="1.23" fill="#FFFFFF" />
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  )
}
