import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const usc: SchoolAwardsData = {
  slug: "usc",
  aliases: ["usc", "university of southern california", "southern california"],
  name: "University of Southern California",
  country: "USA",
  region: "California",
  searchName: "University of Southern California",
  description:
    "Official USC Financial Aid and merit scholarship starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on usc.edu and government sites.",
  domains: ["usc.edu"],
  officialAwardsUrl: "https://admission.usc.edu/cost-and-financial-aid/scholarships/",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "usc-aid",
      title: "USC Financial Aid Office",
      summary:
        "Need-based aid application hub for undergraduates, including FAFSA and CSS Profile steps.",
      href: "https://financialaid.usc.edu/",
    },
    {
      id: "usc-merit",
      title: "USC merit scholarships",
      summary:
        "Undergraduate Admission page for USC Merit Scholarships — confirm current terms on the official site.",
      href: "https://admission.usc.edu/cost-and-financial-aid/scholarships/",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
