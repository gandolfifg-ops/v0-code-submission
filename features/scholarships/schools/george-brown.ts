import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const georgeBrown: SchoolAwardsData = {
  slug: "George Brown College",
  aliases: ["george-brown", "george-brown-college", "georgebrown"],
  name: "George Brown College",
  region: "Ontario",
  searchName: "George Brown College",
  description:
    "Official starting points for George Brown awards, OSAP, NSLSC, and national awards.",
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
