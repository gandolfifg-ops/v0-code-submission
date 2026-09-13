import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const umich: SchoolAwardsData = {
  slug: "umich",
  aliases: [
    "umich",
    "u of m",
    "u-m",
    "university of michigan",
    "university of michigan ann arbor",
    "michigan",
  ],
  name: "University of Michigan",
  country: "USA",
  region: "Michigan",
  searchName: "University of Michigan",
  description:
    "Official U-M Office of Financial Aid starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on umich.edu and government sites.",
  domains: ["umich.edu"],
  officialAwardsUrl: "https://finaid.umich.edu/types-aid/scholarships/undergraduate",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "umich-aid",
      title: "U-M Office of Financial Aid",
      summary:
        "University of Michigan hub for applying for aid, scholarships, and new-undergraduate steps.",
      href: "https://finaid.umich.edu/",
    },
    {
      id: "umich-scholarships",
      title: "U-M undergraduate scholarships",
      summary:
        "How Michigan scholarships are awarded and when a separate application is required — confirm on the official listing.",
      href: "https://finaid.umich.edu/types-aid/scholarships/undergraduate",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
