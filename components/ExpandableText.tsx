"use client"

import { useLayoutEffect, useRef, useState } from "react"

type ExpandableTextProps = {
  text: string
  className?: string
}

export function ExpandableText({ text, className = "" }: ExpandableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (expanded) {
      setOverflows(true)
      return
    }
    setOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [text, expanded])

  return (
    <div>
      <p
        ref={ref}
        className={`${className} break-words ${expanded ? "" : "line-clamp-3"}`}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="mt-1 min-h-11 text-sm font-semibold text-[#8B6914] underline underline-offset-2 dark:text-[#C9A84C]"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  )
}
