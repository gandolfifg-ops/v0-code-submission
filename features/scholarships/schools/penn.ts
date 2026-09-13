import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const penn: SchoolAwardsData = {
  slug: "penn",
  aliases: [
    "upenn",
    "u penn",
    "penn",
    "university of pennsylvania",
  ],
  name: "University of Pennsylvania",
  country: "USA",
  region: "Pennsylvania",
  searchName: "University of Pennsylvania",
  description:
    "Official Penn SRFS financial aid starting points on upenn.edu, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on Penn and government sites.",
  domains: ["upenn.edu"],
  officialAwardsUrl: "https://srfs.upenn.edu/financial-aid/grants-and-scholarships",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  rejectDomains: ["penn.edu"],
  links: [
    {
      id: "penn-aid",
      title: "Penn Student Registration & Financial Services",
      summary:
        "Penn undergraduate grant-based aid program — need-based aid only. Confirm current rules on srfs.upenn.edu.",
      href: "https://srfs.upenn.edu/financial-aid",
    },
    {
      id: "penn-grants",
      title: "Penn grants and scholarships",
      summary:
        "How Penn Grant and named scholarships work. Penn does not award undergraduate academic-merit scholarships.",
      href: "https://srfs.upenn.edu/financial-aid/grants-and-scholarships",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
