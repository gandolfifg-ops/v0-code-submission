import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const georgeBrown: SchoolAwardsData = {
  slug: "george-brown",
  aliases: ["George Brown College", "george-brown-college", "georgebrown", "george brown"],
  name: "George Brown College",
  country: "Canada",
  region: "Ontario",
  searchName: "George Brown College",
  description:
    "Official starting points for George Brown awards, OSAP, NSLSC, and national awards.",
  domains: ["georgebrown.ca"],
  officialAwardsUrl: "https://www.georgebrown.ca/apply/financial-aid/awards-and-scholarships",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  links: [
    {
      id: "gbc-awards",
      title: "George Brown awards and scholarships",
      summary:
        "College awards, scholarships, and bursaries — apply through STU-VIEW using the student profile.",
      href: "https://www.georgebrown.ca/apply/financial-aid/awards-and-scholarships",
    },
    NSLSC,
    osapLink("George Brown"),
    LORAN,
    schulichLink(),
  ],
}
