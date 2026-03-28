export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface SearchResult {
  id: string;
  title: string;
  provider: string;
  amount: string;
  eligibility: string;
  deadline: string;
  url: string;
}

// Extract hard negative keywords from a free-text user query.
// Supports: "NOT biology", "no biology", "not a biology", "I hate biology", "excluding biology", "without biology"
function extractNegativeKeywords(query: string): string[] {
  if (!query) return [];
  const lower = query.toLowerCase();
  const terms: string[] = [];

  const patterns = [
    /\bnot\s+(?:a\s+|an\s+|the\s+)?(\w+)/gi,
    /\bno\s+(\w+)/gi,
    /\bwithout\s+(?:a\s+|an\s+)?(\w+)/gi,
    /\bexcluding?\s+(\w+)/gi,
    /\bhate\s+(\w+)/gi,
    /\bavoid(?:ing)?\s+(\w+)/gi,
    /\bnon[- ](\w+)/gi,
  ];

  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(lower)) !== null) {
      const term = m[1]?.trim();
      if (term && term.length > 2 && !["the","and","for","any","all","this","that","from"].includes(term)) {
        terms.push(term);
      }
    }
  }
  return [...new Set(terms)];
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const type = body?.type ?? "scholarship";
  const filters = body?.filters ?? {};

  const apiKey = process.env.TAVILY_API_KEY?.trim();

  if (!apiKey) {
    console.error("[v0] TAVILY_API_KEY is missing");
    return Response.json({ results: [], error: "Search API not configured" }, { status: 200 });
  }

  // Extract hard negative keywords from user's free-text query
  const userQuery: string = filters.query ?? "";
  const negativeTerms = extractNegativeKeywords(userQuery);

  // Build positive query parts
  const queryParts = [
    type === "scholarship" ? "scholarship 2026" : "student loan 2026",
    filters.major && filters.major !== "Any Major" ? filters.major : "",
    filters.country && filters.country !== "Any Country" ? filters.country : "",
    // Include positive words only (strip out the negative phrases so the AI searches positively)
    userQuery.replace(/\b(?:not|no|without|excluding?|hate|avoid(?:ing)?|non[-\s]?\w+)\s+\w+/gi, "").trim(),
  ].filter(Boolean);

  // Append Tavily-style negative constraints using "-term" prefix (hard exclude)
  const negativeConstraints = negativeTerms.map(t => `-${t}`).join(" ");

  const searchQuery = (queryParts.join(" ") + " application open deadline " + negativeConstraints).trim();
  
  try {
    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: "advanced",
        include_domains: type === "scholarship" 
          ? ["scholarships.com", "fastweb.com", "bold.org", "scholarshipowl.com", "unigo.com", "cappex.com", "niche.com", "goingmerry.com", "studentaid.gov", "collegeboard.org"]
          : ["studentaid.gov", "nerdwallet.com", "bankrate.com", "credible.com", "sofi.com", "earnest.com", "collegeavestudentloans.com", "salliemae.com"],
        max_results: 10,
      }),
    });
    
    if (!tavilyResponse.ok) {
      console.error("[v0] Tavily API error:", tavilyResponse.status);
      return Response.json({ results: [], error: "Search failed" }, { status: 200 });
    }
    
    const tavilyData = await tavilyResponse.json();
    const tavilyResults: TavilyResult[] = tavilyData.results ?? [];
    
    // Validate URL is properly formatted
    const isValidUrl = (url: string): boolean => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    };
    
    // Filter out broken/invalid links, low-relevance results, AND hard-excluded keyword results
    const results: SearchResult[] = tavilyResults
      .filter((r: TavilyResult) => {
        // Filter out results with no URL or suspicious patterns
        if (!r.url || r.url.length < 10) return false;
        if (!isValidUrl(r.url)) return false;
        if (r.url.includes("404") || r.url.includes("error") || r.url.includes("not-found")) return false;
        if (r.score < 0.3) return false; // Low relevance

        // Hard negative keyword enforcement — if ANY negative term appears in title or content, discard
        if (negativeTerms.length > 0) {
          const searchable = (r.title + " " + r.content).toLowerCase();
          if (negativeTerms.some(term => searchable.includes(term))) return false;
        }

        return true;
      })
      .map((r: TavilyResult, i: number) => {
        // Extract provider from URL
        const urlObj = new URL(r.url);
        const provider = urlObj.hostname.replace("www.", "").split(".")[0];
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        
        // Extract amount from content if available
        const amountMatch = r.content.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?|\$[\d,]+\+?/);
        const amount = amountMatch ? amountMatch[0] : (type === "scholarship" ? "Varies" : "Variable APR");
        
        // Extract deadline from content if available
        const deadlineMatch = r.content.match(/(?:deadline|due|closes?|ends?)(?:\s*:?\s*)([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/i);
        const deadline = deadlineMatch ? deadlineMatch[1] : "Check website";
        
        return {
          id: `tavily-${type}-${i}-${Date.now()}`,
          title: r.title.slice(0, 80),
          provider: providerName,
          amount,
          eligibility: r.content.slice(0, 150) + (r.content.length > 150 ? "..." : ""),
          deadline,
          url: r.url,
        };
      });
    
    return Response.json({ results });
  } catch (error) {
    console.error("[v0] Search error:", error);
    return Response.json({ results: [], error: "Search failed" }, { status: 200 });
  }
}
