import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const ucla: SchoolAwardsData = {
  slug: "ucla",
  aliases: [
    "ucla",
    "university of california los angeles",
    "university of california, los angeles",
    "uc los angeles",
  ],
  name: "UCLA",
  country: "USA",
  region: "California",
  searchName: "UCLA",
  description:
    "Official UCLA Financial Aid & Scholarships starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on UCLA and government sites.",
  domains: ["ucla.edu"],
  officialAwardsUrl: "https://financialaid.ucla.edu/types-of-aid/scholarships",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "ucla-aid",
      title: "UCLA Financial Aid & Scholarships",
      summary:
        "UCLA office hub for grants, scholarships, and how to apply for institutional and federal aid.",
      href: "https://financialaid.ucla.edu/",
    },
    {
      id: "ucla-scholarships",
      title: "UCLA scholarships",
      summary:
        "How UCLA scholarships work and how to complete the UCLA Scholarship Application on the official portal.",
      href: "https://financialaid.ucla.edu/types-of-aid/scholarships",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
