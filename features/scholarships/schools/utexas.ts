import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const utexas: SchoolAwardsData = {
  slug: "utexas",
  aliases: [
    "utexas",
    "ut austin",
    "university of texas",
    "university of texas at austin",
    "university of texas austin",
  ],
  name: "The University of Texas at Austin",
  country: "USA",
  region: "Texas",
  searchName: "University of Texas at Austin",
  description:
    "Official UT Austin scholarships and financial aid starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on utexas.edu and government sites.",
  domains: ["utexas.edu"],
  officialAwardsUrl:
    "https://onestop.utexas.edu/managing-costs/scholarships-financial-aid/types-of-financial-aid/scholarships/",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "utexas-aid",
      title: "UT Austin financial aid and scholarships",
      summary:
        "Texas One Stop hub for FAFSA, scholarships, and programs such as the Texas Advance Commitment — confirm eligibility on the official site.",
      href: "https://onestop.utexas.edu/managing-costs/scholarships-financial-aid/",
    },
    {
      id: "utexas-scholarships",
      title: "UT Austin scholarships",
      summary:
        "How UT scholarships are awarded, including LASSO search and college awards — confirm deadlines on Texas One Stop.",
      href: "https://onestop.utexas.edu/managing-costs/scholarships-financial-aid/types-of-financial-aid/scholarships/",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
