import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const york: SchoolAwardsData = {
  slug: "york",
  aliases: ["York", "yorku", "york-university", "york university"],
  name: "York University",
  country: "Canada",
  region: "Ontario",
  searchName: "York University",
  description:
    "Official starting points for York scholarships and FAAS, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["yorku.ca"],
  officialAwardsUrl: "https://students.yorku.ca/sfs/scholarships-awards-bursaries",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  rejectDomains: ["york.edu", "york.ac.uk"],
  links: [
    {
      id: "york-awards",
      title: "York scholarships, awards and bursaries",
      summary:
        "York Student Financial Services hub for scholarships, bursaries, and the FAAS application.",
      href: "https://students.yorku.ca/sfs/scholarships-awards-bursaries",
    },
    NSLSC,
    osapLink("York"),
    LORAN,
    schulichLink(),
  ],
}
