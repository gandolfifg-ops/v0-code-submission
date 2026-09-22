import { LORAN, NSLSC, QUEBEC_AFE, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const concordia: SchoolAwardsData = {
  slug: "concordia",
  aliases: [
    "concordia university",
    "concordia montreal",
  ],
  name: "Concordia University",
  country: "Canada",
  region: "Quebec",
  searchName: "Concordia University",
  description:
    "Official starting points for Concordia scholarships and funding, Quebec Aide financière aux études, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on Concordia and government sites.",
  domains: ["concordia.ca"],
  officialAwardsUrl: "https://www.concordia.ca/students/financial/scholarships-funding/scholarships.html",
  officialAidUrl: "https://www.quebec.ca/en/education/student-financial-assistance/online-services",
  links: [
    {
      id: "concordia-scholarships",
      title: "Concordia scholarships",
      summary:
        "Concordia Tuition & Financial Aid page for entrance and in-course scholarships.",
      href: "https://www.concordia.ca/students/financial/scholarships-funding/scholarships.html",
    },
    NSLSC,
    QUEBEC_AFE,
    LORAN,
    schulichLink("Concordia University"),
  ],
}
