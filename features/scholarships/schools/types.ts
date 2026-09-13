export type SchoolAwardLink = {
  id: string
  title: string
  summary: string
  href: string
}

export type SchoolAwardsData = {
  slug: string
  aliases?: string[]
  name: string
  region: string
  searchName: string
  description: string
  links: SchoolAwardLink[]
}
