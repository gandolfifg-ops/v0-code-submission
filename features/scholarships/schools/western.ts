import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const western: SchoolAwardsData = {
  slug: "Western University",
  aliases: ["western", "western-university", "uwo"],
  name: "Western University",
  region: "Ontario",
  searchName: "Western University",
  description:
    "Official starting points for Western scholarships and awards, OSAP, NSLSC, Loran, and Schulich Leaders.",
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
