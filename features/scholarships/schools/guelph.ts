import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const guelph: SchoolAwardsData = {
  slug: "guelph",
  aliases: ["Guelph", "university-of-guelph", "uoguelph", "university of guelph"],
  name: "University of Guelph",
  country: "Canada",
  region: "Ontario",
  searchName: "University of Guelph",
  description:
    "Official starting points for Guelph financial aid, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["uoguelph.ca"],
  officialAwardsUrl: "https://www.uoguelph.ca/registrar/finances-fees/financial-aid",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
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
