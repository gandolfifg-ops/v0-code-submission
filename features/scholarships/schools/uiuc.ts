import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const uiuc: SchoolAwardsData = {
  slug: "uiuc",
  aliases: [
    "uiuc",
    "illinois",
    "university of illinois",
    "university of illinois urbana champaign",
    "university of illinois urbana-champaign",
    "university of illinois at urbana-champaign",
  ],
  name: "University of Illinois Urbana-Champaign",
  country: "USA",
  region: "Illinois",
  searchName: "University of Illinois Urbana-Champaign",
  description:
    "Official Illinois OSFA and admissions scholarship starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on illinois.edu and government sites.",
  domains: ["illinois.edu"],
  officialAwardsUrl: "https://www.osfa.illinois.edu/types-of-aid/scholarships/",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "uiuc-osfa",
      title: "Illinois Office of Student Financial Aid",
      summary:
        "OSFA hub for FAFSA, grants, scholarships, and programs such as Illinois Promise — confirm current terms on the official site.",
      href: "https://www.osfa.illinois.edu/",
    },
    {
      id: "uiuc-scholarships",
      title: "Illinois scholarships",
      summary:
        "Undergraduate Admissions page for merit and college scholarships considered with your Illinois application.",
      href: "https://www.admissions.illinois.edu/scholarships/",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
