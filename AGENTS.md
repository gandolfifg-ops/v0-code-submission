# WealthNutz — agent instructions

You are editing **WealthNutz**, a Canada + US student-finance discovery site (Next.js App Router, `features/*`).

- Live product: marketplace, scholarships (official-domain search), school pages, loans, chat, saved, guides, cards.
- Production: https://www.wealthnutz.com
- Repo path (this machine): `C:\Users\gando\Projects\v0-code-submission`
- Package manager: **pnpm**

Not a bank, lender, or licensed advisor. Never invent rates, deadlines, or approval.

## Money rules

- Affiliate / paid placement only on commercial products (banking, investing, cards).
- Government hubs are **never** affiliate or sponsored: FAFSA, StudentAid.gov, NSLSC, canada.ca student aid, provincial aid, school official awards pages.
- `featured` = editorial. `sponsored` = paid. Different fields. Organic table order stays editorial.
- No SIN / SSN / DOB / full address / credit score collection.
- No fake urgency. No gating search behind email.
- If unsure of an amount, APR, or deadline: say "Varies" / "Confirm on official site".

## Design

- Navy / paper surfaces, **gold CTAs only**.
- Reuse `ComparisonTable`, `ProductCard`, `CountryToggle`, `pageMeta`, `lib/constants/nav.ts`.
- Mobile-first. Primary buttons `min-h-11`. No horizontal overflow.
- Country is only Canada or United States — use the existing localStorage country/profile store.

## After each task

1. `pnpm lint && pnpm test && pnpm build` (fix errors before claiming done).
2. Update sitemap, nav, about, terms, privacy, help when you add routes.
3. List files changed and click-test steps for www.wealthnutz.com.

## Do not start unless asked

- Auth, Stripe, or a CMS
- A second country store
- Placeholder / "coming soon" primary-nav pages
