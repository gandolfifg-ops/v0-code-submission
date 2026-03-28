import { generateText, Output } from 'ai'
import * as z from 'zod'

export const maxDuration = 30

const ScholarshipSchema = z.object({
  scholarships: z.array(z.object({
    id: z.string(),
    title: z.string(),
    provider: z.string(),
    amount: z.string(),
    deadline: z.string(),
    eligibility: z.string(),
    country: z.enum(["USA", "Canada"]),
    description: z.string().describe("A detailed 3-4 sentence description of the scholarship, its requirements, benefits, and application process."),
    url: z.string(),
  }))
})

export async function POST(req: Request) {
  try {
    const { country, query, major, year } = await req.json()
    
    const countryContext = country === "Canada" 
      ? "Canadian scholarships, bursaries, and grants available for students in Canada"
      : "American scholarships, grants, and financial aid available for students in the USA"
    
    const majorContext = major && major !== "Any" ? `for ${major} students` : ""
    const yearContext = year && year !== "Any" ? `in their ${year} year` : ""
    const searchContext = query ? `related to: ${query}` : ""
    
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({ schema: ScholarshipSchema }),
      prompt: `Generate 8 realistic and diverse ${countryContext} ${majorContext} ${yearContext} ${searchContext}.

For each scholarship, provide:
- A realistic scholarship name (avoid generic names)
- A real-sounding organization or foundation as the provider
- Award amounts in the range of $500 to $50,000
- Realistic deadlines throughout the academic year
- Specific eligibility requirements
- A DETAILED description of 3-4 sentences explaining the scholarship's purpose, what it covers, application requirements, and any special benefits or opportunities it provides
- Country must be strictly "${country}"
- URL should be "#" for now

Make the scholarships diverse in terms of:
- Award amounts (mix of small, medium, and large awards)
- Eligibility criteria (academic merit, financial need, community service, specific majors)
- Provider types (universities, foundations, corporations, government)
- Application complexity (some no-essay, some requiring essays)

Important: The description field MUST be detailed and substantive - at least 100 words - so users can read the full details when they expand the card.`
    })

    return Response.json({ scholarships: result.object?.scholarships || [] })
  } catch (error) {
    console.error('Scholarship search error:', error)
    // Return fallback data on error
    return Response.json({ 
      scholarships: [],
      error: 'Failed to fetch scholarships. Please try again.'
    })
  }
}
