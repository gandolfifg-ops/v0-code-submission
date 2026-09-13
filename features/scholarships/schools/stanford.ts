import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const stanford: SchoolAwardsData = {
  slug: "stanford",
  aliases: ["stanford", "stanford university"],
  name: "Stanford University",
  country: "USA",
  region: "California",
  searchName: "Stanford University",
  description:
    "Official Stanford Financial Aid Office starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on stanford.edu and government sites.",
  domains: ["stanford.edu"],
  officialAwardsUrl: "https://financialaid.stanford.edu/undergrad/types/index.html",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "stanford-aid",
      title: "Stanford Financial Aid",
      summary:
        "Stanford undergraduate aid hub. Stanford states it meets demonstrated need without loans for eligible admitted undergraduates — confirm current terms on the official site.",
      href: "https://financialaid.stanford.edu/",
    },
    {
      id: "stanford-types",
      title: "Types of Stanford undergraduate aid",
      summary:
        "How Stanford Scholarship, federal grants, and outside awards fit together. No separate application for named Stanford scholarship funds beyond the CSS Profile.",
      href: "https://financialaid.stanford.edu/undergrad/types/index.html",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
