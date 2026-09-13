import { LORAN, NSLSC, STUDENTAID_BC, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const ubc: SchoolAwardsData = {
  slug: "UBC",
  aliases: ["ubc", "university-of-british-columbia"],
  name: "University of British Columbia",
  region: "British Columbia",
  searchName: "University of British Columbia",
  description:
    "Official starting points for UBC awards and bursaries, StudentAid BC, NSLSC, Loran, and Schulich Leaders.",
  links: [
    {
      id: "ubc-awards",
      title: "UBC awards, scholarships and bursaries",
      summary:
        "UBC Student Services hub for merit scholarships, need-based bursaries, and related aid.",
      href: "https://students.ubc.ca/finances/awards-scholarships-bursaries/",
    },
    NSLSC,
    STUDENTAID_BC,
    LORAN,
    schulichLink("UBC"),
  ],
}
