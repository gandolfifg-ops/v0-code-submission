import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const harvard: SchoolAwardsData = {
  slug: "harvard",
  aliases: ["harvard", "harvard university", "harvard college"],
  name: "Harvard University",
  country: "USA",
  region: "Massachusetts",
  searchName: "Harvard University",
  description:
    "Official Harvard College financial aid starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on harvard.edu and government sites.",
  domains: ["harvard.edu"],
  officialAwardsUrl: "https://college.harvard.edu/financial-aid",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "harvard-aid",
      title: "Harvard College financial aid",
      summary:
        "Griffin Financial Aid Office hub for need-based Harvard Scholarships. Confirm current contribution rules on the official College site.",
      href: "https://college.harvard.edu/financial-aid",
    },
    {
      id: "harvard-types",
      title: "Types of Harvard aid",
      summary:
        "How Harvard scholarships, federal grants, and outside awards are packaged. Harvard College aid is need-based — not merit scholarships.",
      href: "https://college.harvard.edu/financial-aid/how-aid-works/types-aid",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
