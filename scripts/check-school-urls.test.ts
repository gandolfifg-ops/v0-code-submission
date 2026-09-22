import { describe, expect, it } from "vitest"
import { SCHOOL_PAGES } from "@/features/scholarships/schools"

const OK = new Set([200, 201, 204, 301, 302, 303, 307, 308, 403])
/** Opt in via env or by targeting this file: `pnpm check:school-urls` */
const runNetwork =
  process.env.CHECK_SCHOOL_URLS === "1" ||
  process.argv.some((arg) => arg.replace(/\\/g, "/").includes("check-school-urls.test"))

async function probe(url: string): Promise<number> {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": "WealthNutzLinkCheck/1.0" },
      signal: AbortSignal.timeout(15000),
    })
    if (head.status !== 405 && head.status !== 501) return head.status
  } catch {
    /* fall through to GET */
  }
  const get = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "user-agent": "WealthNutzLinkCheck/1.0" },
    signal: AbortSignal.timeout(15000),
  })
  return get.status
}

describe.runIf(runNetwork)("school official URL network smoke", () => {
  it(
    "official awards, aid, and link URLs respond",
    async () => {
      const urls = new Set<string>()
      for (const school of SCHOOL_PAGES) {
        urls.add(school.officialAwardsUrl)
        if (school.officialAidUrl) urls.add(school.officialAidUrl)
        for (const link of school.links) urls.add(link.href)
      }
      const failures: string[] = []
      for (const url of urls) {
        try {
          const status = await probe(url)
          if (!OK.has(status)) failures.push(`${status} ${url}`)
        } catch {
          failures.push(`network error ${url}`)
        }
      }
      expect(failures).toEqual([])
    },
    180_000,
  )
})
