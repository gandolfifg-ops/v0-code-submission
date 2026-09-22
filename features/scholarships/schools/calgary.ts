import {
  LORAN,
  NSLSC,
  STUDENTAID_ALBERTA,
  schulichLink,
} from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const calgary: SchoolAwardsData = {
  slug: "calgary",
  aliases: [
    "ucalgary",
    "u of c",
    "university of calgary",
  ],
  name: "University of Calgary",
  country: "Canada",
  region: "Alberta",
  searchName: "University of Calgary",
  description:
    "Official starting points for University of Calgary awards, Alberta Student Aid, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on UCalgary and government sites.",
  domains: ["ucalgary.ca"],
  officialAwardsUrl: "https://www.ucalgary.ca/registrar/finances/awards",
  officialAidUrl: "https://studentaid.alberta.ca/",
  links: [
    {
      id: "calgary-awards",
      title: "UCalgary awards",
      summary:
        "University of Calgary Registrar awards hub for scholarships, bursaries, and related student finances.",
      href: "https://www.ucalgary.ca/registrar/finances/awards",
    },
    NSLSC,
    STUDENTAID_ALBERTA,
    LORAN,
    schulichLink("the University of Calgary"),
  ],
}
