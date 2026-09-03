import { CountryFlag } from "@/components/CountryFlag"

type Option<T extends string> = {
  value: T
  flag: "CA" | "US"
  label: string
}

type CountryToggleProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  className?: string
}

export function CountryToggle<T extends string>({
  value,
  onChange,
  options,
  className = "grid grid-cols-2 gap-2",
}: CountryToggleProps<T>) {
  return (
    <div className={className} role="group" aria-label="Country">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold md:gap-2 md:px-3 md:text-sm transition-colors ${
              active
                ? "bg-[#C9A84C] text-[#07090d] hover:bg-[#b8973f]"
                : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <CountryFlag code={option.flag} />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
