import { LORAN, NSLSC, QUEBEC_AFE, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const mcgill: SchoolAwardsData = {
  slug: "mcgill",
  aliases: ["mcgill-university"],
  name: "McGill University",
  region: "Quebec",
  searchName: "McGill University",
  description:
    "Official starting points for McGill scholarships and student aid, Quebec aid, NSLSC, Loran, and Schulich Leaders.",
  links: [
    {
      id: "mcgill-aid",
      title: "McGill scholarships and student aid",
      summary:
        "McGill Scholarships and Student Aid for entrance awards, in-course funding, and need-based aid.",
      href: "https://www.mcgill.ca/studentaid/scholarships-aid",
    },
    NSLSC,
    QUEBEC_AFE,
    LORAN,
    schulichLink("McGill"),
  ],
}
