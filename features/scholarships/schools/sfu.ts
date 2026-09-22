import { LORAN, NSLSC, STUDENTAID_BC, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const sfu: SchoolAwardsData = {
  slug: "sfu",
  aliases: [
    "simon fraser",
    "simon fraser university",
  ],
  name: "Simon Fraser University",
  country: "Canada",
  region: "British Columbia",
  searchName: "Simon Fraser University",
  description:
    "Official starting points for SFU financial aid and awards, StudentAid BC, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on SFU and government sites.",
  domains: ["sfu.ca"],
  officialAwardsUrl: "https://www.sfu.ca/students/financial-aid.html",
  officialAidUrl: "https://studentaidbc.ca/",
  links: [
    {
      id: "sfu-financial-aid",
      title: "SFU financial aid and awards",
      summary:
        "Simon Fraser University Student Services hub for scholarships, bursaries, and financial aid.",
      href: "https://www.sfu.ca/students/financial-aid.html",
    },
    NSLSC,
    STUDENTAID_BC,
    LORAN,
    schulichLink("Simon Fraser University"),
  ],
}
