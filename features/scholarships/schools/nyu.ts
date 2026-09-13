import { FAFSA, STUDENTAID_GOV } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const nyu: SchoolAwardsData = {
  slug: "nyu",
  aliases: ["nyu", "new york university"],
  name: "New York University",
  country: "USA",
  region: "New York",
  searchName: "New York University",
  description:
    "Official NYU Financial Aid and Scholarships starting points, plus FAFSA and StudentAid.gov. Confirm amounts and deadlines on nyu.edu and government sites.",
  domains: ["nyu.edu"],
  officialAwardsUrl: "https://www.nyu.edu/admissions/financial-aid-and-scholarships.html",
  officialAidUrl: "https://studentaid.gov/h/apply-for-aid/fafsa",
  links: [
    {
      id: "nyu-aid",
      title: "NYU Financial Aid and Scholarships",
      summary:
        "NYU Office of Financial Aid hub for undergraduate and graduate aid, including the NYU Promise for eligible first-year New York campus students.",
      href: "https://www.nyu.edu/admissions/financial-aid-and-scholarships.html",
    },
    {
      id: "nyu-apply",
      title: "How to apply for NYU aid",
      summary:
        "Official steps for FAFSA, CSS Profile, and NYU scholarship consideration — confirm current deadlines on NYU’s site.",
      href: "https://www.nyu.edu/admissions/financial-aid-and-scholarships/applying-as-a-prospective-undergraduate-student.html",
    },
    FAFSA,
    STUDENTAID_GOV,
  ],
}
