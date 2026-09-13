import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const queens: SchoolAwardsData = {
  slug: "queens",
  aliases: [
    "queen",
    "queens-university",
    "queen's",
    "queens",
    "queen’s university",
    "queen's university",
    "queen's university at kingston",
    "queen’s university at kingston",
    "queens university",
    "queensu",
  ],
  name: "Queen’s University",
  country: "Canada",
  region: "Ontario",
  searchName: "Queen's University",
  description:
    "Official Queen’s Student Awards, Smith Engineering bursaries, OSAP, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on Queen’s and government sites.",
  domains: ["queensu.ca"],
  officialAwardsUrl: "https://www.queensu.ca/registrar/financial-aid",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  rejectDomains: ["queens.edu"],
  rejectTitlePatterns: ["charlotte", "queens university of charlotte", "queen's university of charlotte"],
  links: [
    {
      id: "queens-student-awards",
      title: "Queen’s Student Awards",
      summary:
        "Queen’s Financial Aid and Awards hub for scholarships, bursaries, and how student aid is paid.",
      href: "https://www.queensu.ca/registrar/financial-aid",
    },
    {
      id: "queens-engineering",
      title: "Faculty of Engineering awards",
      summary:
        "Named bursaries for Smith Engineering (Faculty of Engineering and Applied Science) students, listed by the Registrar.",
      href: "https://www.queensu.ca/registrar/financial-aid/application-required/current-students/named-general-bursaries/engineering",
    },
    NSLSC,
    osapLink("Queen’s"),
    LORAN,
    schulichLink("Queen’s"),
  ],
}
