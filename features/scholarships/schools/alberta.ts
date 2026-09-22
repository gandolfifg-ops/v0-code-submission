import {
  LORAN,
  NSLSC,
  STUDENTAID_ALBERTA,
  schulichLink,
} from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const alberta: SchoolAwardsData = {
  slug: "alberta",
  aliases: [
    "ualberta",
    "u of a",
    "uofa",
    "university of alberta",
  ],
  name: "University of Alberta",
  country: "Canada",
  region: "Alberta",
  searchName: "University of Alberta",
  description:
    "Official starting points for University of Alberta scholarships and awards, Alberta Student Aid, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on UAlberta and government sites.",
  domains: ["ualberta.ca"],
  officialAwardsUrl: "https://www.ualberta.ca/registrar/scholarships-awards-financial-support/index.html",
  officialAidUrl: "https://studentaid.alberta.ca/",
  links: [
    {
      id: "alberta-awards",
      title: "Scholarships, awards and financial support",
      summary:
        "University of Alberta Registrar hub for undergraduate scholarships, bursaries, and financial support.",
      href: "https://www.ualberta.ca/registrar/scholarships-awards-financial-support/index.html",
    },
    NSLSC,
    STUDENTAID_ALBERTA,
    LORAN,
    schulichLink("the University of Alberta"),
  ],
}
