import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const berkeley: SchoolAwardsData = {
  slug: "berkeley",
  aliases: [
    "berkeley",
    "uc berkeley",
    "university of california berkeley",
    "university of california, berkeley",
    "cal",
  ],
  name: "UC Berkeley",
  country: "USA",
  region: "California",
  searchName: "UC Berkeley",
  description:
    "Official UC Berkeley Financial Aid & Scholarships starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on Berkeley and government sites.",
  domains: ["berkeley.edu"],
  officialAwardsUrl: "https://financialaid.berkeley.edu/types-of-aid-at-berkeley/scholarships/",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "berkeley-aid",
      title: "Berkeley Financial Aid & Scholarships",
      summary:
        "UC Berkeley office hub for university scholarships, grants, and how aid is packaged.",
      href: "https://financialaid.berkeley.edu/",
    },
    {
      id: "berkeley-regents",
      title: "Regents’ & Chancellor’s Scholarship",
      summary:
        "Berkeley’s most prestigious undergraduate scholarship program — selection rules are on the official Financial Aid site.",
      href: "https://financialaid.berkeley.edu/types-of-aid-at-berkeley/scholarships/regents-and-chancellors-scholarship/",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
