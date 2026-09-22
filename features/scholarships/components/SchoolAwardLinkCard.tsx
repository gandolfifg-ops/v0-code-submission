"use client"

import { FollowThrough } from "@/features/student-profile/components/FollowThrough"
import type { SchoolAwardLink } from "@/features/scholarships/schools/types"

export function SchoolAwardLinkCard({
  link,
  schoolName,
}: {
  link: SchoolAwardLink
  schoolName: string
}) {
  return (
    <li className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <h2 className="text-base font-semibold text-foreground">{link.title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{link.summary}</p>
      <FollowThrough
        href={link.href}
        cta="Open official site"
        item={{
          id: `school-${schoolName}-${link.id}`,
          kind: "scholarship",
          title: link.title,
          href: link.href,
          subtitle: `${schoolName} · official link`,
          savedAt: Date.now(),
        }}
      />
    </li>
  )
}
