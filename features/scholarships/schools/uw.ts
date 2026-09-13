import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const uw: SchoolAwardsData = {
  slug: "uw",
  aliases: [
    "uw seattle",
    "u dub",
    "university of washington",
    "university of washington seattle",
  ],
  name: "University of Washington",
  country: "USA",
  region: "Washington",
  searchName: "University of Washington",
  description:
    "Official UW Student Financial Aid starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on washington.edu and government sites.",
  domains: ["washington.edu"],
  officialAwardsUrl:
    "https://www.washington.edu/financialaid/types-of-aid/scholarships/undergraduate-scholarships/",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "uw-aid",
      title: "UW Student Financial Aid",
      summary:
        "University of Washington office hub for grants, scholarships, and how to apply for aid.",
      href: "https://www.washington.edu/financialaid/",
    },
    {
      id: "uw-scholarships",
      title: "UW undergraduate scholarships",
      summary:
        "Office of Admissions overview of UW scholarships, including the Presidential Scholarship for eligible Washington residents — confirm terms on the official site.",
      href: "https://admit.washington.edu/costs/scholarships/",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
