import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { SchoolAwardsPage } from "@/features/scholarships/components/SchoolAwardsPage"
import { getSchoolAwards, schoolPagePath, schoolStaticParams } from "@/features/scholarships/schools"
import { pageMeta } from "@/lib/seo"

type SchoolRouteProps = {
  params: Promise<{ school: string }>
}

export function generateStaticParams() {
  return schoolStaticParams()
}

export async function generateMetadata({ params }: SchoolRouteProps): Promise<Metadata> {
  const { school: slug } = await params
  const school = getSchoolAwards(slug)
  if (!school) {
    return pageMeta(
      "School scholarships — WealthNutz",
      "Official starting points for scholarships and student aid at Canadian schools.",
    )
  }
  if (slug === "queens") {
    return pageMeta(
      "Queen’s University scholarships and student awards — WealthNutz",
      "Official Queen’s Student Awards, Smith Engineering bursaries, OSAP, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on Queen’s and government sites.",
    )
  }
  return pageMeta(`${school.name} scholarships — WealthNutz`, school.description)
}

export default async function SchoolScholarshipsRoute({ params }: SchoolRouteProps) {
  const { school: slug } = await params
  const school = getSchoolAwards(slug)
  if (!school) notFound()
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    decoded = slug
  }
  if (decoded !== school.slug) {
    redirect(schoolPagePath(school))
  }
  return <SchoolAwardsPage school={school} />
}
