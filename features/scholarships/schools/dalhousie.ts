import {
  LORAN,
  NOVA_SCOTIA_STUDENT_ASSISTANCE,
  NSLSC,
  schulichLink,
} from "@/features/scholarships/schools/national"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export const dalhousie: SchoolAwardsData = {
  slug: "dalhousie",
  aliases: [
    "dal",
    "dalhousie university",
  ],
  name: "Dalhousie University",
  country: "Canada",
  region: "Nova Scotia",
  searchName: "Dalhousie University",
  description:
    "Official starting points for Dalhousie scholarships and financial aid, Nova Scotia Student Assistance, NSLSC, Loran, and Schulich Leaders. Confirm amounts and deadlines on Dalhousie and government sites.",
  domains: ["dal.ca"],
  officialAwardsUrl: "https://www.dal.ca/admissions/scholarships-financial-aid.html",
  officialAidUrl: "https://novascotia.ca/studentassistance/",
  links: [
    {
      id: "dalhousie-aid",
      title: "Dalhousie scholarships and financial aid",
      summary:
        "Dalhousie hub for scholarships, bursaries, student loans, and other funding options.",
      href: "https://www.dal.ca/admissions/scholarships-financial-aid.html",
    },
    NSLSC,
    NOVA_SCOTIA_STUDENT_ASSISTANCE,
    LORAN,
    schulichLink("Dalhousie University"),
  ],
}
