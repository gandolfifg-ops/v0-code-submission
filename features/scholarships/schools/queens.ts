import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const queens: SchoolAwardsData = {
  slug: "queens",
  aliases: ["queen", "queens-university"],
  name: "Queen’s University",
  region: "Ontario",
  searchName: "Queen's University",
  description:
    "Official Queen’s Student Awards, Smith Engineering bursaries, OSAP, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on Queen’s and government sites.",
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
