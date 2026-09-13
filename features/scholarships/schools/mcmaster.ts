import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const mcmaster: SchoolAwardsData = {
  slug: "mcmaster",
  aliases: ["mcmaster-university"],
  name: "McMaster University",
  region: "Ontario",
  searchName: "McMaster University",
  description:
    "Official starting points for McMaster financial support, OSAP, NSLSC, Loran, and Schulich Leaders.",
  links: [
    {
      id: "mcmaster-aid",
      title: "McMaster financial support",
      summary:
        "Registrar financial-support hub for scholarships, bursaries, OSAP, and AwardSpring applications.",
      href: "https://registrar.mcmaster.ca/financial-support/",
    },
    NSLSC,
    osapLink("McMaster"),
    LORAN,
    schulichLink("McMaster"),
  ],
}
