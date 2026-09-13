import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const columbia: SchoolAwardsData = {
  slug: "columbia",
  aliases: [
    "columbia",
    "columbia university",
    "columbia college",
    "columbia engineering",
  ],
  name: "Columbia University",
  country: "USA",
  region: "New York",
  searchName: "Columbia University",
  description:
    "Official Columbia College and Engineering financial aid starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on columbia.edu and government sites.",
  domains: ["columbia.edu"],
  officialAwardsUrl: "https://cc-seas.financialaid.columbia.edu/how/aid/works",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "columbia-aid",
      title: "Columbia Financial Aid and Educational Financing",
      summary:
        "Need-based aid office for Columbia College and Columbia Engineering. Columbia does not award academic-merit institutional scholarships.",
      href: "https://cc-seas.financialaid.columbia.edu/",
    },
    {
      id: "columbia-how",
      title: "How Columbia aid works",
      summary:
        "Official explainer of need-based grants and work — confirm current contribution rules on Columbia’s site.",
      href: "https://cc-seas.financialaid.columbia.edu/how/aid/works",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
