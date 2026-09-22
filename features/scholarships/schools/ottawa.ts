import { LORAN, NSLSC, osapLink, schulichLink } from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const ottawa: SchoolAwardsData = {
  slug: "ottawa",
  aliases: [
    "uottawa",
    "u of ottawa",
    "university of ottawa",
    "université d'ottawa",
    "universite d'ottawa",
  ],
  name: "University of Ottawa",
  country: "Canada",
  region: "Ontario",
  searchName: "University of Ottawa",
  description:
    "Official starting points for uOttawa scholarships and bursaries, OSAP, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on uOttawa and government sites.",
  domains: ["uottawa.ca"],
  officialAwardsUrl: "https://www.uottawa.ca/study/fees-financial-support/applying-scholarships-awards",
  officialAidUrl: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  links: [
    {
      id: "ottawa-scholarships",
      title: "Applying for scholarships and awards",
      summary:
        "University of Ottawa Financial Aid and Awards hub for Online Scholarships and Bursaries and how to apply.",
      href: "https://www.uottawa.ca/study/fees-financial-support/applying-scholarships-awards",
    },
    NSLSC,
    osapLink("the University of Ottawa"),
    LORAN,
    schulichLink("the University of Ottawa"),
  ],
}
