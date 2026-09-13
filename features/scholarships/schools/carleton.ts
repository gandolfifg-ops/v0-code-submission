import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const carleton: SchoolAwardsData = {
  slug: "carleton",
  aliases: ["carleton-university", "carleton university"],
  name: "Carleton University",
  country: "Canada",
  region: "Ontario",
  searchName: "Carleton University",
  description:
    "Official starting points for Carleton awards and financial aid, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["carleton.ca"],
  officialAwardsUrl: "https://carleton.ca/awards/",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  links: [
    {
      id: "carleton-awards",
      title: "Carleton Awards and Financial Aid",
      summary:
        "Carleton’s awards office for scholarships, bursaries, departmental awards, and government aid.",
      href: "https://carleton.ca/awards/",
    },
    NSLSC,
    osapLink("Carleton"),
    LORAN,
    schulichLink(),
  ],
}
