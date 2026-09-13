import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const guelph: SchoolAwardsData = {
  slug: "Guelph",
  aliases: ["guelph", "university-of-guelph", "uoguelph"],
  name: "University of Guelph",
  region: "Ontario",
  searchName: "University of Guelph",
  description:
    "Official starting points for Guelph financial aid, OSAP, NSLSC, Loran, and Schulich Leaders.",
  links: [
    {
      id: "guelph-aid",
      title: "University of Guelph financial aid",
      summary:
        "Registrar financial-aid hub for scholarships, bursaries, government aid, and award search tools.",
      href: "https://www.uoguelph.ca/registrar/finances-fees/financial-aid",
    },
    NSLSC,
    osapLink("Guelph"),
    LORAN,
    schulichLink(),
  ],
}
