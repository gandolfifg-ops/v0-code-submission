import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const uOfT: SchoolAwardsData = {
  slug: "u-of-t",
  aliases: ["uoft", "utoronto", "university-of-toronto"],
  name: "University of Toronto",
  region: "Ontario",
  searchName: "University of Toronto",
  description:
    "Official starting points for U of T awards and aid, OSAP, NSLSC, Loran, and Schulich Leaders.",
  links: [
    {
      id: "uoft-awards",
      title: "U of T awards and scholarships",
      summary:
        "University Registrar hub for scholarships, awards, and Award Explorer — confirm eligibility on the official site.",
      href: "https://www.registrar.utoronto.ca/financial-aid-awards/awards-scholarships/",
    },
    {
      id: "uoft-utaps",
      title: "UTAPS (need-based aid)",
      summary:
        "University of Toronto Advanced Planning for Students — grants that can help cover unmet need after government aid.",
      href: "https://www.registrar.utoronto.ca/financial-aid-awards/utaps/",
    },
    NSLSC,
    osapLink("the University of Toronto"),
    LORAN,
    schulichLink("the University of Toronto"),
  ],
}
