import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const waterloo: SchoolAwardsData = {
  slug: "waterloo",
  aliases: ["uwaterloo", "university-of-waterloo", "university of waterloo"],
  name: "University of Waterloo",
  country: "Canada",
  region: "Ontario",
  searchName: "University of Waterloo",
  description:
    "Official starting points for Waterloo awards, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["uwaterloo.ca"],
  officialAwardsUrl: "https://uwaterloo.ca/awards-directory/",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  links: [
    {
      id: "waterloo-awards",
      title: "Waterloo Awards Directory",
      summary:
        "Searchable directory of scholarships, bursaries, and other awards for incoming and current Waterloo students.",
      href: "https://uwaterloo.ca/awards-directory/",
    },
    NSLSC,
    osapLink("Waterloo"),
    LORAN,
    schulichLink("Waterloo"),
  ],
}
