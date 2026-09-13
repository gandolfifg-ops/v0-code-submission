import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const ontarioTech: SchoolAwardsData = {
  slug: "ontario-tech",
  aliases: ["OntarioTech", "ontariotech", "ontario-tech-university", "ontario tech"],
  name: "Ontario Tech University",
  country: "Canada",
  region: "Ontario",
  searchName: "Ontario Tech University",
  description:
    "Official starting points for Ontario Tech awards, OSAP, NSLSC, Loran, and Schulich Leaders.",
  domains: ["ontariotechu.ca"],
  officialAwardsUrl: "https://safa.ontariotechu.ca/awards-bursaries-and-scholarships/undergraduate-student-finances/index.php",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  links: [
    {
      id: "ontariotech-awards",
      title: "Ontario Tech awards, bursaries and scholarships",
      summary:
        "Student Awards and Financial Aid for undergraduate scholarships, bursaries, and donor awards.",
      href: "https://safa.ontariotechu.ca/awards-bursaries-and-scholarships/undergraduate-student-finances/index.php",
    },
    NSLSC,
    osapLink("Ontario Tech"),
    LORAN,
    schulichLink(),
  ],
}
