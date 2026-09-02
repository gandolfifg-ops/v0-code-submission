import { Fragment, type ReactNode } from "react"

function inlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /(\*\*[^*]+?\*\*|`[^`]+?`)/g
  let last = 0
  let i = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded bg-background/80 px-1 py-0.5 font-mono text-[0.8em]"
        >
          {token.slice(1, -1)}
        </code>,
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function headingLevel(line: string): 1 | 2 | 3 | null {
  if (line.startsWith("### ")) return 3
  if (line.startsWith("## ")) return 2
  if (line.startsWith("# ")) return 1
  return null
}

function listMarker(line: string): "ul" | "ol" | null {
  if (/^\s*[-*]\s+/.test(line)) return "ul"
  if (/^\s*\d+\.\s+/.test(line)) return "ol"
  return null
}

function listItemText(line: string): string {
  return line.replace(/^\s*(?:[-*]|\d+\.)\s+/, "")
}

export function ChatMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === "") {
      i += 1
      continue
    }

    const level = headingLevel(line)
    if (level) {
      const text = line.replace(/^#{1,3}\s+/, "")
      const className =
        level === 1
          ? "text-base font-bold text-foreground"
          : level === 2
            ? "text-sm font-bold text-foreground"
            : "text-sm font-semibold text-foreground"
      const Tag = `h${level}` as "h1" | "h2" | "h3"
      blocks.push(
        <Tag key={`h-${i}`} className={className}>
          {inlineMarkdown(text, `h-${i}`)}
        </Tag>,
      )
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
    while (i < lines.length && lines[i].trim() !== "" && !headingLevel(lines[i]) && !listMarker(lines[i])) {
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
