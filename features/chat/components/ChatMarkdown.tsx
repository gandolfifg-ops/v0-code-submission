import { Fragment, type ReactNode } from "react"

function inlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re =
    /(\*\*[^*]+?\*\*|__[^_]+?__|`[^`]+?`|\[[^\]]+\]\(https?:\/\/[^)]+\)|\*[^*\n]+?\*)/g
  let last = 0
  let i = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(stripLeftoverMarkers(text.slice(last, match.index)))
    const token = match[0]
    if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded bg-background/80 px-1 py-0.5 font-mono text-[0.8em]"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
      if (link) {
        nodes.push(
          <a
            key={`${keyPrefix}-a-${i++}`}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#8B6914] underline underline-offset-2 dark:text-[#C9A84C]"
          >
            {link[1]}
          </a>,
        )
      }
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i-${i++}`} className="italic">
          {token.slice(1, -1)}
        </em>,
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) nodes.push(stripLeftoverMarkers(text.slice(last)))
  return nodes
}

/** Drop unmatched heading/bold markers the model leaves in prose. */
function stripLeftoverMarkers(text: string): string {
  return text
    .replace(/#{2,6}/g, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
}

function parseHeading(line: string): { level: 1 | 2 | 3; text: string } | null {
  const match = line.match(/^\s{0,3}(#{1,6})(?:\s+|$)(.*?)(?:\s+#+\s*)?$/)
  if (!match) {
    const glued = line.match(/^\s{0,3}(#{1,6})(\S.*)$/)
    if (!glued) return null
    const level = Math.min(glued[1].length, 3) as 1 | 2 | 3
    return { level, text: glued[2].replace(/\s+#+\s*$/, "").trim() }
  }
  const level = Math.min(match[1].length, 3) as 1 | 2 | 3
  return { level, text: match[2].trim() }
}

function listMarker(line: string): "ul" | "ol" | null {
  if (/^\s*[-*+•]\s+/.test(line)) return "ul"
  if (/^\s*\d+[.)]\s+/.test(line)) return "ol"
  return null
}

function listItemText(line: string): string {
  return line.replace(/^\s*(?:[-*+•]|\d+[.)])\s+/, "")
}

export function ChatMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === "" || /^[-_*]{3,}$/.test(line.trim())) {
      i += 1
      continue
    }

    const heading = parseHeading(line)
    if (heading) {
      if (heading.text) {
        const className =
          heading.level === 1
            ? "text-base font-bold text-foreground"
            : heading.level === 2
              ? "text-sm font-bold text-foreground"
              : "text-sm font-semibold text-foreground"
        const Tag = `h${heading.level}` as "h1" | "h2" | "h3"
        blocks.push(
          <Tag key={`h-${i}`} className={className}>
            {inlineMarkdown(heading.text, `h-${i}`)}
          </Tag>,
        )
      }
      i += 1
      continue
    }

    const marker = listMarker(line)
    if (marker) {
      const start = i
      const items: string[] = []
      while (i < lines.length && listMarker(lines[i]) === marker) {
        items.push(listItemText(lines[i]))
        i += 1
      }
      const ListTag = marker === "ul" ? "ul" : "ol"
      const listClass = marker === "ul" ? "list-disc" : "list-decimal"
      blocks.push(
        <ListTag key={`l-${start}`} className={`${listClass} my-1 space-y-1 pl-5`}>
          {items.map((item, idx) => (
            <li key={idx}>{inlineMarkdown(item, `l-${start}-${idx}`)}</li>
          ))}
        </ListTag>,
      )
      continue
    }

    const start = i
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !parseHeading(lines[i]) &&
      !listMarker(lines[i])
    ) {
      para.push(lines[i])
      i += 1
    }
    blocks.push(
      <p key={`p-${start}`}>
        {para.map((row, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {inlineMarkdown(row, `p-${start}-${idx}`)}
          </Fragment>
        ))}
      </p>,
    )
  }

  if (blocks.length === 0) return null
  return <div className="space-y-2 [&_p]:m-0">{blocks}</div>
}
