import { LORAN, NSLSC, STUDENTAID_BC, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const ubc: SchoolAwardsData = {
  slug: "ubc",
  aliases: ["UBC", "university-of-british-columbia", "university of british columbia"],
  name: "University of British Columbia",
  country: "Canada",
  region: "British Columbia",
  searchName: "University of British Columbia",
  description:
    "Official starting points for UBC awards and bursaries, StudentAid BC, NSLSC, Loran, and Schulich Leaders.",
  domains: ["ubc.ca"],
  officialAwardsUrl: "https://students.ubc.ca/finances/awards-scholarships-bursaries/",
  officialAidUrl: "https://studentaidbc.ca/",
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
