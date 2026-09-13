import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const western: SchoolAwardsData = {
  slug: "western",
  aliases: ["Western University", "western-university", "uwo", "western university"],
  name: "Western University",
  country: "Canada",
  region: "Ontario",
  searchName: "Western University",
  description:
    "Official starting points for Western scholarships and awards, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["uwo.ca", "westernu.ca"],
  officialAwardsUrl: "https://registrar.uwo.ca/student_finances/scholarships_awards/index.html",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  rejectDomains: ["western.edu"],
  links: [
    {
      id: "western-awards",
      title: "Western scholarships and awards",
      summary:
        "Office of the Registrar scholarships and awards hub, including admission and in-course awards.",
      href: "https://registrar.uwo.ca/student_finances/scholarships_awards/index.html",
    },
    NSLSC,
    osapLink("Western"),
    LORAN,
    schulichLink("Western"),
  ],
}
